export type RoleKey = "ai" | "be" | "fe" | "seo" | "pm" | "sh";

export const ROLE_COLORS: Record<RoleKey, string> = {
  ai:  "#00ffcc",
  be:  "#6c8fff",
  fe:  "#ff6b9d",
  seo: "#ffd166",
  pm:  "#c77dff",
  sh:  "#ff9f43",
};

export const ROLE_LABELS: Record<RoleKey, string> = {
  ai:  "AI Automation",
  be:  "Backend Dev",
  fe:  "Frontend Dev",
  seo: "SEO Strategist",
  pm:  "All Roles / PM",
  sh:  "Shared",
};

export const KPI_ITEMS = [
  { n: "4",    label: "Team Roles",     color: "ai"  as RoleKey },
  { n: "7",    label: "Days to Launch", color: "be"  as RoleKey },
  { n: "500+", label: "Articles/Day",   color: "fe"  as RoleKey },
  { n: "15K+", label: "Target Pages",   color: "seo" as RoleKey },
  { n: "1M",   label: "Traffic Goal",   color: "pm"  as RoleKey },
];

export const ROLES = [
  {
    key: "ai" as RoleKey,
    icon: "🤖",
    name: "AI AUTOMATION",
    sub: "Agent Pipeline Engineer",
    badge: "Core Role",
    desc: "Owns the entire intelligent pipeline — from news ingestion to final content output. This person builds the brain of ImperialPedia.",
    primaryOutput: "A fully autonomous Python pipeline that fetches news, filters it with AI, generates 1,500-word articles, and saves them to the database — running every 10 minutes without human intervention.",
    tasks: [
      { role: "ai" as RoleKey, text: "<strong>6-Agent AI Pipeline</strong> — Relevance, Dedup, Trend, Content, SEO, Quality agents" },
      { role: "ai" as RoleKey, text: "<strong>News API Integration</strong> — NewsAPI, GNews, Mediastack fetcher with rotation" },
      { role: "ai" as RoleKey, text: "<strong>Finance Data Enrichment</strong> — Alpha Vantage, Finnhub, CoinGecko live data injection" },
      { role: "ai" as RoleKey, text: "<strong>Embedding System</strong> — OpenAI embeddings for deduplication + related articles" },
      { role: "ai" as RoleKey, text: "<strong>Cron Scheduler</strong> — APScheduler, every 10 minutes, with error recovery" },
      { role: "ai" as RoleKey, text: "<strong>Prompt Engineering</strong> — All AI prompts for article generation, SEO meta, FAQs" },
      { role: "ai" as RoleKey, text: "<strong>LangChain Orchestration</strong> — Chain all agents, handle retries, manage context" },
      { role: "ai" as RoleKey, text: "<strong>IndexNow Submission</strong> — Auto-ping Google/Bing for each published article" },
    ],
    stackLabel: "Tech Stack",
    stack: ["Python 3.11","LangChain","OpenAI SDK","Anthropic SDK","APScheduler","httpx","pgvector"],
  },
  {
    key: "be" as RoleKey,
    icon: "⚙️",
    name: "BACKEND DEV",
    sub: "API & Infrastructure Engineer",
    badge: "Core Role",
    desc: "Owns all infrastructure — the database, REST API, caching, deployment, and the glue that connects the AI pipeline to the frontend.",
    primaryOutput: "A production-ready FastAPI server with PostgreSQL + Redis backend, fully deployed on Railway/Render, serving article data to the frontend via REST API with <100ms response time.",
    tasks: [
      { role: "be" as RoleKey, text: "<strong>PostgreSQL Schema</strong> — Articles, keywords, embeddings, SEO meta tables" },
      { role: "be" as RoleKey, text: "<strong>pgvector Setup</strong> — Extension install, index config for semantic search" },
      { role: "be" as RoleKey, text: "<strong>Redis Layer</strong> — Upstash setup, caching strategies, TTL management" },
      { role: "be" as RoleKey, text: "<strong>FastAPI Server</strong> — All REST endpoints: GET articles, categories, search, sitemap" },
      { role: "be" as RoleKey, text: "<strong>Authentication</strong> — API key auth for admin endpoints, rate limiting" },
      { role: "be" as RoleKey, text: "<strong>Deployment</strong> — Railway, Supabase, Upstash Redis, Vercel deploy hooks" },
      { role: "be" as RoleKey, text: "<strong>Environment Config</strong> — All .env files, secrets management, Docker Compose" },
      { role: "be" as RoleKey, text: "<strong>Monitoring Setup</strong> — Sentry error tracking, Grafana metrics, UptimeRobot alerts" },
    ],
    stackLabel: "Tech Stack",
    stack: ["FastAPI","PostgreSQL 16","pgvector","Redis","Docker","Railway","Supabase","Sentry"],
  },
  {
    key: "fe" as RoleKey,
    icon: "🖥️",
    name: "FRONTEND DEV",
    sub: "Next.js & SEO UI Engineer",
    badge: "Core Role",
    desc: "Owns the public-facing website. Turns the article data from the backend into a fast, SEO-perfect, Google-friendly interface that users and crawlers love.",
    primaryOutput: "A Next.js 14 website on imperialpedia.com — with article pages, category hubs, programmatic stock/crypto pages, dynamic sitemap, schema markup, and Core Web Vitals scores all passing green.",
    tasks: [
      { role: "fe" as RoleKey, text: "<strong>Next.js 14 App Router</strong> — All routes, layouts, loading states" },
      { role: "fe" as RoleKey, text: "<strong>Article Page</strong> — ISR, dynamic meta, schema JSON-LD, breadcrumbs" },
      { role: "fe" as RoleKey, text: "<strong>Programmatic Pages</strong> — /stocks/[ticker], /crypto/[coin], /economy/[country]" },
      { role: "fe" as RoleKey, text: "<strong>Sitemap.xml</strong> — Auto-generated, submitted to GSC on deploy" },
      { role: "fe" as RoleKey, text: "<strong>RSS Feed</strong> — /feed.xml for Google Discover and aggregators" },
      { role: "fe" as RoleKey, text: "<strong>Core Web Vitals</strong> — LCP <2s, CLS <0.1, FID <100ms" },
      { role: "fe" as RoleKey, text: "<strong>OG Image Generation</strong> — Dynamic og:image with article title per page" },
      { role: "fe" as RoleKey, text: "<strong>Dark/Light UI</strong> — Clean, fast, finance-appropriate design" },
    ],
    stackLabel: "Tech Stack",
    stack: ["Next.js 14","TypeScript","Tailwind CSS","Vercel","next/image","next/seo"],
  },
  {
    key: "seo" as RoleKey,
    icon: "📈",
    name: "SEO STRATEGIST",
    sub: "Rankings & Content Architect",
    badge: "Support Role",
    desc: "Owns keyword strategy, content structure, and Google Search Console. Translates what Google wants into instructions the AI agent follows automatically.",
    primaryOutput: "A 300-keyword master list, article structure template given to AI agent, GSC verified + sitemap submitted, all schema markup validated, and daily ranking reports set up before Day 3.",
    tasks: [
      { role: "seo" as RoleKey, text: "<strong>Keyword Research</strong> — 300 primary + 1,000 LSI keywords with search volume and difficulty" },
      { role: "seo" as RoleKey, text: "<strong>Article Structure</strong> — Define the exact H1/H2/H3 template the AI must follow" },
      { role: "seo" as RoleKey, text: "<strong>Google Search Console</strong> — Verify domain, submit sitemap, monitor coverage" },
      { role: "seo" as RoleKey, text: "<strong>Google News</strong> — Application submission, compliance checklist" },
      { role: "seo" as RoleKey, text: "<strong>Schema Validation</strong> — Test all schema markup via Rich Results Test" },
      { role: "seo" as RoleKey, text: "<strong>IndexNow Key</strong> — Generate, configure, verify for instant URL submission" },
      { role: "seo" as RoleKey, text: "<strong>Rank Tracking</strong> — Set up SerpAPI + GSC API daily pull for 100 keywords" },
      { role: "seo" as RoleKey, text: "<strong>Backlink Outreach</strong> — Reddit, Quora, LinkedIn, finance newsletter submissions" },
    ],
    stackLabel: "Tools",
    stack: ["GSC","Ahrefs","SerpAPI","Pytrends","Rich Results Test","DataForSEO"],
  },
];

