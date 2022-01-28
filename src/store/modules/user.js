const state = {
    userName: '',
    userRole: '',
    jwt: '',
    getWeatherNotifications: '',
    getOrderNotifications: '',
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
    },
    setWeatherNotifications(state, value) {
        state.getWeatherNotifications = value
    },
    setOrderNotifications(state, value) {
        state.getOrderNotifications = value
    },
}

export default {
    state,
    mutations,
}