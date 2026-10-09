interface ChapterDoodleProps {
  index: number
  className?: string
}

const common = {
  viewBox: '0 0 32 32',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function ChapterDoodle({ index, className }: ChapterDoodleProps) {
  switch (index) {
    // 0 – Vergleiche: Waage
    case 0:
      return (
        <svg {...common} className={className}>
          <path d="M16 5 v19.5" />
          <path d="M6 8.5 h20" />
          <path d="M3.5 8.5 l2.5 5 h-5 z" />
          <path d="M28.5 8.5 l2.5 5 h-5 z" />
          <path d="M10 24.5 h12" />
        </svg>
      )
    // 1 – Logik: Glühbirne
    case 1:
      return (
        <svg {...common} className={className}>
          <path d="M16 5.5 a7 7 0 0 1 4 12.6 c -1 0.7 -1.5 1.6 -1.5 2.6 h-5 c 0 -1 -0.5 -1.9 -1.5 -2.6 a7 7 0 0 1 4 -12.6 z" />
          <path d="M13.5 23.5 h5" />
          <path d="M14 26.5 h4" />
          <path d="M16 1.5 v1.6" />
          <path d="M6.5 6 l1.1 1.1" />
          <path d="M25.5 6 l-1.1 1.1" />
        </svg>
      )
    // 2 – Kontrolle: Schleife
    case 2:
      return (
        <svg {...common} className={className}>
          <path d="M27 16 a11 11 0 1 1 -4 -8.5" />
          <path d="M23 3.5 l4 4 l-5 2" />
        </svg>
      )
    // 3 – Mathe: Taschenrechner
    case 3:
      return (
        <svg {...common} className={className}>
          <rect x="8" y="4" width="16" height="24" rx="2" />
          <rect x="11" y="7" width="10" height="4" rx="1" />
          <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="16" cy="17" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="20" cy="17" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="12" cy="22" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="16" cy="22" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="20" cy="22" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      )
    // 4 – Strings: Sprechblase
    case 4:
      return (
        <svg {...common} className={className}>
          <path d="M7 6 h18 a2.5 2.5 0 0 1 2.5 2.5 v9 a2.5 2.5 0 0 1 -2.5 2.5 h-9 l-5.5 4.5 v-4.5 h-3.5 a2.5 2.5 0 0 1 -2.5 -2.5 v-9 a2.5 2.5 0 0 1 2.5 -2.5 z" />
          <path d="M11 12.5 h10" />
          <path d="M11 16.5 h6" />
        </svg>
      )
    // 5 – Arrays: Zellen
    case 5:
      return (
        <svg {...common} className={className}>
          <rect x="3.5" y="9" width="7.5" height="14" rx="1.5" />
          <rect x="12.3" y="9" width="7.5" height="14" rx="1.5" />
          <rect x="21" y="9" width="7.5" height="14" rx="1.5" />
        </svg>
      )
    // 6 – OOP: Würfel
    case 6:
      return (
        <svg {...common} className={className}>
          <path d="M16 4 l10 5 v13 l-10 5 l-10 -5 v-13 z" />
          <path d="M6 9 l10 5 l10 -5" />
          <path d="M16 14 v13" />
        </svg>
      )
    // 7 – Character & Epsilon
    case 7:
      return (
        <svg {...common} className={className}>
          <path d="M10 24 l6 -16 l6 16" />
          <path d="M12.7 18 h6.6" />
        </svg>
      )
    // 8 – Ternärer Operator ? :
    case 8:
      return (
        <svg {...common} className={className}>
          <path d="M7.5 11 a3.5 3.5 0 1 1 4.8 3.2 c -1.2 0.5 -1.3 1.3 -1.3 2.4" />
          <circle cx="11" cy="21" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="22" cy="12.5" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="22" cy="19.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      )
    // 9 – Finale: Flagge
    default:
      return (
        <svg {...common} className={className}>
          <path d="M9 5 v22" />
          <path d="M9 6 h16 l-3 4 l3 4 h-16" />
          <path d="M6 27 h8" />
        </svg>
      )
  }
}