export const HANDOFFS = [
  { from: "seo" as RoleKey, fromLabel: "SEO", to: "ai" as RoleKey, toLabel: "AI Agent", what: "keyword_list.json (300 keywords) + article_template.txt (exact prompt structure)", when: "Day 1 EOD" },
  { from: "be" as RoleKey, fromLabel: "Backend", to: "ai" as RoleKey, toLabel: "AI Agent", what: "DB schema SQL file + .env with DATABASE_URL + Redis connection string", when: "Day 1 EOD" },
  { from: "ai" as RoleKey, fromLabel: "AI Agent", to: "be" as RoleKey, toLabel: "Backend", what: "pipeline.py integrated with DB. First articles appear in articles table for API testing", when: "Day 3 EOD" },
  { from: "be" as RoleKey, fromLabel: "Backend", to: "fe" as RoleKey, toLabel: "Frontend", what: "API docs (Swagger URL) + base URL + all endpoint specs + example JSON responses", when: "Day 3 EOD" },
  { from: "fe" as RoleKey, fromLabel: "Frontend", to: "seo" as RoleKey, toLabel: "SEO", what: "Live URL of imperialpedia.com for GSC verification + sitemap.xml link for submission", when: "Day 5 EOD" },
  { from: "seo" as RoleKey, fromLabel: "SEO", to: "ai" as RoleKey, toLabel: "AI Agent", what: "IndexNow key.txt + trending keyword feed URL for real-time trend targeting", when: "Day 5 EOD" },
  { from: "sh" as RoleKey, fromLabel: "ALL ROLES", to: "sh" as RoleKey, toLabel: "Day 7 Launch", what: "All systems live, pipeline running, GSC submitted, IndexNow active, 500+ articles published", when: "Day 7 10AM" },
];

