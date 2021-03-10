import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { paypalStore } from './store'
import { beforeRegistration } from './hooks/beforeRegistration'
import { afterRegistration } from './hooks/afterRegistration'

export const KEY = 'payment-paypal-magento2'

export const PaymentPaypalModule: StorefrontModule = function ({ store, router, appConfig }) {
  beforeRegistration(appConfig, store)
  store.registerModule(KEY, paypalStore)
  afterRegistration(appConfig, store)
}
