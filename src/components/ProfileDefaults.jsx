import { Check } from 'lucide-react'

export default function ProfileDefaults({
  professionId,
  professions,
  customProfessionLabel,
  level,
  goal,
  problem,
  selectedAreas,
  loadOnStart,
  onLoadOnStartChange,
  onSaveDefaults,
  onApplyDefaults,
  customProfessionId,
}) {
  return (
    <div className="profile-defaults">
      <p className="profile-section-title">Domyślne ustawienia formularza</p>
      <p className="profile-hint">
        Zapisz zawód, cel i problem — przy każdym starcie (opcjonalnie) formularz wypełni się automatycznie.
      </p>

      <label className="profile-checkbox">
        <input
          type="checkbox"
          checked={loadOnStart}
          onChange={function (e) {
            onLoadOnStartChange(e.target.checked)
          }}
        />
        <span>Wczytuj domyślne ustawienia przy starcie aplikacji</span>
      </label>

      <div className="profile-defaults-preview">
        <span>
          <b>Zawód:</b>{' '}
          {professionId === customProfessionId
            ? customProfessionLabel || 'Inny zawód'
            : professions.find((p) => p.id === professionId)?.label}
        </span>
        <span>
          <b>Poziom:</b> {level}
        </span>
        <span>
          <b>Obszary:</b> {selectedAreas.join(', ') || '—'}
        </span>
        <span>
          <b>Cel:</b> {goal}
        </span>
        <span>
          <b>Problem:</b> {problem.length > 80 ? problem.slice(0, 80) + '…' : problem}
        </span>
      </div>

      <button type="button" className="ghost profile-backup-btn" onClick={onApplyDefaults}>
        Zastosuj zapisane domyślne
      </button>
      <button type="button" className="primary profile-save-defaults" onClick={onSaveDefaults}>
        <Check size={15} /> Zapisz bieżące jako domyślne
      </button>
    </div>
  )
}