export interface DayTask { role: RoleKey; text: string }
export interface DayLane { role: RoleKey; title: string; tasks: DayTask[] }
export interface DaySuccessBox { role: RoleKey; title: string; text: string }

export interface SprintDay {
  num: string;
  color: RoleKey;
  title: string;
  goal: string;
  badge: string;
  badgeRole: RoleKey;
  leftLanes: DayLane[];
  rightLanes: DayLane[];
  successBox?: DaySuccessBox;
}

export const SPRINT_DAYS: SprintDay[] = [
  {
    num: "01", color: "ai", title: "Foundation Day — Set Up Everything",
    goal: "Goal: All environments running. Credentials shared. No one is blocked.",
    badge: "All Hands", badgeRole: "pm",
    leftLanes: [
      { role: "ai", title: "AI Expert", tasks: [
        { role: "ai", text: "Create Python project, install all dependencies" },
        { role: "ai", text: "Register NewsAPI, GNews, Mediastack accounts + get keys" },
        { role: "ai", text: "Register Alpha Vantage, Finnhub, CoinGecko + get keys" },
        { role: "ai", text: "Test: verify all API keys return real data" },
        { role: "ai", text: "Wait for SEO keyword list + DB credentials → configure .env" },
      ]},
      { role: "be", title: "Backend Dev", tasks: [
        { role: "be", text: "Create Supabase project, enable pgvector extension" },
        { role: "be", text: "Run full schema migration (all tables + indexes)" },
        { role: "be", text: "Set up Upstash Redis account, get connection string" },
        { role: "be", text: "Share DATABASE_URL + REDIS_URL with AI Expert by EOD" },
        { role: "be", text: "Create FastAPI project skeleton, configure CORS" },
      ]},
    ],
    rightLanes: [
      { role: "seo", title: "SEO Strategist", tasks: [
        { role: "seo", text: "Complete 300-keyword research (Ahrefs / free tools)" },
        { role: "seo", text: "Format keyword_list.json and share with AI Expert" },
        { role: "seo", text: "Write article_template.txt with exact structure rules" },
        { role: "seo", text: "Apply for Google News publisher account NOW" },
        { role: "seo", text: "Verify imperialpedia.com in Google Search Console" },
      ]},
      { role: "fe", title: "Frontend Dev", tasks: [
        { role: "fe", text: "Create Next.js 14 app with TypeScript + Tailwind" },
        { role: "fe", text: "Set up Vercel project, connect GitHub repo" },
        { role: "fe", text: "Build all route folder structure (no content yet)" },
        { role: "fe", text: "Create lib/api.ts with typed fetch functions (using mock data)" },
      ]},
    ],
    successBox: { role: "pm", title: "✅ Day 1 Success Check", text: "All API keys work. DB schema live in Supabase. GSC domain verified. Next.js project on Vercel (even if empty). Keyword list delivered to AI Expert. Nobody is blocked going into Day 2." },
  },
  {
    num: "02", color: "be", title: "Build Day — Core Systems",
    goal: "Goal: News fetcher working. FastAPI endpoints built. Frontend skeleton with mock data.",
    badge: "Backend + AI Heavy", badgeRole: "be",
    leftLanes: [
      { role: "ai", title: "AI Expert", tasks: [
        { role: "ai", text: "Build news_fetcher.py — multi-API with rotation + dedup" },
        { role: "ai", text: "Build finance_fetcher.py — stock/crypto live data enrichment" },
        { role: "ai", text: "Test: fetch 100 unique articles from 10 keywords. Confirm no duplicates." },
        { role: "ai", text: "Start building RelevanceAgent + DupAgent" },
      ]},
      { role: "be", title: "Backend Dev", tasks: [
        { role: "be", text: "Build all REST endpoints in FastAPI" },
        { role: "be", text: "Add Redis caching to trending + category endpoints" },
        { role: "be", text: "Write Swagger docs for every endpoint" },
        { role: "be", text: "Local test: all endpoints return correct JSON structure" },
      ]},
    ],
    rightLanes: [
      { role: "fe", title: "Frontend Dev", tasks: [
        { role: "fe", text: "Build homepage layout with mock article cards" },
        { role: "fe", text: "Build article page layout (H1, content, sidebar, related)" },
        { role: "fe", text: "Build category page layout (grid + filter bar)" },
        { role: "fe", text: "All pages rendering correctly with mock data" },
      ]},
      { role: "seo", title: "SEO Strategist", tasks: [
        { role: "seo", text: "Define article schema template (Article + FAQPage JSON-LD)" },
        { role: "seo", text: "Set up rank tracking: SerpAPI for 50 target keywords" },
        { role: "seo", text: "Create internal linking strategy doc for AI agent" },
        { role: "seo", text: "Start content gap analysis vs competitors" },
      ]},
    ],
  },
  {
    num: "03", color: "ai", title: "Integration Day — Connect the Systems",
    goal: "Goal: AI pipeline → DB → API → Frontend all connected. Real data flowing end-to-end.",
    badge: "Integration", badgeRole: "sh",
    leftLanes: [
      { role: "ai", title: "AI Expert", tasks: [
        { role: "ai", text: "Build ContentAgent using Claude 3.5 Sonnet + article_template.txt" },
        { role: "ai", text: "Build SEOAgent — meta title, description, slug, schema JSON" },
        { role: "ai", text: "Wire all 6 agents into master pipeline in pipeline/master.py" },
        { role: "ai", text: "Test: run 1 full pipeline cycle. Confirm article saved to DB with all fields." },
      ]},
      { role: "be", title: "Backend Dev", tasks: [
        { role: "be", text: "Deploy FastAPI to Railway. Test all endpoints live." },
        { role: "be", text: "Share live API URL + Swagger docs with Frontend Developer" },
        { role: "be", text: "Set up Sentry for error tracking" },
        { role: "be", text: "Test /articles endpoint returns real DB data" },
      ]},
    ],
    rightLanes: [
      { role: "fe", title: "Frontend Dev", tasks: [
        { role: "fe", text: "Connect article page to real Backend API (replace mock data)" },
        { role: "fe", text: "Article page renders real title, content, schema JSON from DB" },
        { role: "fe", text: "Add JSON-LD schema tag and canonical link to article page" },
        { role: "fe", text: "Deploy to Vercel. Confirm real article renders at live URL." },
      ]},
      { role: "seo", title: "SEO Strategist", tasks: [
        { role: "seo", text: "Validate first 5 articles via Rich Results Test" },
        { role: "seo", text: "Generate IndexNow key.txt file" },
        { role: "seo", text: "Manually request indexing for first 10 articles via GSC" },
        { role: "seo", text: "Check GSC for crawl errors after Vercel deploy" },
      ]},
    ],
    successBox: { role: "ai", title: "🎯 Day 3 Integration Checkpoint", text: "End-to-end data flow working: AI writes article → saves to DB → Backend API serves it → Frontend renders it at live URL → SEO validates schema. This is the most critical milestone of the sprint." },
  },
  {
    num: "04", color: "fe", title: "Scale Day — Programmatic Pages",
    goal: "Goal: 100+ articles in DB. Stock/crypto pages live. Sitemap generating.",
    badge: "Frontend + AI", badgeRole: "fe",
    leftLanes: [
      { role: "ai", title: "AI Expert", tasks: [
        { role: "ai", text: "Set up APScheduler cron — run_pipeline() every 10 minutes" },
        { role: "ai", text: "Test: 6-hour cron run. Confirm 30+ articles saved." },
        { role: "ai", text: "Integrate IndexNow: ping Google/Bing after each article save" },
        { role: "ai", text: "Add dead-letter logging — every failed article saved with error reason" },
      ]},
      { role: "be", title: "Backend Dev", tasks: [
        { role: "be", text: "Build /admin/stats endpoint (articles today, pipeline health, error rate)" },
        { role: "be", text: "Set up UptimeRobot to ping /health every 5 minutes" },
        { role: "be", text: "Add pgvector semantic search to /search endpoint" },
        { role: "be", text: "Test load: 50 concurrent requests, all endpoints <100ms" },
      ]},
    ],
    rightLanes: [
      { role: "fe", title: "Frontend Dev", tasks: [
        { role: "fe", text: "Build /stocks/[ticker] pages — live price + recent articles" },
        { role: "fe", text: "Build /crypto/[coin] pages — chart + news + AI summary" },
        { role: "fe", text: "Implement generateStaticParams() for top 200 stocks + 100 coins" },
        { role: "fe", text: "Build dynamic sitemap.ts — fetch all slugs from backend" },
      ]},
      { role: "seo", title: "SEO Strategist", tasks: [
        { role: "seo", text: "Submit sitemap.xml to GSC once live" },
        { role: "seo", text: "Configure IndexNow key.txt at imperialpedia.com/[key].txt" },
        { role: "seo", text: "Verify 20 article URLs manually submitted via GSC URL Inspection" },
        { role: "seo", text: "Start backlink outreach: 5 Reddit posts, 3 Quora answers" },
      ]},
    ],
  },
  {
    num: "05", color: "seo", title: "Polish Day — SEO + Performance",
    goal: "Goal: Core Web Vitals green. Schema validated. 200+ articles published. GSC showing crawl activity.",
    badge: "SEO + Frontend", badgeRole: "seo",
    leftLanes: [
      { role: "ai", title: "AI Expert", tasks: [
        { role: "ai", text: "Review first 20 published articles — quality check" },
        { role: "ai", text: "Refine ContentAgent prompt based on quality issues found" },
        { role: "ai", text: "Add QualityAgent: word count >800, Flesch score, keyword density" },
        { role: "ai", text: "Scale keyword list: add 100 more keywords from trending topics" },
      ]},
      { role: "be", title: "Backend Dev", tasks: [
        { role: "be", text: "Run EXPLAIN ANALYZE on top 3 DB queries. Add missing indexes." },
        { role: "be", text: "Enable Supabase PgBouncer connection pooling" },
        { role: "be", text: "Confirm all endpoints still <100ms after 500+ articles in DB" },
        { role: "be", text: "Set up automated daily DB backups (Supabase scheduled backup)" },
      ]},
    ],
    rightLanes: [
      { role: "fe", title: "Frontend Dev", tasks: [
        { role: "fe", text: "Run Lighthouse on article page, homepage, category page" },
        { role: "fe", text: "Fix LCP: ensure hero image uses next/image with priority prop" },
        { role: "fe", text: "Build /feed.xml RSS route (last 100 articles, valid RSS 2.0)" },
        { role: "fe", text: "Build /compare/[a]-vs-[b] comparison pages" },
      ]},
      { role: "seo", title: "SEO Strategist", tasks: [
        { role: "seo", text: "Validate schema for 10 articles via Rich Results Test — all must pass" },
        { role: "seo", text: "Check GSC Coverage report: how many pages discovered?" },
        { role: "seo", text: "Deliver IndexNow key to AI Expert for auto-submission integration" },
        { role: "seo", text: "Apply for Google News if not already approved" },
      ]},
    ],
  },
  {
    num: "06", color: "pm", title: "Scale Day — Full Speed, 500 Articles/Day",
    goal: "Goal: All systems stable. Pipeline at full capacity. 3,000+ articles in DB. GSC showing first impressions.",
    badge: "Optimization", badgeRole: "pm",
    leftLanes: [
      { role: "ai", title: "AI Expert", tasks: [
        { role: "ai", text: "Review quality of published articles — refine prompts if needed" },
        { role: "ai", text: "Scale keyword list to 300 (add trending terms from Pytrends)" },
        { role: "ai", text: "Add breaking news fast-track (2-min publish for trending articles)" },
        { role: "ai", text: "Confirm 500 articles/day rate achieved" },
      ]},
      { role: "seo", title: "SEO Strategist", tasks: [
        { role: "seo", text: "Check GSC: how many pages discovered/indexed?" },
        { role: "seo", text: "Monitor first organic impressions in GSC Performance tab" },
        { role: "seo", text: "Continue backlink outreach — LinkedIn posts, newsletter pings" },
        { role: "seo", text: "Set up daily SerpAPI rank tracking for top 50 keywords" },
      ]},
    ],
    rightLanes: [
      { role: "fe", title: "Frontend Dev", tasks: [
        { role: "fe", text: "Build /economy/[country] pages (50 countries)" },
        { role: "fe", text: "Build /compare/[a]-vs-[b] comparison pages" },
        { role: "fe", text: "Build /tag/[tag] and /region/[region] pages" },
        { role: "fe", text: "Add newsletter signup form (Mailchimp integration)" },
      ]},
      { role: "be", title: "Backend Dev", tasks: [
        { role: "be", text: "Optimize slow DB queries from Grafana metrics" },
        { role: "be", text: "Add /admin/stats endpoint with pipeline health" },
        { role: "be", text: "Set up automated DB backups (Supabase built-in)" },
      ]},
    ],
  },
  {
    num: "07", color: "ai", title: "LAUNCH DAY — ImperialPedia is LIVE",
    goal: "Goal: All systems green. 5,000+ articles. Indexed pages growing. Pipeline running autonomously.",
    badge: "GO LIVE", badgeRole: "ai",
    leftLanes: [
      { role: "pm", title: "All Roles — Final Checks", tasks: [
        { role: "ai", text: "AI: Confirm pipeline has zero unhandled exceptions in last 12h" },
        { role: "be", text: "Backend: All endpoints <100ms. Uptime 100%. Sentry zero errors." },
        { role: "fe", text: "Frontend: All pages pass Core Web Vitals. Sitemap confirmed live." },
        { role: "seo", text: "SEO: GSC showing 500+ pages discovered. Schema validated." },
        { role: "seo", text: "SEO: Google News application submitted and pending." },
      ]},
    ],
    rightLanes: [
      { role: "ai", title: "Launch Day Announcements", tasks: [
        { role: "ai", text: "Post on Reddit r/SEO, r/juststart about the launch" },
        { role: "seo", text: "Share on LinkedIn with finance/fintech network" },
        { role: "fe", text: "Submit to Product Hunt (finance/AI category)" },
        { role: "be", text: "Share API endpoints to potential developer users" },
        { role: "pm", text: "Apply for Google AdSense monetization" },
      ]},
    ],
    successBox: { role: "ai", title: "🚀 Day 7 Definition of Done", text: "Pipeline running every 10 minutes autonomously · 5,000+ articles in DB · 500+ articles published per day · imperialpedia.com live and fast · GSC verified with sitemap submitted · IndexNow pinging every new article · Schema validated · First organic impressions appearing in GSC Performance tab · All 4 roles handed off their systems cleanly." },
  },
];

