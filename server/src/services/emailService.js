import nodemailer from 'nodemailer';
import { logger } from '../config/logger.js';

// Create a transporter using environment settings
const createTransporter = async () => {
  // If we're using the default ethereal configuration, create an account dynamically
  if (
    !process.env.SMTP_USER || 
    process.env.SMTP_USER === 'ethereal_user_placeholder' ||
    process.env.SMTP_USER === 'your_smtp_user'
  ) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      logger.info('Using dynamic Ethereal Mail testing account for Nodemailer alerts.');
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (err) {
      logger.warn(`Could not generate Ethereal testing account: ${err.message}. Emailing disabled.`);
      return null;
    }
  }

  // Otherwise, use user defined values
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: parseInt(process.env.SMTP_PORT, 10) === 465, // True for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Sends a confirmation email to the job candidate.
 */
export const sendApplicationConfirmation = async (candidateEmail, candidateName, jobTitle, atsScore) => {
  try {
    const transporter = await createTransporter();
    if (!transporter) return;

    const mailOptions = {
      from: `"Castack Operations" <${process.env.SMTP_FROM || 'no-reply@castack.com'}>`,
      to: candidateEmail,
      subject: `Application Received - ${jobTitle} at Castack`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #ec590f;">Thank you, ${candidateName}!</h2>
          <p>We have successfully received your application for the <strong>${jobTitle}</strong> position at Castack.</p>
          
          <div style="background-color: #f7f8fa; padding: 15px; border-radius: 6px; border-left: 4px solid #ec590f; margin: 20px 0;">
            <h4 style="margin: 0 0 5px 0; color: #333;">Resume ATS Match Report Summary</h4>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #ec590f;">${atsScore}% Match Score</p>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">Our system successfully processed your CV structure and extracted technical profiles relative to the job requirements.</p>
          </div>

          <p>Our talent acquisition team will review your application details. If your skills align with our next steps, we will schedule a brief introductory call.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">Castack Technologies • Bengaluru / Remote • Premium Engineering & Enterprise AI Solutions</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Candidate confirmation email sent successfully: ${info.messageId}`);
    
    // Log preview URL if using Ethereal
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      logger.info(`Ethereal email preview URL: ${previewUrl}`);
    }
  } catch (error) {
    logger.error(`Failed to send application confirmation email: ${error.message}`);
  }
};

/**
 * Sends a notification email to the recruiting admin.
 */
export const sendRecruiterAlert = async (jobTitle, candidateName, atsScore, candidateEmail) => {
  try {
    const transporter = await createTransporter();
    if (!transporter) return;

    const mailOptions = {
      from: `"Castack ATS Alerts" <${process.env.SMTP_FROM || 'no-reply@castack.com'}>`,
      to: process.env.ADMIN_INIT_EMAIL || 'admin@castack.com',
      subject: `[New Candidate] ${candidateName} Applied for ${jobTitle} (${atsScore}% Score)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333; border-bottom: 2px solid #ec590f; padding-bottom: 8px;">New Job Application</h2>
          <p>A new applicant has submitted their CV through the Careers portal.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">Candidate:</td>
              <td style="padding: 8px 0;">${candidateName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${candidateEmail}">${candidateEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Job Role:</td>
              <td style="padding: 8px 0;"><strong>${jobTitle}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">ATS Match:</td>
              <td style="padding: 8px 0; color: #ec590f; font-weight: bold; font-size: 18px;">${atsScore}%</td>
            </tr>
          </table>

          <p>Please log in to the <strong>Castack Administrator Dashboard</strong> to view the candidate's complete details, read full ATS keyword analyses, and download their resume.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">Castack Enterprise Dashboard Notification Server</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Recruiter alert email sent: ${info.messageId}`);
  } catch (error) {
    logger.error(`Failed to send recruiter alert email: ${error.message}`);
  }
};

/**
 * Sends a notification when a contact form inquiry is received.
 */
export const sendInquiryNotification = async (inquiryName, inquiryEmail, inquirySubject, inquiryMessage, category) => {
  try {
    const transporter = await createTransporter();
    if (!transporter) return;

    const mailOptions = {
      from: `"Castack Contact Center" <${process.env.SMTP_FROM || 'no-reply@castack.com'}>`,
      to: process.env.ADMIN_INIT_EMAIL || 'admin@castack.com',
      subject: `[New Inquiry] [${category}] - ${inquirySubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #ec590f; border-bottom: 2px solid #ec590f; padding-bottom: 8px;">Client Inquiry</h2>
          <p>A new client request was submitted through the contact form.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">Client Name:</td>
              <td style="padding: 8px 0;">${inquiryName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Client Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${inquiryEmail}">${inquiryEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Category:</td>
              <td style="padding: 8px 0;">${category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
              <td style="padding: 8px 0;">${inquirySubject}</td>
            </tr>
          </table>

          <div style="background-color: #f7f8fa; padding: 15px; border-radius: 6px; border-left: 4px solid #333; margin: 20px 0;">
            <h4 style="margin: 0 0 5px 0; color: #333;">Message Content</h4>
            <p style="margin: 0; color: #555; white-space: pre-wrap; font-size: 14px; line-height: 1.5;">${inquiryMessage}</p>
          </div>

          <p>Log in to the Admin Panel to reply and manage this inquiry status.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Client inquiry alert email sent: ${info.messageId}`);
  } catch (error) {
    logger.error(`Failed to send client inquiry email notification: ${error.message}`);
  }
};
