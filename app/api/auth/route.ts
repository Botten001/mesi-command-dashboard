import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Simple token generation
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Get password from env (set in Vercel dashboard)
    const correctPassword = process.env.DASHBOARD_PASSWORD;
    
    if (!correctPassword) {
      return NextResponse.json(
        { error: 'Server not configured' },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      const token = generateToken();
      return NextResponse.json({ token, success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  // Verify token endpoint
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  // In a real app, you'd verify the token properly
  // For now, we just check if it looks like a token (64 hex chars)
  if (token.length === 64 && /^[a-f0-9]+$/.test(token)) {
    return NextResponse.json({ valid: true });
  }

  return NextResponse.json({ valid: false }, { status: 401 });
}
