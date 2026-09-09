import { NextRequest, NextResponse } from 'next/server';
import { parseExcelBuffer } from '@/lib/data/parser';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const rows = parseExcelBuffer(buffer);

  return NextResponse.json({ rows, count: rows.length });
}
