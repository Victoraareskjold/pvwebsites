import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../../utils/supabase/client";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      site,
      user_address,
      user_name,
      user_phone,
      user_email,
      user_equipment,
      user_comment,
      gclid,
      fbclid,
      utmCampaign,
    } = body;
    if (!user_address || !user_name || !user_phone || !user_email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const client = createSupabaseAdminClient();

    const { data: installerGroup, error: installerError } = await client
      .from("installer_groups")
      .select("id, team_id")
      .eq("site", site)
      .single();

    if (installerError || !installerGroup) {
      return NextResponse.json(
        { error: "Installer group not found" },
        { status: 404 },
      );
    }

    const { id: installer_group_id, team_id } = installerGroup;

    const { data: lead, error: leadError } = await client
      .from("leads")
      .insert({
        team_id,
        installer_group_id,
        person_info: user_name,
        address: user_address,
        phone: user_phone,
        email: user_email,
        status: 6,
        note: `
Equipment: ${user_equipment || ""}
Comment: ${user_comment || ""}

Tracking:
gclid: ${gclid || ""}
fbclid: ${fbclid || ""}
utmCampaign: ${utmCampaign || ""}
        `,
      })
      .select()
      .single();

    if (leadError) throw leadError;

    return NextResponse.json({ success: true, lead });
  } catch (err) {
    console.error("POST /api/leads/create error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
