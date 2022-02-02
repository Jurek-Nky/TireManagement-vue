<template>
  <q-layout view="hHh LpR fff">
    <q-header v-if="(usernameComp !== '')" elevated>
      <q-toolbar class="bg-primary">
        <q-btn dense flat icon="mdi-menu" round @click="toggleLeftDrawer"/>
        <q-img class="q-ml-md gt-xs" src="./assets/lms_logo_midsize.png" width="120px"
               @click="$router.push('/dashboard')"/>
        <q-toolbar-title class="gt-sm" shrink>Reifenverwaltung</q-toolbar-title>
        <q-space/>
        <q-toolbar-title class="gt-xs" shrink>{{ $route.name }}</q-toolbar-title>
        <q-space/>
        <q-btn v-if="(usernameComp !== '')" :label="username" class="q-mr-md" color="accent"
               dense size="md" @click="this.$router.push('/profil')"/>
        <q-btn class="q-mr-sm" color="negative" dense icon="mdi-logout" label="logout" size="md" @click="logout"/>
      </q-toolbar>
    </q-header>
    <q-drawer v-if="(usernameComp !== '')" v-model="leftDrawerOpen" :mini="miniState" :width="200"
              class="bg-primary" elevated mini-to-overlay show-if-above side="left" @mouseout="miniState = true"
              @mouseover="miniState = false">
      <!-- admin items-->
      <q-list v-if="(this.$store.state.user.userRole === 'Admin')" class="rounded-borders" padding>
        <q-item v-for="item in adminItems" :key="item.title" v-ripple :to="item.to" class="text-white" clickable link>
          <q-item-section avatar>
            <q-icon :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{ item.title }}
          </q-item-section>
        </q-item>
      </q-list>
      <!--manager items-->
      <q-list v-if="this.$store.state.user.userRole === 'Manager'" class="rounded-borders" padding>
        <q-item v-for="item in manItems" :key="item.title" v-ripple :to="item.to" class="text-white" clickable link>
          <q-item-section avatar>
            <q-icon :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{ item.title }}
          </q-item-section>
        </q-item>
      </q-list>
      <!--ingenieur items-->
      <q-list v-if="this.$store.state.user.userRole === 'Ingenieur'" class="rounded-borders" padding>
        <q-item v-for="item in ingItems" :key="item.title" v-ripple :to="item.to" class="text-white" clickable link>
          <q-item-section avatar>
            <q-icon :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{ item.title }}
          </q-item-section>
        </q-item>
      </q-list>
      <!--employee items-->
      <q-list v-if="this.$store.state.user.userRole === 'Employee'" class="rounded-borders" padding>
        <q-item v-for="item in empItems" :key="item.title" v-ripple :to="item.to" class="text-white" clickable link>
          <q-item-section avatar>
            <q-icon :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{ item.title }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container style="background-color: #2C363F">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {ref} from 'vue'

