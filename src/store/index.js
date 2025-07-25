import { createStore } from 'vuex'
import routerStore from "./modules/router.js"
import permissionStore from "./modules/permission.js"
import jessionStore from "./modules/jession.js"
import dateStore from "./modules/date.js"
const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    routerStore,
	permissionStore,
	jessionStore,
	dateStore,
  }
})

export default store
 