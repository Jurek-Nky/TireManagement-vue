<template>
  <q-page padding>
    <div class="row q-gutter-lg">
      <div class="col-grow">
        <q-card bordered class="q-pa-lg bg-primary" rounded>
          <q-card-section class="text-white text-h5">Passwort aendern</q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input v-model="username" dark readonly filled label="username" label-color="white"
                       type="text"/>
              <q-input ref="passwordOld" v-model="passwordOld" :hint="pwOldHint" dark filled
                       label="Altes Passwort"
                       label-color="white"
                       type="password" @keydown="resetHints"/>
              <q-input ref="passwordNew" v-model="passwordNew" :hint="pwNewHint" dark filled
                       label="Neues Password"
                       label-color="white"
                       type="password" @keydown="resetHints"/>
              <q-input ref="passwordVerify" v-model="passwordVerify" :hint="pwVerifyHint" dark filled
                       label="Password wiederholen" label-color="white"
                       type="password" @keydown="resetHints"/>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn :color="changeBtnColor" :icon="changeBtnIcon" class="full-width" size="md"
                   @click="changePassword"></q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-grow">
        <q-card bordered class="q-pa-lg shadow-5 bg-primary" rounded>
          <q-card-section>
            <span class="text-subtitle1 text-white">Settings</span>
          </q-card-section>
          <q-separator dark/>
          <q-card-section class="column q-gutter-sm">
            <q-toggle v-model="weatherNotification" class="text-white" color="secondary"
                      dark label="I want to get Notification for Weather Timer"/>
            <q-toggle v-model="orderNotification" class="text-white" color="secondary"
                      dark label="I want to get Notification for Order Timer"/>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="accent" label="save" @click="updateNotifications"></q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Profile",
  data: () => {
    return {
      username: '',
      passwordOld: '',
      passwordNew: '',
      passwordVerify: '',
      pwOldHint: '',
      pwNewHint: '',
      pwVerifyHint: '',
      changeBtnIcon: 'mdi-autorenew',
      changeBtnColor: 'accent',
      weatherNotification: null,
      orderNotification: null,
    }
  },
  mounted() {
    this.username = this.$store.state.user.userName
    this.getUserSettings()
  }
  ,
  methods: {
    updateNotifications() {
      this.$store.commit('setWeatherNotifications', this.weatherNotification)
      this.$store.commit('setOrderNotifications', this.orderNotification)
      const apiUrl = this.$store.state.host.api_url
      let url = new URL(`${apiUrl}/user/update/userSettings`)
      url.searchParams.append('u', this.$store.state.user.userName)
      const data = {
        darkMode: true,
        getOrderNotifications: this.orderNotification,
        getWeatherNotifications: this.weatherNotification
      }
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt
        },
        body: JSON.stringify(data)
      }
      let resp
      fetch(url, requestOptions)
    },
    changePassword() {
      if (this.passwordOld === '') {
        this.pwOldHint = "enter your old password"
        return
      } else if (this.passwordNew === '') {
        this.pwNewHint = "enter a new password"
        return
      } else if (this.passwordOld === this.passwordNew) {
        this.pwNewHint = "old and new password are the same"
        return
      } else if (this.passwordVerify === '') {
        this.pwVerifyHint = "retype your new password"
        return
      } else if (this.passwordNew !== this.passwordVerify) {
        this.pwVerifyHint = "passwords do not match"
        return
      }

      // create url and add params
      const apiUrl = this.$store.state.host.api_url
      const url = new URL(apiUrl + '/user/resetpw')
      const data = {
        pwold: this.passwordOld,
        pwnew: this.passwordNew,
        username: this.username
      }
      for (let k in data) {
        url.searchParams.append(k, data[k]);
      }
      const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`},
      }
      let resp;
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then(data => {
            if (!resp.ok) {
              if (data.message === "Wrong password.") {
                this.pwOldHint = data.message
                this.changeBtnIcon = "mdi-alert"
                this.changeBtnColor = "negative"
                this.resetButtonColorAndIcon()
              } else if (data.message === "Password must be at least  8 characters long.") {
                this.pwNewHint = data.message
                this.changeBtnIcon = "mdi-alert"
                this.resetButtonColorAndIcon()
              }
              return
            }
            this.changeBtnIcon = "mdi-check"
            this.changeBtnColor = "positive"
            this.resetButtonColorAndIcon()
            this.passwordOld = this.passwordNew = this.passwordVerify = ''
          })
    },
    resetHints() {
      this.pwOldHint = ''
      this.pwNewHint = ''
      this.pwVerifyHint = ''
    },
    resetButtonColorAndIcon() {
      setTimeout(() => {
        this.changeBtnIcon = "mdi-autorenew"
        this.changeBtnColor = "accent"
      }, 1400)
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
            this.weatherNotification = data.getWeatherNotifications
            this.orderNotification = data.getOrderNotifications
          })
    }
  }
}
</script>
