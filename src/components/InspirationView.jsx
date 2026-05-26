import { useState } from 'react'
import { Check, Copy, Dices, Save, Sparkles, Zap } from 'lucide-react'

const INSPIRATIONS = [
  {
    id: 'audyt-czasu',
    category: 'Oszczędność czasu',
    title: 'Mini-audyt jednego procesu',
    challenge: 'Wybierz jedno powtarzalne zadanie z ostatniego tygodnia i opisz je AI krok po kroku. Poproś o konkretny plan automatyzacji.',
    prompt: 'Jestem [ZAWÓD]. Regularnie wykonuję to zadanie:\n[OPISZ ZADANIE — np. „odpowiadam na zapytania klientów przez e-mail, co zajmuje mi 1 h dziennie"]\n\nPrzeanalizuj ten proces i zaproponuj:\n1. 3 kroki, które mógłbym zastąpić AI od zaraz\n2. Gotowy szablon/prompt do każdego z nich\n3. Szacowany czas, który uda mi się zaoszczędzić tygodniowo',
    time: '10 min',
    difficulty: 'Łatwe',
  },
  {
    id: 'trzy-wersje-odpowiedzi',
    category: 'Komunikacja',
    title: '3 wersje odpowiedzi do klienta',
    challenge: 'Weź ostatnie trudne pytanie od klienta i poproś AI o 3 różne odpowiedzi: ciepłą, konkretną i premium. Wybierz najlepszą i zapisz jako szablon.',
    prompt: 'Klient zadał mi to pytanie: [WPISZ PYTANIE]\n\nJestem [ZAWÓD]. Przygotuj 3 wersje profesjonalnej odpowiedzi:\n1. Ciepła i empatyczna — buduje relację\n2. Konkretna i rzeczowa — daje szybką odpowiedź\n3. Premium — buduje wartość i zachęca do zakupu\n\nKażda wersja: maks. 5 zdań. Na końcu: która pasuje do jakiej sytuacji.',
    time: '5 min',
    difficulty: 'Łatwe',
  },
  {
    id: 'projekt-w-szablon',
    category: 'Automatyzacja',
    title: 'Zamień projekt w szablon',
    challenge: 'Opisz AI swój ostatni ukończony projekt. Poproś o gotowy szablon, który przyspieszy następny podobny projekt.',
    prompt: 'Właśnie ukończyłem projekt: [OPISZ PROJEKT — typ, zakres, kroki, co poszło dobrze i co sprawia trudność]\n\nJestem [ZAWÓD]. Na podstawie tego opisu:\n1. Stwórz szablon checklisty do użycia przy kolejnym podobnym projekcie\n2. Zaproponuj 3 etapy, które można zautomatyzować z AI\n3. Daj mi gotowy brief dla nowego klienta na podobne zlecenie',
    time: '15 min',
    difficulty: 'Łatwe',
  },
  {
    id: 'plan-tygodnia',
    category: 'Oszczędność czasu',
    title: 'Plan tygodnia z AI w 5 minut',
    challenge: 'Wpisz AI swoje cele i zadania na ten tydzień. Poproś o ustrukturyzowany plan z blokami czasu i priorytetami.',
    prompt: 'Moje zadania na ten tydzień: [WPISZ LISTĘ — np. 3 oferty dla klientów, 2 posty, spotkanie, faktura]\n\nJestem [ZAWÓD]. Ułóż mi plan tygodniowy:\n- Podziel zadania na: pilne/ważne/można delegować\n- Zaproponuj rozkład na dni tygodnia z blokami czasu\n- Wskaż, które zadania AI może mi pomóc wykonać szybciej i jak\n- Na końcu: jedno zadanie, od którego powinienem zacząć jutro rano',
    time: '5 min',
    difficulty: 'Łatwe',
  },
  {
    id: 'faq-klientow',
    category: 'Komunikacja',
    title: 'FAQ dla klientów',
    challenge: 'Zbuduj z AI bazę 10 najczęstszych pytań klientów z gotowymi odpowiedziami. Oszczędza czas przy każdym nowym zapytaniu.',
    prompt: 'Jestem [ZAWÓD]. Klienci często pytają mnie o: [WYPISZ 3-5 TEMATÓW — np. cena, czas realizacji, co wliczone w cenę]\n\nNa podstawie tego stwórz:\n1. Listę 10 najczęstszych pytań klientów w mojej branży\n2. Krótką, profesjonalną odpowiedź na każde pytanie (maks. 3 zdania)\n3. Format gotowy do wklejenia na stronę WWW lub do wiadomości autorespondera',
    time: '20 min',
    difficulty: 'Średnie',
  },
  {
    id: 'bio-zawodowe',
    category: 'Kreacja',
    title: '3 wersje bio zawodowego',
    challenge: 'Poproś AI o 3 wersje Twojego opisu: krótki na LinkedIn, dłuższy na stronę i ustny na networking. Wszystkie gotowe do użycia.',
    prompt: 'Jestem [ZAWÓD]. Oto moje doświadczenie: [OPISZ — lata praktyki, specjalizacja, co wyróżnia, sukcesy]\n\nPrzygotuj 3 wersje mojego bio zawodowego:\n1. LinkedIn (maks. 3 zdania, pod nagłówek)\n2. Strona „O mnie" (150-200 słów, buduje zaufanie)\n3. Przedstawienie ustne na networking (30 sekund, kończy się pytaniem)\n\nTon: profesjonalny, ale ludzki. Po polsku.',
    time: '15 min',
    difficulty: 'Łatwe',
  },
  {
    id: 'analiza-konkurencji',
    category: 'Analiza',
    title: 'Analiza mocnych stron konkurenta',
    challenge: 'Opisz AI swojego głównego konkurenta. Poproś o analizę ich strategii i 3 rzeczy, które możesz zrobić lepiej.',
    prompt: 'Mój główny konkurent to: [NAZWA/OPIS — typ firmy, co oferuje, jak się prezentuje, skąd klienci]\n\nJestem [ZAWÓD]. Przeanalizuj ich strategię i powiedz mi:\n1. Co robią dobrze — czego mogę się nauczyć\n2. Gdzie mają luki — co mogę robić lepiej\n3. 3 konkretne działania, które mogę podjąć w tym miesiącu, żeby wyróżnić się na tle konkurencji\n\nBądź szczery i konkretny — nie ogólniki.',
    time: '20 min',
    difficulty: 'Średnie',
  },
  {
    id: 'skrypt-rolka',
    category: 'Kreacja',
    title: 'Skrypt 30-sekundowej rolki',
    challenge: 'Napisz z AI skrypt krótkiego wideo pokazującego Twoją pracę. Gotowy do nagrania tego samego dnia.',
    prompt: 'Jestem [ZAWÓD]. Chcę nagrać 30-sekundową rolkę na Instagram/TikTok na temat: [TEMAT — np. „jak pracuję", „mój proces", „zanim/po", „szybka porada"]\n\nNapisz skrypt:\n- Ujęcie 1 (0-5 sek.): hak — pierwsze zdanie, które zatrzymuje scrollowanie\n- Ujęcia 2-4 (5-25 sek.): wartość — 3 szybkie punkty\n- Ujęcie 5 (25-30 sek.): CTA — co widz ma zrobić\n\nDla każdego ujęcia: co widać w kadrze, co mówię/tekst na ekranie.',
    time: '15 min',
    difficulty: 'Średnie',
  },
  {
    id: 'system-followup',
    category: 'Automatyzacja',
    title: 'System follow-up do klientów',
    challenge: 'Zaprojektuj z AI sekwencję 3 wiadomości follow-up. Od pierwszego kontaktu do zamknięcia sprzedaży — nigdy więcej zapomnianego klienta.',
    prompt: 'Jestem [ZAWÓD]. Klienci często pytają o ofertę, ale nie odpowiadają dalej.\n\nZaprojektuj dla mnie sekwencję 3 wiadomości follow-up:\n1. Wiadomość 1 (po 2 dniach od wysłania oferty): przypomnienie z wartością\n2. Wiadomość 2 (po 5 dniach): inne ujęcie, pytanie o wątpliwości\n3. Wiadomość 3 (po 10 dniach): ostatnie zaproszenie, bez presji\n\nKażda wiadomość: maks. 5 zdań. Ton: profesjonalny, nie natrętny. Gotowe do wklejenia w e-mail lub WhatsApp.',
    time: '25 min',
    difficulty: 'Wyzwanie',
  },
  {
    id: 'trudne-pytania',
    category: 'Komunikacja',
    title: 'Przygotowanie na trudne pytania',
    challenge: 'Poproś AI o 5 najtrudniejszych pytań, jakie możesz dostać od klienta. Przygotuj gotowe, pewne odpowiedzi zanim one padną.',
    prompt: 'Jestem [ZAWÓD]. Moja oferta/usługa: [KRÓTKI OPIS]\n\nPrzygotuj mnie na trudne sytuacje:\n1. Podaj 5 najtrudniejszych pytań lub obiekcji, które klienci mogą zadać\n2. Do każdego: gotowa, pewna odpowiedź (maks. 3 zdania)\n3. Dla 2 najczęstszych obiekcji: alternatywna wersja odpowiedzi, jeśli pierwsza nie zadziała\n\nCel: chcę być gotowy i spokojny na każdą rozmowę sprzedażową.',
    time: '15 min',
    difficulty: 'Średnie',
  },
  {
    id: 'analiza-tekstu',
    category: 'Analiza',
    title: 'AI oceni Twój tekst lub ofertę',
    challenge: 'Wklej swój opis usługi, post lub e-mail. Poproś AI o szczerą ocenę i konkretne poprawki — bez owijania w bawełnę.',
    prompt: 'Przeanalizuj mój tekst i oceń go szczerze:\n\n[WKLEJ SWÓJ TEKST]\n\nJestem [ZAWÓD]. Oceń ten tekst pod kątem:\n1. Jasność — czy odbiorca od razu rozumie, co oferuję?\n2. Wartość — czy widać korzyści dla klienta?\n3. CTA — czy jest jasne, co zrobić dalej?\n4. Ton — czy pasuje do mojej branży?\n\nNa końcu: przepisana, lepsza wersja gotowa do użycia.',
    time: '10 min',
    difficulty: 'Łatwe',
  },
  {
    id: '12-pomyslow',
    category: 'Kreacja',
    title: '12 pomysłów na treści na rok',
    challenge: 'Wygeneruj z AI roczny plan treści w 20 minut. Jeden pomysł na miesiąc — nigdy więcej blokady twórczej.',
    prompt: 'Jestem [ZAWÓD]. Chcę regularnie publikować treści w social mediach i/lub blogu.\n\nStwórz plan na 12 miesięcy:\n- Jeden główny temat/format na każdy miesiąc\n- Nawiąż do sezonowości (Boże Narodzenie, lato, nowy rok itp.)\n- Mix formatów: porada, historia, kulisy, FAQ, case study\n\nFormat: tabela z kolumnami: miesiąc, temat, format, główna wartość dla odbiorcy.',
    time: '20 min',
    difficulty: 'Średnie',
  },
  {
    id: 'optymalizacja-cennika',
    category: 'Sprzedaż',
    title: 'Analiza i optymalizacja oferty',
    challenge: 'Opisz AI swoją obecną ofertę i poproś o analizę: co jest za tanie, co brakuje, jak ustrukturyzować pakiety.',
    prompt: 'Moja obecna oferta: [OPISZ USŁUGI I CENY]\nMoi typowi klienci: [KTO KUPUJE]\nŚrednia wartość zlecenia: [KWOTA]\n\nJestem [ZAWÓD]. Przeanalizuj moją ofertę i podpowiedz:\n1. Co prawdopodobnie wyceniam za nisko i dlaczego\n2. Jak ustrukturyzować 3 pakiety (podstawowy / standardowy / premium)\n3. Co dodać do oferty premium, żeby podnieść wartość bez dużo więcej pracy\n4. Jedna zmiana, którą mogę wprowadzić już w tym tygodniu',
    time: '30 min',
    difficulty: 'Wyzwanie',
  },
  {
    id: 'skrypt-sprzedazowy',
    category: 'Sprzedaż',
    title: 'Skrypt rozmowy z klientem',
    challenge: 'Zbuduj z AI kompletny skrypt rozmowy sprzedażowej: od przywitania do zamknięcia. Ćwicz i modyfikuj do własnych potrzeb.',
    prompt: 'Jestem [ZAWÓD]. Prowadzę rozmowy z potencjalnymi klientami przez telefon/wideo.\n\nNapisz mi skrypt rozmowy sprzedażowej:\n1. Otwarcie — przywitanie i cel rozmowy (30 sek.)\n2. Diagnoza — 3-4 pytania, które odkryją problem klienta\n3. Prezentacja — jak przedstawić moją ofertę językiem korzyści\n4. Obiekcje — 3 najczęstsze i gotowe odpowiedzi\n5. Zamknięcie — jak naturalnie zaproponować kolejny krok\n\nForma: gotowy do użycia, z zaznaczonym miejscem na adaptację.',
    time: '25 min',
    difficulty: 'Wyzwanie',
  },
  {
    id: 'newsletter',
    category: 'Kreacja',
    title: 'Pierwszy newsletter z AI',
    challenge: 'Napisz z AI pierwszy lub kolejny newsletter w mniej niż 20 minut. Temat, struktura i treść — gotowe do wysłania.',
    prompt: 'Jestem [ZAWÓD]. Chcę wysłać newsletter do moich subskrybentów.\n\nTemat tego wydania: [WPISZ TEMAT — np. trendy w mojej branży, mój case study, porada]\nGrupa docelowa: [KTO JEST NA LIŚCIE]\nCel: [np. zbudować relację / sprzedać produkt / dać wartość]\n\nNapisz gotowy newsletter:\n- Temat wiadomości (email subject): 3 propozycje\n- Wstęp: 2-3 zdania przyciągające uwagę\n- Główna treść: 200-250 słów, konkretna wartość\n- CTA: jedno, jasne wezwanie do działania',
    time: '20 min',
    difficulty: 'Średnie',
  },
  {
    id: 'analiza-czasu',
    category: 'Analiza',
    title: 'Audyt czasu pracy z AI',
    challenge: 'Zapisz przez 2 dni co robisz co godzinę, potem wklej do AI. Dowiedz się, gdzie tracisz czas i co możesz zmienić.',
    prompt: 'Mój typowy dzień pracy wygląda tak:\n[WPISZ: lista zadań z przybliżonym czasem, np. „9:00 odpisywanie na maile — 45 min, 10:00 praca nad projektem — 2h, 12:00 spotkanie — 1h"]\n\nJestem [ZAWÓD]. Przeanalizuj mój dzień i powiedz mi:\n1. Gdzie tracę czas na zadania o niskiej wartości\n2. Co mogę skrócić o połowę używając AI (z konkretnym narzędziem i promptem)\n3. Jak przeorganizować dzień, żeby mieć minimum 1 h nieprzerwanej pracy twórczej\n4. Jedno zadanie, które mogę całkowicie usunąć z mojej listy',
    time: '15 min',
    difficulty: 'Łatwe',
  },
  {
    id: 'plan-sezonowy',
    category: 'Sprzedaż',
    title: 'Plan kampanii sezonowej',
    challenge: 'Nadchodzi ważny sezon (święta, lato, nowy rok). Zaplanuj z AI kampanię w 30 minut — zanim konkurencja zdąży się obudzić.',
    prompt: 'Jestem [ZAWÓD]. Zbliża się sezon: [JAKI SEZON — np. Boże Narodzenie, wakacje, powrót do szkoły, nowy rok]\n\nStwórz mi plan kampanii sezonowej:\n1. Okazja do promowania — co mogę zaoferować w tym czasie\n2. Harmonogram działań — 4 tygodnie przed sezonem: co robić każdy tydzień\n3. 3 posty do social mediów — temat i główny przekaz każdego\n4. Jeden e-mail do bazy klientów — gotowy do wysłania\n5. Propozycja oferty sezonowej lub pakietu specjalnego',
    time: '30 min',
    difficulty: 'Wyzwanie',
  },
  {
    id: 'checklista-procesu',
    category: 'Automatyzacja',
    title: 'Checklista procesu z AI',
    challenge: 'Opisz AI swój typowy proces pracy od A do Z. Dostaniesz gotową checklistę, którą użyjesz przy każdym projekcie.',
    prompt: 'Mój typowy proces pracy wygląda mniej więcej tak:\n[OPISZ KROKI — od pierwszego kontaktu z klientem do dostarczenia efektu]\n\nJestem [ZAWÓD]. Na podstawie tego opisu:\n1. Stwórz checklistę 15-20 kroków z podziałem na fazy (przed/w trakcie/po)\n2. Zaznacz, przy których krokach AI może mi pomóc i jak\n3. Dodaj kolumnę "gotowy do użycia prompt" dla 3 kluczowych kroków\n\nFormat: gotowy do wklejenia do Notion lub wydruku.',
    time: '20 min',
    difficulty: 'Średnie',
  },
]

