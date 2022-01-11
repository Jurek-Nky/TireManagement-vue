const state = {
    userName: '',
    userRole: '',
    jwt: '',
}

const mutations = {
    login(state, user) {
        state.userName = user.name
        state.userRole = user.role
        state.jwt = user.jwt
    },
    logout(state) {
        state.userName = ''
        state.userRole = ''
        state.jwt = ''
    }
}

export default {
    state,
    mutations,
}