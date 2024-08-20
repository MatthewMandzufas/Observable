import type { SchedulerLike } from '../types'
import { isFunction } from '../../observable'

export function isScheduler(value: any): value is SchedulerLike {
  return value && isFunction(value.schedule)
}
