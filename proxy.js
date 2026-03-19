#!/usr/bin/env node

/**
 * SIDECHICK Proxy Server
 * Bypasses CORS so sidechick.html can talk to Notion API
 * Run: node proxy.js
 */

import http from "http";
import https from "https";

const PORT = 3131;

const server = http.createServer((req, res) => {
  // CORS headers — allow everything from local files
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Notion-Version");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Only proxy /notion/* routes
  if (!req.url.startsWith("/notion/")) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  // Strip /notion prefix → forward to api.notion.com
  const notionPath = req.url.replace("/notion", "");

  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    const options = {
      hostname: "api.notion.com",
      path: notionPath,
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Notion-Version": req.headers["notion-version"] || "2022-06-28",
        ...(req.headers["authorization"]
          ? { Authorization: req.headers["authorization"] }
          : {}),
      },
    };

    const proxyReq = https.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      proxyRes.pipe(res);
    });

    proxyReq.on("error", (err) => {
      res.writeHead(502);
      res.end(JSON.stringify({ error: err.message }));
    });

    if (body) proxyReq.write(body);
    proxyReq.end();

    // Log every request
    const status = `[${new Date().toLocaleTimeString()}]`;
    console.log(`${status} ${req.method} ${notionPath}`);
  });
});

server.listen(PORT, () => {
  console.log(`
\x1b[31m╔══════════════════════════════════════╗
║   SIDECHICK PROXY  ·  port ${PORT}     ║
╚══════════════════════════════════════╝\x1b[0m

\x1b[32m✓ Running.\x1b[0m Open \x1b[1msidechick.html\x1b[0m in your browser.
  Keep this terminal open while using SIDECHICK.

\x1b[2m  Ctrl+C to stop\x1b[0m
`);
});