export interface StepItem {
  num: string;
  role: RoleKey;
  dayTag: string;
  title: string;
  desc: string;
}

export const AI_STEPS: StepItem[] = [
  { num: "01", role: "ai", dayTag: "Day 1 · Setup", title: "Receive inputs from SEO + Backend. Set up your environment.", desc: "Get keyword_list.json, article_template.txt from SEO. Get DATABASE_URL, REDIS_URL from Backend. Create your Python project: pip install langchain openai anthropic httpx apscheduler asyncpg redis pgvector. Configure .env with all API keys. Verify all API connections return data." },
  { num: "02", role: "ai", dayTag: "Day 2 · News Fetcher", title: "Build the multi-API news fetcher with rotation logic.", desc: "Write fetcher/news_fetcher.py. Loop through keyword list, call NewsAPI first, fallback to GNews if rate-limited, fallback to Mediastack. Parse each response into a standard Article dataclass. Deduplicate by URL hash using Redis SET. Test: run against 10 keywords, confirm 50+ unique articles." },
  { num: "03", role: "ai", dayTag: "Day 2 · Finance Enrichment", title: "Pull live financial data for each relevant article topic.", desc: "Write fetcher/finance_fetcher.py. When an article mentions a stock ticker (e.g. AAPL, BTC), call the appropriate API — Alpha Vantage for stocks, CoinGecko for crypto, FRED API for macro data. Return a LiveData dict that gets appended to the article before AI processing." },
  { num: "04", role: "ai", dayTag: "Day 3 · AI Agents", title: "Build all 6 AI agents. Wire them into a sequential pipeline.", desc: "Build each agent as a Python class in agents/. Agent 1: RelevanceAgent — GPT-4o-mini, scores 0–100, threshold 65. Agent 2: DupAgent — OpenAI embeddings + pgvector cosine similarity <0.85. Agent 3: TrendAgent — Pytrends interest score. Agent 4: ContentAgent — Claude 3.5 Sonnet. Agent 5: SEOAgent — meta title, desc, slug, schema JSON. Agent 6: QualityAgent — word count, Flesch score, keyword density. Wire all 6 in pipeline/master.py." },
  { num: "05", role: "ai", dayTag: "Day 4 · Cron + DB Save", title: "Set up APScheduler cron. Save approved articles to PostgreSQL.", desc: "Write cron/scheduler.py. Schedule run_pipeline() every 10 minutes using APScheduler AsyncIOScheduler. After Quality Gate passes, save the article using asyncpg INSERT into the articles table. Save the embedding vector via pgvector. After each batch save, call IndexNow API with the new article URLs." },
  { num: "06", role: "ai", dayTag: "Day 5–6 · Optimization", title: "Tune prompts, add error handling, scale keyword list to 300.", desc: "Read the first 20 published articles. Are they good quality? If not, refine the ContentAgent prompt. Add try/except around every agent with dead-letter logging. Expand keyword list to 300 keywords. Implement the trend scorer: if a keyword's pytrends score > 70, prioritize it and skip the queue." },
  { num: "07", role: "ai", dayTag: "Day 7 · Launch Check", title: "Confirm pipeline is live, stable, and producing 500 articles/day.", desc: "Run 24-hour pipeline test. Check Sentry for zero unhandled exceptions. Verify DB row count growing at rate of 48–72 articles/hour. Confirm IndexNow submissions succeeding. Hand over monitoring dashboard URL to Project Lead. Pipeline runs autonomously from here." },
];

