/*
 * Blog content. Add an article by appending an object here.
 * Keep the newest article first: the article page's "Newer / Older" links follow this order.
 * Body block types: h2 (x), p (x), quote (x), ul (items), code (x = code text).
 * Text is always inserted with textContent, so plain text is safe; do not add HTML.
 */
window.ARTICLES = [
  {
    slug: "understanding-sql-query-optimization",
    title: "Understanding SQL Query Optimization",
    category: "Technical Notes",
    excerpt: "Start with the query plan, then index the filter you actually run. A short walk through EXPLAIN ANALYZE on a reporting query.",
    date: "2026-09-14",
    readingTime: "6 min read",
    tags: ["SQL", "PostgreSQL", "Performance"],
    featured: true,
    body: [
      { t: "p", x: "Most slow queries are not slow for mysterious reasons. The planner has a plan, and EXPLAIN ANALYZE shows what it actually did: which scans it used, how many rows it expected, and how many it really processed. Compare those numbers first." },
      { t: "code", x: "EXPLAIN ANALYZE\nSELECT branch_code, COUNT(*) AS failed\nFROM atm_transactions\nWHERE status = 'FAILED'\n  AND created_at >= now() - interval '1 day'\nGROUP BY branch_code;" },
      { t: "p", x: "If the plan shows a sequential scan over millions of rows for a filter that keeps only a few hundred, that gap between expected and actual rows is your first lead." },
      { t: "h2", x: "Index the filter you actually run" },
      { t: "p", x: "An index helps when it matches the WHERE clause and its column order. For this query, a composite index on (status, created_at) fits; two separate single-column indexes often do not combine well." },
      { t: "ul", items: [
        "Index the columns used in equality and range filters.",
        "Check the column order against the filter; put the most selective equality column first.",
        "Run EXPLAIN ANALYZE again after each change. An index the planner ignores still costs you on every write."
      ] },
      { t: "h2", x: "Measure before you rewrite" },
      { t: "p", x: "A CTE can make a query easier to read, but it is not a performance tool by itself. Treat readability as the goal and check every speed claim with the plan." },
      { t: "quote", x: "Change one thing, measure again, keep only what the numbers support." }
    ]
  },
  {
    slug: "lessons-automating-repetitive-work",
    title: "Lessons Learned from Automating Repetitive Work",
    category: "Work & Lessons Learned",
    excerpt: "Automate the part you already understand, make every job safe to run twice, and only notify people when something needs them.",
    date: "2026-08-30",
    readingTime: "5 min read",
    tags: ["Automation", "Python"],
    featured: true,
    body: [
      { t: "p", x: "Repetitive work is a good target for automation, but the first version is rarely the right one. These are the lessons I keep relearning." },
      { t: "h2", x: "Automate the part you already understand" },
      { t: "p", x: "If you cannot do the task by hand reliably, a script will only repeat the confusion faster. Do it manually a few times, write down the steps, and automate those steps." },
      { t: "h2", x: "Make every job safe to run twice" },
      { t: "p", x: "Schedulers retry, networks fail, and people re-run things. A job should produce the same result when it runs again. Use upserts or a processed-marker instead of blind inserts." },
      { t: "ul", items: [
        "Key each record by a stable ID.",
        "Write results in one transaction, so a failed run leaves nothing half-done.",
        "Log the input range each run covered."
      ] },
      { t: "h2", x: "Notify on failure, not on every success" },
      { t: "p", x: "A channel that posts every successful run gets muted within a week. Send a message when a job fails, when it is late, or when its output looks wrong." },
      { t: "quote", x: "A quiet channel is a useful signal only if the alerts in it are trusted." }
    ]
  },
  {
    slug: "building-practical-data-monitoring-dashboard",
    title: "Building a Practical Data Monitoring Dashboard",
    category: "Data & Automation",
    excerpt: "Begin with the questions people ask every morning, keep the pipeline boring, and show trends before details.",
    date: "2026-08-12",
    readingTime: "7 min read",
    tags: ["Dashboard", "ETL", "PostgreSQL"],
    featured: true,
    body: [
      { t: "p", x: "A monitoring dashboard is only useful if someone opens it and acts on what they see. The design starts with the questions, not the charts." },
      { t: "h2", x: "Start from the questions people ask" },
      { t: "ul", items: [
        "Is anything down right now?",
        "Is this week worse than last week?",
        "Which item needs a follow-up today?"
      ] },
      { t: "p", x: "Each question maps to one view. If a chart does not answer one of them, leave it out." },
      { t: "h2", x: "Keep the pipeline boring" },
      { t: "p", x: "Validate and normalise each row before it reaches the database. Small, explicit functions are easier to test than one large script." },
      { t: "code", x: "from datetime import datetime, timezone\n\ndef clean(row):\n    return {\n        \"branch_code\": row[\"branch_code\"].strip().upper(),\n        \"status\": row[\"status\"].strip().upper(),\n        \"recorded_at\": datetime.fromisoformat(row[\"recorded_at\"]).replace(tzinfo=timezone.utc),\n    }" },
      { t: "h2", x: "Show trends first, details second" },
      { t: "p", x: "Put the trend line at the top and let people drill into a table below it. Most visitors need the trend; a few need the rows behind it." }
    ]
  },
  {
    slug: "debugging-problems-through-evidence",
    title: "Debugging Problems Through Evidence",
    category: "Personal Reflections",
    excerpt: "Write down what you observed before you guess at the cause, then change one variable at a time.",
    date: "2026-07-25",
    readingTime: "4 min read",
    tags: ["Debugging"],
    featured: false,
    body: [
      { t: "p", x: "When something breaks, the urge is to fix the first suspicious line. A slower approach usually finds the real cause sooner." },
      { t: "h2", x: "Write down what you observed" },
      { t: "p", x: "Record the exact error, the time, the input, and what changed recently. Separate those facts from your theories about them." },
      { t: "h2", x: "Change one variable at a time" },
      { t: "p", x: "If you change three things and the problem disappears, you do not know which one mattered. Reproduce the failure first, then make a single change and observe it again." },
      { t: "quote", x: "The notes you write while debugging are often the best documentation you will ever have." }
    ]
  },
  {
    slug: "keeping-technical-projects-simple",
    title: "Keeping Technical Projects Simple and Maintainable",
    category: "Technical Notes",
    excerpt: "A short checklist for choosing the simplest design that will still work in production.",
    date: "2026-07-03",
    readingTime: "3 min read",
    tags: ["Architecture", "Maintainability"],
    featured: false,
    body: [
      { t: "p", x: "Simple designs are easier to change, easier to debug, and easier to hand over. Complexity should be added only when a real requirement demands it." },
      { t: "ul", items: [
        "Start with one process, one database, and one deployment target.",
        "Add a queue only when a request truly cannot wait.",
        "Name things after what they do, not after the pattern they follow.",
        "Write down why a component exists; delete it when the reason is gone."
      ] }
    ]
  }
];
