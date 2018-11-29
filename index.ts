import { module } from './store'
import { plugin } from './store/plugin'
import { beforeRegistration } from './hooks/beforeRegistration'
import { VueStorefrontModule, VueStorefrontModuleConfig } from '@vue-storefront/core/lib/module'

export const KEY = 'paypal'

const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY,
  store: { modules: [{ key: KEY, module }], plugin },
  beforeRegistration
}

export const Paypal = new VueStorefrontModule(moduleConfig)
