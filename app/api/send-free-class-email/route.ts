import { NextResponse } from 'next/server';
import { API_ROUTES } from '@/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, healthConditions } = body;

    // Use API_ROUTES
    const backendResponse = await fetch(API_ROUTES.SIGNUP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        healthConditions,
        source: 'free_class'
      })
    });

    if (!backendResponse.ok) {
      throw new Error('Failed to create user in backend');
    }

    return NextResponse.json({ 
      success: true,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}