import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Validate SMTP config first
const validateSMTPConfig = () => {
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length) {
    throw new Error(`Missing SMTP configuration: ${missing.join(', ')}`);
  }
};

// Create transporter with validation
const createTransporter = () => {
  validateSMTPConfig();
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Add this at the top to verify env variables
const checkEnvVariables = () => {
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length) {
    console.error('Missing environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export async function POST(request: Request) {
  try {
    // First check env variables
    checkEnvVariables();
    
    const body = await request.json();
    const { name, email, message, userId } = body;

    // Create transporter with proper error handling
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `Support Request from ${name}`,
      html: `
        <h2>New Support Request</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>User ID:</strong> ${userId || 'Not logged in'}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; border-left: 4px solid #ccc; margin: 1.5em 10px; padding: 1em 10px;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true,
      message: 'Support notification sent successfully'
    });

  } catch (err) {
    const error = err as Error;
    console.error('Email notification error:', error);
    
    // Send more specific error message
    return NextResponse.json(
      { 
        error: error.message || 'Failed to send notification',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}