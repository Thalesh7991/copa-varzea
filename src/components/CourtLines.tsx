/** Linhas de uma quadra de futsal vista de cima (decorativo). */
export default function CourtLines({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <rect x="2" y="2" width="396" height="196" rx="2" />
      <line x1="200" y1="2" x2="200" y2="198" />
      <circle cx="200" cy="100" r="30" />
      <circle cx="200" cy="100" r="2" fill="currentColor" />
      {/* áreas (formato de "D") */}
      <path d="M2 40 A60 60 0 0 1 62 85 L62 115 A60 60 0 0 1 2 160" />
      <path d="M398 40 A60 60 0 0 0 338 85 L338 115 A60 60 0 0 0 398 160" />
      {/* marcas de pênalti e tiro livre */}
      <circle cx="62" cy="100" r="1.8" fill="currentColor" />
      <circle cx="338" cy="100" r="1.8" fill="currentColor" />
      <circle cx="100" cy="100" r="1.8" fill="currentColor" />
      <circle cx="300" cy="100" r="1.8" fill="currentColor" />
      {/* gols */}
      <rect x="-6" y="85" width="8" height="30" />
      <rect x="398" y="85" width="8" height="30" />
    </svg>
  );
}
