import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch recent activity from backend (hosted in the container)
    const baseUrl = process.env.WS_TARGET_URL || 'http://187.77.64.102:3001';
    const response = await fetch(`${baseUrl}/activity?limit=50`, { cache: 'no-store' });

    if (!response.ok) throw new Error('Failed to fetch activity');

    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ activities: [] });
  }
}
