# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.6] - 13.11.2020

- Defer beforeRegistration Hook if config value `addPaypalJsToHead` is false + Documentation to add JS to head

## [1.1.5] - 06.11.2020

- Pass telephone number parameter to PayPal

## [1.1.4] - 29.10.2020

- Added error log informations

## [1.1.3] - 28.10.2020

- Correct calc of taxes (included / excluded)
- Disable MyBank and Sofort funding
- Fix import and module registration of this module

## [1.1.2] - 20.08.2020

- Display notification messages from paypal

## [1.1.1] - 19.08.2020

- paypal-button component refactoring - logic moved to actions/getters - @dimasch (#137)

## [1.1.0] - 14.08.2020

- Upgraded module signatures to VSF 1.12.x - @dimasch (#131)
- Compatibility with Capybara theme. Updated README. - @dimasch (#124)

## [1.0.4] - 11.06.2020

- Resolved issue with expected intent from order api call to be authorize, got capture. - @dimasch

## [1.0.3] - 30.01.2020

- Support the invoice creation (by use Sale type for Payment Action) - @dimasch

## [1.0.2] - 27.01.2020

- Documentation

## [1.0.0] - 27.01.2020

- Refactored for Magento2 and compatible with 2.2.x built in Paypal Express - able to read transaction data from Paypal and do Refunds
- Use NVP methods similar to how Magento 2 implements paypal

## [0.7.2] - 09.12.2019
- Added support the style attribute for any buttons customizations. - @dimasch (#114)

## [0.7.1] - 08.12.2019
- Added loader for the place order process. Backward compatibility with support old getters. - @dimasch (#112)

## [0.7.0] - 27.09.2019
- Compatibility for VSF 1.10.x - updated the module signature - @dimasch (#107)

## [0.5.0] - 30.07.2019

### Changed / Improved

- Migrated to the new PayPal Smart Payment Buttons SDK  - @dimasch (#91)
- Use async/await for component methods - @dimasch (#91)
- Support live and sandbox by configuration - @dimasch (#91)
