import { createClient } from "npm:@supabase/supabase-js@2.112.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const IMAGEKIT_PUBLIC_KEY = Deno.env.get("IMAGEKIT_PUBLIC_KEY");
const IMAGEKIT_PRIVATE_KEY = Deno.env.get("IMAGEKIT_PRIVATE_KEY");
const IMAGEKIT_URL_ENDPOINT = Deno.env.get("IMAGEKIT_URL_ENDPOINT") ?? "https://ik.imagekit.io/TriadeBeta";

function basicAuth(user: string, pass: string): string {
  return btoa(`${user}:${pass}`);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
      return new Response(JSON.stringify({ error: "ImageKit credentials not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "DELETE") {
      const body = await req.json();
      const fileId = body.fileId;
      if (!fileId) {
        return new Response(JSON.stringify({ error: "No fileId provided" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const deleteResponse = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${basicAuth(IMAGEKIT_PRIVATE_KEY, "")}`,
        },
      });

      if (!deleteResponse.ok) {
        const errText = await deleteResponse.text();
        return new Response(JSON.stringify({ error: `ImageKit delete failed: ${errText}` }), {
          status: deleteResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const fileName = formData.get("fileName") as string;
    const folder = (formData.get("folder") as string) || "general";

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fileNameToUpload = fileName || `upload_${Date.now()}`;

    const uploadFormData = new FormData();
    uploadFormData.append("file", file, fileNameToUpload);
    uploadFormData.append("fileName", fileNameToUpload);
    uploadFormData.append("folder", folder);

    const uploadResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth(IMAGEKIT_PRIVATE_KEY, "")}`,
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text();
      let parsedError = "ImageKit upload failed";
      try {
        const parsed = JSON.parse(errText);
        parsedError = parsed.message || parsed.error || errText || parsedError;
      } catch {
        parsedError = errText || parsedError;
      }
      return new Response(JSON.stringify({ error: parsedError }), {
        status: uploadResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const uploadResult = await uploadResponse.json();

    return new Response(JSON.stringify({
      url: uploadResult.url,
      fileId: uploadResult.fileId,
      name: uploadResult.name,
      size: uploadResult.size,
      mimeType: uploadResult.mime,
      fileType: uploadResult.fileType,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
