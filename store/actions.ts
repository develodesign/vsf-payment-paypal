import { ExampleState } from '../types/ExampleState'
import { ActionTree } from 'vuex';
import * as types from './mutation-types'

// it's a good practice for all actions to return Promises with effect of their execution
export const actions: ActionTree<ExampleState, any> = {
  // if you want to use cache in your module you can load cached data like this
  loadUsers ({ commit }) {
    return new Promise ((resolve, reject) => {
      resolve([])
    })
  },
  // if you are using cache in your module it's a good practice to allow develoeprs to choose either to use it or not
  addUser ({ commit }, { user, useCache = false }) {
    return new Promise ((resolve, reject) => {
      resolve([])
    })
  }
}