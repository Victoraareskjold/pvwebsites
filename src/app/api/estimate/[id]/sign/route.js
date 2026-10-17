import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../../../utils/supabase/client";
import nodemailer from "nodemailer";
import { signedOfferFor } from "../../../../../components/estimate/offerConfig";

export async function POST(req, { params }) {
  try {
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
      return NextResponse.json(
        { error: "Missing estimate id" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { leadEmail, createdByEmail, estimateUrl, selection } = body;

    const client = createSupabaseAdminClient();
    const estimateId = (await params).id;

    // Kundens endelige valg låses med signeringen. Tilleggene regnes på nytt
    // her fra estimatets egne priser (ikke fra nettleseren).
    const { data: estimate, error: readError } = await client
      .from("estimates")
      .select("id, private, signed_at, price_data, quote_version_id, created_at, leads ( own_consumption )")
      .eq("id", estimateId)
      .maybeSingle();
    if (readError) throw readError;
    if (!estimate) return NextResponse.json({ error: "Fant ikke estimatet" }, { status: 404 });
    if (estimate.signed_at) return NextResponse.json({ error: "Avtalen er allerede signert" }, { status: 409 });

    const signedAt = new Date().toISOString();
    const offer = { ...signedOfferFor(estimate, selection), signedAt };

    const { data, error } = await client
      .from("estimates")
      .update({ signed_at: signedAt, signed_selection: offer.selection, signed_offer: offer })
      .eq("id", estimateId)
      .is("signed_at", null)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Avtalen er allerede signert" }, { status: 409 });

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.error("Missing SMTP env vars");
      return new NextResponse("Server misconfigured", { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Soleklart Dashboard" <${SMTP_USER}>`,
      to: [/* leadEmail,  */ SMTP_USER].filter(Boolean).join(", "),
      subject: `Signert Kjøpsavtale!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>Kjøpsavtale signert!</h2>
          <p>Takk for din signering av kjøpsavtalen for solcelleanlegg.</p>
          <a href="${estimateUrl}" target="_blank">Link til kjøpsavtale</a>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("GET /api/estimates/[id] error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
