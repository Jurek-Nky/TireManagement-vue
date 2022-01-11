import {createStore} from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import host from './modules/host'

const store = createStore({
    modules: {
        user,
        host
    },
    plugins: [createPersistedState()]
})

export default store