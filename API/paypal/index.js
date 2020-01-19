import { apiStatus } from '../../../lib/util';
import { Router } from 'express';
// const Magento2Client = require('magento2-rest-client').Magento2Client
import config from 'config';

// 1a. Import the SDK package
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

/**
 *
 * PayPal HTTP client dependency
 */
const paypalClient = require('./paypal-client');

const paypalNVPClient = require('paypal-nvp-api');
const paypalNvpConfig = {
  mode: config.extensions.paypal.env,
  username: config.extensions.paypal.username,
  password: config.extensions.paypal.password,
  signature: config.extensions.paypal.signature
}
const paypalNVP = paypalNVPClient(paypalNvpConfig);

module.exports = ({ config, db }) => {
  const api = Router();

  // customize yourself
  api.post('/complete', async (req, res) => {
    const orderId = req.body.cart_id;
    let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
    let order;
    try {
      order = await paypalClient.client(config.extensions.paypal).execute(request);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    return res.json({
      status: 'success'
    })
  })

  api.post('/setExpressCheckout', async (req, res) => {
    try {
      const query = setPaypalNVPQuery(req.body);
      paypalNVP.request('SetExpressCheckout', query).then((result) => {
        if (result.TOKEN) {
          return res.json({
            status: 'success',
            token: result.TOKEN
          });
        } else {
          console.trace(result);
          return res.sendStatus(500);
        }
      }).catch((err) => {
        console.trace(query);
        console.trace(err);
        return res.sendStatus(500);
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });

  return api;
};

function setPaypalNVPQuery(pay) {
  var query = {
    'PAYMENTREQUEST_0_AMT': paypalNVP.formatCurrency(pay.purchase_units[0].amount.value),
    'PAYMENTREQUEST_0_CURRENCYCODE': pay.currency_code,
    'PAYMENTREQUEST_0_ITEMAMT': paypalNVP.formatCurrency(pay.purchase_units[0].amount.breakdown.item_total.value),
    'PAYMENTREQUEST_0_SHIPPINGAMT': paypalNVP.formatCurrency(pay.purchase_units[0].amount.breakdown.shipping.value),
    'PAYMENTREQUEST_0_TAXAMT': paypalNVP.formatCurrency(pay.purchase_units[0].amount.breakdown.tax_total.value),
    'PAYMENTREQUEST_0_SHIPDISCAMT': -1 * paypalNVP.formatCurrency(pay.purchase_units[0].amount.breakdown.discount.value),

    'PAYMENTREQUEST_0_DESC': pay.purchase_units[0].description,
    'PAYMENTREQUEST_0_INVNUM': pay.purchase_units[0].reference_id,
    'PAYMENTREQUEST_0_PAYMENTREQUESTID': pay.purchase_units[0].reference_id,

    'PAYMENTREQUEST_0_PAYMENTREASON': 'None',
    'PAYMENTREQUEST_0_PAYMENTACTION': 'Order',
    'RETURNURL': pay.return_url,
    'CANCELURL': pay.cancel_url,
    'ADDROVERRIDE': 1,
    'LOCALECODE': pay.locale,
    'BRANDNAME': pay.brand_name,
    'SOLUTIONTYPE': 'Sole',
    'EMAIL': pay.email,
    'LOGOIMG': pay.logo,
    'TOTALTYPE': pay.total_type,
    'PAYMENTREQUEST_0_SHIPTONAME': pay.purchase_units[0].shipping.name.full_name,
    'PAYMENTREQUEST_0_SHIPTOSTREET': pay.purchase_units[0].shipping.address.address_line_1,
    'PAYMENTREQUEST_0_SHIPTOSTREET2': pay.purchase_units[0].shipping.address.address_line_2,
    'PAYMENTREQUEST_0_SHIPTOCITY': pay.purchase_units[0].shipping.address.admin_area_2,
    'PAYMENTREQUEST_0_SHIPTOSTATE': pay.purchase_units[0].shipping.address.admin_area_1,
    'PAYMENTREQUEST_0_SHIPTOZIP': pay.purchase_units[0].shipping.address.postal_code,
    'PAYMENTREQUEST_0_SHIPTOCOUNTRYCODE': pay.purchase_units[0].shipping.address.country_code
  };

  return Object.assign(query, getProducts(pay.purchase_units[0].items));
}

function getProducts(products) {
  var pQuery = {};
  products.forEach((p, i) => {
    var tmp = {};
    tmp["L_PAYMENTREQUEST_0_NAME" + i] = p.name.replace(/[^a-zA-Z0-9- ]/g, '');
    tmp["L_PAYMENTREQUEST_0_DESC" + i] = p.description.replace(/[^a-zA-Z0-9- ]/g, '');
    tmp["L_PAYMENTREQUEST_0_AMT" + i] = paypalNVP.formatCurrency(p.unit_amount.value);
    tmp["L_PAYMENTREQUEST_0_TAXAMT" + i] = paypalNVP.formatCurrency(p.tax.value);
    tmp["L_PAYMENTREQUEST_0_NUMBER" + i] = p.sku.replace(/[^a-zA-Z0-9- ]/g, '');
    tmp["L_PAYMENTREQUEST_0_QTY" + i] = p.quantity;
    tmp["L_PAYMENTREQUEST_0_ITEMCATEGORY" + i] = 'Physical';
    Object.assign(pQuery, tmp);
  });

  return pQuery;
}