export default {
  setup() {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  mounted() {
    this.startTimers()
  },
  methods: {
    logout() {
      this.$store.commit('logout')
      this.$router.push('/login')
    },
    startTimers() {
      this.$store.state.timer.weatherRunning = false
      this.$store.state.timer.orderRunning = false
      const apiUrl = this.$store.state.host.api_url
      const url_weather = apiUrl + '/weather/timer'
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      fetch(url_weather, requestOptions)
          .then(response => {
            if (response.status !== 200) {
              throw new Error("no timer available")
            }
            return response.text()
          })
          .then(d => {
            const data = d.replace("\"", "").split(".")[0]
            const dataSplit = data.split("T")
            const date = dataSplit[0].split("-")
            const time = dataSplit[1].split(":")
            const now = new Date()
            let lastEntry = new Date()
            lastEntry.setUTCFullYear(date[0])
            lastEntry.setUTCMonth(date[1] - 1) // for some reason Date.Month is zero based
            lastEntry.setUTCDate(date[2])
            lastEntry.setUTCHours(time[0])
            lastEntry.setUTCMinutes(time[1])
            lastEntry.setUTCSeconds(time[2])
            const timerInSec = ((lastEntry.getTime() - now.getTime() + 1800000) / 1000)
            this.$store.commit("startWeatherTimer", timerInSec)
          })
      const url_order = apiUrl + '/tire/ordertimer'
      fetch(url_order, requestOptions)
          .then(response => {
            if (response.status !== 200) {
              throw new Error("no timer available")
            }
            return response.text()
          })
          .then(d => {
            const data = d.split(".")[0].split(" ")
            const time = data[1].split(":")
            const date = data[0].split("-")
            const now = new Date()
            let timer = new Date()
            timer.setFullYear(date[0])
            timer.setMonth(date[1] - 1)
            timer.setDate(date[2])
            timer.setHours(time[0])
            timer.setMinutes(time[1])
            timer.setUTCSeconds(time[2])
            const timerInSec = (timer.getTime() - now.getTime()) / 1000
            this.$store.commit("startOrderTimer", timerInSec)
          })
      setTimeout(() => {
        this.update()
      }, 2000)
    },
    update() {
      const interval = setInterval(() => {
        if (!this.$store.state.timer.weatherRunning) {
          const apiUrl = this.$store.state.host.api_url
          const url = apiUrl + '/weather/timer'
          const jwt = this.$store.state.user.jwt
          const requestOptions = {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + jwt
            },
          }
          fetch(url, requestOptions)
              .then(response => {
                if (response.status !== 200) {
                  throw new Error("no timer available")
                }
                return response.text()
              })
              .then(d => {
                const data = d.replace("\"", "").split(".")[0]
                const dataSplit = data.split("T")
                const date = dataSplit[0].split("-")
                const time = dataSplit[1].split(":")
                const now = new Date()
                let lastEntry = new Date()
                lastEntry.setUTCFullYear(date[0])
                lastEntry.setUTCMonth(date[1] - 1) // for some reason Date.Month is zero based
                lastEntry.setUTCDate(date[2])
                lastEntry.setUTCHours(time[0])
                lastEntry.setUTCMinutes(time[1])
                lastEntry.setUTCSeconds(time[2])
                const timerInSec = ((lastEntry.getTime() - now.getTime() + 1800000) / 1000)
                if (timerInSec >= 0) {
                  this.$store.commit("startWeatherTimer", timerInSec)
                }
              })
        }
        if (!this.$store.state.timer.orderRunning) {
          const apiUrl = this.$store.state.host.api_url
          const url = apiUrl + '/tire/ordertimer'
          const jwt = this.$store.state.user.jwt
          const requestOptions = {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + jwt
            },
          }
          fetch(url, requestOptions)
              .then(response => {
                if (response.status !== 200) {
                  throw new Error("no timer available")
                }
                return response.text()
              })
              .then(d => {
                const data = d.split(".")[0].split(" ")
                const time = data[1].split(":")
                const date = data[0].split("-")
                const now = new Date()
                let timer = new Date()
                timer.setFullYear(date[0])
                timer.setMonth(date[1] - 1)
                timer.setDate(date[2])
                timer.setHours(time[0])
                timer.setMinutes(time[1])
                timer.setUTCSeconds(time[2])
                const timerInSec = (timer.getTime() - now.getTime()) / 1000
                if (timerInSec >= 0) {
                  this.$store.commit("startOrderTimer", timerInSec)
                }
              })
        }
        this.getUserSettings()
      }, 5000)
    },
    getUserSettings() {
      const apiUrl = this.$store.state.host.api_url
      let url = new URL(`${apiUrl}/user/userSettings`)
      url.searchParams.append('u', this.$store.state.user.userName)
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      fetch(url, requestOptions)
          .then(response => {
            return response.json()
          })
          .then(data => {
            this.$store.commit('setWeatherNotifications', data.getWeatherNotifications)
            this.$store.commit('setOrderNotifications', data.getOrderNotifications)
          })
    }
  },
  computed: {
    usernameComp() {
      if (this.$store.state.user.userName !== '') {
        this.username = this.$store.state.user.userName
        return this.username
      }
      return ''
    }
  },
  data: () => ({
    miniState: true,
    drawer: null,
    username: '',
    adminItems: [
      {title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard'},
      {title: 'Bestellungen', icon: 'mdi-timer', to: '/bestellungen'},
      {title: 'Bestand', icon: 'mdi-database', to: '/bestand'},
      {title: 'Wetter', icon: 'mdi-weather-cloudy', to: '/wetter'},
      {title: 'Statistik', icon: 'mdi-information-outline', to: '/statistik'},
      {title: 'Admin', icon: 'mdi-account-lock', to: '/admin'},
    ],
    ingItems: [
      {title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard'},
      {title: 'Bestand', icon: 'mdi-database', to: '/bestand'},
      {title: 'Wetter', icon: 'mdi-weather-cloudy', to: '/wetter'},
      {title: 'Statistik', icon: 'mdi-history', to: '/statistik'},
    ],
    manItems: [
      {title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard'},
      {title: 'Bestellungen', icon: 'mdi-timer', to: '/bestellungen'},
      {title: 'Bestand', icon: 'mdi-database', to: '/bestand'},
      {title: 'Wetter', icon: 'mdi-weather-cloudy', to: '/wetter'},
      {title: 'Statistik', icon: 'mdi-history', to: '/statistik'},
    ],
    empItems: [
      {title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard'},
      {title: 'Bestellungen', icon: 'mdi-timer', to: '/bestellungen'},
      {title: 'Wetter', icon: 'mdi-weather-cloudy', to: '/wetter'},
    ],
  }),
}
</script>