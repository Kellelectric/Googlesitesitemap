import { homeFaq } from '@/content/faq'
import { Reveal } from '@/components/ui/Reveal'

// The breaker schedule — Circuit Map beat 08. Native <details>/<summary>:
// no JS accordion, fully keyboard- and screen-reader-operable by default,
// deliberately the calmest, most information-only moment on the page
// after eight beats of spectacle.
export function FaqSection() {
  return (
    <section className="bg-paper py-24">
      <div className="container-content">
        <Reveal>
          <h2 className="max-w-xl text-3xl font-semibold text-ink [text-wrap:balance] md:text-4xl">
            Answered before you have to ask
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-10 border border-ink/10">
          {homeFaq.map((item, i) => (
            <details
              key={item.question}
              className="group border-b border-ink/10 last:border-b-0 open:bg-petrol/[0.02]"
            >
              <summary className="flex cursor-pointer list-none items-start gap-4 px-6 py-5 marker:content-none">
                <span className="mt-0.5 shrink-0 font-mono text-xs text-petrol/40">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-display text-base font-medium text-ink">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border border-ink/25 transition-colors group-open:border-yellow group-open:bg-yellow/20"
                />
              </summary>
              <p className="px-6 pb-6 pl-[3.25rem] text-sm leading-relaxed text-ink/70">
                {item.answer}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
