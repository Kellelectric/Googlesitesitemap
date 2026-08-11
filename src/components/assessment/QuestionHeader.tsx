export function QuestionHeader({ question, supporting }: { question: string; supporting?: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{question}</h1>
      {supporting && <p className="mt-3 text-base text-ink/60">{supporting}</p>}
    </div>
  )
}
