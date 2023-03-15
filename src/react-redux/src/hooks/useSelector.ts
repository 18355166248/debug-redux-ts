import { useContext, useDebugValue } from 'react'

import { useReduxContext as useDefaultReduxContext } from './useReduxContext'
import { ReactReduxContext } from '../components/Context'
import type { EqualityFn, NoInfer } from '../types'
import type { uSESWS } from '../utils/useSyncExternalStore'
import { notInitialized } from '../utils/useSyncExternalStore'

let useSyncExternalStoreWithSelector = notInitialized as uSESWS
export const initializeUseSelector = (fn: uSESWS) => {
  useSyncExternalStoreWithSelector = fn
}

const refEquality: EqualityFn<any> = (a, b) => a === b

/**
 * Hook factory, which creates a `useSelector` hook bound to a given context.
 *
 * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
 * @returns {Function} A `useSelector` hook bound to the specified context.
 */
export function createSelectorHook(
  context = ReactReduxContext
): <TState = unknown, Selected = unknown>(
  selector: (state: TState) => Selected,
  equalityFn?: EqualityFn<Selected>
) => Selected {
  // 这里拿到了 useContext
  const useReduxContext =
    context === ReactReduxContext
      ? useDefaultReduxContext
      : () => useContext(context)

  return function useSelector<TState, Selected extends unknown>(
    selector: (state: TState) => Selected,
    equalityFn: EqualityFn<NoInfer<Selected>> = refEquality
  ): Selected {
    if (process.env.NODE_ENV !== 'production') {
      if (!selector) {
        throw new Error(`You must pass a selector to useSelector`)
      }
      if (typeof selector !== 'function') {
        throw new Error(`You must pass a function as a selector to useSelector`)
      }
      if (typeof equalityFn !== 'function') {
        throw new Error(
          `You must pass a function as an equality function to useSelector`
        )
      }
    }
    // 这里拿到的 context 上的 value
    const { store, subscription, getServerState } = useReduxContext()!
    // 这里就是 react 自己封装的库 use-sync-external-store 暴露的方法 目的就是为了提供给三方库使用
    // 作用就是可以拿到最新的 state 因为在react18开始, concurrent 模式是异步的, 可中断的, 所以如果使用useState可能拿到的不是最新的值 这里的底层实现方式也就是将默认的异步更新强制转为同步模式, 所以可能会存在一直执行更新 我感觉这里也是不很优美 会消耗性能
    // selector 是一个函数 目的就是通过 store.getState() 拿到最新的 state, 然后格式化拿到具体需要的参数
    const selectedState = useSyncExternalStoreWithSelector(
      subscription.addNestedSub,
      store.getState,
      getServerState || store.getState,
      selector,
      equalityFn
    )

    useDebugValue(selectedState)

    return selectedState
  }
}

/**
 * A hook to access the redux store's state. This hook takes a selector function
 * as an argument. The selector is called with the store state.
 *
 * This hook takes an optional equality comparison function as the second parameter
 * that allows you to customize the way the selected state is compared to determine
 * whether the component needs to be re-rendered.
 *
 * @param {Function} selector the selector function
 * @param {Function=} equalityFn the function that will be used to determine equality
 *
 * @returns {any} the selected state
 *
 * @example
 *
 * import React from 'react'
 * import { useSelector } from 'react-redux'
 *
 * export const CounterComponent = () => {
 *   const counter = useSelector(state => state.counter)
 *   return <div>{counter}</div>
 * }
 */
export const useSelector = /*#__PURE__*/ createSelectorHook()
