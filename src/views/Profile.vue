<template>
  <q-page class="row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="password-h5 q-my-md">Passwort aendern</h5>
      </div>
      <div class="row">
        <q-card rounded bordered class="q-pa-lg shadow-5">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input disable filled v-model="username" type="text" label="username"/>
              <q-input filled v-model="passwordOld" type="password" label="Altes Passwort" :hint="pwOldHint"
                       ref="passwordOld" @keydown="resetHints"/>
              <q-input filled v-model="passwordNew" type="password" label="Neues Password" :hint="pwNewHint"
                       ref="passwordNew" @keydown="resetHints"/>
              <q-input filled v-model="passwordVerify" type="password" label="Password wiederholen" :hint="pwVerifyHint"
                       ref="passwordVerify" @keydown="resetHints"/>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn :color="changeBtnColor" size="md" class="full-width" :icon="changeBtnIcon"
                   @click="changePassword"></q-btn>
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
      username: localStorage.getItem("username"),
      passwordOld: '',
      passwordNew: '',
      passwordVerify: '',
      pwOldHint: '',
      pwNewHint: '',
      pwVerifyHint: '',
      changeBtnIcon: 'mdi-autorenew',
      changeBtnColor: 'secondary'
    }
  },
  methods: {
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
      const url = new URL('http://limla.ml:8081/api/v1/user/resetpw')
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
        this.changeBtnColor = "secondary"
      }, 1400)
    }
  }
}
</script>
