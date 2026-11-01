/** Empty side pane: a stack of skeleton cards shaped like what will appear here, a title and one line of help. */
export function EmptyPane({ kind, title, text }: { kind: 'takes' | 'transcripts'; title: string; text: string }) {
  return (
    <div className="empty-pane">
      <div className="empty-art" aria-hidden>
        <div className="empty-card is-back2" />
        <div className="empty-card is-back1" />
        <div className="empty-card">
          {kind === 'takes' ? (
            <div className="sk-row">
              <span className="sk-dot" />
              <span className="sk-wave">{WAVE.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</span>
              <span className="sk-line sk-time" />
            </div>
          ) : null}
          <span className="sk-line" style={{ width: '92%' }} />
          <span className="sk-line" style={{ width: '64%' }} />
          <div className="sk-meta"><span className="sk-line sk-pill" /><span className="sk-line sk-pill is-short" /></div>
        </div>
      </div>
      <p className="empty-title">{title}</p>
      <p className="empty-text">{text}</p>
    </div>
  )
}

const WAVE = [30, 55, 40, 75, 50, 90, 60, 40, 70, 45, 85, 55, 35, 65, 45, 30, 50, 25]
