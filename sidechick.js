#!/usr/bin/env node

/**
 * SIDECHICK — The Dump Processor
 * Paste anything → Claude analyses it → Auto-files to Notion
 */

import Anthropic from "@anthropic-ai/sdk";
import readline from "readline";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_DB_ID;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!NOTION_API_KEY || !NOTION_DB_ID || !ANTHROPIC_API_KEY) {
  console.error("\n❌  Missing env vars. Run: source .env before starting.\n");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ── Notion helpers ────────────────────────────────────────────────────────────

async function notionRequest(endpoint, method = "GET", body = null) {
  const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || JSON.stringify(data));
  return data;
}

async function createNotionPage(analysis) {
  const dbId = NOTION_DB_ID.split("?")[0].replace(/-/g, "");

  const page = {
    parent: { database_id: dbId },
    properties: {
      title: {
        title: [{ text: { content: analysis.title } }],
      },
      Type: {
        select: { name: analysis.type },
      },
      Tags: {
        multi_select: analysis.tags.map((t) => ({ name: t })),
      },
      Summary: {
        rich_text: [{ text: { content: analysis.summary } }],
      },
      "Date Added": {
        date: { start: new Date().toISOString().split("T")[0] },
      },
      ...(analysis.source_url
        ? { Source: { url: analysis.source_url } }
        : {}),
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ text: { content: "🧠 SIDECHICK Analysis" } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ text: { content: analysis.summary } }],
        },
      },
      {
        object: "block",
        type: "divider",
        divider: {},
      },
      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [{ text: { content: "💡 Key Insights" } }],
        },
      },
      ...analysis.key_insights.map((insight) => ({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ text: { content: insight } }],
        },
      })),
      {
        object: "block",
        type: "divider",
        divider: {},
      },
      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [{ text: { content: "🔗 Possible Connections" } }],
        },
      },
      ...analysis.connections.map((conn) => ({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ text: { content: conn } }],
        },
      })),
      {
        object: "block",
        type: "divider",
        divider: {},
      },
      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [{ text: { content: "📄 Original Dump" } }],
        },
      },
      {
        object: "block",
        type: "quote",
        quote: {
          rich_text: [
            {
              text: {
                content: analysis.original_text.slice(0, 2000),
              },
            },
          ],
        },
      },
    ],
  };

  return notionRequest("/pages", "POST", page);
}

// ── Claude analysis ───────────────────────────────────────────────────────────

async function analyseWithClaude(rawText) {
  const prompt = `You are SIDECHICK, an elite research intelligence agent. Analyse this content dump and extract structured intelligence for a student/researcher's Notion database.

Content to analyse:
---
${rawText}
---

Respond ONLY with a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "title": "concise title for this entry (max 80 chars)",
  "type": "one of: Paper, Idea, URL, Note, Email",
  "tags": ["array", "of", "3-6", "relevant", "topic", "tags"],
  "summary": "2-3 sentence summary of the core content and why it matters to a researcher",
  "key_insights": ["insight 1", "insight 2", "insight 3", "up to 5 insights"],
  "connections": ["possible connection to other research areas or concepts", "another possible link"],
  "source_url": "URL if one is present in the content, otherwise null",
  "original_text": "${rawText.slice(0, 200).replace(/"/g, '\\"')}..."
}`;

  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text.trim();

  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON if Claude added any extra text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Claude returned invalid JSON:\n" + text);
  }
}

// ── CLI interface ─────────────────────────────────────────────────────────────

function printBanner() {
  console.log(`
\x1b[31m╔═══════════════════════════════════════════════╗
║   ██████╗██╗██████╗ ███████╗ ██████╗██╗  ██╗ ║
║  ██╔════╝██║██╔══██╗██╔════╝██╔════╝██║ ██╔╝ ║
║  ╚█████╗ ██║██║  ██║█████╗  ██║     █████╔╝  ║
║   ╚═══██╗██║██║  ██║██╔══╝  ██║     ██╔═██╗  ║
║  ██████╔╝██║██████╔╝███████╗╚██████╗██║  ██╗ ║
║  ╚═════╝ ╚═╝╚═════╝ ╚══════╝ ╚═════╝╚═╝  ╚═╝ ║
╚═══════════════════════════════════════════════╝
\x1b[0m
  \x1b[2mThe research partner your supervisor doesn't know about.\x1b[0m
  \x1b[2mDump anything. It files everything.\x1b[0m
`);
}

function printHelp() {
  console.log(`\x1b[33m📋 Commands:\x1b[0m
  Type or paste ANY content and press Enter twice to process it.
  Content can be: paper abstract, URL, idea, email, random thought...

  \x1b[2m/quit\x1b[0m  — Exit SIDECHICK
  \x1b[2m/help\x1b[0m  — Show this message
`);
}

async function processInput(input) {
  if (!input.trim()) return;

  console.log(`\n\x1b[31m◆ SIDECHICK is reading...\x1b[0m`);

  let analysis;
  try {
    analysis = await analyseWithClaude(input);
  } catch (err) {
    console.error(`\x1b[31m✗ Analysis failed:\x1b[0m ${err.message}`);
    return;
  }

  console.log(`\n\x1b[33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m`);
  console.log(`\x1b[1m  ${analysis.title}\x1b[0m`);
  console.log(`\x1b[2m  ${analysis.type} · ${analysis.tags.join(", ")}\x1b[0m`);
  console.log(`\n  ${analysis.summary}`);
  console.log(`\n\x1b[33m  Key Insights:\x1b[0m`);
  analysis.key_insights.forEach((i) => console.log(`  · ${i}`));
  console.log(`\n\x1b[33m  Possible Connections:\x1b[0m`);
  analysis.connections.forEach((c) => console.log(`  · ${c}`));
  console.log(`\x1b[33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m`);

  console.log(`\n\x1b[31m◆ Filing to Notion...\x1b[0m`);

  try {
    const page = await createNotionPage({
      ...analysis,
      original_text: input,
    });
    console.log(`\x1b[32m✓ Filed!\x1b[0m ${page.url}\n`);
  } catch (err) {
    console.error(`\x1b[31m✗ Notion error:\x1b[0m ${err.message}\n`);
  }
}

// ── Main loop ─────────────────────────────────────────────────────────────────

async function main() {
  printBanner();
  printHelp();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  let buffer = [];
  let lastLineBlank = false;

  console.log(`\x1b[32m✓ Connected. Ready to receive your dumps.\x1b[0m\n`);
  process.stdout.write("\x1b[31m❯ \x1b[0m");

  rl.on("line", async (line) => {
    if (line === "/quit") {
      console.log("\n\x1b[2mSIDECHICK signing off. Your secrets are safe.\x1b[0m\n");
      process.exit(0);
    }

    if (line === "/help") {
      printHelp();
      process.stdout.write("\x1b[31m❯ \x1b[0m");
      return;
    }

    if (line.trim() === "" && buffer.length > 0) {
      if (lastLineBlank) {
        const content = buffer.join("\n").trim();
        buffer = [];
        lastLineBlank = false;
        if (content) {
          rl.pause();
          await processInput(content);
          process.stdout.write("\x1b[31m❯ \x1b[0m");
          rl.resume();
        }
      } else {
        buffer.push(line);
        lastLineBlank = true;
      }
    } else {
      buffer.push(line);
      lastLineBlank = false;
    }
  });

  rl.on("close", () => {
    if (buffer.length > 0) {
      processInput(buffer.join("\n").trim()).then(() => process.exit(0));
    } else {
      process.exit(0);
    }
  });
}

main().catch(console.error);