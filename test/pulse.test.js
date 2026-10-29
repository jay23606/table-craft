import test from 'node:test';
import assert from 'node:assert/strict';
import { heartbeat } from '../src/engine/pulse.js';

test('heartbeat: two beats then a rest, periodic and bounded', () => {
  const P = 1300;
  const at = (f) => heartbeat(f * P, P);
  assert.ok(at(0.08) > 0.95, 'first beat peaks');
  assert.ok(at(0.27) > 0.7 && at(0.27) < at(0.08), 'second beat is softer');
  assert.ok(at(0.175) < at(0.08) && at(0.175) < at(0.27), 'a dip between the beats');
  assert.ok(at(0.6) < 0.01 && at(0.9) < 0.01, 'rest after the beats');
  for (let ms = -2000; ms < 4000; ms += 37) {
    const k = heartbeat(ms, P);
    assert.ok(k >= 0 && k <= 1, `bounded at ${ms}`);
    assert.ok(Math.abs(k - heartbeat(ms + P, P)) < 1e-9, `periodic at ${ms}`);
  }
});
