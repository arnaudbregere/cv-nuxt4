// ─── Niveaux WCAG ──────────────────────────────────────────────────────────────
export type NiveauWCAG = 'A' | 'AA' | 'AAA'

// ─── Une violation d'accessibilité ─────────────────────────────────────────────
export interface Violation {
  critere:     string
  niveau:      NiveauWCAG
  description: string
  element:     string
  correction:  string
}

// ─── Résultat brut renvoyé par l'agent d'audit ─────────────────────────────────
export interface AuditResult {
  score:       number
  resume:      string
  violations:  Violation[]
  htmlCorrige: string
}

// ─── Une étape dans l'historique de l'agent itératif ───────────────────────────
export interface IterationStep {
  iteration:   number
  score:       number
  resume:      string
  violations:  Violation[]
  htmlCorrige: string
}