import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../../utils/supabase/client";

// Kalkulatortjenesten. Kan overstyres med CALC_API_URL.
const CALC_API_URL = (process.env.CALC_API_URL || "https://soleklartpriskalkulator-main.vercel.app")
  .trim()
  .replace(/\/+$/, "")
  .replace(/^(?!https?:\/\/)/, "https://");

/** Gjeldende forutsetninger for tilbudet, eller null (tilbudet bruker da de låste verdiene). */
async function currentOfferDefaults(estimateId) {
  try {
    const res = await fetch(`${CALC_API_URL}/api/offer-defaults?estimateId=${encodeURIComponent(estimateId)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function GET(_req, { params }) {
  try {
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
      return NextResponse.json(
        { error: "Missing estimate id" },
        { status: 400 },
      );
    }

    const client = createSupabaseAdminClient();
    const estimateId = (await params).id;

    const { data, error } = await client
      .from("estimates")
      .select(
        `
        *,
        leads (
          status,
          person_info,
          address,
          company,
          email,
          org_nr,
          own_consumption,
          created_by (
            name,
            email,
            phone
          )
        )
      `,
      )
      .eq("id", estimateId)
      .maybeSingle();

    if (error) throw error;

    // Usignerte tilbud: gjeldende forutsetninger fra Beregningsregler i dashboardet,
    // så endringer der slår gjennom. Signerte tilbud beholder det som ble låst (price_data.economy).
    if (data && !data.signed_at) {
      const economyDefaults = await currentOfferDefaults(estimateId);
      if (economyDefaults) data.economyDefaults = economyDefaults;
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/estimates/[id] error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
