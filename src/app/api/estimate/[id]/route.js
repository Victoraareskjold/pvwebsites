import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../../utils/supabase/client";

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
          person_info,
          address,
          company,
          email,
          org_nr,
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
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/estimates/[id] error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
