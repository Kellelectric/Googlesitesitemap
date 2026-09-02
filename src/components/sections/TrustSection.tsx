import { company } from '@/content/company'
import { Reveal } from '@/components/ui/Reveal'

// The compliance nameplate — Circuit Map beat 06. A close-up of a
// nameplate rivetted to the panel body: COREN/NEMSA/RC as engraved fact,
// not a marketing kicker. The rating itself already lives in the
// StatsBar instrument panel above; this section doesn't repeat it.
export function TrustSection() {
  return (
    <section className="bg-petrol-700 py-24 text-paper">
      <div className="container-content">
        <Reveal className="relative border border-copper/30 bg-petrol-600/60 px-8 py-10 md:px-12 md:py-12">
          <span className="absolute left-3 top-3 h-1.5 w-1.5 rounded-full bg-copper" aria-hidden="true" />
          <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-copper" aria-hidden="true" />
          <span className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-copper" aria-hidden="true" />
          <span className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-copper" aria-hidden="true" />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="max-w-lg text-3xl font-semibold [text-wrap:balance] md:text-4xl">
                Certified, not claimed
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/70">
                Every installation runs through the same documented process
                — assess, design, install, test and hand over — to{' '}
                {company.certifications.map((c) => c.fullName).join(' and ')}{' '}
                standards. Work carried out across {company.serviceAreas.join(', ')}, and
                wider Nigeria for larger contracts, is verifiable on our
                Google Business Profile.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-paper/10 pt-8 font-mono text-sm md:border-l md:border-t-0 md:pl-10 md:pt-0">
              {company.certifications.map((cert) => (
                <div key={cert.name}>
                  <dt className="text-[0.7rem] uppercase tracking-[0.08em] text-copper">{cert.name}</dt>
                  <dd className="mt-1 text-paper/75">{cert.fullName}</dd>
                </div>
              ))}
              <div>
                <dt className="text-[0.7rem] uppercase tracking-[0.08em] text-copper">Registered</dt>
                <dd className="mt-1 text-paper/75">RC {company.rcNumber}</dd>
              </div>
              <div>
                <dt className="text-[0.7rem] uppercase tracking-[0.08em] text-copper">Legal name</dt>
                <dd className="mt-1 text-paper/75">{company.legalName}</dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
