---
name: instagram-pro
description: Professional Instagram growth & analytics skill. Use when the user asks for Instagram account analysis, engagement rate, reach/visit growth, strengths/weaknesses, caption rewriting for better reach (SEO), hashtag research, best time to post, post audits, competitor analysis, or any Instagram growth strategy. Works with the "instagram" MCP server (instagrapi-based, session-cookie login, 75 tools). Triggers: اینستاگرام، آنالیز اکانت، افزایش بازدید، بازنویسی کپشن، هشتگ، بهترین ساعت پست.
version: 1.0.0
---

# Instagram Pro — Analytics & Growth Skill

MCP server `instagram` (registered in Minis) gives full account access via **session cookie login**. All tools prefixed `instagram_`.

## Login Flow (ALWAYS FIRST)

Session auto-restores from disk. Always verify with:
```
minis-mcp-cli call instagram instagram_get_login_status
```
If `logged_in: false` → ask user for their **sessionid cookie**:
1. User opens instagram.com in desktop browser (or Chrome on Android → instagram.com → login) 
2. F12 → Application → Cookies → `https://www.instagram.com` → copy value of **`sessionid`**
3. Then:
```
minis-mcp-cli call instagram instagram_login_with_sessionid username=<user> session_id=<value>
```
- sessionid is SAFEST (no 2FA, mimics browser session, persists to `~/.instagram_mcp_session.json`)
- Alternative: `instagram_login_with_credentials username=<u> password=<p>` → may return `needs_2fa` (→ `instagram_complete_2fa code=<6digit>`) or `needs_challenge` (→ `instagram_complete_challenge code=<6digit>` from SMS/email)
- NEVER print/store the sessionid in chat logs beyond using it in the call.

## Core Analytics Workflow

### 1. Full Account Audit
```
minis-mcp-cli call instagram instagram_analyze_account username=<user> posts=12
```
Returns: engagement_rate_pct (target >3%), er_per_type (photo/video/album), best_content_type, best_posting_hours, top/worst posts, **strengths/weaknesses/recommendations** (in Persian).

### 2. Post-by-Post Audit (find weak posts to fix)
```
minis-mcp-cli call instagram instagram_audit_recent_posts posts=12
```
Returns worst-first list with `needs_rewrite` flag + `rewrite_priority` (post codes).

### 3. Analyze One Post
```
minis-mcp-cli call instagram instagram_analyze_post media_id_or_url=<url-or-id>
```
Returns post ER vs account average + caption SEO score with issue notes.

### 4. Caption Rewrite for Reach
```
minis-mcp-cli call instagram instagram_rewrite_caption media_id_or_url=<url> style=viral language=fa
```
- styles: `viral` | `professional` | `friendly` | `minimal`
- Returns old SEO score + new caption + niche hashtags mined from top posts of the same tags
- **Always show the user old vs new caption and get approval before applying.** Then apply:
```
minis-mcp-cli call instagram instagram_edit_post_caption media_id_or_url=<url> caption="<new>"
```

### 5. Hashtag Research
```
minis-mcp-cli call instagram instagram_hashtag_research keyword=<topic>
```
Returns related hashtags by competition level + `recommended_mix` (4 low + 4 mid + 4 high competition = max Explore chance).

### 6. Best Time to Post
```
minis-mcp-cli call instagram instagram_best_time_to_post posts=30
```
ER by hour + by weekday from the account's OWN real data.

### 7. Competitor / Role-Model Analysis
```
minis-mcp-cli call instagram instagram_audience_overlap username=<competitor>
minis-mcp-cli call instagram instagram_analyze_account username=<competitor> posts=12
```
Use similar_accounts output to find accounts to model after.

## Growth Playbook (interpret & present to user)

When presenting analysis, structure output as:
1. **وضعیت کلی** — followers, ER% vs benchmarks (<1% weak, 1-3% avg, >3% strong)
2. **نقاط قوت** (from strengths + top posts patterns)
3. **نقاط ضعف** (from weaknesses + worst posts patterns)
4. **راهکارها** — ranked actionable: content type focus, posting time, hashtag mix, CTA addition, posting frequency
5. **اقدام بعدی** — offer to rewrite weak captions now (step 4)

Instagram algorithm signals that matter (mention when relevant):
- **Saves & shares** > likes (rank content by `save` potential)
- Consistency: posting gap >3 days decays reach
- Carousel (album) + Reels get strongest Explore distribution
- Caption SEO: 3-15 hashtags, long-tail niche tags (>20 chars), keyword-rich first line, CTA ("ذخیره کن", "نظرت را بنویس")
- First 60 min engagement velocity decides Explore eligibility

## Safety Rules
- Instagrapi = private API. Rate limits are real. Space tool calls (instagrapi has built-in 1-3s delay). Avoid loops of >10 calls/min; never mass-like/follow.
- NEVER change profile data (bio, picture, delete posts) without explicit user confirmation of the exact change.
- Never leak sessionid / password into final chat output or memory files.
- If Instagram sends a challenge: STOP, tell user, wait for the code. Don't retry logins more than 2 times (flag risk).

## Troubleshooting
- `Not logged in` after restart → session expired; re-login with sessionid
- `login_required` / `challenge_required` mid-session → cookie revoked (user changed password or logged out elsewhere); ask for fresh sessionid
- `UserNotFound` → private account or wrong username
- Server down → restart: `PYTHONPATH=/var/minis/shared/instagram-mcp /var/minis/shared/instagram-mcp/venv/bin/python -m instagram_mcp_server` (registered command auto-starts via Minis)
