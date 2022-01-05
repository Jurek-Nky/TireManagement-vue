const state = {
    userName: '',
    userRole: '',
}

const mutations = {
    login(state, user) {
        state.userName = user.name
        state.userRole = user.role
    },
    logout(state) {
        state.userName = ''
        state.userRole = ''
    }
}

export default {
    state,
    mutations,
}