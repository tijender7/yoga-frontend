import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
  }

  try {
    const body = await request.json();
    const { name, email, phone, healthConditions } = body;

    // Call backend API to create user
    const backendResponse = await fetch(`${API_URL}/auth/signup`, {
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