export const BE_STEPS: StepItem[] = [
  { num: "01", role: "be", dayTag: "Day 1 · Database", title: "Provision Supabase. Run schema migration. Install pgvector.", desc: "Create project at supabase.com. In SQL Editor, run: CREATE EXTENSION vector; then paste the full schema SQL. Create indexes for articles table. Export DATABASE_URL and share with AI Expert. Set up Upstash Redis — get REDIS_URL and share with AI Expert." },
  { num: "02", role: "be", dayTag: "Day 2 · FastAPI Server", title: "Build all REST API endpoints that the frontend will consume.", desc: "Create FastAPI project. Build: GET /articles (paginated, filter by category), GET /articles/{slug}, GET /trending (cached 5min), GET /categories, GET /search?q= (semantic via pgvector), GET /stocks/{ticker}, GET /crypto/{coin}, GET /sitemap. Add CORS middleware allowing imperialpedia.com." },
  { num: "03", role: "be", dayTag: "Day 2 · Caching", title: "Add Redis caching to all high-traffic endpoints.", desc: "Wrap trending feed with 5-min Redis cache. Wrap category page with 10-min cache. Cache individual article JSON with 30-min TTL. Use fastapi-cache2 with Redis backend. Critical: the homepage and category pages will get hammered once you rank, and you cannot hit the DB for every request." },
  { num: "04", role: "be", dayTag: "Day 3 · Deploy", title: "Deploy FastAPI to Railway. Set all environment variables. Test live endpoints.", desc: "Push to GitHub. Connect Railway to repo. Set env vars in Railway dashboard. Add health check GET /health returning {status:ok}. After deploy, test every endpoint with Postman. Share live API base URL + Swagger docs URL with Frontend Developer." },
  { num: "05", role: "be", dayTag: "Day 4–5 · Monitoring", title: "Set up Sentry, UptimeRobot, and a basic admin dashboard.", desc: "Install Sentry SDK, configure DSN. Add GET /admin/stats endpoint (API-key protected) returning: articles_published_today, pipeline_last_run, api_calls_remaining, queue_depth, error_rate. Set up UptimeRobot to ping /health every 5 minutes. Set up Grafana Cloud (free tier) connected to Railway metrics." },
  { num: "06", role: "be", dayTag: "Day 6–7 · Scale Prep", title: "Optimize slow queries. Add connection pooling. Load test.", desc: "Run EXPLAIN ANALYZE on the 3 most common queries. Add missing indexes. Enable Supabase PgBouncer connection pooling. Use locust to load-test at 100 concurrent users. Confirm response times stay under 100ms for all cached endpoints." },
];

