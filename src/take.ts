import { Observable } from './observable.ts';

type UnaryFunction<T, R> = (input: T) => R;
type TakeFunction<T> = UnaryFunction<Observable<T>, Observable<T>>;

export const take =
  <T>(numberOfValuesToTake: number): TakeFunction<T> =>
  (sourceObservable: Observable<T>): Observable<T> => {
    return numberOfValuesToTake <= 0
      ? new Observable((subscriber) => subscriber.complete())
      : new Observable((observer) => {
          let counter = 0;
          const sourceSubscriber = sourceObservable.subscribe({
            next: (value: any) => {
              if (++counter < numberOfValuesToTake) {
                observer.next(value);
              } else {
                observer.next(value);
                observer.complete();
                sourceSubscriber.unsubscribe();
              }
            },
            complete: () => observer.complete(),
          });
        });
  };
