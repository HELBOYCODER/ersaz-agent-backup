# Netra Hub — Restore Guide (فارسی)

## بکاپ چیست

- `netra-vitals-YYYY-MM-DD.tar.gz.enc` — پکیج AES-256-CBC (PBKDF2 200k) شامل **تمام کلیدها**: `CLOUDFLARE_API_TOKEN`, `telegram_bot_token`, `DB id`, `account id`
- بقیه فایل‌های پوشه (`worker.js`, `wrangler.toml`, `schema.sql`, `d1-*.json`) — **متن خام کم‌حساس** برای ریستور سریع بدون دیکریپت
- مقدار تلگرام در `d1-settings.json` متن خام **REDACTED** است؛ نسخه واقعی فقط داخل `.enc` است

## بازیابی فوری پنل (۵ دقیقه)

```sh
# 1) decrypt
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 \
  -in netra-hub-backup/netra-vitals-2026-09-13.tar.gz.enc \
  -out /tmp/netra-vitals.tar.gz -pass file:/path/to/password.txt
tar xzf /tmp/netra-vitals.tar.gz -C /tmp/netra-vitals

# یا اگر پسورد را به‌عنوان NETRA_BACKUP_PASS در env دارید:
# openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -in netra-vitals-...tar.gz.enc -out /tmp/netra-vitals.tar.gz -pass env:NETRA_BACKUP_PASS

# 2) redeploy worker (نیاز به CLOUDFLARE_API_TOKEN از secrets/netra-secrets.json)
export CLOUDFLARE_API_TOKEN="$(jq -r .CLOUDFLARE_API_TOKEN /tmp/netra-vitals/secrets/netra-secrets.json)"
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$(jq -r .CF_ACCOUNT_ID /tmp/netra-vitals/secrets/netra-secrets.json)/workers/scripts/netra-hub" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -F 'metadata={"main_module":"worker.js","compatibility_date":"2026-07-10","compatibility_flags":["nodejs_compat"],"bindings":[{"type":"plain_text","name":"WORKER_NAME","text":"netra-hub"},{"type":"plain_text","name":"CF_ACCOUNT_ID","text":"d8260cb1310e4d44256bb12573aa1401"},{"type":"d1","name":"DB","database_id":"bdd84bcd-b5a5-4dd6-a763-ea6cf4389128"}]};type=application/json' \
  -F "worker.js=@/tmp/netra-vitals/files/worker.js;type=application/javascript+module"
# اگر ارور 1042 دیدید (subdomain غیرفعال):
curl -X POST -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"enabled":true}' \
  "https://api.cloudflare.com/client/v4/accounts/d8260cb1310e4d44256bb12573aa1401/workers/scripts/netra-hub/subdomain"

# 3) reset webhook
BOT="$(jq -r .TELEGRAM_BOT_TOKEN /tmp/netra-vitals/secrets/netra-secrets.json)"
curl "https://api.telegram.org/bot${BOT}/setWebhook?url=https://netra-hub.ersaz0174.workers.dev/telegram&drop_pending_updates=true"
curl "https://api.telegram.org/bot${BOT}/getWebhookInfo"
```

## پسورد بکاپ

- فایل `netra-backup-password.txt` را **امن نگه دار** (پسورد `env-backup` نیست)
- پیشنهاد: به‌عنوان متغیر محیطی مقصد هم ذخیره کن: `NETRA_BACKUP_PASS`
