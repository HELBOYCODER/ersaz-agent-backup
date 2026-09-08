---
name: github-full-archive-search
description: >
  استفاده برای جست‌وجو جامع و کامل در تمام ارشیو گیت‌هاب: جست‌وجوی ریپوها، کدها، ایشوها، PRها، کامیت‌ها، کاربران، Discussions و Discussions. این اسکیل ترکیب تمام امکانات `gh search` و GitHub API v3/v4 را در قالب یک workflow یکپارچه فراهم می‌کند. وقتی کاربر بخواهد «سرچ در گیت‌هاب»، «جست‌وجو در تمام گیت‌هاب»، «پیدا کردن کد/ایشو/ریپو در گیت‌هاب»، «gh search»، یا هر درخواست جست‌وجوی گیت‌های بگوید، این اسکیل فعال می‌شود.
version: 1.0.0
---

# GitHub Full Archive Search — اسکیل جست‌وجوی کامل در گیت‌هاب

## هدف

این اسکیل یک **ورک‌فلو کامل جست‌وجو در تمام ارشیو گیت‌هاب** فراهم می‌کند. یعنی وقتی می‌گویید «سرچ کن در گیت‌هاب»، «تمام گیت‌هاب رو جست‌وجو کن»، «پیدا کن این کد / این ایشو / این ریپو» — این اسکیل تمام زیرسخت‌ها و واسط‌های جست‌وجو را می‌گیرد و نتیجه منظم و عمیق می‌دهد.

از ابزارهای زیر استفاده می‌کند:

| بخش جست‌وجو | ابزار / API | توضیحات |
|---|---|---|
| **ریپوها** | `gh search repos` / API `search/repositories` | فیلترهای owner، زبان، ستاره، فورک، تاریخ، size، visibility، template، archived |
| **کد** | `gh search code` / API `search/code` | فیلترهای repo، owner، زبان، extension، filename، match، size |
| **ایشو و PR** | `gh search issues` / API `search/issues` | فیلترهای assignee، author، label، state، comments، reactions، date، project |
| **کامیت‌ها** | API `search/commits` (REST) یا GraphQL | فیلترهای author، committer، repo، date |
| **کاربران** | `gh search users` / API `search/users` | فیلترهای location، language، followers، created |
| **Discusions / Topics** | GraphQL `search` با `type: DISCUSSION` | فقط در GraphQL قابل دسترسی است |
| **تمام ترکیبی** | GraphQL `search` با `type: REPOSITORY` + `... on` | یکی بهترین روش برای یک نتیجه یکپارچه |

---

## پیش‌نیازها

### ۱. نصب و احراز هویت `gh`

```sh
gh --version   # باید >= 2.40.0 باشد
```

اگر نیست، از اسکیل `github-skills` یا نصب مستقیم:
```sh
curl -sL https://github.com/cli/cli/releases/latest/download/gh_$(uname -m)-linux.tar.gz | tar xz
```

#### احراز هویت
توکن در `/var/minis/workspace/.secrets/github.token` ذخیره شده (chmod 600). هرگز مقدارش را نمایش ندهید:

```sh
export GH_TOKEN=$(cat /var/minis/workspace/.secrets/github.token)
gh auth status
# خروجی باید نشان دهد: Logged in to github.com as <username>
```

