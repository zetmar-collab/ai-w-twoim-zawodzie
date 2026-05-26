import { useMemo, useState } from 'react'
import { ArrowLeftRight, Download, Trash2 } from 'lucide-react'
import { compareStacks } from '../lib/stackCompare'

export default function HistoryView({
  history,
  compareSlotA,
  compareSlotB,
  onSelectCompare,
  onClearCompare,
  onRestore,
  onClearHistory,
}) {
  const [showCompare, setShowCompare] = useState(false)

  const entryA = history.find((item) => item.id === compareSlotA)
  const entryB = history.find((item) => item.id === compareSlotB)

  const comparison = useMemo(() => {
    if (!entryA?.stack?.length || !entryB?.stack?.length) return null
    return compareStacks(entryA.stack, entryB.stack)
  }, [entryA, entryB])

  const comparableCount = history.filter((item) => item.stack?.length).length

  function toggleSelect(id) {
    if (compareSlotA === id) {
      onSelectCompare(null, compareSlotB)
      return
    }
    if (compareSlotB === id) {
      onSelectCompare(compareSlotA, null)
      return
    }
    if (!compareSlotA) {
      onSelectCompare(id, compareSlotB)
      return
    }
    if (!compareSlotB) {
      onSelectCompare(compareSlotA, id)
      return
    }
    onSelectCompare(compareSlotA, id)
  }

  return (
    <section className="view-panel history-view">
      <div className="panel-heading">
        <div>
          <h2>Historia generowania</h2>
          <p>
            {history.length} wpisów
            {comparableCount < history.length && comparableCount > 0
              ? ` · ${comparableCount} z pełnym stackiem do porównania`
              : ''}
          </p>
        </div>
        <div className="history-heading-actions">
          {comparableCount >= 2 && (
            <button
              type="button"
              className="ghost"
              onClick={function () {
                setShowCompare(function (v) {
                  return !v
                })
              }}
            >
              <ArrowLeftRight size={15} />
              {showCompare ? 'Ukryj porównanie' : 'Porównaj stacki'}
            </button>
          )}
          {history.length > 0 && (
            <button type="button" className="btn-danger-ghost" onClick={onClearHistory}>
              <Trash2 size={15} /> Wyczyść
            </button>
          )}
        </div>
      </div>

      {showCompare && (
        <div className="history-compare-hint">
          Wybierz <strong>dwa wpisy</strong> z pełnym stackiem (zaznaczone na zielono), aby zobaczyć różnice.
          {compareSlotA && compareSlotB && (
            <button type="button" className="ghost small" onClick={onClearCompare}>
              Wyczyść wybór
            </button>
          )}
        </div>
      )}

      {showCompare && comparison && entryA && entryB && (
        <div className="stack-compare-panel">
          <div className="stack-compare-header">
            <div>
              <span className="compare-label">Stack A</span>
              <strong>{entryA.profession}</strong>
              <small>{entryA.date}</small>
            </div>
            <ArrowLeftRight size={20} />
            <div>
              <span className="compare-label">Stack B</span>
              <strong>{entryB.profession}</strong>
              <small>{entryB.date}</small>
            </div>
          </div>

          <div className="stack-compare-stats">
            <span>{comparison.countA} narzędzi</span>
            <span>{comparison.inBoth.length} wspólnych</span>
            <span>{comparison.countB} narzędzi</span>
          </div>

          <div className="stack-compare-columns">
            <CompareColumn title="Tylko w A" tools={comparison.onlyInA} empty="Brak unikalnych" />
            <CompareColumn title="W obu" tools={comparison.inBoth} empty="Brak wspólnych" variant="both" />
            <CompareColumn title="Tylko w B" tools={comparison.onlyInB} empty="Brak unikalnych" />
          </div>
        </div>
      )}

      {showCompare && compareSlotA && compareSlotB && !comparison && (
        <p className="empty-hint">
          Wybrane wpisy nie mają zapisanego stacka (starsze wpisy). Wygeneruj nowy stack, aby porównywać kolejne wersje.
        </p>
      )}

      <div className="list-panel">
        {history.length ? (
          history.map((item) => {
            const hasStack = Boolean(item.stack?.length)
            const isA = compareSlotA === item.id
            const isB = compareSlotB === item.id
            const isSelected = isA || isB

            return (
              <article
                className={
                  'history-row history-row-extended' +
                  (isSelected ? ' selected' : '') +
                  (hasStack ? ' has-stack' : '')
                }
                key={item.id}
              >
                <div className="history-row-main">
                  <div>
                    <strong>{item.profession}</strong>
                    <p>{item.goal}</p>
                    {item.problem && <p className="history-problem">{item.problem}</p>}
                  </div>
                  <div className="history-row-meta">
                    <span>{item.count} narzędzi</span>
                    {item.source && <span className="history-source">{item.source}</span>}
                    <small>{item.date}</small>
                  </div>
                </div>

                <div className="history-row-actions">
                  {showCompare && hasStack && (
                    <button
                      type="button"
                      className={'ghost small' + (isSelected ? ' active' : '')}
                      onClick={function () {
                        toggleSelect(item.id)
                      }}
                    >
                      {isA ? 'A' : isB ? 'B' : 'Porównaj'}
                    </button>
                  )}
                  {hasStack && (
                    <button type="button" className="ghost small" onClick={function () { onRestore(item) }}>
                      <Download size={13} /> Wczytaj
                    </button>
                  )}
                </div>
              </article>
            )
          })
        ) : (
          <p className="empty-hint">Brak historii. Wygeneruj pierwszy stack z dashboardu.</p>
        )}
      </div>
    </section>
  )
}

function CompareColumn({ title, tools, empty, variant }) {
  return (
    <div className={'compare-column' + (variant ? ' compare-column-' + variant : '')}>
      <h4>
        {title} <span>({tools.length})</span>
      </h4>
      {tools.length ? (
        <ul>
          {tools.map((tool) => (
            <li key={tool.name}>
              <strong>{tool.name}</strong>
              <span>{tool.category}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="compare-empty">{empty}</p>
      )}
    </div>
  )
}
