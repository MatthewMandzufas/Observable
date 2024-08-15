type Observer<T> = {
  next: (value: T) => void;
  error?: () => void;
  complete: () => void;
  closed?: boolean;
};

export default class Observable<T> {
  #fnThatIsCalledWithObserver: (observer: Observer<T>) => void;

  constructor(fnThatIsCalledWithObserver: (observer: Observer<T>) => void) {
    this.#fnThatIsCalledWithObserver = fnThatIsCalledWithObserver;
  }

  subscribe({ next, complete }: Observer<T>) {
    this.#fnThatIsCalledWithObserver({ next, error: () => {}, complete, closed: true });
  }
}
