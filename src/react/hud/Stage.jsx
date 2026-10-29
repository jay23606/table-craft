// Stage: a centred scene card for moments the table alone doesn't explain — a fight (two cards face to face and the
// dice), an encounter (a character card and its lines), a vote. Driven by the view (`hud.stage`), so it stays as long
// as the game state says so and every player sees the same thing. Players can tuck it away; a new stage id brings it back.
import { useEffect, useState } from 'react';
import { CardCanvas } from './CardCanvas';
import { Icon } from './icons';
import { useStrings } from '../i18n';

const PIPS = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export default function Stage({ stage, world, onInspect }) {
  const S = useStrings();
  const [hidden, setHidden] = useState(null);
  useEffect(() => { if (stage?.id !== hidden) setHidden(null); }, [stage?.id]); // eslint-disable-line
  if (!stage) return null;
  if (hidden === stage.id) {
    return <button className="tc-stage-pill" onClick={() => setHidden(null)}><Icon name="up" size={14} /> {stage.title || S.stageShow}</button>;
  }
  const cards = (stage.cards || []).slice(0, 4);
  const h = cards.length <= 2 ? 230 : 180;
  const tone = stage.result?.tone || stage.tone || '';
  return (
    <div className={`tc-stage ${tone}`} style={{ '--ac': stage.accent || '#c8a24a' }}>
      <div className="tc-stage-h">
        <div className="tc-stage-title">
          <b>{stage.title}</b>
          {stage.subtitle && <span>{stage.subtitle}</span>}
        </div>
        <button className="tc-iconbtn" title={S.stageHide} onClick={() => setHidden(stage.id)}><Icon name="down" size={16} /></button>
      </div>
      {cards.length > 0 && (
        <div className="tc-stage-cards">
          {cards.map((c, i) => (
            <div key={`${c.id || i}`} className="tc-stage-slot">
              {i > 0 && stage.vs && <span className="tc-stage-vs">{stage.vs === true ? '⚔' : stage.vs}</span>}
              <figure>
                <CardCanvas world={world} item={{ id: c.id || `stage:${i}`, kind: 'card', size: c.size || 'poker', face: c.face, back: c.back, faceUp: c.faceUp !== false }}
                  height={h} onClick={() => onInspect({ id: c.id || `stage:${i}`, kind: 'card', size: c.size || 'poker', face: c.face, back: c.back, faceUp: c.faceUp !== false, caption: c.label })} title={S.enlarge} />
                {c.label && <figcaption>{c.label}</figcaption>}
              </figure>
            </div>
          ))}
        </div>
      )}
      {(stage.dice?.length > 0 || stage.total) && (
        <div className="tc-stage-dice">
          {(stage.dice || []).map((d, i) => {
            const v = typeof d === 'number' ? d : d.value;
            return <span key={i} className={`tc-stage-die ${d.dim ? 'dim' : ''}`} title={String(v)}>{v >= 1 && v <= 6 ? PIPS[v] : v}</span>;
          })}
          {stage.total && <span className="tc-stage-total">{stage.total}</span>}
        </div>
      )}
      {stage.lines?.length > 0 && <div className="tc-stage-lines">{stage.lines.map((l, i) => <p key={i} className={l.startsWith('“') || l.startsWith('"') ? 'q' : ''}>{l}</p>)}</div>}
      {stage.result && <div className={`tc-stage-result ${stage.result.tone || ''}`}>{stage.result.text}</div>}
    </div>
  );
}
