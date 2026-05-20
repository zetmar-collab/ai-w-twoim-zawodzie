export default function SimpleListView({ title, items }) {
  return (
    <section className="view-panel">
      <h2>{title}</h2>
      <div className="item-grid">
        {items.map((item) =>
          Array.isArray(item) ? (
            <article className="item-card" key={item[0]}>
              <strong>{item[0]}</strong>
              <span>{item[1]}</span>
              <p>{item[2]}</p>
            </article>
          ) : (
            <article className="item-card" key={item}>
              <strong>{item}</strong>
              <p>Gotowy pomysł do przetestowania w tym tygodniu.</p>
            </article>
          ),
        )}
      </div>
    </section>
  )
}
