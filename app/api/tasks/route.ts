import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const baseUrl = process.env.WS_TARGET_URL || 'http://187.77.64.102:3001';
    const response = await fetch(`${baseUrl}/tasks`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ columns: { todo: [], inprogress: [], done: [] }, updatedAt: Date.now() });
  }
}