const CATEGORIES = ['Wszystkie', 'Oszczędność czasu', 'Komunikacja', 'Kreacja', 'Automatyzacja', 'Analiza', 'Sprzedaż']

const DIFFICULTY_COLOR = {
  'Łatwe': 'diff-easy',
  'Średnie': 'diff-mid',
  'Wyzwanie': 'diff-hard',
}

function getDailyFeaturedIndex() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return dayOfYear % INSPIRATIONS.length
}

export default function InspirationView({ profession, onSavePrompt }) {
  const [filter, setFilter] = useState('Wszystkie')
  const [done, setDone] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem('inspiration_done') || '{}') }
    catch { return {} }
  })
  const [featuredIndex, setFeaturedIndex] = useState(getDailyFeaturedIndex)
  const [copied, setCopied] = useState(null)
  const [expanded, setExpanded] = useState(null)

  function personalise(text) {
    return text.replace(/\[ZAWÓD\]/g, profession)
  }

  function markDone(id) {
    const updated = { ...done, [id]: !done[id] }
    setDone(updated)
    window.localStorage.setItem('inspiration_done', JSON.stringify(updated))
  }

  function copyPrompt(id, prompt) {
    navigator.clipboard?.writeText(personalise(prompt))
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  function shuffleFeatured() {
    setFeaturedIndex((i) => (i + 1) % INSPIRATIONS.length)
  }

  const filtered = filter === 'Wszystkie'
    ? INSPIRATIONS
    : INSPIRATIONS.filter((item) => item.category === filter)

  const featured = INSPIRATIONS[featuredIndex]
  const doneCount = Object.values(done).filter(Boolean).length

  return (
    <section className="view-panel">
      {/* ── Nagłówek ── */}
      <div className="insp-header">
        <div>
          <h2>Inspiracje</h2>
          <p>
            {doneCount > 0
              ? `${doneCount} z ${INSPIRATIONS.length} wyzwań wykonanych · `
              : ''}
            Wybierz wyzwanie i wypróbuj prompt z AI
          </p>
        </div>
      </div>

      {/* ── Wyzwanie tygodnia ── */}
      <div className="insp-featured">
        <div className="insp-featured-label">
          <Sparkles size={14} />
          Wyzwanie dnia
        </div>
        <div className="insp-featured-body">
          <div className="insp-featured-content">
            <div className="insp-card-meta">
              <span className="insp-category">{featured.category}</span>
              <span className={`insp-difficulty ${DIFFICULTY_COLOR[featured.difficulty]}`}>{featured.difficulty}</span>
              <span className="insp-time">⏱ {featured.time}</span>
            </div>
            <h3>{featured.title}</h3>
            <p>{featured.challenge}</p>
          </div>
          <div className="insp-featured-actions">
            <button
              type="button"
              className="insp-btn-primary"
              onClick={() => setExpanded(expanded === featured.id ? null : featured.id)}
            >
              <Zap size={15} />
              {expanded === featured.id ? 'Ukryj prompt' : 'Pokaż prompt'}
            </button>
            <button type="button" className="insp-btn-ghost" onClick={shuffleFeatured} title="Inne wyzwanie">
              <Dices size={15} />
              Losuj inne
            </button>
            <button
              type="button"
              className={`insp-btn-done ${done[featured.id] ? 'is-done' : ''}`}
              onClick={() => markDone(featured.id)}
            >
              <Check size={15} />
              {done[featured.id] ? 'Zrobione!' : 'Oznacz jako zrobione'}
            </button>
          </div>
        </div>
        {expanded === featured.id && (
          <div className="insp-prompt-box">
            <p className="insp-prompt-label"><Sparkles size={12} /> Prompt — wklej do Gemini lub ChatGPT</p>
            <pre className="insp-prompt-text">{personalise(featured.prompt)}</pre>
            <div className="insp-prompt-btns">
              <button type="button" className="insp-copy-btn" onClick={() => copyPrompt(featured.id, featured.prompt)}>
                <Copy size={14} />
                {copied === featured.id ? 'Skopiowano!' : 'Kopiuj prompt'}
              </button>
              <button
                type="button"
                className="insp-save-btn"
                onClick={() => onSavePrompt({ name: featured.title, category: featured.category, prompt: personalise(featured.prompt) })}
              >
                <Save size={14} />
                Zapisz w promptach
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Filtry kategorii ── */}
      <div className="insp-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`insp-filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Siatka kart ── */}
      <div className="insp-grid">
        {filtered.map((item) => {
          const isDone = done[item.id]
          const isExpanded = expanded === item.id

          return (
            <article key={item.id} className={`insp-card ${isDone ? 'insp-card-done' : ''}`}>
              <div className="insp-card-meta">
                <span className="insp-category">{item.category}</span>
                <span className={`insp-difficulty ${DIFFICULTY_COLOR[item.difficulty]}`}>{item.difficulty}</span>
                <span className="insp-time">⏱ {item.time}</span>
              </div>

              <h3 className="insp-card-title">
                {isDone && <Check size={15} className="insp-done-icon" />}
                {item.title}
              </h3>
              <p className="insp-card-desc">{item.challenge}</p>

              <div className="insp-card-actions">
                <button
                  type="button"
                  className="insp-card-btn-primary"
                  onClick={() => setExpanded(isExpanded ? null : item.id)}
                >
                  <Zap size={13} />
                  {isExpanded ? 'Ukryj prompt' : 'Wypróbuj'}
                </button>
                <button
                  type="button"
                  className={`insp-card-btn-done ${isDone ? 'is-done' : ''}`}
                  onClick={() => markDone(item.id)}
                  title={isDone ? 'Kliknij by odznaczyć' : 'Oznacz jako zrobione'}
                >
                  <Check size={13} />
                  {isDone ? 'Zrobione' : 'Zrobione?'}
                </button>
              </div>

              {isExpanded && (
                <div className="insp-prompt-box insp-prompt-inline">
                  <pre className="insp-prompt-text">{personalise(item.prompt)}</pre>
                  <div className="insp-prompt-btns">
                    <button type="button" className="insp-copy-btn" onClick={() => copyPrompt(item.id, item.prompt)}>
                      <Copy size={13} />
                      {copied === item.id ? 'Skopiowano!' : 'Kopiuj'}
                    </button>
                    <button
                      type="button"
                      className="insp-save-btn"
                      onClick={() => onSavePrompt({ name: item.title, category: item.category, prompt: personalise(item.prompt) })}
                    >
                      <Save size={13} />
                      Zapisz
                    </button>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
