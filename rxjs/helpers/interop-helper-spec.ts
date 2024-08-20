import { expect } from 'chai'
import { Observable, of, Subscriber } from '@/rxjs'
import { asInteropObservable, asInteropSubscriber } from './interop-helper'

describe('interop helper', () => {
  it('should simulate interop observables', () => {
    const observable: any = asInteropObservable(of(42))
    expect(observable).not.be.instanceOf(Observable)
    expect(observable[Symbol.observable ?? '@@observable']).be.a('function')
  })

  it('should simulate interop subscribers', () => {
    const subscriber: any = asInteropSubscriber(new Subscriber())
    expect(subscriber).not.be.instanceOf(Subscriber)
  })
})
