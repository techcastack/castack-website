import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Blog from '../models/Blog.js';
import { logger } from './logger.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Database connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    await Blog.deleteMany();
    logger.info('Existing database collections cleared.');

    // Seed Admin
    const adminUsername = process.env.ADMIN_INIT_USERNAME || 'admin';
    const adminEmail = process.env.ADMIN_INIT_EMAIL || 'admin@castack.com';
    const adminPassword = process.env.ADMIN_INIT_PASSWORD || 'CastackAdminSecure2026!';

    await User.create({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: 'superadmin'
    });
    logger.info(`Administrative user seeded: ${adminEmail}`);

    // Seed Jobs
    const jobs = [
      {
        title: 'Lead AI Systems Engineer',
        department: 'AI & Intelligence Systems',
        location: 'Bengaluru, India',
        type: 'Full-time',
        workplace: 'Hybrid',
        experienceLevel: 'Lead',
        salaryRange: '₹35L - ₹50L per annum',
        description: `### Overview
We are looking for a Lead AI Systems Engineer to join our core intelligence division. In this role, you will lead the research, design, and implementation of domain-specific agentic AI workflows, LLM fine-tuning, and robust RAG (Retrieval-Augmented Generation) infrastructure for our enterprise SaaS customers.

### What You'll Do
* Architect and implement scalable backend intelligence frameworks using Express, Python, and LangChain/LlamaIndex.
* Lead engineering teams in optimizing model inference speed and deploying private model instances securely.
* Build advanced caching mechanisms, semantic search systems, and multi-agent systems for parallel cognitive tasks.
* Collaborate with UI/UX engineers to deliver highly interactive, low-latency AI response visuals.

### Core Requirements
* Strong background in Node.js, Express, MongoDB, and Mongoose.
* 5+ years of software architecture experience, with 2+ years of direct experience with LLM orchestration frameworks.
* Excellent understanding of vector databases (Pinecone, ChromaDB, PGVector), embedding structures, and token optimizations.
* Experience running containerized Docker models and deploying workloads on AWS or GCP.`,
        requirements: [
          'Mastery of modern JavaScript/TypeScript and Node.js backend infrastructure.',
          'Experience building and deploying RAG structures and multi-agent workflows in production environments.',
          'Deep understanding of REST API design, rate-limiting, and microservices architecture.',
          'Excellent collaborative and documentation skills.'
        ],
        responsibilities: [
          'Design and maintain Castack core AI SaaS integrations.',
          'Review team PRs and maintain 95%+ unit test coverage for intelligence microservices.',
          'Perform security reviews of data pipelines processing client-identifiable data.',
          'Interface with corporate client technology leads to integrate proprietary schemas.'
        ],
        skillsRequired: ['Node.js', 'Express', 'MongoDB', 'Python', 'LLMs', 'Vector Databases', 'AWS', 'Docker'],
        status: 'Published'
      },
      {
        title: 'Senior Full-Stack Engineer (MERN)',
        department: 'SaaS Products & Agency Core',
        location: 'Remote',
        type: 'Full-time',
        workplace: 'Remote',
        experienceLevel: 'Senior',
        salaryRange: '₹22L - ₹30L per annum',
        description: `### Overview
Castack is looking for a Senior Full-Stack Engineer to build and optimize highly responsive, visually breathtaking MERN web applications. You will be responsible for creating pixel-perfect client portals, admin controls, and interactive data visualization structures using the latest industry standards.

### What You'll Do
* Scaffold and maintain complex MERN stacks across client products and agency-engineered solutions.
* Integrate premium animations (GSAP, Framer Motion, Lenis) into responsive, high-performance web pages.
* Optimize database layouts, queries, and server-side state machines to ensure sub-100ms response timelines.
* Build role-based access controllers, secure tokenization, and dynamic form generators.

### Core Requirements
* 4+ years of professional full-stack React and Express development experience.
* Master-level fluency in Tailwind CSS, responsive layouts, and responsive CSS grids.
* Solid skills in Zustand, React Query, and React Hook Form with Zod validation.
* Strong Mongoose schema design skills, query analytics, and indexing.`,
        requirements: [
          'Proven record of launching high-end React apps with complex animations.',
          'Experience with backend validation, rate limiting, and JWT auth architectures.',
          'Familiarity with performance audit benchmarks (Lighthouse scores, core web vitals).',
          'Self-motivated professional capable of working in fully remote agile sprints.'
        ],
        responsibilities: [
          'Orchestrate frontend and backend modules to deliver unified web systems.',
          'Implement modular components following a highly organized design system.',
          'Optimize database queries to support high concurrency client operations.',
          'Provide architectural suggestions and participate in weekly design reviews.'
        ],
        skillsRequired: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'React Query'],
        status: 'Published'
      },
      {
        title: 'UI/UX Product Architect',
        department: 'Product Experience Design',
        location: 'Mumbai, India',
        type: 'Full-time',
        workplace: 'Onsite',
        experienceLevel: 'Senior',
        salaryRange: '₹18L - ₹25L per annum',
        description: `### Overview
We are seeking a senior UI/UX Product Architect to design premium, state-of-the-art interactive digital experiences. You will translate complex enterprise needs, job pipelines, and business workflows into stunning high-fidelity visual representations, defining the premium brand language for Castack and its client portfolios.

### What You'll Do
* Define the design system tokens, typography scales, glassmorphism guidelines, and harmony matrices.
* Design wireframes, user flows, and high-fidelity mockups for complex enterprise portals.
* Collaborate closely with animation engineers (GSAP/ThreeJS) to outline motion guides and micro-interactions.
* Oversee style validation and conduct detailed usability reviews of finalized products.

### Core Requirements
* 5+ years of experience as a Product Designer, UI/UX Architect, or Art Director at high-end agencies or top-tier SaaS companies.
* Breathtaking portfolio showcasing clean dark modes, luxury grid alignments, and complex dashboards.
* Fluent in Figma component libraries, auto-layouts, variants, and interactive prototyping.
* Basic understanding of HTML/CSS structure to ensure realistic feasibility assessments.`,
        requirements: [
          'Deep understanding of grid systems, structural spacing, and color theory.',
          'Experience designing complex dashboards with data dense tables and analytics screens.',
          'Ability to run user interviews and translate qualitative feedback into design iterations.',
          'Strong visual eye for minimalist luxury aesthetic, premium transitions, and subtle borders.'
        ],
        responsibilities: [
          'Lead design efforts for Castack in-house SaaS and consulting client applications.',
          'Maintain and scale our internal UI component library and visual style guidelines.',
          'Deliver developer-ready visual specifications and assets.',
          'Establish a visual benchmark of high-end aesthetics that leaves clients awestruck.'
        ],
        skillsRequired: ['Figma', 'UI Design', 'UX Research', 'Design Systems', 'Interactive Prototyping', 'Visual Hierarchy', 'Brand Identity'],
        status: 'Published'
      }
    ];

    await Job.create(jobs);
    logger.info('Mock Job openings seeded successfully.');

    // Seed Blogs
    const blogs = [
      {
        title: 'The Rise of Agentic Workflows in Enterprise Software Systems',
        slug: 'rise-of-agentic-workflows-enterprise-software',
        summary: 'Explore how modern AI agent structures are moving beyond simple chatbots to autonomous reasoning cores, revolutionizing SaaS logic and operational workflows.',
        content: `Modern software systems are undergoing a historic transformation. The era of static, rule-based APIs and simple question-answering chat panels is quickly giving way to autonomous AI agents capable of planning, executing, checking, and iterating to achieve complex corporate goals.

### Beyond Chatbots: Understanding Agentic Logic
Traditional LLM integration focused on single prompt-and-response mechanisms. An agentic workflow, however, implements a structured logical loop where the LLM is given tools, a specific mandate, and the power to invoke iterative loops.

Let's look at the basic loop structure of a modern AI agent:
1. **Goal Parsing**: Breaking a user goal down into distinct operational tasks.
2. **Tool Selection**: Choosing from a suite of available APIs (database reads, web searches, file edits).
3. **Execution**: Running the selected tool and capturing its output.
4. **Verification**: Confirming whether the outcome meets success constraints, and adapting the next steps accordingly.

### Architectural Implications
To host reliable agent workflows, enterprise backends must shift. We need:
* **Strict Sandboxing**: AI processes must operate under restricted access layers.
* **Deterministic Fallbacks**: Traditional backend APIs must validate and override agent suggestions if they breach core boundaries.
* **High-performance Logging**: Logging every step of an agent's reasoning chain is critical for auditing, debugging, and improving system confidence.

At **Castack**, we are actively designing these backend systems, combining secure Node.js middleware with advanced cognitive mapping to help enterprises scale safely.`,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop',
        tags: ['Artificial Intelligence', 'Enterprise SaaS', 'Software Architecture'],
        author: 'Aarav Mehta, Chief AI Officer',
        status: 'Published',
        publishedAt: new Date()
      },
      {
        title: 'Designing Ultra-Smooth Animations for Premium Web Interfaces',
        slug: 'designing-smooth-animations-premium-web-interfaces',
        summary: 'A technical deep-dive into orchestrating high-end visual systems using GSAP, Lenis, and Framer Motion without sacrificing core rendering performance.',
        content: `A visually breathtaking interface will capture attention, but standard browser stuttering can quickly break the illusion of premium quality. In web applications, the line between elegant movement and laggy performance is incredibly thin.

### The Holy Trinity: Lenis, GSAP, and Framer Motion
To achieve elite, Apple-grade motion profiles, a modern website must synchronize three core engine categories:

#### 1. Inertial Smooth Scrolling with Lenis
Browser native scrolling is irregular and segmented. Lenis normalizes scroll input, giving it natural momentum and weight. This smooth animation flow is essential for synchronizing scroll-triggered animations.

#### 2. GSAP and ScrollTrigger for Timeline Choreography
GSAP is the industry standard for high-performance timeline orchestration. While CSS animations are excellent for simple loops, GSAP excels at mapping multiple, non-adjacent visual shifts directly to the scroll progression.

#### 3. Framer Motion for Declarative UI Reactivity
For individual UI states (hover effects, page transitions, loading curtains), Framer Motion integrates seamlessly with React's component cycles.

### Five Rules for Flawless Performance
To ensure your premium animations achieve 60FPS (or 120FPS on modern displays), implement these rules:
1. **Never Animate Layout Properties**: Avoid animating 'width', 'height', 'top', or 'margin'. They trigger full page re-layouts. Only animate 'transform' (translate, scale, rotate) and 'opacity'.
2. **Leverage 'will-change' Wisely**: Adding \`will-change: transform\` hints the browser to offload rendering to the GPU.
3. **Deactivate Offscreen Elements**: Make sure GSAP ScrollTrigger instances automatically deactivate or pause when their sections scroll out of view.
4. **Throttle Event Listeners**: Always throttle mouse tracking and custom pointer loops to prevent thread clogging.
5. **Optimize 3D Assets**: Limit WebGL vertices and texture resolutions in R3F backgrounds to ensure lag-free rendering on low-tier mobile devices.`,
        coverImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1024&auto=format&fit=crop',
        tags: ['Web Design', 'Animation & GSAP', 'Frontend Performance'],
        author: 'Elena Rostova, Principal Animator',
        status: 'Published',
        publishedAt: new Date()
      }
    ];

    // Seed Blogs using Mongoose (this triggers pre-save readTime auto calculations!)
    for (const blog of blogs) {
      await Blog.create(blog);
    }
    logger.info('Mock Blogs seeded successfully.');

    logger.info('All seed operations completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
