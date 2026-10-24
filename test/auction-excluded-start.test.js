import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../src/server/index.js';

test('T.auction: numeric start skips an excluded bidder', () => {
  const auction = T.auction.create(['a', 'b', 'c'], { kind: 'once', exclude: ['b'], start: 1 });
  assert.equal(T.auction.turn(auction), 'c');
});
