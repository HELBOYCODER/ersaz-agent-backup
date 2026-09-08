#!/bin/sh
# Restore backup into a fresh Minis sandbox. Run with: sh scripts/restore.sh
# 1) memory:    cp memory/*.md /var/minis/memory/
# 2) skills:    cp -r skills/* /var/minis/skills/
# 3) mcp:       re-register each server from mcp/servers.json via:
#                 minis-mcp-cli add --name <n> --command ... / --url ...
#               (full command lines are in mcp/servers.json + mcp/tools/*.info.json)
# 4) local mcp sources in mcp/local-src/ need their runtimes reinstalled
#    (npm i / pip install) before re-adding.
# 5) providers/models/envvars: recreate in Settings UI (values/secrets NOT stored here).
set -e
cp memory/*.md /var/minis/memory/ 2>/dev/null || cp memory/*.md $HOME/ 2>/dev/null || true
mkdir -p /var/minis/skills
cp -r skills/* /var/minis/skills/
echo "restored memory + skills. Re-add MCPs manually (see README)."
