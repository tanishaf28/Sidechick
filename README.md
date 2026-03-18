# SIDECHICK 🔴
### *The research partner your supervisor doesn't know about.*

Paste anything a paper abstract, a YouTube URL, a half-baked 2am idea, an email from your prof and SIDECHICK:

1. **Analyses it** with Claude AI (title, type, tags, summary, key insights, research connections)
2. **Files it** directly into your Notion research database, perfectly structured
3. **Does it in ~5 seconds**

---

## Setup (5 minutes)

### 1. Prerequisites
- [Node.js 18+](https://nodejs.org)
- A Notion account with a database (see below)
- An Anthropic API key → [console.anthropic.com](https://console.anthropic.com)

### 2. Install
```bash
git clone <your-repo>  # or just download this folder
cd sidechick
npm install
```

### 3. Set your API keys
Edit `.env.sh` and fill in your Anthropic API key:
```bash
export NOTION_API_KEY="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"
export NOTION_DB_ID="760f6795cbbe4493bc032065302b7ce2"
export ANTHROPIC_API_KEY="sk-ant-YOUR_KEY_HERE"
```

Get your Anthropic key at: https://console.anthropic.com/settings/keys

### 4. Set up your Notion Database
Your database needs these properties (exact names matter):

| Property | Type |
|----------|------|
| `Title` | Title (default) |
| `Type` | Select |
| `Tags` | Multi-select |
| `Summary` | Text |
| `Source` | URL |
| `Date Added` | Date |

> Already set up? Skip this :SIDECHICK writes directly to your connected database.

### 5. Run it
```bash
source .env.sh
npm start
```

---

## Usage

Once running, just paste or type anything and press **Enter twice**:

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

### Commands
- Paste any content → press Enter twice → filed to Notion
- `/help` - show help
- `/quit` - exit

---

## What you can dump

- 📄 Paper abstracts or excerpts
- 🔗 URLs (YouTube, articles, blog posts)
- 💭 Random ideas or shower thoughts
- 📧 Emails from professors or collaborators
- 🎙️ Voice note transcripts
- 📝 Lecture notes or snippets
- 🐦 Tweets or threads

---

## Architecture

```
Your dump (any format)
        ↓
  Claude claude-opus-4-5
  (analyse → JSON)
        ↓
  Notion API (MCP-compatible)
  (create structured page)
        ↓
  Your Notion Research DB 
```

---

## Notion MCP Challenge

Built for the **MLH × Notion MCP Challenge 2026**.

SIDECHICK demonstrates how Notion MCP can serve as the long-term memory layer for an AI research agent turning a scattered, multi-format information stream into a structured, searchable, connected knowledge base.

---

*Your official tools don't need to know.*