import { from } from '../../observable'
import { observeOn } from '../operators/observeOn'
import { subscribeOn } from '../operators/subscribeOn'
import type { SchedulerLike } from '../types'

export function schedulePromise<T>(
  input: PromiseLike<T>,
  scheduler: SchedulerLike,
) {
  return from(input).pipe(subscribeOn(scheduler), observeOn(scheduler))
}
