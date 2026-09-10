// Technical SEO audit: checks every URL in sitemap.xml for title/meta-
// description length (Google's ~60/~160 char display budgets), a missing
// canonical tag, missing/duplicate <h1>, and broken internal links.
//
// Usage: build + start the app, then run this against it —
//   npm run build && npm run start -- -p 3999 &
//   PORT=3999 node scripts/audit-seo.mjs
//
// Requires a running production server (not `next dev`) since sitemap.xml
// and metadata are generated at build time.
const BASE = `http://localhost:${process.env.PORT ?? 3000}`;

async function getSitemapUrls() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

function decodeEntities(s) {
  if (!s) return s;
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, '’')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—');
}

function extract(html, re) {
  const m = html.match(re);
  return m ? decodeEntities(m[1]) : null;
}

async function auditUrl(url) {
  const path = url.replace('https://kellelectricals.com', '');
  const res = await fetch(`${BASE}${path}`);
  const html = await res.text();
  const status = res.status;

  const title = extract(html, /<title>(.*?)<\/title>/s);
  const description = extract(html, /<meta name="description" content="(.*?)"/s);
  const canonical = extract(html, /<link rel="canonical" href="(.*?)"/s);
  const h1s = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gs)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').trim(),
  );

  const issues = [];
  if (status !== 200) issues.push(`HTTP ${status}`);
  if (!title) issues.push('missing <title>');
  else if (title.length > 60) issues.push(`title too long (${title.length} chars)`);
  if (!description) issues.push('missing meta description');
  else if (description.length > 160) issues.push(`description too long (${description.length} chars)`);
  else if (description.length < 50) issues.push(`description too short (${description.length} chars)`);
  if (!canonical) issues.push('missing canonical');
  if (h1s.length === 0) issues.push('no <h1>');
  if (h1s.length > 1) issues.push(`multiple <h1>s (${h1s.length})`);

  // internal links pointing at non-existent paths (rough check, same-origin only)
  const links = [...html.matchAll(/href="(\/[a-zA-Z0-9\/_-]*)"/g)].map((m) => m[1]);
  const uniqueLinks = [...new Set(links)].filter(
    (l) => !l.startsWith('/api') && l !== '' && !l.includes('#'),
  );

  return { url: path, status, title, description, issues, links: uniqueLinks };
}

const sitemapUrls = await getSitemapUrls();
console.log(`Found ${sitemapUrls.length} URLs in sitemap.xml\n`);

const results = [];
for (const url of sitemapUrls) {
  const r = await auditUrl(url);
  results.push(r);
}

// Check every internal link found actually resolves (catch broken links / typos)
const allLinkedPaths = new Set();
results.forEach((r) => r.links.forEach((l) => allLinkedPaths.add(l)));

console.log('=== Pages with issues ===');
let issueCount = 0;
for (const r of results) {
  if (r.issues.length > 0) {
    issueCount++;
    console.log(`${r.url}: ${r.issues.join('; ')}`);
  }
}
if (issueCount === 0) console.log('(none)');

console.log(`\n=== Checking ${allLinkedPaths.size} unique internal link targets for 404s ===`);
let brokenCount = 0;
for (const path of allLinkedPaths) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
  if (res.status !== 200 && res.status !== 308 && res.status !== 307) {
    brokenCount++;
    console.log(`BROKEN: ${path} -> HTTP ${res.status}`);
  }
}
if (brokenCount === 0) console.log('(no broken internal links found)');

console.log(`\n=== Summary: ${sitemapUrls.length} pages, ${issueCount} with metadata issues, ${brokenCount} broken links ===`);
