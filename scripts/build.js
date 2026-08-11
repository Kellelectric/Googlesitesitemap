// Wraps the production build so it never hard-fails just because
// DATABASE_URL isn't configured yet (e.g. a fresh Vercel preview before
// Postgres is connected — see docs/assessment-platform-deployment.md).
// When DATABASE_URL *is* set, this applies pending migrations first so
// production/preview deploys stay in sync with prisma/schema.prisma
// automatically, with no manual `prisma migrate deploy` step.
const { execSync } = require('child_process')

function run(command) {
  execSync(command, { stdio: 'inherit' })
}

if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL is set — applying pending Prisma migrations...')
  run('npx prisma migrate deploy')
} else {
  console.warn(
    'DATABASE_URL is not set — skipping `prisma migrate deploy`. ' +
      'Pages that read the database (e.g. /book, /admin/*) will error at ' +
      'request time until it is configured. See docs/assessment-platform-deployment.md.',
  )
}

run('next build')
