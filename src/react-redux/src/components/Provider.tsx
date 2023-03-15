import React, { Context, ReactNode, useMemo } from 'react'
import { ReactReduxContext, ReactReduxContextValue } from './Context'
import { createSubscription } from '../utils/Subscription'
import { useIsomorphicLayoutEffect } from '../utils/useIsomorphicLayoutEffect'
import { Action, AnyAction, Store } from 'redux'

export interface ProviderProps<A extends Action = AnyAction, S = unknown> {
  /**
   * The single Redux store in your application.
   */
  store: Store<S, A>

  /**
   * An optional server state snapshot. Will be used during initial hydration render if available, to ensure that the UI output is consistent with the HTML generated on the server.
   */
  serverState?: S

  /**
   * Optional context to be used internally in react-redux. Use React.createContext() to create a context to be used.
   * If this is used, you'll need to customize `connect` by supplying the same context provided to the Provider.
   * Initial value doesn't matter, as it is overwritten with the internal state of Provider.
   */
  context?: Context<ReactReduxContextValue<S, A>>
  children: ReactNode
}

function Provider<A extends Action = AnyAction, S = unknown>({
  store,
  context,
  children,
  serverState,
}: ProviderProps<A, S>) {
  const contextValue = useMemo(() => {
    // 创建监听参数 放入 react 的 context 中
    const subscription = createSubscription(store)
    return {
      store,
      subscription,
      getServerState: serverState ? () => serverState : undefined,
    }
  }, [store, serverState])

  const previousState = useMemo(() => store.getState(), [store])

  useIsomorphicLayoutEffect(() => {
    const { subscription } = contextValue
    // 声明 onStateChange 方法为 notifyNestedSubs 方法
    subscription.onStateChange = subscription.notifyNestedSubs
    // 初始化 store.subscribe 当执行 strore.dispatch 的时候 会触发 onStateChange( notifyNestedSubs ) 方法
    subscription.trySubscribe()
    console.log(
      'previousState !== store.getState()',
      previousState !== store.getState()
    )
    if (previousState !== store.getState()) {
      // 触发更新
      subscription.notifyNestedSubs()
    }
    return () => {
      console.log('销毁订阅')
      subscription.tryUnsubscribe()
      subscription.onStateChange = undefined
    }
  }, [contextValue, previousState])
  // 默认使用内部初始化的 context
  const Context = context || ReactReduxContext

  // @ts-ignore 'AnyAction' is assignable to the constraint of type 'A', but 'A' could be instantiated with a different subtype
  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export default Provider
