import { NextResponse } from 'next/server';
import { getEnvironment } from '../../../../lib/contentful';

// PATCH /api/visitors/[id] — check out a visitor
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const environment = await getEnvironment();
    const entry = await environment.getEntry(id);

    entry.fields.checkOutTime = { 'en-US': new Date().toISOString() };
    entry.fields.status = { 'en-US': 'completed' };

    const updatedEntry = await entry.update();
    await updatedEntry.publish();

    return NextResponse.json({
      id: updatedEntry.sys.id,
      fullName: updatedEntry.fields.fullName['en-US'],
      phoneNumber: updatedEntry.fields.phoneNumber['en-US'],
      purpose: updatedEntry.fields.purpose['en-US'],
      host: updatedEntry.fields.host['en-US'],
      checkInTime: updatedEntry.fields.checkInTime['en-US'],
      checkOutTime: updatedEntry.fields.checkOutTime['en-US'],
      status: 'completed',
    });
  } catch (error) {
    console.error('Failed to check out visitor:', error?.message || error);
    const details = error?.details || error?.message || 'Failed to check out visitor';
    return NextResponse.json({ error: 'Failed to check out visitor', details }, { status: error?.status || 500 });
  }
}

// PUT /api/visitors/[id] — edit a visitor entry
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { fullName, phoneNumber, purpose, host } = body;

    if (!fullName || !phoneNumber || !purpose || !host) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const environment = await getEnvironment();
    const entry = await environment.getEntry(id);

    entry.fields.fullName = { 'en-US': fullName };
    entry.fields.phoneNumber = { 'en-US': parseInt(phoneNumber, 10) };
    entry.fields.purpose = { 'en-US': Array.isArray(purpose) ? purpose[0] : purpose };
    entry.fields.host = { 'en-US': host };

    const updatedEntry = await entry.update();
    await updatedEntry.publish();

    return NextResponse.json({
      id: updatedEntry.sys.id,
      fullName: updatedEntry.fields.fullName['en-US'],
      phoneNumber: updatedEntry.fields.phoneNumber['en-US'],
      purpose: updatedEntry.fields.purpose['en-US'],
      host: updatedEntry.fields.host['en-US'],
      checkInTime: updatedEntry.fields.checkInTime['en-US'],
      checkOutTime: updatedEntry.fields.checkOutTime?.['en-US'] || null,
      status: updatedEntry.fields.status['en-US'],
    });
  } catch (error) {
    console.error('Failed to update visitor:', error);
    return NextResponse.json({ error: error.message || 'Failed to update visitor' }, { status: 500 });
  }
}

// DELETE /api/visitors/[id] — delete a visitor entry
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const environment = await getEnvironment();
    const entry = await environment.getEntry(id);

    // Unpublish first if published, then delete
    try {
      await entry.unpublish();
    } catch {
      // Entry may already be in draft
    }
    await entry.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete visitor:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete visitor' }, { status: 500 });
  }
}