export const FE_STEPS: StepItem[] = [
  { num: "01", role: "fe", dayTag: "Day 1–2 · Scaffold", title: "Create Next.js 14 app. Set up routing structure. Configure Tailwind.", desc: "Run npx create-next-app@latest imperialpedia --typescript --tailwind --app. Create all route folders: app/(site)/[category]/[slug]/page.tsx, stocks/[ticker], crypto/[coin], search. Create lib/api.ts with typed fetch functions. Build with mock data until Backend API is live on Day 3." },
  { num: "02", role: "fe", dayTag: "Day 2–3 · Core Pages", title: "Build homepage, category pages, and the article page.", desc: "Article page #1 priority. Must include: article content as semantic HTML, JSON-LD schema script tag, canonical link tag, dynamic og:image meta tag, breadcrumb nav, and related articles section. Add export const revalidate = 600 for ISR. Category pages: grid of article cards, paginated, filter by subcategory." },
  { num: "03", role: "fe", dayTag: "Day 3–4 · Programmatic Pages", title: "Build /stocks/[ticker] and /crypto/[coin] — these create 10,000+ SEO pages.", desc: "Pages hit the backend's /stocks/{ticker} endpoint returning live price + recent articles. Use generateStaticParams() to pre-render top 200 stocks and 100 coins. Each page needs: live price display, price chart (Recharts), recent news articles, AI summary section, and full meta/schema markup." },
  { num: "04", role: "fe", dayTag: "Day 4 · Sitemap + RSS", title: "Build dynamic sitemap.xml and RSS feed. Critical for indexing speed.", desc: "Create app/sitemap.ts — fetch all article slugs from backend, return in Next.js sitemap format. Create app/feed.xml/route.ts — return valid RSS 2.0 XML with last 100 articles. Google Discover reads RSS. After Vercel deploy, give both URLs to SEO Strategist for immediate GSC submission." },
  { num: "05", role: "fe", dayTag: "Day 5 · Performance", title: "Hit green on all Core Web Vitals. Pass Lighthouse audit.", desc: "Run Lighthouse on article, home, and category pages. Fix LCP: use next/image with priority prop on hero images. Fix CLS: add explicit width/height to all images. Fix FID: defer non-critical JS. Target: LCP <2s, CLS <0.1. Add loading skeletons for article cards. Deploy final optimized build." },
];

