// Heartbeat envelope for clickable objects: two quick beats ("lub-dub") and a rest, 0..1, one cycle per `period` ms.
// The frame never goes dark between beats (the caller adds a floor), so a playable card stays easy to follow.
export function heartbeat(ms, period = 1300) {
  const t = (((ms % period) + period) % period) / period;
  const beat = (c, w) => Math.exp(-(((t - c) / w) ** 2));
  return Math.min(1, beat(0.08, 0.055) + 0.75 * beat(0.27, 0.06));
}
