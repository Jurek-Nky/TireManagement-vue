<template>
  <q-page class="q-ma-lg">
    <div class="row justify-center q-gutter-lg">
      <div class="column">
        <q-card rounded bordered class="q-pa-lg shadow-5 bg-primary">
          <q-card-section class="text-white text-h5">Passwort aendern</q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input label-color="accent" dark disable filled v-model="username" type="text"
                       label="username"/>
              <q-input label-color="accent" dark filled v-model="passwordOld" type="password"
                       label="Altes Passwort"
                       :hint="pwOldHint"
                       ref="passwordOld" @keydown="resetHints"/>
              <q-input label-color="accent" dark filled v-model="passwordNew" type="password"
                       label="Neues Password"
                       :hint="pwNewHint"
                       ref="passwordNew" @keydown="resetHints"/>
              <q-input label-color="accent" dark filled v-model="passwordVerify" type="password"
                       label="Password wiederholen" :hint="pwVerifyHint"
                       ref="passwordVerify" @keydown="resetHints"/>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn :color="changeBtnColor" size="md" class="full-width" :icon="changeBtnIcon"
                   @click="changePassword"></q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="column">
        <q-card rounded bordered class="q-pa-lg shadow-5 bg-primary">
          <q-card-section>
            <span class="text-subtitle1 text-white">Settings</span>
          </q-card-section>
          <q-separator dark/>
          <q-card-section class="column q-gutter-sm">
            <q-toggle label="I want to get Notification for Weather Timer" v-model="weatherNotification" dark
                      color="accent" class="text-white"/>
            <q-toggle label="I want to get Notification for Order Timer" v-model="orderNotification" dark
                      color="accent" class="text-white"/>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="save" color="accent" @click="updateNotifications"></q-btn>
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
      weatherNotification: true,
      orderNotification: true,
    }
  }, mounted() {
    this.username = this.$store.state.user.userName
  }
  ,
  methods: {
    updateNotifications() {
      console.log(this.weatherNotification + " : " + this.orderNotification)
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
    }
  }
}
</script>
