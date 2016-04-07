'use strict';

require('../common');
const assert = require('assert');

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4]);

assert.strictEqual(buf, buf.swap16());
assert.deepStrictEqual(buf, Buffer.from([0x2, 0x1, 0x4, 0x3]));

assert.strictEqual(buf, buf.swap32());
assert.deepStrictEqual(buf, Buffer.from([0x3, 0x4, 0x1, 0x2]));

const buf_array = [];
for (var i = 1; i < 33; i++)
  buf_array.push(i);
const buf2 = Buffer.from(buf_array);
buf2.swap32();
assert.deepStrictEqual(buf2,
    Buffer.from([0x04, 0x03, 0x02, 0x01, 0x08, 0x07, 0x06, 0x05, 0x0c,
                 0x0b, 0x0a, 0x09, 0x10, 0x0f, 0x0e, 0x0d, 0x14, 0x13,
                 0x12, 0x11, 0x18, 0x17, 0x16, 0x15, 0x1c, 0x1b, 0x1a,
                 0x19, 0x20, 0x1f, 0x1e, 0x1d]));
buf2.swap16();
assert.deepStrictEqual(buf2,
    Buffer.from([0x03, 0x04, 0x01, 0x02, 0x07, 0x08, 0x05, 0x06, 0x0b,
                 0x0c, 0x09, 0x0a, 0x0f, 0x10, 0x0d, 0x0e, 0x13, 0x14,
                 0x11, 0x12, 0x17, 0x18, 0x15, 0x16, 0x1b, 0x1c, 0x19,
                 0x1a, 0x1f, 0x20, 0x1d, 0x1e]));

const buf3 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7]);
buf3.slice(1, 5).swap32();
assert.deepStrictEqual(buf3, Buffer.from([0x1, 0x5, 0x4, 0x3, 0x2, 0x6, 0x7]));

buf3.slice(1, 5).swap16();
assert.deepStrictEqual(buf3, Buffer.from([0x1, 0x4, 0x5, 0x2, 0x3, 0x6, 0x7]));

// Force use of native code (Buffer size above threshold limit for js impl)
const buf4 = Buffer.allocUnsafe(1024).fill([0x1, 0x2, 0x3, 0x4]);
const buf5 = Buffer.allocUnsafe(1024).fill([0x2, 0x1, 0x4, 0x3]);
const buf6 = Buffer.allocUnsafe(1024)
                   .fill([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);
const buf7 = Buffer.allocUnsafe(1024)
                   .fill([0x4, 0x3, 0x2, 0x1, 0x8, 0x7, 0x6, 0x5]);

buf4.swap16();
assert.deepStrictEqual(buf4, buf5);

buf6.swap32();
assert.deepStrictEqual(buf6, buf7);


const re16 = /Buffer size must be a multiple of 16-bits/;
const re32 = /Buffer size must be a multiple of 32-bits/;

assert.throws(() => Buffer.from(buf3).swap16(), re16);
assert.throws(() => Buffer.alloc(1025).swap16(), re16);
assert.throws(() => Buffer.from(buf3).swap32(), re32);
assert.throws(() => buf3.slice(1, 3).swap32(), re32);
assert.throws(() => Buffer.alloc(1025).swap32(), re32);