interface ShowcaseSectionProps {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}

export function ShowcaseSection({ id, title, description, children }: ShowcaseSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 space-y-4">
      <header>
        <h2 id={`${id}-title`} className="text-xl font-semibold text-foreground tracking-tight">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-muted-foreground max-w-prose">{description}</p>}
      </header>
      {children}
    </section>
  )
}

interface ShowcaseGroupProps {
  label: string
  children: React.ReactNode
}

export function ShowcaseGroup({ label, children }: ShowcaseGroupProps) {
  return (
    <div className="card-padded space-y-4">
      <p className="section-label">{label}</p>
      {children}
    </div>
  )
}
