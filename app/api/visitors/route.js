import { NextResponse } from 'next/server';
import { contentfulClient, getEnvironment } from '../../../lib/contentful';

const CONTENT_TYPE = 'visitor';

// GET /api/visitors — fetch all visitor logs
export async function GET() {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: CONTENT_TYPE,
      order: ['-fields.checkInTime'],
      limit: 100,
    });

    const logs = entries.items.map((item) => ({
      id: item.sys.id,
      fullName: item.fields.fullName,
      phoneNumber: item.fields.phoneNumber,
      purpose: item.fields.purpose,
      host: item.fields.host,
      checkInTime: item.fields.checkInTime,
      checkOutTime: item.fields.checkOutTime || null,
      status: item.fields.status,
    }));

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Failed to fetch visitors:', error);
    return NextResponse.json({ error: 'Failed to fetch visitors' }, { status: 500 });
  }
}

// POST /api/visitors — create a new check-in entry
export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, phoneNumber, purpose, host } = body;

    if (!fullName || !phoneNumber || !purpose || !host) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const environment = await getEnvironment();

    const entry = await environment.createEntry(CONTENT_TYPE, {
      fields: {
        fullName: { 'en-US': fullName },
        phoneNumber: { 'en-US': parseInt(phoneNumber, 10) },
        purpose: { 'en-US': purpose },
        host: { 'en-US': host },
        checkInTime: { 'en-US': new Date().toISOString() },
        checkOutTime: { 'en-US': null },
        status: { 'en-US': 'active' },
      },
    });

    await entry.publish();

    return NextResponse.json({
      id: entry.sys.id,
      fullName,
      phoneNumber,
      purpose,
      host,
      checkInTime: entry.fields.checkInTime['en-US'],
      checkOutTime: null,
      status: 'active',
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create visitor:', error);
    return NextResponse.json({ error: error.message || 'Failed to create visitor' }, { status: 500 });
  }
}
