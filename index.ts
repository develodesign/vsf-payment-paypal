// This is VS module entry point.
// Read more about modules: https://github.com/DivanteLtd/vue-storefront/blob/master/doc/api-modules/about-modules.md
import { module } from './store'
import { plugin } from './store/plugin'
import { beforeRegistration } from './hooks/beforeRegistration'
import { afterRegistration } from './hooks/afterRegistration'
import { VueStorefrontModule, VueStorefrontModuleConfig } from '@vue-storefront/core/modules'

export const KEY = 'paypal'

const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY,
  store: { module, plugin },
  beforeRegistration,
  afterRegistration
}

export const Paypal = new VueStorefrontModule(moduleConfig)
