import { NextRequest } from "next/server";
import { parseExcelToRows } from "@/lib/xlsx";
import { scrapeForProducts } from "@/lib/scrape";

export const runtime = "nodejs"; // needs cheerio
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: "Missing file" }), { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const rows = parseExcelToRows(Buffer.from(arrayBuffer));
  const results = await scrapeForProducts(rows);
  return new Response(JSON.stringify(results), { headers: { "content-type": "application/json" } });
}
