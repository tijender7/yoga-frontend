import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create transporter with error handling
const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP configuration missing');
  }

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, userId } = body;

    // Create transporter with error handling
    const transporter = createTransporter();

    // Verify SMTP connection with proper error handling
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('SMTP Verification failed:', verifyError);
      throw new Error('Failed to connect to email server');
    }

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

    try {
      await transporter.sendMail(mailOptions);
    } catch (sendError) {
      console.error('Failed to send email:', sendError);
      throw new Error('Failed to send email notification');
    }

    return NextResponse.json({ 
      success: true,
      message: 'Support notification sent successfully'
    });

  } catch (err) {
    const error = err as Error;
    console.error('Email notification error:', error.message);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to send notification',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}