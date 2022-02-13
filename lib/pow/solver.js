'use strict';

// NOTE: We want `require('proof-of-work/lib/pow/solver')` for browser code
const utils = require('./utils');

const MIN_NONCE_SIZE = 8;
const NONCE_SIZE = MIN_NONCE_SIZE + 8;

function Solver() {
}
module.exports = Solver;

Solver.prototype._genNonce = function _genNonce(buf, timestamp) {
  let off = utils.writeTimestamp(buf, timestamp, 0);
  const words = off + (((buf.length - off) / 4) | 0) * 4;

  // Fast writes
  for (; off < words; off += 4)
    utils.writeUInt32(buf, (Math.random() * 0x100000000) >>> 0, off);

  // Slower writes
  for (; off < buf.length; off++)
    buf[off] = (Math.random() * 0x100) >>> 0;
};

Solver.prototype.solve = function solve(complexity, prefix, opts) {
  const start = Date.now();

  if (opts == null) {
    opts = {};
  }

  // 64 bits of entropy should be enough for each millisecond to avoid
  // collisions
  const nonce = utils.allocBuffer(NONCE_SIZE);

  for (;;) {
    let timestamp;
    if (opts.timestamp) {
      timestamp = opts.timestamp;// + (Date.now() - start);
    } else {
      timestamp = Date.now();
    }

    this._genNonce(nonce, timestamp);

    const hash = utils.hash(nonce, prefix);

    if (utils.checkComplexity(hash, complexity))
      return nonce;
  }
};
