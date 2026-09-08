---
name: session-logs
description: Search, extract, and analyze session history, errors, and execution logs using minis-sessions-cli and local log files.
metadata: { "requires": { "bins": ["minis-sessions-cli"] } }
---

# Session Logs & Error Tracker

استخراج، جست‌وجو و واکاوی تاریخچه جلسات، پیام‌ها و لاگ‌های خطای قبلی با `minis-sessions-cli` و فایل‌های لاگ محیطی.

## کاربردها
- بازیابی خطاهای قبلی و استک‌ترس‌های ثبت‌شده در سشن‌های گذشته
- جست‌وجوی تصمیمات فنی، توکن‌ها و وضعیت پیشین پروژه‌ها
- ادامه‌دهی یا دیباگ تسک‌های قطع‌شده بدون از دست رفتن کانتکست

## فرمان‌های کلیدی

### ۱. جست‌وجو در سشن‌های گذشته بر اساس کلمه کلیدی
```bash
minis-sessions-cli search --keywords "build failed"
minis-sessions-cli search --keywords "Android"
minis-sessions-cli search --keywords "error"
```

### ۲. لیست جلسات اخیر
```bash
minis-sessions-cli list --limit 10
```

### ۳. خواندن متن کامل پیام‌ها و لاگ‌های یک جلسه
```bash
minis-sessions-cli messages --id <SESSION_ID>
```

### ۴. بررسی فایل‌های لاگ بزرگ و خروجی‌های آف‌لود
```bash
ls -la /var/minis/offloads/
ls -la /var/minis/memory/
```
