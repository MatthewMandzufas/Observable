type NextObserver<T> = {
  closed?: boolean;
  next: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
};

type ErrorObserver<T> = {
  closed?: boolean;
  next?: (value: T) => void;
  error: (err: any) => void;
  complete?: () => void;
};

type CompletionObserver<T> = {
  closed?: boolean;
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete: () => void;
};

type PartialObserver<T> = NextObserver<T> | ErrorObserver<T> | CompletionObserver<T>;

type Observer<T> = {
  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;
  closed: boolean;
};

interface ObservableInterface<T> {
  subscribe: (observer: Partial<Observer<T>>) => void;
  forEach: (fnCalledEachIteration: (value: T) => void) => Promise<void>;
}

export default class Observable<T> implements ObservableInterface<T> {
  emitValuesToObserver: (observer: Observer<T>) => void;

  constructor(emitValuesToObserver: (observer: Observer<T>) => void) {
    this.emitValuesToObserver = (observer: Observer<T>) => {
      try {
        emitValuesToObserver(observer);
      } catch (error) {
        observer.error(error);
        // observer.complete();
        // observer.closed = true;
      }
    };
  }

  subscribe({ next = () => {}, complete = () => {}, error = () => {}, closed = false }: Partial<Observer<T>>) {
    this.emitValuesToObserver({ next, error, complete, closed });
  }

  forEach(handleNext: (value: T) => void) {
    let closed = false;
    return new Promise<void>((resolve, reject) => {
      this.subscribe({
        next: (value: T) => {
          try {
            if (!closed) {
              handleNext(value);
            }
          } catch (err) {
            closed = true;
            reject(err);
          }
        },
        error: reject,
        complete: resolve,
      });
    });
  }
}
