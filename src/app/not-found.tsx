import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="bg-petrol py-32 text-paper">
      <div className="container-content text-center">
        <span className="eyebrow text-yellow">404</span>
        <h1 className="mt-4 text-3xl font-semibold md:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-paper/70">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button href="/" variant="primary">
            Back to home
          </Button>
          <Button href="/services" variant="secondary">
            View services
          </Button>
        </div>
      </div>
    </section>
  )
}
