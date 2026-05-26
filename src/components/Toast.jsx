import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [message, onClose])

  return (
    <div className="toast" role="alert" aria-live="polite">
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Zamknij powiadomienie">
        <X size={14} />
      </button>
    </div>
  )
}
