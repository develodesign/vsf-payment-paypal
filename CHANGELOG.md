# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2019.30.10

- Rename to payment-paypal-magento2
- Refactored for Magento2 and compatible with 2.2.x built in Paypal Express - able to read transaction data from Paypal and do Refunds
- Use NVP methods similar to how Magento 2 implements paypal
- Update to send cart items, addresses, totals, discount, shipping to Paypal
- Disable Address changes in Paypal, use checkout address
- Add ability to use Standard Rest implementation
- Add `setExpressCheckout` endpoint for api
- Update Readme

## [0.7.0] - 2019.27.09

- Compatibility for VSF 1.10.x - updated the module signature - @dimasch (#107)

## [0.5.0] - 2019.30.07

### Changed / Improved

- Migrated to the new PayPal Smart Payment Buttons SDK  - @dimasch (#91)
- Use async/await for component methods - @dimasch (#91)
- Support live and sandbox by configuration - @dimasch (#91)
