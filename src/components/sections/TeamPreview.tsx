import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { team } from '@/content/team'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

export function TeamPreview() {
  return (
    <section className="bg-paper py-24">
      <div className="container-content">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-petrol/70">Who you&rsquo;ll be working with</span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold text-ink md:text-4xl">
              A real team, not a call centre
            </h2>
          </div>
          <Button href="/about" variant="secondary" data-on-light="true">
            Meet the full team
          </Button>
        </Reveal>

        <StaggerGroup className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {team.map((member) => (
            <MotionDiv key={member.name} variants={staggerItem}>
              <Link href="/about" className="group block border border-ink/10 hover:border-petrol">
                {member.photo ? (
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square w-full bg-petrol/5" />
                )}
                <div className="border-t-2 border-petrol p-3">
                  <p className="text-sm font-semibold text-ink">{member.name}</p>
                  <p className="mt-0.5 text-xs text-ink/60">{member.title}</p>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
