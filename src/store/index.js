import {createStore} from 'vuex'
// Create a new store instance.
const store = createStore({
    state: {
        user_role: '',
        user_token: '',
        user_name: '',

    },
    mutations: {
        setUserRole(state, role) {
            state.user_role = role
        }
        ,
        setUserToken(state, token) {
            state.user_token = token
        }
        ,
        setUserName(state, name) {
            state.user_name = name
        }
    }
    ,
    actions: {
        setUserRole(state, role) {
            state.commit("setUserRole", role)
        },
        setUserName(state, name) {
            state.commit("setUserName", name)
        },
        setUserToken(state, token) {
            state.commit("setUserToken", token)
        }
    }
    ,
    modules: {}
    ,
    getters: {
        getUserRole: state => state.user_role,
        getUserName: state => state.user_name,
        getUserToken: state => state.user_token,
    }
})

export default store