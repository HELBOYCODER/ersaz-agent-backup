#!/bin/sh
# github-full-archive-search.sh — یک اسکریپت یک‌خطی برای جست‌وجو در تمام ارشیو گیت‌هاب
# استفاده:
#   ./github-full-archive-search.sh --repos "machine learning" --limit 20
#   ./github-full-archive-search.sh --code "auth function" --repo cli/cli --lang go
#   ./github-full-archive-search.sh --issues "bug" --owner cli --state open
#   ./github-full-archive-search.sh --users "tehran" --limit 20
#   ./github-full-archive-search.sh --commits "repo:cli/cli" --limit 20
#   ./github-full-archive-search.sh --discussions "repo:cli/cli" --limit 20
#   ./github-full-archive-search.sh --combined "topic:machine-learning" --limit 15
# اگر هیچ فلگی ندهید، تمام جست‌وجوها با یه پرس‌واژه اجرا می‌شوند.

set -e

# بارگذاری توکن
TOKEN_FILE="/var/minis/workspace/.secrets/github.token"
if [ -f "$TOKEN_FILE" ]; then
  export GH_TOKEN=$(cat "$TOKEN_FILE")
else
  echo "⚠️  توکن گیت‌هاب یافت نشد. در مسیر $TOKEN_FILE یا متغیر محیطی GH_TOKEN تنظیم کنید."
  exit 1
fi

QUERY=""
TYPE="repos"
LIMIT=10
OWNER=""
REPO=""
LANG=""
STATE="open"
INCLUDE_PRS=false

while [ $# -gt 0 ]; do
  case "$1" in
    --repos) TYPE="repos"; QUERY="$2"; shift 2 ;;
    --code) TYPE="code"; QUERY="$2"; shift 2 ;;
    --issues) TYPE="issues"; QUERY="$2"; shift 2 ;;
    --users) TYPE="users"; QUERY="$2"; shift 2 ;;
    --commits) TYPE="commits"; QUERY="$2"; shift 2 ;;
    --discussions) TYPE="discussions"; QUERY="$2"; shift 2 ;;
    --combined) TYPE="combined"; QUERY="$2"; shift 2 ;;
    --limit|-L) LIMIT="$2"; shift 2 ;;
    --owner) OWNER="$2"; shift 2 ;;
    --repo) REPO="$2"; shift 2 ;;
    --lang) LANG="$2"; shift 2 ;;
    --state) STATE="$2"; shift 2 ;;
    --include-prs) INCLUDE_PRS=true; shift ;;
    *) QUERY="$1"; shift ;;
  esac
done

if [ -z "$QUERY" ]; then
  echo "❌ لطفاً یک پرس‌واژه جست‌وجو وارد کنید."
  echo "مثال: $0 --repos \"machine learning\" --limit 20"
  exit 1
fi

run_repos() {
  echo "🔍 جست‌وجوی ریپوها: $QUERY"
  ARGS="search repos \"$QUERY\" --limit $LIMIT --json name,owner,description,language,stargazerCount,url --template '{{range .}}{{.owner.login}}/{{.name}} ({{.stargazerCount}} stars) - {{.description}}{{end}}{{\"\\n\"}}'"
  if [ -n "$OWNER" ]; then ARGS="$ARGS --owner $OWNER"; fi
  gh $ARGS
}

run_code() {
  echo "🔍 جست‌وجوی کد: $QUERY"
  ARGS="search code \"$QUERY\" --limit $LIMIT --json path,repository,url --template '{{range .}}{{.repository.fullName}}:{{.path}} - {{.url}}{{end}}{{\"\\n\"}}'"
  if [ -n "$REPO" ]; then ARGS="$ARGS --repo $REPO"; fi
  if [ -n "$LANG" ]; then ARGS="$ARGS --language $LANG"; fi
  gh $ARGS
}

run_issues() {
  echo "🔍 جست‌وجوی ایشوها: $QUERY"
  ARGS="search issues \"$QUERY\" --limit $LIMIT --state $STATE --json number,title,repository,url,isPullRequest"
  if [ -n "$OWNER" ]; then ARGS="$ARGS --owner $OWNER"; fi
  if [ "$INCLUDE_PRS" = "true" ]; then ARGS="$ARGS --include-prs"; fi
  gh $ARGS --template '{{range .}}{{if .isPullRequest}}PR{{else}}Issue{{end}}: {{.repository.fullName}} #{{.number}} - {{.title}} - {{.url}}{{end}}{{\"\\n\"}}'
}

run_users() {
  echo "🔍 جست‌وجوی کاربران: $QUERY"
  gh search users "$QUERY" --limit $LIMIT --json username,name,bio,location,url --template '{{range .}}{{.username}} - {{.name}} ({{.location}}) - {{.bio}}{{end}}{{\"\\n\"}}'
}

run_commits() {
  echo "🔍 جست‌وجوی کامیت‌ها: $QUERY"
  gh api graphql -f query='
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
  }' -F q="$QUERY" -F limit=$LIMIT --jq '.data.search.edges[].node | "\(.repository.nameWithOwner): \(.message[:60])... by \(.author.user.login // "N/A") \(.url)"'
}

run_discussions() {
  echo "🔍 جست‌وجوی Discussions: $QUERY"
  gh api graphql -f query='
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
  }' -F q="$QUERY" -F limit=$LIMIT --jq '.data.search.edges[].node | "\(.title) [\(.category.name)] - \(.url)"'
}

run_combined() {
  echo "🔍 جست‌وجوی ترکیبی: $QUERY"
  gh api graphql -f query='
  query($q: String!, $limit: Int!) {
    repos: search(query: $q, type: REPOSITORY, first: $limit) {
      repositoryCount
      edges { node { ... on Repository { nameWithOwner, stargazerCount, url, description } } }
    }
    issues: search(query: $q, type: ISSUE, first: $limit) {
      edges { node { ... on Issue { title, repository { nameWithOwner }, url } } }
    }
    code: search(query: $q, type: CODE, first: $limit) {
      edges { node { ... on Code { path, repository { nameWithOwner }, url } } }
    }
  }' -F q="$QUERY" -F limit=$LIMIT --jq '
    "📦 Repositories (\(.repos.repositoryCount))",
    (.repos.edges[].node | "  - \(.nameWithOwner) (\(.stargazerCount) stars)"),
    "🐛 Issues:",
    (.issues.edges[].node | "  - [\(.repository.nameWithOwner)] \(.title)"),
    "💻 Code:",
    (.code.edges[].node | "  - \(.repository.nameWithOwner):\(.path)")
  '
}

case "$TYPE" in
  repos) run_repos ;;
  code) run_code ;;
  issues) run_issues ;;
  users) run_users ;;
  commits) run_commits ;;
  discussions) run_discussions ;;
  combined) run_combined ;;
  *) echo "نوع جست‌وجو ناشناخته: $TYPE"; exit 1 ;;
esac
