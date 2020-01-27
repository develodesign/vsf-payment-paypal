# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 27.01.2020

- Refactored for Magento2 and compatible with 2.2.x built in Paypal Express - able to read transaction data from Paypal and do Refunds
- Use NVP methods similar to how Magento 2 implements paypal

## [0.7.0] - 09.27.2019

- Compatibility for VSF 1.10.x - updated the module signature - @dimasch (#107)

## [0.5.0] - 30.07.2019

### Changed / Improved

- Migrated to the new PayPal Smart Payment Buttons SDK  - @dimasch (#91)
- Use async/await for component methods - @dimasch (#91)
- Support live and sandbox by configuration - @dimasch (#91)
