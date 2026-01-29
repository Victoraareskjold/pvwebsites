import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../../../utils/supabase/client";
import nodemailer from "nodemailer";

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
    const { leadEmail, createdByEmail } = body;

    const client = createSupabaseAdminClient();
    const estimateId = (await params).id;

    const { data, error } = await client
      .from("estimates")
      .update({ signed: true })
      .eq("id", estimateId)
      .select()
      .single();

    if (error) throw error;

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
      to: [leadEmail, createdByEmail].filter(Boolean).join(", "),
      subject: `Signert Kjøpsavtale!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>Kjøpsavtale signert!</h2>
          <p>Takk for din signering av kjøpsavtalen for solcelleanlegg.</p>
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
