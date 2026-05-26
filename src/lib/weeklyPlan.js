const DAY_NAMES = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela']

const DAY_ACTIONS = [
  'Otwórz narzędzie i wykonaj jedno zadanie z bieżącego tygodnia.',
  'Wklej gotowy prompt i dostosuj go do konkretnego klienta lub projektu.',
  'Zapisz wynik — co zadziałało, ile czasu zaoszczędziłeś.',
  'Połącz to narzędzie z jednym innym ze swojego stacka (mini-workflow).',
  'Przetestuj ten sam prompt na drugim przypadku użycia.',
  'Udokumentuj szablon: zapisz prompt w „Zapisane prompty”.',
  'Podsumuj tydzień: co wdrożysz na stałe w następnym tygodniu?',
]

export function buildWeeklyPlan(stack) {
  if (!Array.isArray(stack) || stack.length === 0) return []

  return DAY_NAMES.map((day, index) => {
    const tool = stack[index % stack.length]
    return {
      id: `week-day-${index + 1}`,
      day,
      dayNumber: index + 1,
      toolName: tool.name,
      category: tool.category,
      focus: tool.value,
      action: DAY_ACTIONS[index],
      prompt: tool.prompt || '',
      url: tool.url || '',
    }
  })
}
