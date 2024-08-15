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
  forEach: (fn: (value: T) => void) => Promise<void>;
}

export default class Observable<T> implements ObservableInterface<T> {
  #fnThatIsCalledWithObserver: (observer: Observer<T>) => void;

  constructor(fnThatIsCalledWithObserver: (observer: Observer<T>) => void) {
    this.#fnThatIsCalledWithObserver = (observer: Observer<T>) => {
      try {
        fnThatIsCalledWithObserver(observer);
      } catch (error) {
        if (observer && typeof observer.error === 'function') {
          observer?.error(error);
        }
      }
    };
  }

  subscribe({ next = () => {}, complete = () => {}, error = () => {}, closed = false }: Partial<Observer<T>>) {
    this.#fnThatIsCalledWithObserver({ next, error, complete, closed });
  }

  forEach(fn: (value: T) => void) {
    return new Promise<void>((resolve, reject) => {
      this.subscribe({ next: fn, error: reject, complete: resolve });
    });
  }
}
