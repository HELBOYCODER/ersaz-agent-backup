# ersaz-agent-backup

بکاپ شخصی از حافظه، اسکیل‌ها، MCPها و کانفیگ ایجنت ersaz — آخرین آپدیت: 2026-09-08

> ⚠️ ریپو **پرایوت** است و شامل توکن‌ها/کلیدهای واقعی داخل لاگ‌های روزانه است. جایی پابلیکش نکن.

## ساختار

| پوشه | محتوا |
|---|---|
| `memory/` | GLOBAL.md (قوانین دائمی) + SOUL.md + لاگ‌های روزانه 2026-08-22 تا 2026-09-08 |
| `skills/` | هر ۲۰۸ اسکیل کامل (SKILL.md + اسکریپت‌ها) — مدل ۱.۵ گیگی whisper (`youtube-to-text/models/*.bin`) اسکیپ شده، با `requirements.txt` قابل دانلود مجدد است |
| `mcp/` | `servers.json` (کانفیگ هر ۱۸ سرور) + `tools/<name>.info.json` + `tools/<name>.tools.json` (لیست تولزها) + `local-src/` (سورس node سرورهای mantis و npvt) |
| `config/` | خروجی‌های minis-config **بدون سکرت**: providers (سامری)، groups، models، envvars (فقط نام کلیدها)، soul، defaults، memory.enabled |
| `scripts/restore.sh` | اسکریپت برگردوندن بکاپ به سندباکس تازه |

## آمار این بکاپ

- اسکیل‌ها: ۲۰۸ پوشه، ۹۵۹ فایل SKILL.md
- MCPها: ۱۸ سرور (mantis، npvt، codebase-memory، super-search، twitter، instagram، wordpress، seo-mcp، synapse، pixel-bridge، strix، playwright، supabase، gitmcp، context7، deepwiki، you، mu)
- مموری: GLOBAL.md + SOUL.md + ۱۵ لاگ روزانه

## بکاپ Netra Hub

- **پوشه `netra-hub-backup/`**: بکاپ کامل ربات [@netranew_bot](https://t.me/netranew_bot) — شامل `worker.js` + `wrangler.toml` + `schema.sql` + دامپ D1 + پکیج رمزنگاری‌شده `netra-vitals-*.tar.gz.enc` (کلیدهای CF + تلگرام). دیکریپت و ریستور سریع بدون نیاز به گیت‌هاب دیگر → ببین `netra-hub-backup/RESTORE.md` (۴ دستور curl در ۵ دقیقه). تمپلیتی که با `DELETE` خراب شده بود با همین بکاپ برگردانده شد (2026-09-13).

## قوانین دائمی کاربر (از GLOBAL.md)

1. **Memory-first**: اول memory_get بزن بعد جواب بده.
2. **GitHub-first**: هر چیزی خواستی و نداشتی → اول گیت‌هاب سرچ کن، بعد بقیه وب.
3. **Skill registration**: هر تکنیک/شگردی یاد گرفتی → ثبت به‌عنوان Minis skill.
4. **WarpFix Pro** برای تعمیر CI/تست‌ها با کلید کاربر.
5. **Auto-continue**: اگه چت قطع شد و اینترنت هست، بدون پرسیدن ادامه بده.
6. **رفتار انسانی در اتوماسیون**: jitter + ممنوعیت برست + وقفه ۳۰–۶۰ ثانیه‌ای بین اکشن‌های حساس + توقف آنی با دیدن کپچا/لیمیت.
7. **اعتبارسنجی بصری نهایی**: هر خروجی فرانت/SVG با browser_use + اسکرین‌شات فول‌پیج چندالمانی.
8. **لینک‌های مارک‌داون قابل لمس**: هیچ naked URL نفرست.

## MCPها (۱۸)

| سرور | نوع | توضیح |
|---|---|---|
| mantis | stdio (node) | فریم‌ورک باگ‌یابی گوگل Mantis — ۲۴ تولز |
| npvt | stdio (node) | سازنده کانتینر NPVT1 نپسترنت‌وی + کردنشال Netra Hub |
| codebase-memory | stdio | نالج‌گراف کدبیس (DeusData v0.10.8) |
| super-search | stdio (python3) | سرچ سریع گوگل — ⚠️ فایل workspace پاک شده، فقط info/tools موجوده |
| twitter | stdio (venv) | کنترل توییتر |
| instagram | stdio (venv) | کنترل کامل اینستاگرام (۷۵ تولز) — استارت‌آپ سنگین |
| wordpress | stdio | Claudeus WP MCP — ۱۴۵ تولز |
| seo-mcp | stdio | آدیت سئو — ۸ تولز |
| synapse | stdio | حافظه لوکال Synapse OS |
| pixel-bridge | stdio (node) | تولید تصویر via وب‌پروایدر لاگین‌شده |
| strix | stdio | پنتست Strix — ۳۸ تولز |
| playwright | stdio (npx) | اتوماسیون مرورگر headless |
| supabase | http | MCP رسمی سوپابیس (نیاز به OAuth) |
| gitmcp | http | داکیومنت هر ریپوی گیت‌هاب (keyless) |
| context7 | http | داکیومنت به‌روز لایبرری‌ها (keyless) |
| deepwiki | http | پرسش از دانش هر ریپوی گیت‌هاب (keyless) |
| you | http | وب‌هوش You.com (نیاز به YOU_API_KEY) |
| mu | http | پلتفرم ایجنت micro.mu — ۱۱۸ تولز |

## نحوه restore

```sh
sh scripts/restore.sh
# بعد: MCPها را از روی mcp/servers.json دوباره add کن،
# و providers/envvars را در Settings UI از نو بساز (مقادیر سکرت اینجا نیست).
```
