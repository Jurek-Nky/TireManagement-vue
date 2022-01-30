import {createStore} from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import host from './modules/host'
import timer from './modules/timer'

const store = createStore({
    modules: {
        user,
        host,
        timer,
    },
    plugins: [createPersistedState()]
})

export default store