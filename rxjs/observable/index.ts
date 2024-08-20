export {
  Observable,
  Subscriber,
  Subscription,
  UnsubscriptionError,
  config,
  from,
  isObservable,
  operate,
} from './observable'
export type { GlobalConfig, SubscriberOverrides } from './observable'

// TODO: reevaluate these as part of public API of @/rxjs/observable/index? They aren't exported from rxjs so feel more internal?
export {
  COMPLETE_NOTIFICATION,
  ObservableInputType,
  createNotification,
  errorNotification,
  fromArrayLike,
  getObservableInputType,
  isArrayLike,
  isFunction,
  isPromise,
  nextNotification,
  readableStreamLikeToAsyncGenerator,
  subscribeToArray,
} from './observable'