export const SEO_STEPS: StepItem[] = [
  { num: "01", role: "seo", dayTag: "Day 1 · Research", title: "Complete 300-keyword research. Build the master keyword list.", desc: "Use Ahrefs, Google Keyword Planner, or free alternatives. Focus on: Finance news (100 keywords), Stock analysis (80), Crypto (60), Economy (40), Personal finance (20). Format as keyword_list.json with fields: keyword, search_volume, difficulty, category, priority_score. Deliver to AI Expert by EOD Day 1." },
  { num: "02", role: "seo", dayTag: "Day 1 · Template", title: "Write the article_template.txt — this controls every article the AI writes.", desc: "Define exact structure: H1 format, 3 H2 sections minimum, FAQ section with 4 questions, conclusion CTA. Specify: minimum 800 words, include target keyword in first 100 words, include a data table, include a blockquote. This template is the SEO contract — the AI must follow it exactly for every article." },
  { num: "03", role: "seo", dayTag: "Day 2–3 · GSC Setup", title: "Verify domain in GSC. Submit sitemap. Apply for Google News.", desc: "Add imperialpedia.com to Google Search Console via DNS TXT record. Once Frontend deploys sitemap.xml, submit it immediately. Apply for Google News Publisher Center — this can take 2–4 weeks so apply on Day 1. Set up Bing Webmaster Tools as well (IndexNow works for both)." },
  { num: "04", role: "seo", dayTag: "Day 4–5 · Schema + IndexNow", title: "Validate schema markup. Configure IndexNow for instant indexing.", desc: "Paste 10 article URLs into search.google.com/test/rich-results. Confirm Article + FAQPage rich results detected. Generate IndexNow API key, place key.txt at root of domain. Deliver IndexNow key to AI Expert for auto-submission integration. Every new article should ping IndexNow within 60 seconds of publishing." },
  { num: "05", role: "seo", dayTag: "Day 5–7 · Backlinks + Ranking", title: "Start backlink outreach. Set up rank tracking dashboard.", desc: "Post 5 high-value articles to Reddit finance communities (r/investing, r/personalfinance). Write 3 Quora answers linking to relevant articles. Post on LinkedIn finance groups. Set up SerpAPI + GSC API daily pull for 100 keywords. Monitor GSC Performance tab daily — first impressions should appear within 5–7 days." },
];

