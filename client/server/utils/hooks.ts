import { createHooks } from 'hookable'

export interface Hooks {
  'sse:event': (data: any) => any | void,
}

export const hooks = createHooks<Hooks>()