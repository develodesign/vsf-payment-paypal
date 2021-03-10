'use strict';

/**
 *
 * PayPal Node JS SDK dependency
 */
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

/**
 *
 * Returns PayPal HTTP client instance with environment that has access
 * credentials context. Use this instance to invoke PayPal APIs, provided the
 * credentials have access.
 */
function client (config) {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment(config));
}

/**
 *
 * Set up and return PayPal JavaScript SDK environment with PayPal access credentials.
 * This sample uses SandboxEnvironment. In production, use LiveEnvironment.
 *
 */
function environment (config) {
  const clientId = process.env.PAYPAL_CLIENT_ID || config.clientId;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || config.secret;

  const method = config.env ? `${capitalizeFirstLetter(config.env)}Environment` : 'SandboxEnvironment'
  return new checkoutNodeJssdk.core[method](clientId, clientSecret);
}

/**
 *
 * Capitalize first letter
 *
 */
function capitalizeFirstLetter (word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

module.exports = { client: client };
