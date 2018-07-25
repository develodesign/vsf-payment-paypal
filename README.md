# Vue Storefront PayPal Payment Extension

PayPal Payment extension for [vue-storefront](https://github.com/DivanteLtd/vue-storefront), by [Develo Design](https://develodesign.co.uk).

## The architecture
![Architecture diagram](doc/executing-paypal-payment-server-integration.svg)

## Installation using NPM:

Add the extension to your Vue Storefront `package.json` using:
```shell
$ npm install vsf-payment-paypal --save
```

Add `vsf-payment-paypal` to the  `extensions/index.js`
```js
export default [
  require('@vue-storefront/extension-droppoint-shipping/index.js'),
  require('@vue-storefront/extension-google-analytics/index.js'),
  require('@vue-storefront/extension-mailchimp-subscribe/index.js'),
  require('@vue-storefront/extension-payment-backend-methods/index.js'),
  require('@vue-storefront/extension-payment-cash-on-delivery/index.js'),
  require('@vue-storefront/extension-template/index.js'),
  require('vsf-payment-stripe/index.js'),
  require('src/extensions/cms/index.js'),

  require('vsf-payment-paypal/index.js').default
]
```

Add the `checkout.min.js` script to specific theme template, for example to `src/themes/default/index.template.html` In our case - you theme path.
```
<script type="text/javascript">
			(function() {
				var wf = document.createElement('script');
				wf.src = ('https:' == document.location.protocol ? 'https' : 'https') +
				'://www.paypalobjects.com/api/checkout.min.js';
				wf.type = 'text/javascript';
				wf.async = 'true';
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(wf, s);
			})();
		</script>
```

Add the following also to your `config/local.json` need set `paypal.env` to `sandbox` or `production`.
```js
"paypal": {
  "env": "sandbox",
  "create_endpoint": "http://localhost:8080/api/ext/paypal-payment/create",
  "execute_endpoint": "http://localhost:8080/api/ext/paypal-payment/execute",
  "style": {
    "size": "small",
    "color": "gold",
    "shape": "pill"
  }
}
```

Also we can use `paypal.style` option for more customizable PayPal button view. For more info [PayPal](https://developer.paypal.com/demo/checkout/#/pattern/checkout).
