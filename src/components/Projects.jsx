import { Plus, Sparkles } from 'lucide-react'

export default function Projects({ projects, projectName, onSetProjectName, onAddProject, onCreateStack }) {
  return (
    <section className="view-panel">
      <div className="panel-heading">
        <div>
          <h2>Moje projekty</h2>
          <p>Twórz proste projekty, do których będziesz przypinać stacki i prompty.</p>
        </div>
      </div>
      <div className="inline-form">
        <input
          placeholder="Np. Kampania dla klienta, sesja wizerunkowa, lekcja z AI"
          value={projectName}
          onChange={(e) => onSetProjectName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddProject()}
        />
        <button type="button" onClick={onAddProject}>
          <Plus size={16} />
          Dodaj projekt
        </button>
      </div>
      <div className="item-grid">
        {projects.map((project) => (
          <article className="item-card project-card" key={project.id}>
            <strong>{project.name}</strong>
            <p>{project.profession}</p>
            <span>{project.status}</span>
            <button
              className="project-stack-btn"
              type="button"
              onClick={() => onCreateStack(project)}
            >
              <Sparkles size={15} />
              Utwórz stack
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
