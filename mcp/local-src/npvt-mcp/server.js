#!/usr/bin/env node
/**
 * NPVT & Cloudflare Management MCP Server
 * Pure Node.js stdlib JSON-RPC 2.0 MCP server.
 * Provides tools for NPVT1 encryption/decryption and Cloudflare Worker / D1 management.
 */

const fs = require('fs');
const readline = require('readline');

// Load WBAES tables from clean engine
const engineCode = fs.readFileSync('/tmp/clean_npvt_engine.js', 'utf8');
eval(engineCode);

const CF_CONTEXT = {
  account_id: "d8260cb1310e4d44256bb12573aa1401",
  account_name: "Ersaz0174@gmail.com's Account",
  token: "cfut_UToWiEuzMlH8sR5CivsPQzQ8l03hMt2vhYcqdaH8aecc97b0",
  d1_database_id: "bdd84bcd-b5a5-4dd6-a763-ea6cf4389128",
  d1_name: "ersaz_panel_db",
  worker_name: "netra-hub",
  subdomain: "ersaz0174.workers.dev",
  file_extension: ".npvt",
  worker_url: "https://netra-hub.ersaz0174.workers.dev",
  bot: "@netranew_bot"
};

const TOOLS = [
  {
    name: "generate_npvt",
    description: "Generate a valid encrypted NPVT1 container (.npvt file content) for NapsternetV / NPV Tunnel (iOS & Android) from VLESS/VMess parameters.",
    inputSchema: {
      type: "object",
      properties: {
        username: { type: "string", description: "Username (e.g. user1)" },
        uuid: { type: "string", description: "Client UUID" },
        host: { type: "string", description: "Worker host / SNI (e.g. netra-hub.ersaz0174.workers.dev)" },
        clean_ip: { type: "string", description: "Clean CDN IP (default: www.speedtest.net)" },
        remark: { type: "string", description: "Config display remark name" },
        output_file: { type: "string", description: "Optional Linux file path to write .npvt file to" }
      },
      required: ["username", "uuid", "host"]
    }
  },
  {
    name: "decode_npvt",
    description: "Decrypt and parse an NPVT1 string or .npvt file back to human-readable VLESS/VMess profiles and settings.",
    inputSchema: {
      type: "object",
      properties: {
        content: { type: "string", description: "NPVT1 string or base64 token" },
        file_path: { type: "string", description: "Path to .npvt / .npv file to decode" }
      }
    }
  },
  {
    name: "get_cf_credentials",
    description: "Retrieve stored Cloudflare account IDs, active API token, D1 database ID, and worker endpoints so they are never lost.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];

function handleToolCall(name, args) {
  if (name === "get_cf_credentials") {
    return {
      content: [{
        type: "text",
        text: JSON.stringify(CF_CONTEXT, null, 2)
      }]
    };
  }

  if (name === "generate_npvt") {
    const { username, uuid, host, clean_ip = "www.speedtest.net", remark = `⚡ Speedtest CDN | ${username}`, output_file } = args;
    const isUnlim = true;
    const volTag = "♾️ آن‌لیمیتد";
    const dynPath = "/stream/PANEL_ZEUS/" + ((uuid || "").split("-")[4] || "default");
    const fragIp = "104.21.40.3";

    const lockConfig = {
      version: 1,
      isLocked: false,
      password: "",
      onlyMobileNetwork: false,
      blockRootedAndJailbroken: false,
      onlyOfficialStores: false,
      expiryDate: "",
      deviceIds: "",
      message: "",
      customServerMessage: ""
    };

    const makeV2rayJson = (rmk, srv, isFrag) => {
      const outbound = {
        protocol: "vless",
        settings: {
          vnext: [{ address: srv, port: 443, users: [{ id: uuid, encryption: "none", level: 8 }] }]
        },
        streamSettings: {
          network: "ws",
          security: "tls",
          sockopt: { domainStrategy: "UseIPv4" },
          wsSettings: { headers: { Host: host }, path: encodeURIComponent(dynPath) },
          tlsSettings: { allowInsecure: false, fingerprint: "chrome", alpn: ["http/1.1"], serverName: host }
        },
        tag: "proxy"
      };
      if (isFrag) {
        outbound.streamSettings.fragment = { packets: "1-1", length: "100-200", interval: "1-1" };
      }
      return JSON.stringify({
        remarks: rmk,
        log: { loglevel: "warning" },
        dns: { servers: ["fakedns", { address: "https://dns.google/dns-query", tag: "remote-dns" }], queryStrategy: "UseIPv4", tag: "dns" },
        inbounds: [
          { port: 10808, protocol: "socks", settings: { auth: "noauth", udp: true, userLevel: 8 }, sniffing: { destOverride: ["http", "tls", "fakedns"], enabled: true, routeOnly: true }, tag: "socks-in" },
          { port: 10853, protocol: "dokodemo-door", settings: { address: "1.1.1.1", network: "tcp,udp", port: 53 }, tag: "dns-in" }
        ],
        outbounds: [
          outbound,
          { protocol: "dns", tag: "dns-out" },
          { protocol: "freedom", settings: { domainStrategy: "UseIP" }, tag: "direct" },
          { protocol: "blackhole", settings: { response: { type: "http" } }, tag: "block" }
        ],
        policy: { levels: { "8": { connIdle: 300, downlinkOnly: 1, handshake: 4, uplinkOnly: 1 } }, system: { statsOutboundUplink: true, statsOutboundDownlink: true } },
        routing: { domainStrategy: "IPIfNonMatch", rules: [{ inboundTag: ["socks-in"], port: 53, outboundTag: "dns-out", type: "field" }, { inboundTag: ["dns-in"], outboundTag: "dns-out", type: "field" }, { inboundTag: ["remote-dns"], outboundTag: "proxy", type: "field" }, { inboundTag: ["dns"], outboundTag: "direct", type: "field" }, { network: "udp", outboundTag: "proxy", type: "field" }, { network: "tcp", outboundTag: "proxy", type: "field" }] },
        stats: {}
      });
    };

    const rmk1 = `⚡ Speedtest CDN | ${username} (${volTag})`;
    const rmk2 = `🧠 Fragment | ${username} (${volTag})`;

    const servers = [
      {
        name: rmk1,
        address: `${clean_ip}:443`,
        type: "V2RAY",
        v2rayProfile: {
          configVersion: 4,
          configType: 2,
          subscriptionId: "",
          addedTime: Date.now(),
          remarks: rmk1,
          server: clean_ip,
          serverPort: "443",
          v2rayJson: makeV2rayJson(rmk1, clean_ip, false),
          persistJson: false
        },
        lockConfig
      },
      {
        name: rmk2,
        address: `${fragIp}:443`,
        type: "V2RAY",
        v2rayProfile: {
          configVersion: 4,
          configType: 2,
          subscriptionId: "",
          addedTime: Date.now() + 1,
          remarks: rmk2,
          server: fragIp,
          serverPort: "443",
          v2rayJson: makeV2rayJson(rmk2, fragIp, true),
          persistJson: false
        },
        lockConfig
      }
    ];

    const npvt = buildNPVT1(JSON.stringify(servers), JSON.stringify(lockConfig));

    if (output_file) {
      fs.writeFileSync(output_file, npvt);
      return { content: [{ type: "text", text: `NPVT1 generated and saved to ${output_file} (${npvt.length} bytes)` }] };
    }

    return { content: [{ type: "text", text: npvt }] };
  }

  if (name === "decode_npvt") {
    let raw = args.content || "";
    if (args.file_path) {
      raw = fs.readFileSync(args.file_path, 'utf8');
    }
    const lines = raw.trim().split('\n');
    const header = lines[0];
    const chunks = (lines[1] || "").split(',');
    if (header !== "NPVT1" || chunks.length < 3) {
      throw new Error("Invalid NPVT1 format: missing header or chunks");
    }

    function decryptChunk(b64) {
      const buf = Buffer.from(b64, 'base64');
      const nonce = buf.slice(0, 16);
      const ct = buf.slice(16);
      const pt = ctrCrypt(nonce, ct);
      return Buffer.from(pt).toString('utf8');
    }

    const version = decryptChunk(chunks[0]);
    const servers = JSON.parse(decryptChunk(chunks[1]));
    const settings = JSON.parse(decryptChunk(chunks[2]));

    return {
      content: [{
        type: "text",
        text: JSON.stringify({ version, servers, settings }, null, 2)
      }]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const req = JSON.parse(line);
    const { id, method, params } = req;

    if (method === "initialize") {
      const resp = {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "npvt-manager", version: "1.0.0" }
        }
      };
      process.stdout.write(JSON.stringify(resp) + "\n");
      return;
    }

    if (method === "notifications/initialized") {
      return;
    }

    if (method === "tools/list") {
      const resp = {
        jsonrpc: "2.0",
        id,
        result: { tools: TOOLS }
      };
      process.stdout.write(JSON.stringify(resp) + "\n");
      return;
    }

    if (method === "tools/call") {
      const result = handleToolCall(params.name, params.arguments || {});
      const resp = {
        jsonrpc: "2.0",
        id,
        result
      };
      process.stdout.write(JSON.stringify(resp) + "\n");
      return;
    }

    // Default error for unhandled methods
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Method not found: ${method}` }
    }) + "\n");

  } catch (err) {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32603, message: err.message }
    }) + "\n");
  }
});
