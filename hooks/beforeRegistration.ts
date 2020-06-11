import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export function beforeRegistration({ Vue, config, store, isServer }) {
  const VSF_PAYPAL_CODE = 'paypal_express'

  if (!isServer) {
    const storeView = currentStoreView()
    const { currencyCode } = storeView.i18n
    const clientId = config.paypal.clientId
    const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currencyCode}&disable-funding=card,credit`
    var script = document.createElement('script')
    script.setAttribute('src', sdkUrl)
    document.head.appendChild(script)
  }
}
