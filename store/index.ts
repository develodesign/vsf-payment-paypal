import { Module } from 'vuex'
import { PaypalState } from '../types/PaypalState'
import { getters } from './getters'
import { actions } from './actions'
import * as types from './mutation-types'

export const paypalStore: Module<PaypalState, any> = {
  namespaced: true,
  actions,
  getters,
  mutations: {
    [types.SET_BACKEND_PAYMENT_PAYPAL_EXPRESS] (state, paymentMethods) {
      state.methods = paymentMethods
    },
    [types.SET_PAYPAL_EXPRESS_TOKEN] (state, token) {
      state.token = token
    },
    [types.SET_PAYPAL_MESSAGE] (state, message) {
      state.message = message
    }
  }
}
