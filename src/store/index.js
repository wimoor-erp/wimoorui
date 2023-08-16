import { createStore } from 'vuex'
import routerStore from "./modules/router.js"
import permissionStore from "./modules/permission.js"
const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    routerStore,
	permissionStore
  }
})

export default store
 