import { NextResponse } from 'next/server';
import { EMISSION_FACTORS } from '@/lib/carbon-data';

export async function POST(req: Request) {
  try {
    const { factorId, quantity } = await req.json();

    const factor = EMISSION_FACTORS.find((f) => f.id === factorId);
    if (!factor) {
      return NextResponse.json({ error: 'Emission factor not found' }, { status: 404 });
    }

    const kgCO2 = factor.kgCO2PerUnit * quantity;
    const xpEarned = Math.max(5, Math.round(20 - kgCO2 * 2));

    return NextResponse.json({
      factorId,
      name: factor.name,
      category: factor.category,
      quantity,
      unit: factor.unit,
      kgCO2,
      xpEarned,
    });
  } catch (error: any) {
    console.error('Calculation API error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
