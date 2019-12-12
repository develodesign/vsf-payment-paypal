import { Module } from 'vuex'
import { PaypalState } from '../types/PaypalState'
import { getters } from './getters'
import { actions } from './actions'
import * as types from './mutation-types'

export const module: Module<PaypalState, any> = {
  namespaced: true,
  actions,
  getters,
  mutations: {
    [types.SET_BACKEND_PAYMENT_PAYPAL_EXPRESS](state, paymentMethods) {
      state.methods = paymentMethods
    }
  }
}
