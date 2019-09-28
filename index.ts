import { createModule } from '@vue-storefront/core/lib/module'
import { module } from './store'
import { beforeRegistration } from './hooks/beforeRegistration'

export const KEY = 'paypal'

export const Paypal = createModule({
  key: KEY,
  store: { modules: [{ key: KEY, module }]},
  beforeRegistration
})