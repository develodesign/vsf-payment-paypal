import { PaypalState } from '../types/PaypalState'
import { GetterTree } from 'vuex';

export const getters: GetterTree<PaypalState, any> = {
    getPlatformTotalSegments: (state, getters, rootState, rootGetters) => rootState.cart.platformTotalSegments,
    getShippingDetails: (state, getters, rootState, rootGetters) => rootState.checkout.shippingDetails,
    getPaymentDetails: (state, getters, rootState, rootGetters) => rootState.checkout.paymentDetails,
    getProducts: (state, getters, rootState, rootGetters) => {
        return rootState.cart.cartItems.map(product => {
            return {
                name: product.name,
                unit_amount: {
                    currency_code: rootState.storeView.i18n.currencyCode,
                    value: product.price
                },
                tax: {
                    currency_code: rootState.storeView.i18n.currencyCode,
                    value: ''
                    // optional tax already set in totals, this is not needed
                    // value: (product.totals.price_incl_tax - product.totals.price).toFixed(2)
                },
                description: (product.options && product.options.length > 0) ? product.options.map((el) => { return el.value }).join(',') : '',
                quantity: product.qty,
                sku: product.sku,
                category: 'PHYSICAL_GOODS'
            }
        })
    },
    getBillingAddress: (state, getters, rootState, rootGetters) => {
        const paymentDetails = getters.getPaymentDetails
        return {
            address_line_1: paymentDetails.streetAddress,
            address_line_2: paymentDetails.apartmentNumber,
            admin_area_1: paymentDetails.region_code,
            admin_area_2: paymentDetails.city,
            postal_code: paymentDetails.zipCode,
            country_code: paymentDetails.country
        }
    },
    getShippingAddress: (state, getters, rootState, rootGetters) => {
        const shippingDetails = getters.getShippingDetails
        return {
            name: {
                full_name: `${shippingDetails.firstName} ${shippingDetails.lastName}`
            },
            address: {
                address_line_1: shippingDetails.streetAddress,
                address_line_2: shippingDetails.apartmentNumber,
                admin_area_1: shippingDetails.region_code,
                admin_area_2: shippingDetails.city,
                postal_code: shippingDetails.zipCode,
                country_code: shippingDetails.country
            }
        }
    }
}