export const STANDUP_CODE = `STANDUP FORMAT — use every morning at 9AM

Each person answers EXACTLY these 3 questions (2 min each):

  1. WHAT DID I SHIP YESTERDAY?
     → Specific output only. No vague progress. Name the file/feature/endpoint.
     ✅ "Built RelevanceAgent. Tested 100 articles. 68% pass rate."
     ❌ "Worked on the AI stuff."

  2. WHAT AM I BUILDING TODAY?
     → One primary deliverable. One secondary if time allows.
     ✅ "Primary: ContentAgent with full prompt. Secondary: SEOAgent if time."
     ❌ "Going to work on the pipeline stuff."

  3. AM I BLOCKED BY ANYONE?
     → If yes, that person fixes it NOW — not EOD, NOW.
     ✅ "Blocked: need DATABASE_URL from Backend Dev."
     ❌ "No blockers." (when there actually are)

------- HANDOFF TRACKER (shared doc, updated daily) -------

  SEO → AI Expert:     keyword_list.json        [ ] Day 1  [ ] Delivered
  SEO → AI Expert:     article_template.txt     [ ] Day 1  [ ] Delivered
  Backend → AI Expert: DATABASE_URL + REDIS_URL [ ] Day 1  [ ] Delivered
  AI Expert → Backend: First rows in DB         [ ] Day 3  [ ] Delivered
  Backend → Frontend:  Swagger docs + API URL   [ ] Day 3  [ ] Delivered
  Frontend → SEO:      Live site URL            [ ] Day 5  [ ] Delivered
  SEO → AI Expert:     IndexNow key             [ ] Day 5  [ ] Delivered`;

export const COMM_RULES = [
  { channel: "WhatsApp Group", use: "Quick questions, blockers, 'I just shipped X'", sla: "< 30 min", slaRole: "ai" as RoleKey },
  { channel: "GitHub Issues", use: "Bug reports, feature requests, technical decisions", sla: "< 4 hours", slaRole: "be" as RoleKey },
  { channel: "Shared Google Doc", use: "Handoff tracker, daily standup notes, decisions log", sla: "Updated daily", slaRole: "seo" as RoleKey },
  { channel: "Loom Video", use: "Demo a feature, explain a complex problem, code review", sla: "Watch same day", slaRole: "fe" as RoleKey },
  { channel: "9AM Call (Daily)", use: "Standup — blockers + today's plan", sla: "Mandatory", slaRole: "pm" as RoleKey },
];

export const SUCCESS_METRICS = [
  { role: "ai" as RoleKey, icon: "🤖", name: "AI Expert", day3: "Pipeline manually run: 10+ articles in DB with full content + schema", day5: "Cron running: 200+ articles/day rate confirmed", done: "500+ articles/day · Zero unhandled exceptions · IndexNow firing" },
  { role: "be" as RoleKey, icon: "⚙️", name: "Backend", day3: "FastAPI deployed on Railway · /articles endpoint returns real data", day5: "All endpoints <100ms · Redis cache confirmed · Monitoring live", done: "100% uptime · Swagger docs complete · Admin stats live · DB backups on" },
  { role: "fe" as RoleKey, icon: "🖥️", name: "Frontend", day3: "Article page renders real DB content · No mock data", day5: "Sitemap.xml live · /stocks/[ticker] pages working · CWV green", done: "All pages pass Lighthouse · Schema validated · Programmatic pages live" },
  { role: "seo" as RoleKey, icon: "📈", name: "SEO", day3: "GSC verified · Keyword list delivered · Google News applied", day5: "Sitemap submitted · IndexNow live · 20 articles manually submitted", done: "500+ URLs discovered in GSC · Schema rich results detected · Rank tracking setup" },
];
