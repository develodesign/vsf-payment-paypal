import { Module } from 'vuex'
import { PaypalState } from '../types/PaypalState'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'

export const module: Module<PaypalState, any> = {
  namespaced: true,
  mutations,
  actions,
  getters
}