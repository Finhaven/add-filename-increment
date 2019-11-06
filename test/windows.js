'use strict';

require('mocha');
const path = require('path');
const assert = require('assert').strict;
const increment = require('..');
const posix = str => str.replace(/\\/g, '/');

describe('windows - options.fs', () => {
  const inc = (fp, opts) => {
    return posix(increment(fixtures(fp), { ...opts, fs: true, platform: 'windows' }));
  };

  const fixtures = (...args) => {
    return posix(path.join(__dirname, 'fixtures', ...args));
  };

  it('should not increment the filename when it does not exist', () => {
    assert.equal(inc('baz.txt'), fixtures('baz.txt'));
  });

  it('should increment the filename when it exists already', () => {
    assert.equal(inc('bar.txt'), fixtures('bar (2).txt'));
    assert.equal(inc('sub/foo.txt'), fixtures('sub/foo (2).txt'));
    assert.equal(inc('sub/nested/foo.txt'), fixtures('sub/nested/foo (2).txt'));
  });

  it('should strip existing raw numbers and increments before updating increment', () => {
    let opts = { strip: true, removeRawNumbers: true };
    assert.equal(inc('foo.txt', opts), fixtures('foo (3).txt'));
    assert.equal(inc('foo 2.txt', opts), fixtures('foo (3).txt'));
    assert.equal(inc('foo copy.txt', opts), fixtures('foo (3).txt'));
    assert.equal(inc('qux 2.txt', opts), fixtures('qux (3).txt'));
    assert.equal(inc('abc (2) - Copy.txt', opts), fixtures('abc (2).txt'));
    assert.equal(inc('abc (2) - Copy Copy.txt', opts), fixtures('abc (2).txt'));
    assert.equal(inc('sub/nested/foo copy.txt', opts), fixtures('sub/nested/foo (2).txt'));
    assert.equal(inc('sub/nested/foo copy 2.txt', opts), fixtures('sub/nested/foo (2).txt'));
  });

  it('should strip existing increments before updating increment', () => {
    let opts = { strip: true };
    assert.equal(inc('foo.txt', opts), fixtures('foo (3).txt'));
    assert.equal(inc('foo 2.txt', opts), fixtures('foo 2 (2).txt'));
    assert.equal(inc('foo copy.txt', opts), fixtures('foo (3).txt'));
    assert.equal(inc('qux 2.txt', opts), fixtures('qux 2 (2).txt'));
    assert.equal(inc('abc (2) - Copy.txt', opts), fixtures('abc (2).txt'));
    assert.equal(inc('abc (2) - Copy Copy.txt', opts), fixtures('abc (2).txt'));
    assert.equal(inc('sub/nested/foo copy.txt', opts), fixtures('sub/nested/foo (2).txt'));
    assert.equal(inc('sub/nested/foo copy 2.txt', opts), fixtures('sub/nested/foo (2).txt'));
  });

  it('should start at the given number, or the next number that does not exist', () => {
    assert.equal(inc('foo.txt', { start: 1 }), fixtures('foo (3).txt'));
    assert.equal(inc('foo.txt', { start: 2 }), fixtures('foo (3).txt'));
    assert.equal(inc('foo.txt', { start: 3 }), fixtures('foo (3).txt'));
    assert.equal(inc('foo.txt', { start: 4 }), fixtures('foo (4).txt'));
    assert.equal(inc('foo.txt', { start: 5 }), fixtures('foo (5).txt'));
    assert.equal(inc('foo.txt', { start: 6 }), fixtures('foo (6).txt'));
    assert.equal(inc('foo.txt', { start: 7 }), fixtures('foo (7).txt'));
    assert.equal(inc('foo.txt', { start: 101 }), fixtures('foo (101).txt'));
    assert.equal(inc('foo.txt', { start: 102 }), fixtures('foo (102).txt'));
  });

  it('should not strip increments when disabled', () => {
    let opts = { stripIncrement: false };
    assert.equal(inc('foo.txt', opts), fixtures('foo (3).txt'));
    assert.equal(inc('foo 2.txt', opts), fixtures('foo 2 (2).txt'));
    assert.equal(inc('foo copy.txt', opts), fixtures('foo copy (2).txt'));
  });

  it('should use a custom function to increment the file name', () => {
    let opts = {
      increment(stem, n) {
        return stem.replace(/\s\d+$/, '') + ' copy ' + (n + 1);
      }
    };

    assert.equal(inc('foo.txt', opts), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo 2.txt', opts), fixtures('foo copy 7.txt'));
    assert.equal(inc('foo copy.txt', opts), fixtures('foo copy copy 2.txt'));
  });
});

describe('windows - options.files', () => {
  const inc = (filename, opts) => {
    //return posix(increment(fixtures(fp), { ...opts, fs: true, platform: 'windows' }));
    return increment(filename, {
      ...opts,
      platform: 'windows',
      // This is a list of files in the fixtures directory.
      // I didn't do anything in subdirectories, because that's not
      // relevant for our use case.
      files: [
        'abc (2) - Copy - Copy.txt',
        'abc (2) - Copy.txt',
        'abc.txt',
        'bar.txt',
        'foo (2).txt',
        'foo 2 2.txt',
        'foo 2.txt',
        'foo 22.txt',
        'foo 3 copy.txt',
        'foo copy 2.txt',
        'foo copy 3.txt',
        'foo copy 4.txt',
        'foo copy 5.txt',
        'foo copy 6.txt',
        'foo copy.txt',
        'foo.txt',
        'one (copy).txt',
        'one.txt',
        'qux (2).txt',
        'qux 2.txt',
        'qux.txt',
      ]
    })
  };

  it('should not increment the filename when it does not exist', () => {
    assert.equal(inc('baz.txt'), 'baz.txt');
  });

  it('should increment the filename when it exists already', () => {
    assert.equal(inc('bar.txt'), 'bar (2).txt');
  });

  it('should strip existing raw numbers and increments before updating increment', () => {
    let opts = { strip: true, removeRawNumbers: true };
    assert.equal(inc('foo.txt', opts), 'foo (3).txt');
    assert.equal(inc('foo 2.txt', opts), 'foo (3).txt');
    assert.equal(inc('foo copy.txt', opts), 'foo (3).txt');
    assert.equal(inc('qux 2.txt', opts), 'qux (3).txt');
    assert.equal(inc('abc (2) - Copy.txt', opts), 'abc (2).txt');
    assert.equal(inc('abc (2) - Copy Copy.txt', opts), 'abc (2).txt');
  });

  it('should strip existing increments before updating increment', () => {
    let opts = { strip: true };
    assert.equal(inc('foo.txt', opts), 'foo (3).txt');
    assert.equal(inc('foo 2.txt', opts), 'foo 2 (2).txt');
    assert.equal(inc('foo copy.txt', opts), 'foo (3).txt');
    assert.equal(inc('qux 2.txt', opts), 'qux 2 (2).txt');
    assert.equal(inc('abc (2) - Copy.txt', opts), 'abc (2).txt');
    assert.equal(inc('abc (2) - Copy Copy.txt', opts), 'abc (2).txt');
  });
});
