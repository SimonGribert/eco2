import { auth } from "@/auth";
import { CreateAccount } from "@/lib/Account";
import { TinkToken } from "@/types/tink";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;

  try {
    const code = searchParams.get("code");
    const credentials = searchParams.get("credentialsId");

    const tokenRes = await fetch("https://api.tink.com/api/v1/oauth/token", {
      method: "POST",
      body: new URLSearchParams({
        code: code ?? "",
        client_id: process.env.TINK_CLIENT_ID ?? "",
        client_secret: process.env.TINK_SECRET ?? "",
        grant_type: "authorization_code",
      }),
    });

    const data: TinkToken = await tokenRes.json();

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return Response.redirect(`${origin}/login`);
    }

    await CreateAccount({
      provider: "tink",
      providerAccountId: credentials ?? "",
      type: "oauth",
      access_token: data.access_token,
      expires_at: data.expires_in,
      scope: data.scope,
      token_type: data.token_type,
      id_token: data.id_hint,
      refresh_token: data.refresh_token,
      user: { connect: { id: Number(session.user.id) } },
    });
  } catch (err) {
    console.error(`Something went wrong with tink authentication: ${err}`);
  }

  return Response.redirect(`${origin}/`);
}
