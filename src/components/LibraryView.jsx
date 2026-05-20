import { ExternalLink } from 'lucide-react'

const libraryTools = [
  {
    name: 'ChatGPT',
    category: 'Asystent AI',
    description: 'Generowanie tekstu, analiza danych i burza mózgów z GPT-4o.',
    url: 'https://chatgpt.com',
  },
  {
    name: 'Claude',
    category: 'Asystent AI',
    description: 'Analiza długich dokumentów, kodowanie i precyzyjne instrukcje.',
    url: 'https://claude.ai',
  },
  {
    name: 'Gemini',
    category: 'Asystent AI',
    description: 'Integracja z Google Workspace, analiza obrazów i wyszukiwanie.',
    url: 'https://gemini.google.com',
  },
  {
    name: 'Perplexity',
    category: 'Research',
    description: 'Wyszukiwanie z cytowanymi źródłami i aktualną wiedzą w czasie rzeczywistym.',
    url: 'https://perplexity.ai',
  },
  {
    name: 'Midjourney',
    category: 'Grafika AI',
    description: 'Generowanie profesjonalnych ilustracji i grafik z opisów tekstowych.',
    url: 'https://midjourney.com',
  },
  {
    name: 'Adobe Firefly',
    category: 'Grafika AI',
    description: 'Generatywna edycja w narzędziach Adobe z bezpieczną licencją komercyjną.',
    url: 'https://firefly.adobe.com',
  },
  {
    name: 'Canva AI',
    category: 'Grafika',
    description: 'Szybkie projekty, posty, prezentacje i materiały marketingowe bez umiejętności graficznych.',
    url: 'https://canva.com',
  },
  {
    name: 'ElevenLabs',
    category: 'Audio AI',
    description: 'Realistyczna synteza głosu i klonowanie po polsku i angielsku.',
    url: 'https://elevenlabs.io',
  },
  {
    name: 'Runway Gen-3',
    category: 'Wideo AI',
    description: 'Generowanie i edycja wideo z opisów tekstowych lub zdjęć referencyjnych.',
    url: 'https://runwayml.com',
  },
  {
    name: 'CapCut AI',
    category: 'Wideo',
    description: 'Automatyczne napisy, montaż i krótkie rolki z materiałami backstage.',
    url: 'https://capcut.com',
  },
  {
    name: 'Notion AI',
    category: 'Produktywność',
    description: 'Bazy wiedzy, szablony procesów i automatyczne notatki ze spotkań.',
    url: 'https://notion.com',
  },
  {
    name: 'Make.com',
    category: 'Automatyzacja',
    description: 'Wizualne scenariusze łączące setki aplikacji bez pisania kodu.',
    url: 'https://make.com',
  },
  {
    name: 'Zapier',
    category: 'Automatyzacja',
    description: 'Automatyzacja przepływu danych między narzędziami SaaS.',
    url: 'https://zapier.com',
  },
  {
    name: 'Surfer SEO',
    category: 'SEO',
    description: 'Optymalizacja treści pod wyniki wyszukiwania Google z analizą słów kluczowych.',
    url: 'https://surferseo.com',
  },
  {
    name: 'Remove.bg',
    category: 'Edycja zdjęć',
    description: 'Usuwanie tła ze zdjęć w jednym kliknięciu — idealne do miniatur i ofert.',
    url: 'https://remove.bg',
  },
  {
    name: 'Metricool',
    category: 'Social media',
    description: 'Planowanie publikacji i analiza wyników postów w social mediach.',
    url: 'https://metricool.com',
  },
]

const categories = [...new Set(libraryTools.map((t) => t.category))]

export default function LibraryView() {
  return (
    <section className="view-panel">
      <h2>Biblioteka narzędzi AI</h2>
      <p className="library-intro">
        Przegląd popularnych narzędzi AI przydatnych w polskich realiach biznesowych.
        Kliknij, aby przejść do narzędzia.
      </p>

      {categories.map((cat) => (
        <div key={cat} className="library-category">
          <h3 className="library-cat-label">{cat}</h3>
          <div className="item-grid">
            {libraryTools
              .filter((t) => t.category === cat)
              .map((tool) => (
                <a
                  className="item-card library-card"
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>
                    {tool.name}
                    <ExternalLink size={13} />
                  </strong>
                  <p>{tool.description}</p>
                  <span>{tool.category}</span>
                </a>
              ))}
          </div>
        </div>
      ))}
    </section>
  )
}
