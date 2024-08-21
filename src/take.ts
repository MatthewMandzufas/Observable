import { Observable } from './observable.ts';

type UnaryFunction<T, R> = (input: T) => R;
type TakeFunction<T> = UnaryFunction<Observable<T>, Observable<T>>;

export const take =
  <T>(numberOfValuesToTake: number): TakeFunction<T> =>
  (sourceObservable: Observable<T>): Observable<T> => {
    return new Observable((observer) => {
      const sourceSubscriber = sourceObservable.subscribe({
        next: (value: any) => {
          numberOfValuesToTake--;
          observer.next(value);
          if (numberOfValuesToTake <= 0) {
            sourceSubscriber.unsubscribe();
            observer.complete();
          }
        },
        complete: () => observer.complete(),
      });
    });
  };
