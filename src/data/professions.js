import {
  BookOpen,
  BriefcaseBusiness,
  Camera,
  Copy,
  FileText,
  GraduationCap,
  Home,
  MessageSquareText,
  PenLine,
  Search,
  ShoppingCart,
  Sparkles,
  Target,
  UserRoundSearch,
  WandSparkles,
} from 'lucide-react'

export const CUSTOM_PROFESSION_ID = 'custom'

export const professions = [
  {
    id: 'fotograf',
    label: 'Fotograf',
    icon: Camera,
    goal: 'Oszczędność czasu i automatyzacja',
    defaults: ['Edycja zdjęć', 'Marketing i social media', 'Obsługa klienta'],
    tools: ['Lightroom', 'Photoshop', 'Canva', 'Google Drive', 'Instagram'],
    problem:
      'Szybsza selekcja zdjęć, opisy sesji, oferty dla klientów i gotowe posty po realizacji.',
  },
  {
    id: 'copywriter',
    label: 'Copywriter',
    icon: PenLine,
    goal: 'Lepsze briefy i szybsze warianty tekstów',
    defaults: ['Tworzenie treści', 'SEO', 'Analiza briefu'],
    tools: ['Google Docs', 'Notion', 'Surfer SEO', 'LinkedIn'],
    problem: 'Chcę szybciej przechodzić od briefu do gotowych wersji tekstu dla klienta.',
  },
  {
    id: 'sklep',
    label: 'Sklep / E-commerce',
    icon: ShoppingCart,
    goal: 'Opisy produktów i obsługa sprzedaży',
    defaults: ['Opisy produktów', 'Obsługa klienta', 'Kampanie'],
    tools: ['Shopify', 'WooCommerce', 'Baselinker', 'Allegro'],
    problem: 'Potrzebuję opisów, odpowiedzi do klientów i pomysłów na kampanie sezonowe.',
  },
  {
    id: 'nauczyciel',
    label: 'Nauczyciel',
    icon: BookOpen,
    goal: 'Materiały lekcyjne i indywidualizacja',
    defaults: ['Scenariusze lekcji', 'Quizy', 'Materiały dydaktyczne'],
    tools: ['Canva', 'Google Classroom', 'Teams', 'YouTube'],
    problem: 'Chcę tworzyć lepsze materiały i dostosowywać zadania do poziomu uczniów.',
  },
  {
    id: 'hr',
    label: 'HR / Rekruter',
    icon: UserRoundSearch,
    goal: 'Szybszy screening i komunikacja',
    defaults: ['Rekrutacja', 'Komunikacja', 'Onboarding'],
    tools: ['LinkedIn', 'ATS', 'Gmail', 'Google Sheets'],
    problem: 'Potrzebuję uporządkować kandydatów i pisać trafniejsze wiadomości.',
  },
  {
    id: CUSTOM_PROFESSION_ID,
    label: 'Inny zawód',
    icon: BriefcaseBusiness,
    goal: 'Automatyzacja i oszczędność czasu w mojej pracy',
    defaults: ['Tworzenie treści', 'Administracja', 'Obsługa klienta'],
    tools: [],
    problem: 'Chcę dopasować narzędzia AI do mojej specyficznej pracy i codziennych zadań.',
    isCustom: true,
  },
]

export const navItems = [
  ['dashboard', 'Mój dashboard', Home],
  ['stack', 'Mój stack AI', Sparkles],
  ['projects', 'Moje projekty', BriefcaseBusiness],
  ['history', 'Historia', FileText],
  ['prompts', 'Zapisane prompty', Copy],
  ['tools', 'Biblioteka narzędzi', BookOpen],
  ['training', 'Szkolenia', GraduationCap],
  ['inspiration', 'Inspiracje', WandSparkles],
]

export const areas = [
  'Edycja zdjęć',
  'Marketing i social media',
  'Obsługa klienta',
  'Administracja',
  'Tworzenie treści',
  'SEO',
  'Zarządzanie projektami',
  'Analiza briefu',
  'Quizy',
  'Scenariusze lekcji',
  'Materiały dydaktyczne',
  'Rekrutacja',
  'Komunikacja',
  'Onboarding',
  'Opisy produktów',
  'Kampanie',
]

export const fallbackStack = [
  {
    name: 'Gemini',
    category: 'Asystent',
    value: 'Pomysły na treści, opisy ofert i odpowiedzi do klientów.',
    prompt:
      'Jesteś praktycznym doradcą AI. Przygotuj 5 wariantów odpowiedzi do klienta, który pyta o cenę mojej usługi.',
    url: 'https://gemini.google.com/',
  },
  {
    name: 'Adobe Lightroom AI',
    category: 'Edycja zdjęć',
    value: 'Automatyczna selekcja, maski i pierwsze korekty zdjęć.',
    prompt: 'Stwórz checklistę ustawień Lightroom AI dla reportażu rodzinnego.',
    url: 'https://www.adobe.com/products/photoshop-lightroom.html',
  },
  {
    name: 'Canva AI',
    category: 'Grafika',
    value: 'Szybkie posty, relacje i prezentacje po sesji.',
    prompt: 'Zaproponuj 7 slajdów karuzeli Instagram po sesji wizerunkowej.',
    url: 'https://www.canva.com/ai/',
  },
  {
    name: 'Remove.bg',
    category: 'Edycja zdjęć',
    value: 'Usuwanie tła do miniatur, ofert i materiałów sprzedażowych.',
    prompt: 'Przygotuj instrukcję, kiedy używać usuwania tła w ofercie fotografa.',
    url: 'https://www.remove.bg/',
  },
  {
    name: 'Metricool',
    category: 'Social media',
    value: 'Plan publikacji i analiza wyników postów.',
    prompt: 'Ułóż tygodniowy plan postów dla fotografa ślubnego w Polsce.',
    url: 'https://metricool.com/',
  },
  {
    name: 'Google Drive AI',
    category: 'Produktywność',
    value: 'Porządkowanie plików, briefów i notatek z klientami.',
    prompt: 'Zaproponuj strukturę folderów dla sesji zdjęciowych i komunikacji z klientem.',
    url: 'https://workspace.google.com/',
  },
  {
    name: 'Notion AI',
    category: 'Organizacja',
    value: 'Briefy, checklisty sesji i baza pomysłów na publikacje.',
    prompt: 'Stwórz szablon notatki projektowej dla nowej sesji zdjęciowej.',
    url: 'https://www.notion.com/product/ai',
  },
  {
    name: 'CapCut AI',
    category: 'Wideo',
    value: 'Krótkie rolki z backstage, napisami i wariantami montażu.',
    prompt: 'Ułóż scenariusz 30-sekundowej rolki z backstage sesji biznesowej.',
    url: 'https://www.capcut.com/',
  },
  {
    name: 'Trello + AI',
    category: 'Zarządzanie',
    value: 'Lista zadań od zapytania klienta po oddanie galerii.',
    prompt: 'Rozpisz tablicę Trello dla procesu od zapytania do finalnego rezultatu.',
    url: 'https://trello.com/',
  },
  {
    name: 'Mailerlite AI',
    category: 'Newsletter',
    value: 'Sekwencje maili, oferty i przypomnienia dla stałych klientów.',
    prompt: 'Napisz 3-mailową sekwencję dla klienta po odebraniu galerii zdjęć.',
    url: 'https://www.mailerlite.com/',
  },
]

export const toolIcons = [
  MessageSquareText,
  Camera,
  WandSparkles,
  Search,
  FileText,
  Target,
]

export function getProfessionById(id) {
  return professions.find((item) => item.id === id) ?? professions[0]
}
