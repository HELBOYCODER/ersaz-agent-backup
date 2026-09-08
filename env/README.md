# env/ — بکاپ رمزنگاری‌شده متغیرها (خصوصی)

> ⚠️ این پوشه فقط فایل **رمزنگاری‌شده** دارد. هیچ مقدار سکرتی به‌صورت متن خام داخل گیت نیست.

## فایل‌ها

| فایل | توضیح |
|---|---|
| `env-backup-2026-09-08.tar.gz.enc` | پکیج AES-256-CBC (PBKDF2, 200k iter) شامل: مقادیر ۱۰ کلید کاربر + `.npmrc` + `.git-credentials` + `synapse.db` + `servers.json` + لیست نام کلیدها |
| `manifest.json` | فقط **اسم** کلیدهای ست/نات‌ست + وضعیت کپی فایل‌ها (بدون هیچ مقداری) |

## کلیدهای داخل پکیج (فقط اسم)

`CLOUDFLARE2_API_TOKEN`، `CLOUDFLARE_API_TOKEN`، `GEMINI_API_KEY`، `GH_TOKEN`، `MU_TOKEN`، `TG_BOT_TOKEN`، `UNUSUAL_WHALES_API_KE`، `VERCEL_TOKEN`، `WHALES`، `YOU_API_KEY`

ست‌نشده: `UNUSUAL_WHALES_API_KEY` (خالی)

## دیکریپت

پسورد فقط نزد کاربر است (در چت خصوصی داده شده، اینجا ذخیره نشده):

```sh
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 \
  -in env/env-backup-2026-09-08.tar.gz.enc \
  -out /tmp/env-restore.tar.gz -pass file:/path/to/password.txt
tar xzf /tmp/env-restore.tar.gz -C /tmp/env-restore/
# env.json -> مقادیر | files/ -> فایل‌ها (سر جاشون کپی کن)
```
