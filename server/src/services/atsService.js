import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { logger } from '../config/logger.js';

/**
 * Extracts raw text from a PDF or DOCX file.
 * @param {string} filePath - Absolute or relative path to the file
 * @returns {Promise<string>} Plain text content
 */
export const parseResume = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Resume file not found at path: ${filePath}`);
  }

  try {
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      return pdfData.text || '';
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    } else {
      throw new Error(`Unsupported file extension: ${ext}`);
    }
  } catch (error) {
    logger.error(`Error parsing resume file (${ext}): ${error.message}`);
    throw new Error(`Failed to extract text from resume: ${error.message}`);
  }
};

/**
 * Compares resume text against job requirements and computes an ATS match profile.
 * @param {string} resumeText - Raw text from the resume
 * @param {Object} job - Mongoose Job model or simple JS object with job details
 * @returns {Object} Analytical ATS Report
 */
export const analyzeATS = (resumeText, job) => {
  const text = (resumeText || '').toLowerCase();
  const skillsRequired = (job.skillsRequired || []).map(s => s.toLowerCase());
  const jobTitle = (job.title || '').toLowerCase();
  
  // 1. Skill Match Score (Max 40 points)
  let matchedSkills = [];
  let missingSkills = [];
  
  if (skillsRequired.length > 0) {
    skillsRequired.forEach(skill => {
      // Create a regex to match the skill as a whole word boundary to avoid partial matches
      // (e.g. 'c' matching 'cloud' or 'aws' matching 'flaws')
      const cleanSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const skillRegex = new RegExp(`\\b${cleanSkill}\\b|\\b${cleanSkill}\\w*`, 'i');
      
      if (skillRegex.test(text)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });
  }
  
  const skillMatchPercentage = skillsRequired.length > 0 
    ? (matchedSkills.length / skillsRequired.length) * 100 
    : 100;
  
  const skillsScore = Math.round((skillMatchPercentage / 100) * 40);

  // 2. Experience Level Alignment & Markers (Max 30 points)
  let experienceScore = 15; // Baseline
  let experienceYears = 0;
  
  // Extract possible experience years using regex
  // Matches expressions like "5+ years", "3 years of experience", "exp: 6 years"
  const expRegexes = [
    /(\d+)\s*\+?\s*years?\s+(?:of\s+)?experience/i,
    /(\d+)\s*\+?\s*years?\s+exp/i,
    /experience\s*:\s*(\d+)\s*years?/i,
    /work\s+history\s*:\s*(\d+)\s*years?/i
  ];
  
  for (const regex of expRegexes) {
    const match = text.match(regex);
    if (match && match[1]) {
      const years = parseInt(match[1], 10);
      if (years > experienceYears && years < 45) { // Sanity cap
        experienceYears = years;
      }
    }
  }

  // Evaluate matching with target experience level
  const targetLevel = (job.experienceLevel || 'Mid').toLowerCase();
  if (targetLevel === 'junior') {
    if (experienceYears >= 0 && experienceYears <= 2) experienceScore = 30;
    else if (experienceYears > 2 && experienceYears <= 4) experienceScore = 25;
    else experienceScore = 18; // Overqualified
  } else if (targetLevel === 'mid') {
    if (experienceYears >= 2 && experienceYears <= 5) experienceScore = 30;
    else if (experienceYears > 5) experienceScore = 25;
    else experienceScore = 15;
  } else if (targetLevel === 'senior') {
    if (experienceYears >= 5 && experienceYears <= 8) experienceScore = 30;
    else if (experienceYears > 8) experienceScore = 28;
    else experienceScore = 10;
  } else if (targetLevel === 'lead') {
    if (experienceYears >= 8) experienceScore = 30;
    else if (experienceYears >= 5 && experienceYears < 8) experienceScore = 22;
    else experienceScore = 8;
  }

  // 3. Readability & Document Structure Score (Max 30 points)
  let readabilityScore = 30;
  let deductions = 0;
  
  // Check for critical sections
  const standardSections = [
    { name: 'Education', keywords: ['education', 'academic', 'university', 'college', 'degree'] },
    { name: 'Experience', keywords: ['experience', 'employment', 'work history', 'professional background', 'career history'] },
    { name: 'Skills', keywords: ['skills', 'technologies', 'technical skills', 'core competencies', 'expertise'] },
    { name: 'Projects', keywords: ['projects', 'academic projects', 'personal projects', 'key works'] },
    { name: 'Certifications', keywords: ['certifications', 'licenses', 'courses', 'awards'] }
  ];

  let missingSections = [];
  standardSections.forEach(section => {
    const hasSection = section.keywords.some(kw => text.includes(kw));
    if (!hasSection) {
      missingSections.push(section.name);
      deductions += 5; // Deduct 5 points per missing critical section
    }
  });

  // Length check (Word count based)
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 150) {
    deductions += 8; // Resume too short
  } else if (wordCount > 2500) {
    deductions += 5; // Resume too wordy
  }

  readabilityScore = Math.max(0, readabilityScore - deductions);

  // 4. Final ATS Score calculation
  const atsScore = Math.round(skillsScore + experienceScore + readabilityScore);

  // 5. Keyword Density Analysis (Top keywords, excluding common English stop words)
  const stopWords = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could',
    'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
    'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres',
    'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is',
    'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 'of',
    'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
    'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats',
    'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll',
    'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt',
    'we', 'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which',
    'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll',
    'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves', 'using', 'used', 'using', 'also', 'development',
    'software', 'project', 'team', 'working', 'worked', 'systems', 'experience', 'engineered'
  ]);

  const words = text.match(/\b[a-zA-Z]{2,15}\b/g) || [];
  const freqMap = {};
  let totalValidWords = 0;
  
  words.forEach(w => {
    if (!stopWords.has(w)) {
      freqMap[w] = (freqMap[w] || 0) + 1;
      totalValidWords++;
    }
  });

  const keywordDensity = Object.entries(freqMap)
    .map(([word, count]) => ({
      word,
      count,
      density: parseFloat(((count / wordCount) * 100).toFixed(2))
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Return top 10 keywords

  // 6. Actionable optimization suggestions
  let recommendations = [];
  
  if (missingSkills.length > 0) {
    recommendations.push(
      `Add missing target technical keywords: ${missingSkills.slice(0, 4).map(s => `'${s}'`).join(', ')}. Recruiters actively search for these terms.`
    );
  }

  if (missingSections.length > 0) {
    recommendations.push(
      `Incorporate standard layout sections to pass parsing layers. Missing sections detected: ${missingSections.join(', ')}.`
    );
  }

  if (experienceYears === 0) {
    recommendations.push(
      `Include a dedicated Professional Experience section detailing your history, years of tenure, and work deliverables with precise numbers (e.g. 'boosted speeds by 30%').`
    );
  } else {
    if (experienceYears < (targetLevel === 'senior' ? 5 : targetLevel === 'lead' ? 8 : 2)) {
      recommendations.push(
        `The analyzed experience (${experienceYears} years) falls slightly below the typical ${targetLevel} profile. Ensure your project scope shows strong seniority.`
      );
    }
  }

  if (wordCount < 200) {
    recommendations.push(
      `Expand your resume details. A word count of ${wordCount} is too brief. Try to aim for 400 - 800 words to cover skills, projects, and career impacts.`
    );
  }

  if (atsScore < 50) {
    recommendations.push("Consider redesigning your CV from a basic two-column template to a clean, single-column text-focused format to improve readability.");
  } else if (atsScore >= 80) {
    recommendations.push("Excellent work! Your resume shows high relevance to the requirements. You are fully ready to apply.");
  }

  return {
    matchPercentage: atsScore,
    skillsScore,
    experienceScore,
    readabilityScore,
    keywordDensity,
    missingKeywords: missingSkills,
    recommendations
  };
};
