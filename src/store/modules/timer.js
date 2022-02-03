const state = {
    weatherTimer: null,
    weatherInitialTime: 0,
    weatherTime: 0,
    weatherRunning: false,

    orderTimer: null,
    orderInitialTime: 0,
    orderTime: 0,
    orderRunning: false,
}
import {Notify} from 'quasar'
import Router from "@/router";
import store from "../index";

const mutations = {
    startWeatherTimer(state, timeInSec) {
        if (timeInSec < 0) {
            return
        }
        state.weatherRunning = true
        state.weatherInitialTime = 1800
        state.weatherTime = timeInSec
        state.weatherTimer = setInterval(() => mutations.weatherCountdown(state), 1000)

    },
    pauseWeatherTimer(state) {
        clearInterval(state.weatherTimer)
        state.weatherRunning = false
    },
    continueWeatherTimer(state) {
        state.weatherTimer = setInterval(() => mutations.weatherCountdown(state), 1000)
        state.weatherRunning = true
    },
    resetWeatherTimer(state) {
        clearInterval(state.weatherTimer)
        state.weatherTime = state.weatherInitialTime
        state.weatherRunning = false
    },
    weatherCountdown(state) {
        if (state.weatherTime >= 1) {
            state.weatherTime--
        } else {
            state.weatherTime = 0
            clearInterval(state.weatherTimer)
            state.weatherRunning = false
            if (store.state.user.getWeatherNotifications) {
                Notify.create({
                    message: 'Eine neue Temperaturmessung muss vorgenommen werden',
                    closeBtn: 'Done',
                    color: 'warning',
                    timeout: 0,
                    actions: [
                        {
                            label: 'Wetter', color: 'white', handler: () => {
                                Router.push('/wetter')
                            }
                        }
                    ],
                    position: 'top-left'
                })
            }
        }
    },

    startOrderTimer(state, initialTime) {
        if (initialTime < 0) {
            return
        }
        state.orderRunning = true
        if (initialTime > (60 * 60)) {
            state.orderInitialTime = initialTime
        } else {
            state.orderInitialTime = 3600
        }
        state.orderTime = initialTime
        state.orderTimer = setInterval(() => mutations.orderCountdown(state), 1000)

    },
    pauseOrderTimer(state) {
        clearInterval(state.orderTimer)
        state.orderRunning = false
    },
    continueOrderTimer() {
        state.orderTimer = setInterval(() => mutations.orderCountdown(state), 1000)
        state.orderRunning = true
    },
    resetOrderTimer(state) {
        clearInterval(state.orderTimer)
        state.orderTime = state.orderInitialTime
        state.orderRunning = false
    },
    orderCountdown(state) {
        if (state.orderTime >= 1) {
            state.orderTime--
        } else {
            state.orderTime = 0
            clearInterval(state.orderTimer)
            state.orderRunning = false
            if (store.state.user.getOrderNotifications) {
                Notify.create({
                    message: 'Bestellung ist bereit zur Abholung',
                    closeBtn: 'Done',
                    color: 'warning',
                    timeout: 0,
                    actions: [
                        {
                            label: 'Bestellungen', color: 'white', handler: () => {
                                Router.push('/bestellungen')
                            }
                        }
                    ],
                    position: 'top-left'
                })
            }
        }
    },
}

export default {
    state,
    mutations
}