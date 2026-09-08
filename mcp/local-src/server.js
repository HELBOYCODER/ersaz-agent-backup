/**
 * Google Mantis MCP Server v1.0.0
 * Exposes Google Mantis as MCP tools for AI agents
 * https://github.com/google/mantis
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANTIS_DIR = path.join(__dirname, '..', 'mantis-mcp');

// ─── Skill Definitions ─────────────────────────────────────────────────────

const SKILLS = {
  'mantis-history': {
    command: '/mantis-history',
    description: 'Analyzes repository VCS history to extract past vulnerabilities, security fixes, and patterns.',
  },
  'mantis-structural-index': {
    command: '/mantis-structural-index',
    description: 'Builds a content-addressed semantic-unit index (manifest + catalog) from source code.',
  },
  'mantis-summarize': {
    command: '/mantis-summarize',
    description: 'Generates security-focused directory summaries (mantis-summary.md). Reduces token overhead by 85%+.',
  },
  'mantis-architecture': {
    command: '/mantis-architecture',
    description: 'Synthesizes raw learnings and codebase analysis into an interlinked Markdown Knowledge Base.',
  },
  'mantis-threat-model': {
    command: '/mantis-threat-model',
    description: 'Synthesizes trust boundaries, attack surfaces, and attacker profiles into a living threat model.',
  },
  'mantis-plan': {
    command: '/mantis-plan',
    description: 'Formulates a targeted defensive security reviewing plan. Outputs workspace/plan.json.',
  },
  'mantis-researcher': {
    command: '/mantis-researcher',
    description: 'Multi-threaded security flaw sweep. Audits production source code based on the strategy in workspace/plan.json.',
  },
  'mantis-dedupe': {
    command: '/mantis-dedupe',
    description: 'Consolidates raw security findings to eliminate redundant reports.',
  },
  'mantis-review': {
    command: '/mantis-review',
    description: 'Independently reviews findings and filters out false positives using the Negative Filter Rule.',
  },
  'mantis-critic': {
    command: '/mantis-critic',
    description: 'Assesses production viability of findings, filtering debug-only and non-exploitable edge cases.',
  },
  'mantis-reproduce': {
    command: '/mantis-reproduce',
    description: 'Generates and runs crash reproducers to verify security flaws. Docker + gVisor sandbox required.',
  },
  'mantis-patch': {
    command: '/mantis-patch',
    description: 'Generates minimal security fixes using transactional isolation (shadow directories).',
  },
  'mantis-calibrate': {
    command: '/mantis-calibrate',
    description: 'Calculates final risk score based on empirical evidence and architectural impact.',
  },
  'mantis-report': {
    command: '/mantis-report',
    description: 'Generates human-readable security review packet from confirmed findings.',
  },
  'mantis-advise': {
    command: '/mantis-advise',
    description: 'Proactive security advisor and guardrail assistant for secure code development.',
  },
  'mantis-meta-agent': {
    command: '/mantis-meta-agent',
    description: 'Persistent supervisor that launches and monitors the automated review pipeline.',
  },
  'mantis-reflect': {
    command: '/mantis-reflect',
    description: 'Extracts learnings from execution trajectories. Updates workspace/learnings.jsonl.',
  },
  'mantis-chain': {
    command: '/mantis-chain',
    description: 'Analyzes findings to construct complex exploit chains from separate vulnerabilities.',
  },
};

const PIPELINE_STAGES = [
  { id: 'mantis-history',         name: 'History Analyzer',    purpose: 'Learn from past vulnerabilities' },
  { id: 'mantis-structural-index',name: 'Semantic Index',      purpose: 'Build content-addressed index' },
  { id: 'mantis-summarize',       name: 'Dir Summarizer',      purpose: 'Reduce token overhead by 85%' },
  { id: 'mantis-architecture',   name: 'Architecture KB',     purpose: 'Synthesize Knowledge Base' },
  { id: 'mantis-threat-model',   name: 'Threat Model',        purpose: 'Map attack surfaces' },
  { id: 'mantis-plan',           name: 'Strategic Planner',    purpose: 'Build scanning roadmap' },
  { id: 'mantis-researcher',    name: 'Security Researcher',  purpose: 'Find vulnerabilities' },
  { id: 'mantis-dedupe',         name: 'Deduplicator',         purpose: 'Eliminate redundant findings' },
  { id: 'mantis-review',         name: 'Reviewer',             purpose: 'Filter false positives' },
  { id: 'mantis-critic',         name: 'Critic',               purpose: 'Eliminate non-viable issues' },
  { id: 'mantis-reproduce',      name: 'Reproducer',           purpose: 'Sandboxed PoC verification' },
  { id: 'mantis-patch',          name: 'Patcher',              purpose: 'Generate security patches' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function getSkillContent(skillId) {
  const skillPath = path.join(MANTIS_DIR, skillId, 'SKILL.md');
  if (!fs.existsSync(skillPath)) return null;
  return fs.readFileSync(skillPath, 'utf8');
}

function generateOverview() {
  return `## 🐜 Mantis — Google Open-Source Agentic Bug Finding & Fixing Framework

**GitHub:** https://github.com/google/mantis
**Blog:** https://cloud.google.com/blog/products/identity-security/getting-started-with-the-mantis-harness-to-find-and-fix-bugs

### Key Features
- **12-stage sequential pipeline**: history → index → summarize → architecture → threat-model → plan → researcher → dedupe → review → critic → reproduce → patch
- **85%+ token reduction**: Hierarchical Security Summary Tree condenses directories into summaries
- **False Positive Filtering**: Critic + Review agents + sandboxed reproduction eliminate hallucinated bugs
- **Sandbox Execution**: Docker + gVisor (--network=none) for running AI-generated crash code
- **Continuous Pipeline**: Snapshot-per-pass model for living codebases (opt-in)

### Installation
\`\`\`bash
git clone https://github.com/google/mantis.git
npx skills add google/mantis
\`\`\`

### Quick Start
In your AI coding agent (Gemini CLI, Antigravity CLI, etc.):
\`\`\`
/mantis-plan        # Build scanning roadmap
/mantis-researcher  # Find vulnerabilities
/mantis-review     # Filter false positives
/mantis-critic     # Remove non-exploitable issues
/mantis-reproduce  # Run PoC in sandbox
/mantis-patch      # Generate patches
\`\`\`

### ⚠️ Safety Notes
- Run ONLY in isolated VMs — never on machines with production access
- All findings must be verified by a security expert before reporting
- Do not mass-file unverified AI-generated reports to open-source maintainers
- AI agents are non-deterministic — always review generated code before execution
`;
}

// ─── Server ─────────────────────────────────────────────────────────────────

const server = new Server({ name: 'mantis-security', version: '1.0.0' }, {
  capabilities: { tools: {} },
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'mantis_overview',
      description: 'Get comprehensive overview of Google Mantis framework, architecture, and usage.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'mantis_pipeline',
      description: 'Get the full sequential pipeline with all 12 stages, commands, and purpose.',
      inputSchema: {
        type: 'object',
        properties: {
          target_path: { type: 'string', description: 'Path to the codebase to review' },
          focus_areas: { type: 'string', description: 'Comma-separated skill IDs to include (e.g. "mantis-plan,mantis-researcher,mantis-review")' },
          mode: { type: 'string', description: '"manual" or "continuous" (default: manual)' },
        },
      },
    },
    {
      name: 'mantis_run_stage',
      description: 'Get detailed guide for executing a specific Mantis pipeline stage, including arguments and full SKILL.md content.',
      inputSchema: {
        type: 'object',
        properties: {
          skill_id: { type: 'string', description: 'Skill ID (e.g. mantis-plan, mantis-researcher)', enum: Object.keys(SKILLS) },
          target_path: { type: 'string', description: 'Path to the target codebase' },
        },
        required: ['skill_id'],
      },
    },
    {
      name: 'mantis_get_skill',
      description: 'Get the raw SKILL.md content for any Mantis skill.',
      inputSchema: {
        type: 'object',
        properties: {
          skill_id: { type: 'string', description: 'Skill ID', enum: Object.keys(SKILLS) },
        },
        required: ['skill_id'],
      },
    },
    {
      name: 'mantis_list_skills',
      description: 'List all 18 available Mantis skills with their commands and descriptions.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'mantis_agents_reference',
      description: 'Get the full README_AGENTS.md — architecture reference, inter-stage contracts, model selection guidelines, and cloud deployment guide.',
      inputSchema: { type: 'object', properties: {} },
    },
    // Expose each skill as its own tool
    ...Object.entries(SKILLS).map(([id, skill]) => ({
      name: id,
      description: skill.description,
      inputSchema: {
        type: 'object',
        properties: {
          target_path: { type: 'string', description: 'Path to the target codebase to analyze' },
        },
        required: ['target_path'],
      },
    })),
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const targetPath = args?.target_path;

  try {
    // ── Overview ──
    if (name === 'mantis_overview') {
      return { content: [{ type: 'text', text: generateOverview() }] };
    }

    // ── Pipeline ──
    if (name === 'mantis_pipeline') {
      const focus = args?.focus_areas;
      const stageList = focus
        ? PIPELINE_STAGES.filter((s) => focus.split(',').map((x) => x.trim()).includes(s.id))
        : PIPELINE_STAGES;

      let text = `## 🐜 Mantis Pipeline\n\n**Mode:** ${args?.mode || 'manual'}  **Target:** \`${targetPath || 'not specified'}\`\n\n`;
      text += `| # | Stage | Command | Purpose |\n|---|-------|---------|--------|\n`;
      stageList.forEach((s, i) => {
        text += `| ${i + 1} | **${s.name}** | \`${SKILLS[s.id]?.command || s.id}\` | ${s.purpose} |\n`;
      });
      text += `\n\`\`\`bash\ngit clone https://github.com/google/mantis\nnpx skills add google/mantis\n\`\`\`\n\n` + generateOverview();
      return { content: [{ type: 'text', text }] };
    }

    // ── Run Stage ──
    if (name === 'mantis_run_stage') {
      const skillId = args?.skill_id;
      const skill = SKILLS[skillId];
      if (!skill) return { content: [{ type: 'text', text: `❌ Unknown: ${skillId}` }], isError: true };

      const content = getSkillContent(skillId);
      let text = `## ${skill.command} — ${skillId}\n\n**${skill.description}**\n\n`;
      text += `### How to Use\n\nIn your AI coding agent, run:\n\`\`\`\n${skill.command}\n\`\`\`\n`;
      if (targetPath) text += `Arguments: \`--target_path ${targetPath}\`\n`;

      if (content) {
        const clean = content.replace(/^---\n[\s\S]*?---\n/, '');
        text += `\n### SKILL.md\n\n\`\`\`markdown\n${clean.slice(0, 6000)}\n\`\`\``;
      }
      return { content: [{ type: 'text', text }] };
    }

    // ── List Skills ──
    if (name === 'mantis_list_skills') {
      let text = `## 🐜 Mantis Skills (${Object.keys(SKILLS).length} total)\n\n`;
      text += `| # | Skill ID | Command | Description |\n`;
      text += `|---|----------|---------|-------------|\n`;
      Object.entries(SKILLS).forEach(([id, s], i) => {
        const d = s.description.slice(0, 70);
        text += `| ${i + 1} | \`${id}\` | \`${s.command}\` | ${d}${s.description.length > 70 ? '...' : ''} |\n`;
      });
      text += `\nUse \`mantis_run_stage\` with \`skill_id\` to get the full guide.\n`;
      return { content: [{ type: 'text', text }] };
    }

    // ── Get Skill raw ──
    if (name === 'mantis_get_skill') {
      const skillId = args?.skill_id;
      const content = getSkillContent(skillId);
      if (!content) return { content: [{ type: 'text', text: `❌ Not found: ${skillId}` }], isError: true };
      return { content: [{ type: 'text', text: content }] };
    }

    // ── Agents Reference ──
    if (name === 'mantis_agents_reference') {
      const readmePath = path.join(MANTIS_DIR, 'README_AGENTS.md');
      if (!fs.existsSync(readmePath)) return { content: [{ type: 'text', text: '❌ README_AGENTS.md not found' }], isError: true };
      const content = fs.readFileSync(readmePath, 'utf8');
      return { content: [{ type: 'text', text: content.slice(0, 12000) }] };
    }

    // ── Individual Skill Tools ──
    if (SKILLS[name]) {
      const skill = SKILLS[name];
      let text = `## ${skill.command}\n\n**${skill.description}**\n\n`;
      text += `In your AI coding agent, run:\n\`\`\`\n${skill.command}\n\`\`\`\n`;
      text += `Target: \`${targetPath || '[path to your codebase]'}\`\n\n`;
      text += `Use \`mantis_run_stage\` tool with \`skill_id="${name}"\` to get the full SKILL.md content.\n`;
      return { content: [{ type: 'text', text }] };
    }

    return { content: [{ type: 'text', text: `❌ Unknown tool: ${name}` }], isError: true };
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
  }
});

// ─── Start ──────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.error('[mantis-mcp] Server connected');
}).catch((err) => {
  console.error('[mantis-mcp] Connection error:', err);
  process.exit(1);
});