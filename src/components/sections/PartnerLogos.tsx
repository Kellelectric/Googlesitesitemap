import Image from 'next/image'
import type { Partner } from '@/content/partners'
import { Reveal, StaggerGroup, MotionDiv, staggerItem } from '@/components/ui/Reveal'

// Renders nothing until src/content/partners.ts has real entries — see that
// file's header comment. Do not pass placeholder/invented partners here.
export function PartnerLogos({ partners, dark = false }: { partners: Partner[]; dark?: boolean }) {
  if (partners.length === 0) return null

  return (
    <section className={dark ? 'bg-petrol-700 py-16 text-paper' : 'border-y border-ink/10 bg-paper py-16'}>
      <div className="container-content">
        <Reveal>
          <span className={`eyebrow ${dark ? 'text-yellow' : 'text-petrol/70'}`}>
            Partners &amp; suppliers
          </span>
        </Reveal>
        <StaggerGroup className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-8">
          {partners.map((partner) => {
            const logo = (
              <Image
                src={partner.logo}
                alt={partner.name}
                width={140}
                height={56}
                className={`h-10 w-auto object-contain grayscale transition-[filter] duration-200 hover:grayscale-0 ${dark ? 'brightness-0 invert' : ''}`}
              />
            )
            return (
              <MotionDiv key={partner.name} variants={staggerItem}>
                {partner.url ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={partner.name}
                  >
                    {logo}
                  </a>
                ) : (
                  <span aria-label={partner.name}>{logo}</span>
                )}
              </MotionDiv>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
