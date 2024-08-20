import { Subject } from '../Subject'
import type { Subscriber } from '../../observable'
import { Subscription } from '../../observable'
import type { Scheduler } from '../Scheduler'
import type { TestMessage } from './TestMessage'
import { observeNotification } from '../Notification'
import type { SubscriptionLog } from './subscription-logging'
import {
  logSubscribedFrame,
  logUnsubscribedFrame,
} from './subscription-logging'

export class HotObservable<T> extends Subject<T> {
  public subscriptions: SubscriptionLog[] = []

  logSubscribedFrame = logSubscribedFrame

  logUnsubscribedFrame = logUnsubscribedFrame

  constructor(
    public messages: TestMessage[],
    public scheduler: Scheduler,
  ) {
    super()
  }

  /** @internal */
  protected _subscribe(subscriber: Subscriber<any>): Subscription {
    const index = this.logSubscribedFrame()
    const subscription = new Subscription()
    subscription.add(
      new Subscription(() => {
        this.logUnsubscribedFrame(index)
      }),
    )
    subscription.add(super._subscribe(subscriber))
    return subscription
  }

  setup() {
    for (const { notification, frame } of this.messages) {
      this.scheduler.schedule(() => {
        observeNotification(notification, this)
      }, frame)
    }
  }
}
