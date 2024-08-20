/** @prettier */
// import { expect } from 'chai';
// import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { of } from './of.ts';
import { observableMatcher } from './rxjs/helpers/observableMatcher';
import { concatAll, concatMap, delay } from './rxjs/operators';
import { TestScheduler } from './rxjs/testing';

/** @test {of} */
describe('of', () => {
  let rxTestScheduler: TestScheduler;

  beforeEach(() => {
    rxTestScheduler = new TestScheduler(observableMatcher);
  });

  it('should create a cold observable that emits 1, 2, 3', () => {
    rxTestScheduler.run(({ expectObservable, time }) => {
      const delayValue = time('--|');

      const e1 = of(1, 2, 3).pipe(
        // for the purpose of making a nice diagram, spread out the synchronous emissions
        concatMap((x, i) => of(x).pipe(delay(i === 0 ? 0 : delayValue)))
      );
      const expected = 'x-y-(z|)';
      expectObservable(e1).toBe(expected, { x: 1, y: 2, z: 3 });
    });
  });

  it.skip('should create an observable from the provided values', () =>
    new Promise<void | Error>((done) => {
      const x = { foo: 'bar' };
      const expected = [1, 'a', x];
      let i = 0;

      of(1, 'a', x).subscribe({
        next: (y: any) => {
          expect(y).to.equal(expected[i++]);
        },
        error: (x) => {
          done(new Error('should not be called'));
        },
        complete: () => {
          done();
        },
      });
    }));

  it.skip('should emit one value', () =>
    new Promise<void | Error>((done) => {
      let calls = 0;

      of(42).subscribe({
        next: (x: number) => {
          expect(++calls).to.equal(1);
          expect(x).to.equal(42);
        },
        error: (err: any) => {
          done(new Error('should not be called'));
        },
        complete: () => {
          done();
        },
      });
    }));

  it.skip('should handle an Observable as the only value', () => {
    rxTestScheduler.run(({ expectObservable }) => {
      const source = of(of('a', 'b', 'c'));
      const result = source.pipe(concatAll());
      expectObservable(result).toBe('(abc|)');
    });
  });

  it.skip('should handle many Observable as the given values', () => {
    rxTestScheduler.run(({ expectObservable }) => {
      const source = of(of('a', 'b', 'c'), of('d', 'e', 'f'));

      const result = source.pipe(concatAll());
      expectObservable(result).toBe('(abcdef|)');
    });
  });
});
