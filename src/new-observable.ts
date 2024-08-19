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
  add: (functionToCallWhenFinalizing: UnsubscribeFunction) => void;
};

type UnsubscribeFunction = () => void;

interface SubscriptionInterface {
  unsubscribe: () => void;
}

type Notification = {
  kind: NotificationType;
  error: unknown;
};

enum NotificationType {
  ERROR = 'E',
}

interface Config {
  onStoppedNotification: ((notification: Notification) => void) | null;
}

export const config: Config = {
  onStoppedNotification: null,
};

export class Subscription implements SubscriptionInterface {
  unsubscribe: UnsubscribeFunction;
  constructor(unsubscribeFunction: UnsubscribeFunction) {
    this.unsubscribe = unsubscribeFunction;
  }
}

interface ObservableInterface<T> {
  subscribe: (observer?: Partial<Observer<T>>) => void;
  forEach: (fnCalledEachIteration: (value: T) => void) => Promise<void>;
}

export default class Observable<T> implements ObservableInterface<T> {
  emitValuesToObserver: (observer: Observer<T>) => UnsubscribeFunction;

  constructor(emitValuesToObserver: (observer: Observer<T>) => void | UnsubscribeFunction) {
    this.emitValuesToObserver = (observer: Observer<T>) => {
      try {
        return emitValuesToObserver(observer) ?? (() => {});
      } catch (error) {
        if (config.onStoppedNotification) {
          config.onStoppedNotification({
            kind: NotificationType.ERROR,
            error,
          });
        } else {
          observer.error(error);
        }
        return () => {};
      }
    };
  }

  subscribe(observer?: Observer<T> | Partial<Observer<T>>) {
    // eslint-disable-next-line prefer-const
    let unsubscribe: UnsubscribeFunction = () => {};
    const errorWrapper = (value: T) => {
      if (observer?.error !== undefined) {
        observer?.error(value);
      }
      unsubscribe();
    };
    unsubscribe = this.emitValuesToObserver({
      next: () => {},
      complete: () => {},
      closed: false,
      ...observer,
      error: errorWrapper,
      add: (functionToCallWhenFinalizing: UnsubscribeFunction) => {
        const wrappedUnsubscribe = unsubscribe;
        unsubscribe = () => {
          functionToCallWhenFinalizing();
          wrappedUnsubscribe();
        };
      },
    });
    return new Subscription(unsubscribe);
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

  async *[Symbol.asyncIterator]() {
    const results: T[] = [];
    const subscriber = {
      next: (value: T) => {
        results.push(value);
      },
      error: (err: Error) => {
        results.push(err);
      },
    };
    const subscription = this.subscribe(subscriber);
    try {
      for (const result of results) {
        if (result instanceof Error) throw result;
        yield result;
      }
    } finally {
      subscription.unsubscribe();
    }
  }
}
