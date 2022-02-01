<template>
  <q-layout view="hHh LpR fff">
    <q-header v-if="(usernameComp !== '')" elevated>
      <q-toolbar class="bg-primary">
        <q-btn dense flat icon="mdi-menu" round @click="toggleLeftDrawer"/>
        <q-img src="./assets/lms_logo_midsize.png" width="120px" class="q-ml-md"/>
        <q-toolbar-title shrink>Reifenverwaltung</q-toolbar-title>
        <q-space/>
        <q-toolbar-title shrink>{{ $route.name }}</q-toolbar-title>
        <q-space/>
        <q-btn v-if="(usernameComp !== '')" :label="username" class="q-mr-lg text-subtitle1" color="accent"
               @click="this.$router.push('/profil')"/>
        <q-btn class="text-subtitle1" color="negative" dense icon="mdi-logout" @click="logout">logout</q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer v-if="(usernameComp !== '')" v-model="leftDrawerOpen" class="bg-primary" elevated overlay show-if-above
              side="left">
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
    this.update()
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
            return response.json()
          })
          .then(data => {
            const dataSplit = data.split(":")
            let lastEntry = new Date()
            lastEntry.setHours(dataSplit[0])
            lastEntry.setMinutes(dataSplit[1])
            lastEntry.setSeconds(dataSplit[2])
            const timerInSec = 1800 + ((lastEntry.getTime() - new Date().getTime()) / 1000) // 30 minutes - lastEntry + localtime
            this.$store.commit("startWeatherTimer", timerInSec)
          })
      const url_order = apiUrl + '/tire/ordertimer'
      fetch(url_order, requestOptions)
          .then(response => {
            if (response.status !== 200) {
              throw new Error("no timer available")
            }
            return response.json()
          })
          .then(data => {
            const dataSplit = data.split(":")
            let lastEntry = new Date()
            lastEntry.setHours(dataSplit[0])
            lastEntry.setMinutes(dataSplit[1])
            lastEntry.setSeconds(dataSplit[2])
            const timerInSec = ((lastEntry.getTime() - new Date().getTime()) / 1000)  // timer - localtime
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
                return response.json()
              })
              .then(data => {
                const dataSplit = data.split(":")
                let lastEntry = new Date()
                lastEntry.setHours(dataSplit[0])
                lastEntry.setMinutes(dataSplit[1])
                lastEntry.setSeconds(dataSplit[2])
                const timerInSec = 1800 + ((lastEntry.getTime() - new Date().getTime()) / 1000) // 30 minutes - lastEntry + localtime
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
                return response.json()
              })
              .then(data => {
                const dataSplit = data.split(":")
                let timer = new Date()
                timer.setHours(dataSplit[0])
                timer.setMinutes(dataSplit[1])
                timer.setSeconds(dataSplit[2])
                const timerInSec = ((timer.getTime() - new Date().getTime()) / 1000) // timer - localtime
                if (timerInSec >= 0) {
                  this.$store.commit("startOrderTimer", timerInSec)
                }
              })
        }
      }, 10000)
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