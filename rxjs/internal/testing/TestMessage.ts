import type { ObservableNotification } from '../types'

export interface TestMessage {
  frame: number
  notification: ObservableNotification<any>
  isGhost?: boolean
}
