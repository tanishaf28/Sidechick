# SIDECHICK™ 🔴
### *The research partner your supervisor doesn't know about.*

> Papers pile up. Ideas evaporate. Deadlines hide in emails. Most AI tools sit outside all of it, guessing what you want. SIDECHICK lives inside your Notion and actually does the work.

[![MLH × Notion MCP Challenge](https://img.shields.io/badge/MLH-Notion%20MCP%20Challenge-C8102E?style=flat-square)](https://mlh.io)
[![Global Hack Week: Cloud](https://img.shields.io/badge/Global%20Hack%20Week-Cloud-1A0808?style=flat-square)](https://ghw.mlh.io)
[![Built with Claude AI](https://img.shields.io/badge/Built%20with-Claude%20AI-C9922A?style=flat-square)](https://anthropic.com)
[![Notion MCP](https://img.shields.io/badge/Notion-MCP%20Powered-000000?style=flat-square&logo=notion)](https://notion.so)

---

## What It Does

Paste **anything** into SIDECHICK : a paper abstract, a YouTube URL, an email from your prof, a half-baked 2am idea, a voice note transcript  and it:

1. **Analyses it** with Claude AI → extracts title, type, tags, summary, key insights, and research connections
2. **Files it** directly into your Notion research database, perfectly structured
3. **Does it in ~5 seconds**, automatically, every time

No manual organisation. No forgotten ideas. No scattered notes.

---

## The Full Vision

SIDECHICK operates across three tiers of intelligence:

| Tier | Name | Status | What it does |
|------|------|--------|-------------|
| 1 | **The Dump Processor** |  Working | Paste anything → structured Notion page in 5 seconds |
| 2 | **The Field Spy** |  Designed(in progress) | Monitors arxiv & researchers → auto-files breakthroughs |
| 3 | **The Daily Brief** | wORKING | Synthesises mail + calendar + notes → morning Notion brief |

SIDECHICK is also connected to **Notion Mail** (Gmail) and **Notion Calendar** (Google Calendar)  so the agent doesn't just organise what you throw at it, it sees your deadlines, reads your professor's emails, and knows what's actually happening in your life.

---

## Quick Start

### Prerequisites
- Node.js 18+
- A Notion account + database (setup below)
- Your Notion API key → [notion.so/my-integrations](https://notion.so/my-integrations)

### 1. Clone & Install

```bash
git clone https://github.com/tanishaf28/Sidechick.git
cd Sidechick
npm install
```

### 2. Configure

Create a `.env.sh` file (or edit the existing one):

```bash
export NOTION_API_KEY="ntn_your_key_here"
export NOTION_DB_ID="your_database_id_here"
export ANTHROPIC_API_KEY="sk-ant-your_key_here"
```

> Get your Anthropic key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

### 3. Set Up Your Notion Database

Your database needs these properties (exact names matter):

| Property | Type |
|----------|------|
| `Title` | Title (default) |
| `Type` | Select |
| `Tags` | Multi-select |
| `Summary` | Text |
| `Source` | URL |
| `Date Added` | Date |

Connect the database to your SIDECHICK integration via **Settings → Connections** in Notion.

### 4. Run

```bash
# Terminal 1 — start the proxy (bypasses CORS)
node proxy.js

# Terminal 2 — open the browser interface
open sidechick.html
# or just double-click sidechick.html
```

---

## Usage

### Browser Interface (Recommended)

Open `sidechick.html` with `proxy.js` running. Paste anything into the dump zone and hit **◆ PROCESS DUMP** or press `Cmd+Enter`.

### Terminal Interface

```bash
source .env.sh
node sidechick.js
```

Paste content and press **Enter twice** to process:

```
❯ Attention is all you need. The Transformer architecture uses
  self-attention mechanisms instead of recurrence or convolution.
  This allows for more parallelization and achieves state of the art
  on machine translation tasks.

◆ SIDECHICK is reading...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Transformer Architecture: Attention Mechanism Overview
  Paper · NLP, Transformers, Attention, Deep Learning, ML

  The Transformer model replaces recurrent layers with self-attention,
  enabling full parallelisation during training. It achieved SOTA on
  WMT translation benchmarks and laid the foundation for GPT and BERT.

  Key Insights:
  · Self-attention allows each token to attend to all others equally
  · No sequential dependency means massively faster training
  · Positional encoding preserves word order without recurrence

  Possible Connections:
  · Links to BERT, GPT, and modern LLM architectures
  · Relates to your notes on sequence modelling

◆ Filing to Notion...
✓ Filed! https://notion.so/your-page-url
```

**Terminal commands:** `/help` — show help · `/quit` — exit

---

## What You Can Dump

| Type | Examples |
|------|---------|
| 📄 Papers | Abstracts, excerpts, full PDFs |
| 🔗 URLs | YouTube lectures, articles, blog posts, tweets |
| 💭 Ideas | Half-formed thoughts, shower realisations, 2am theories |
| 📧 Emails | Messages from professors, collaborators, journals |
| 🎙️ Voice notes | Transcripts from walks, commutes, study sessions |
| 📝 Notes | Lecture snippets, meeting notes, reading highlights |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Your Input                        │
│   (any format — text, URL, idea, email, excerpt)   │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│              Claude AI (Sonnet 4)                   │
│   Analyses → JSON: title, type, tags, summary,     │
│   key insights, research connections                │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│           Node.js Proxy (proxy.js)                  │
│   Handles CORS · Routes to Notion API               │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│         Notion API (MCP-compatible)                 │
│   Creates structured page with rich content blocks  │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│         Your Notion Research Database ✓             │
│   Connected to: Notion Mail · Notion Calendar       │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Technology | Role |
|-----------|------|
| **Claude AI (Sonnet 4)** | Intelligence layer — analyses input, returns structured JSON |
| **Notion API + MCP** | Memory layer — read/write to workspace, databases, mail, calendar |
| **Notion Mail** | Gmail connected — agent reads real email context |
| **Notion Calendar** | Google Calendar synced — agent knows deadlines and schedule |
| **Node.js** | Proxy server handling CORS and Notion API authentication |
| **HTML / JS** | Zero-dependency browser interface — no build step, opens in any browser |

---

## About This Project

Built for the **MLH × Notion MCP Challenge 2026** as part of **Global Hack Week: Cloud**.

SIDECHICK demonstrates how Notion MCP can serve as the long-term memory and context layer for an AI research agent turning a scattered, multi-format information stream into a structured, searchable, connected knowledge base that compounds over time. Notion is not a peripheral feature here. It is the entire foundation.

Not a chatbot that can look up a Notion page. A full-context agent that treats your entire Notion ecosystem  mail, calendar, notes, databases as its working memory, and uses Claude AI to reason across all of it simultaneously.

---

*Your official tools don't need to know.*