اگر توکن ندارید، با این لینک بسازید: [Set GH_TOKEN](minis://settings/environments?create_key=GH_TOKEN)

---

## الگوی جست‌وجوی یکپارچه (یکپارچه workflow)

### ۱. تعیین نوع جست‌وجو

با توجه به درخواست کاربر، تصمیم بگیرید که جست‌وجویی که می‌خواهد چه نوعی است:

| درخواست کاربر | نوع جست‌وجوی پیشنهادی |
|---|---|
| «پیدا کن یه ریپو ...» | Repositories |
| «جست‌وجو کن در کدهای ...» | Code |
| «ایشوی مرتبط با ...» | Issues + PRs (`include-prs`) |
| «PRهایی که ...» | Issues (فقط PRها با `is:pr`) |
| «کاربری مثل ...» | Users |
| «کامیتی که ...» | Commits (GraphQL) |
| «تمام چیز مرتبط با ...» | ترکیبی از همه (GraphQL) |

### ۲. اجرای جست‌وجو با `gh search` (سریع و ساده)

#### ۲.۱. جست‌وجوی ریپوها
```sh
export GH_TOKEN=$(cat /var/minis/workspace/.secrets/github.token)

# ساده: جست‌وجوی همه ریپوهای مرتبط
gh search repos "machine learning" \
  --limit 50 \
  --sort stars \
  --order desc \
  --json name,owner,description,language,stargazerCount,url \
  --template '{{range .}}{{.owner.login}}/{{.name}} ({{.stargazerCount}} stars) - {{.description}}{{end}}{{"\n"}}'
```

فیلترهای مهم:
| فلگ | معنی |
|---|---|
| `--license MIT` | فقط لایسنس منطینی |
| `--language go` | زبان برنامه‌نویسی |
| `--followers 1000` | حداقل تعداد فالوور |
| `--forks 100` | حداقل فورک |
| `--stars 1000` | حداقل ستاره |
| `--created 2023-01-01..2024-01-01` | بازه تاریخ ساخت |

#### ۲.۲. جست‌وجوی کد
> نکته مهم: **جست‌وجوی کد فقط در ریپوهای عمومی و منتشر شده کار می‌کند.** اگر کاربر خصوصی می‌خواهد، فقط ریپوهای دسترسی داشته باشد.

```sh
export GH_TOKEN=$(cat /var/minis/workspace/.secrets/github.token)

gh search code "function authenticate" \
  --repo cli/cli \
  --language go \
  --extension go \
  --filename "auth.go" \
  --match file \
  -L 30 \
  --json path,repository,url \
  --template '{{range .}}{{.repository.fullName}}:{{.path}} - {{.url}}{{end}}{{"\n"}}'
```

#### ۲.۳. جست‌وجوی ایشو و PR

```sh
export GH_TOKEN=$(cat /var/minis/workspace/.secrets/github.token)

# جست‌وجو فقط ایشوها
gh search issues "bug in login" --state open --owner cli

# جست‌وجو فقط PRها
gh search issues "fix" --state open --owner cli --json isPullRequest,number,title,url

# ترکیب ایشو و PR
gh search issues "performance" --include-prs --is "open" --label "bug"
```

#### ۲.۴. جست‌وجوی کاربران

```sh
gh search users "developer in Tehran" --json username,name,bio,location,url
```

---

## جست‌وجوی پیشرفته با GraphQL (تمام‌عیار)

وقتی می‌خواهید **یک نتیجه یکپارچه از ریپو + کد + ایشو + PR + کامیت** بگیرید، از GraphQL استفاده کنید. `gh api graphql` یا یک فایل GraphQL.

### مثال: جست‌وجوی ترکیبی

```sh
export GH_TOKEN=$(cat /var/minis/workspace/.secrets/github.token)

gh api graphql \
  -H "Accept: application/vnd.github+json" \
  -f query='
  query($q: String!, $limit: Int!) {
    search(query: $q, type: REPOSITORY, first: $limit) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            nameWithOwner
            description
            stargazerCount
            forkCount
            primaryLanguage { name }
            url
            issues(first: 5, states: OPEN) {
              totalCount
            }
            pullRequests(first: 5, states: OPEN) {
              totalCount
            }
          }
        }
      }
    }
  }' \
  -F q='topic:ai topic:machine-learning' \
  -F limit=10
```

### جست‌وجوی کامیت (Commits) — فقط در GraphQL

```sh
gh api graphql \
  -f query='
  query($q: String!, $limit: Int!) {
    search(query: $q, type: COMMIT, first: $limit) {
      commitCount
      edges {
        node {
          ... on Commit {
            oid
            message
            committedDate
            repository { nameWithOwner }
            author { user { login } }
          }
        }
      }
    }
  }' \
  -F q='repo:cli/cli' \
  -F limit=5
```

### جست‌وجوی Discussions

```sh
gh api graphql \
  -f query='
  query($q: String!, $limit: Int!) {
    search(query: $q, type: DISCUSSION, first: $limit) {
      edges {
        node {
          ... on Discussion {
            title
            body
            url
            category { name }
          }
        }
      }
    }
  }' \
  -F q='repo:cli/cli' \
  -F limit=5
```

---

## نکات کلیدی و Gotchas

1. **کد search فقط عمومی:** اگر `--repo` یا `--owner` ندهید، فقط ریپوهای عمومی جست‌وجو می‌شود.
2. **حداکثر نتایج:** `gh search` پیش‌فرض 30 است؛ با `-L` بیشتر کنید (حداکثر 1000).
3. **Rate limit:** 30 درخواست در دقیقه برای Search API. با GraphQL می‌توانید `rateLimit` را چک کنید.
4. **GraphQL pagination:** اگر بیش از 100 نتیجه می‌خواهید، از `pageInfo.hasNextPage` + `endCursor` استفاده کنید.
5. **فرمت خروجی:** همیشه از `--json` یا `--template` استفاده کنید تا خروجی منظم شود؛ خروجی پیش‌فرض برای پردازش توسط اسکریپت مناسب نیست.
6. **Discusions از طریق API v3 قابل دسترسی نیست** — فقط GraphQL.

---

## یکپارچه‌سازی با Minis

این اسکیل در هر جایی که از `gh`، `curl`/API، یا `gh api` استفاده می‌کنید، کار می‌کند:

```sh
# در shell_execute یا اسکریپت Python
export GH_TOKEN=$(cat /var/minis/workspace/.secrets/github.token)
gh search repos "..." --json ...
gh api graphql -f query='...'
```

برای جست‌وجوهای تکراری، اسکریپت‌های کمکی بسازید در `/var/minis/skills/github-full-archive-search/scripts/`.

---

## مثال‌های واقعی کاربر

| درخواست | دستور پیشنهادی |
|---|---|
| «پیدا کن ریپوهای فارسی درباره رمزارز» | `gh search repos "cryptocurrency persian farsi" --language go --json ...` |
| «ایمیل واترلیکنس در کدهای گیت‌هاب» | `gh search code "waterlike email" --match file --language python` |
| «ایشوهایی درباره rate-limit در nextjs» | `gh search issues "rate limit" --repo vercel/next.js --is issue` |
| «همه PRهای merged در ماه جاری در rust» | `gh search issues "is:pr is:merged created:2024-08" --repo rust-lang/rust` |
