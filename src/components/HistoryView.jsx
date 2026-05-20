export default function HistoryView({ history }) {
  return (
    <section className="view-panel">
      <h2>Historia generowania</h2>
      <div className="list-panel">
        {history.length ? (
          history.map((item) => (
            <article className="history-row" key={item.id}>
              <div>
                <strong>{item.profession}</strong>
                <p>{item.goal}</p>
              </div>
              <span>{item.count} narzędzi</span>
              <small>{item.date}</small>
            </article>
          ))
        ) : (
          <p>Nie ma jeszcze historii. Wygeneruj pierwszy stack z dashboardu.</p>
        )}
      </div>
    </section>
  )
}
