"use client";

import { useState } from "react";

type Row = {
  product: string;
  brand?: string;
  model?: string;
  sspUK?: number | null;
  sspEU?: number | null;
};

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    setLoading(true);
    try {
      const res = await fetch("/api/scrape", { method: "POST", body: data });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json = await res.json();
      setResult(json);
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="h1">Price Scraper</h1>
        <p className="p">Upload your Excel sheet. We'll collect SSP and street prices across sources and competitors.</p>
        <form onSubmit={onSubmit} className="grid" style={{ alignItems: "center" }}>
          <div className="col-12">
            <input className="input" type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="col-12">
            <button className="button" disabled={!file || loading}>{loading ? "Scraping..." : "Start Scrape"}</button>
          </div>
        </form>
      </div>

      {error && (
        <div style={{ marginTop: 16 }} className="card">
          <div style={{ color: "#fda4af" }}>Error: {error}</div>
        </div>
      )}

      {result && (
        <div style={{ marginTop: 16 }} className="card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="badge">Rows: {result.rows?.length ?? 0}</div>
            <a className="button" href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(result, null, 2))}`} download="scrape-results.json">Download JSON</a>
          </div>
          <div style={{ overflowX: "auto", marginTop: 16 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SSP UK</th>
                  <th>SSP EU</th>
                  <th>Source</th>
                  <th>Market</th>
                  <th>URL</th>
                  <th>Street Price</th>
                  <th>Competitors</th>
                </tr>
              </thead>
              <tbody>
                {result.rows?.map((r: any, idx: number) => (
                  <tr key={idx}>
                    <td>{r.product}</td>
                    <td>{r.sspUK ?? "-"}</td>
                    <td>{r.sspEU ?? "-"}</td>
                    <td>{r.source}</td>
                    <td>{r.market}</td>
                    <td>
                      <a href={r.url} target="_blank" rel="noreferrer" style={{ color: "#93c5fd" }}>
                        link
                      </a>
                    </td>
                    <td>{r.price ?? "-"}</td>
                    <td>
                      {r.competitors?.length ? (
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {r.competitors.map((c: any, i: number) => (
                            <li key={i}>{c.brand} {c.model} ? {c.market} ? {c.price ?? "-"} (<a href={c.url} style={{ color: "#93c5fd" }} target="_blank">link</a>)</li>
                          ))}
                        </ul>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
