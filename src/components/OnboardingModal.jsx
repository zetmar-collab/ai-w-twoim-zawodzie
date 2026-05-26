import { useState } from 'react'
import { ChevronRight, Sparkles, X } from 'lucide-react'

const STEPS = [
  {
    title: 'Witaj w AI w Twoim Zawodzie',
    body: 'W 60 sekund zrozumiesz, jak zbudować swój pierwszy stack narzędzi AI dopasowany do pracy.',
  },
  {
    title: '1. Wybierz zawód i problem',
    body: 'Ustaw rolę, obszary pracy i opisz, czego potrzebujesz od AI. Możesz też wpisać własny zawód.',
  },
  {
    title: '2. Wygeneruj i wdrażaj',
    body: 'Dostaniesz stack z promptami, plan na 7 dni oraz eksport do PDF. Klucz Gemini jest opcjonalny.',
  },
]

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <div className="onboarding-card">
        <button type="button" className="onboarding-skip" onClick={onComplete} aria-label="Pomiń wprowadzenie">
          <X size={16} />
        </button>
        <div className="onboarding-icon">
          <Sparkles size={28} />
        </div>
        <p className="onboarding-step-label">
          Krok {step + 1} / {STEPS.length}
        </p>
        <h2 id="onboarding-title">{current.title}</h2>
        <p>{current.body}</p>
        <div className="onboarding-dots" aria-hidden="true">
          {STEPS.map((_, index) => (
            <span key={index} className={index === step ? 'active' : ''} />
          ))}
        </div>
        <div className="onboarding-actions">
          {step > 0 ? (
            <button type="button" className="ghost" onClick={() => setStep((s) => s - 1)}>
              Wstecz
            </button>
          ) : (
            <span />
          )}
          {isLast ? (
            <button type="button" className="primary" onClick={onComplete}>
              Zaczynam
            </button>
          ) : (
            <button type="button" className="primary" onClick={() => setStep((s) => s + 1)}>
              Dalej <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
