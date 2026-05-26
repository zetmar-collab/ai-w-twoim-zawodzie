import { Check, Copy, ExternalLink } from 'lucide-react'
import { buildPromptUrl } from '../lib/promptUrl'

export default function WeeklyPlanPanel({ plan, doneIds, onToggleDay, onCopyPrompt }) {
  if (!plan?.length) return null

  const doneCount = plan.filter((day) => doneIds.includes(day.id)).length

  return (
    <section className="weekly-plan-panel" aria-label="Plan wdrożenia na 7 dni">
      <div className="weekly-plan-header">
        <div>
          <h3>Plan na 7 dni</h3>
          <p>
            Jeden krok dziennie — {doneCount}/{plan.length} ukończone
          </p>
        </div>
        <div className="weekly-plan-progress" role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={plan.length}>
          <span style={{ width: `${(doneCount / plan.length) * 100}%` }} />
        </div>
      </div>

      <ol className="weekly-plan-list">
        {plan.map((day) => {
          const isDone = doneIds.includes(day.id)
          const tool = { name: day.toolName, prompt: day.prompt, url: day.url }
          return (
            <li key={day.id} className={isDone ? 'done' : ''}>
              <div className="weekly-plan-day-top">
                <span className="weekly-plan-day-num">{day.dayNumber}</span>
                <div>
                  <strong>{day.day}</strong>
                  <span className="weekly-plan-tool">
                    {day.toolName} · {day.category}
                  </span>
                </div>
                <button
                  type="button"
                  className={'weekly-plan-check' + (isDone ? ' is-done' : '')}
                  onClick={() => onToggleDay(day.id)}
                  aria-pressed={isDone}
                >
                  <Check size={14} />
                  {isDone ? 'Zrobione' : 'Oznacz'}
                </button>
              </div>
              <p className="weekly-plan-focus">{day.focus}</p>
              <p className="weekly-plan-action">{day.action}</p>
              {day.prompt ? (
                <div className="weekly-plan-prompt">
                  <p>{day.prompt}</p>
                  <div className="weekly-plan-prompt-actions">
                    <button type="button" className="ghost small" onClick={() => onCopyPrompt(day.prompt)}>
                      <Copy size={13} /> Kopiuj prompt
                    </button>
                    {day.url ? (
                      <a href={buildPromptUrl(tool)} target="_blank" rel="noreferrer" className="ghost small">
                        <ExternalLink size={13} /> Otwórz narzędzie
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
