import type { SchedulerLike, ReadableStreamLike } from '../types'
import type { Observable } from '../../observable'
import { readableStreamLikeToAsyncGenerator } from '../../observable'
import { scheduleAsyncIterable } from './scheduleAsyncIterable'

export function scheduleReadableStreamLike<T>(
  input: ReadableStreamLike<T>,
  scheduler: SchedulerLike,
): Observable<T> {
  return scheduleAsyncIterable(
    readableStreamLikeToAsyncGenerator(input),
    scheduler,
  )
}
