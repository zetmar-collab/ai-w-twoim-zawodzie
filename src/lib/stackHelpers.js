export function getToolLessons(tool) {
  const promptSnippet = (tool.prompt || '').slice(0, 90) + ((tool.prompt || '').length > 90 ? '…' : '')
  return [
    {
      id: tool.name + '-0',
      title: 'Pierwsze kroki z ' + tool.name,
      duration: '10 min',
      desc: 'Poznaj interfejs i możliwości narzędzia. ' + tool.value,
      task: 'Otwórz narzędzie i przetestuj gotowy prompt: „' + promptSnippet + '"',
      url: tool.url || '#',
      level: 'Podstawowy',
    },
    {
      id: tool.name + '-1',
      title: tool.name + ' w codziennej pracy',
      duration: '15 min',
      desc: 'Wdróż ' + tool.name + ' do realnych zadań. Kategoria: ' + tool.category + '. ' + tool.value,
      task: 'Dostosuj gotowy prompt do konkretnego zadania z bieżącego tygodnia i zapisz efekt.',
      url: tool.url || '#',
      level: 'Średni',
    },
    {
      id: tool.name + '-2',
      title: 'Workflow z ' + tool.name + ' — oszczędność czasu',
      duration: '20 min',
      desc: 'Połącz ' + tool.name + ' z innymi narzędziami ze swojego stacka i zbuduj mini-automatyzację.',
      task: 'Zapisz 3 przypadki, w których ' + tool.name + ' zastępuje Twoją manualną pracę.',
      url: tool.url || '#',
      level: 'Zaawansowany',
    },
  ]
}

export function getStackInspirations(stack) {
  const result = []
  stack.forEach(function (tool) {
    result.push({
      id: tool.name + '-quick',
      type: 'quick',
      typeLabel: 'Szybki test',
      time: '5 min',
      title: 'Przetestuj ' + tool.name + ' dziś',
      desc: 'Wybierz jedno realne zadanie z dziś i wykonaj je za pomocą ' + tool.name + '. ' + tool.value,
      prompt: tool.prompt,
      tool: tool.name,
      url: tool.url || '#',
    })
    result.push({
      id: tool.name + '-workflow',
      type: 'workflow',
      typeLabel: 'Workflow',
      time: '30 min',
      title: 'Mini-automatyzacja z ' + tool.name,
      desc:
        'Zidentyfikuj jeden powtarzalny proces i zautomatyzuj go za pomocą ' +
        tool.name +
        '. Kategoria: ' +
        tool.category +
        '.',
      prompt:
        'Opisz krok po kroku jak ' +
        tool.name +
        ' może zastąpić moją ręczną pracę przy: [wpisz zadanie]. Daj gotowy przepływ pracy.',
      tool: tool.name,
      url: tool.url || '#',
    })
    result.push({
      id: tool.name + '-idea',
      type: 'idea',
      typeLabel: 'Pomysł',
      time: '15 min',
      title: tool.name + ' — nowe zastosowanie',
      desc:
        'Wymyśl nieoczywiste zastosowanie ' +
        tool.name +
        ' w kategorii ' +
        tool.category +
        '. Co możesz zrobić inaczej niż dotychczas?',
      prompt:
        'Podaj 5 nieoczywistych sposobów użycia ' +
        tool.name +
        ' dla kogoś w mojej pracy. Skup się na oszczędności czasu i energii.',
      tool: tool.name,
      url: tool.url || '#',
    })
  })
  return result
}

export function seededShuffle(arr, seed) {
  const result = arr.slice()
  let s = seed >>> 0
  for (let i = result.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    const j = s % (i + 1)
    const tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }
  return result
}
