import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractAssignmentFromImage, ExtractionError } from "@/lib/ai/extract";
import { ACCEPTED_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/ai/schema";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image was uploaded." }, { status: 400 });
  }
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only PNG and JPEG screenshots are supported." },
      { status: 400 },
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "That image is too large (max 8MB)." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const result = await extractAssignmentFromImage(base64, file.type);
    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof ExtractionError ? error.message : "Couldn't read that screenshot.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
