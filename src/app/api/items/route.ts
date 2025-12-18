import { createSupabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export type Body = {
  keyword: string;
  item_code: string;
  th_price: number;
  td_price: number;
};

export async function POST(req: Request) {
  const supabase = createSupabaseAdmin();

  try {
    const body = (await req.json()) as Partial<Body>;

    // Validate secret keyword
    if (!process.env.SECRET_KEYWORD) {
      return NextResponse.json(
        { error: 'Server misconfiguration' },
        { status: 500 }
      );
    }

    // Basic validation
    if (typeof body.keyword !== 'string' || body.keyword.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const keyword = body.keyword.trim(); // Sanitize input
    if (keyword !== process.env.SECRET_KEYWORD) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // payload validation
    if (
      typeof body.item_code !== 'string' ||
      body.item_code.trim().length === 0
    ) {
      return NextResponse.json({ error: 'Invalid item_code' }, { status: 400 });
    }

    const th = Number(body.th_price);
    const td = Number(body.td_price);

    if (isNaN(th) || isNaN(td) || th < 0 || td < 0) {
      return NextResponse.json({ error: 'Invalid prices' }, { status: 400 });
    }

    const item_code = body.item_code.trim();

    // Validasi item_code di database
    const { data: item, error: itemErr } = await supabase
      .from('item_data')
      .select('item_code')
      .eq('item_code', item_code)
      .maybeSingle();
    if (itemErr) {
      return NextResponse.json({ error: itemErr.message }, { status: 400 });
    }
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Insert harga baru ke tabel prices
    const { data, error } = await supabase
      .from('item_price_history')
      .insert({
        item_code: item_code,
        th_price: th,
        td_price: td,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
