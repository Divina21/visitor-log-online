import { NextResponse } from 'next/server';
import { contentfulClient } from '../../../lib/contentful';

// POST /api/auth — validate admin credentials against Contentful
export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const entries = await contentfulClient.getEntries({
      content_type: 'admin',
      'fields.username': username,
      limit: 1,
    });

    if (entries.items.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const admin = entries.items[0];

    if (admin.fields.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ success: true, username: admin.fields.username });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
