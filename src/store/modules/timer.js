const state = {
    weatherTimer: null,
    weatherInitialTime: 0,
    weatherTime: 0,

    orderTimer: null,
    orderInitialTime: 0,
    orderTime: 0,
}
import {Notify} from 'quasar'
import Router from "@/router";

const mutations = {
    startWeatherTimer(state, initialTime) {
        state.weatherInitialTime = initialTime
        state.weatherTime = initialTime
        state.weatherTimer = setInterval(() => mutations.weatherCountdown(state), 1000)
    },
    pauseWeatherTimer(state) {
        clearInterval(state.weatherTimer)
    },
    continueWeatherTimer() {
        state.weatherTimer = setInterval(() => mutations.weatherCountdown(state), 1000)
    },
    resetWeatherTimer(state) {
        clearInterval(state.weatherTimer)
        state.weatherTime = state.weatherInitialTime
    },
    weatherCountdown(state) {
        if (state.weatherTime >= 1) {
            state.weatherTime--
        } else {
            state.weatherTime = 0
            clearInterval(state.weatherTimer)
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
    },

    startOrderTimer(state, initialTime) {
        state.orderInitialTime = initialTime
        state.orderTime = initialTime
        state.orderTimer = setInterval(() => mutations.orderCountdown(state), 1000)
    },
    pauseOrderTimer(state) {
        clearInterval(state.orderTimer)
    },
    continueOrderTimer() {
        state.orderTimer = setInterval(() => mutations.orderCountdown(state), 1000)
    },
    resetOrderTimer(state) {
        clearInterval(state.orderTimer)
        state.orderTime = state.orderInitialTime
    },
    orderCountdown(state) {
        if (state.orderTime >= 1) {
            state.orderTime--
        } else {
            state.orderTime = 0
            clearInterval(state.orderTimer)
            Notify.create({
                message: 'Bestelltimer ist abgelaufen',
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
    },
}

export default {
    state,
    mutations
}