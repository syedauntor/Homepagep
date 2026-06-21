import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const zipPath = new URL("./printanduse.zip", import.meta.url);
  const zipBytes = await Deno.readFile(zipPath);

  return new Response(zipBytes, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="printanduse.zip"',
      "Content-Length": String(zipBytes.byteLength),
    },
  });
});
