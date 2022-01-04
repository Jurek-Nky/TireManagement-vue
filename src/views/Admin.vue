<template>
  <q-page class="row justify-center items-center">
    <div class="column">
      <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
        <q-card-section class="text-white text-h5">Rennen erstellen</q-card-section>
        <q-card-section>
          <q-input filled v-model="date" dark mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="mdi-calendar" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-form class="q-gutter-md">
            <q-input dense label-color="accent" dark filled v-model="raceName" type="text"
                     label="Name" ref="raceName"/>
            <q-input dense label-color="accent" dark filled v-model="location" type="text"
                     label="Ort" ref="location"/>
            <q-input dense label-color="accent" dark filled v-model="cont" type="number"
                     label="Kontingent" ref="cont"/>
          </q-form>
        </q-card-section>
        <q-card-section>
          <q-btn color="accent" size="md" class="full-width" icon="mdi-plus"
                 @click="createRace"></q-btn>
        </q-card-section>
      </q-card>
    </div>
    <div class="column">
      <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
        <q-card-section class="text-white text-h5">Rennen</q-card-section>
        <q-card-section>

        </q-card-section>
      </q-card>
    </div>
    <div class="column">
      <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
        <q-card-section class="text-white text-h5">Benutzer</q-card-section>
        <q-card-section>

        </q-card-section>
      </q-card>
    </div>
    <div class="column">
      <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
        <q-card-section class="text-white text-h5">Benutzerverwaltung</q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input dense label-color="accent" dark filled v-model="username" type="text"
                     label="username" ref="username" :hint="userNameHint" @keydown="clearUserHints"/>
            <q-input dense label-color="accent" dark filled v-model="password" type="password"
                     label="password" ref="password" :hint="passwordHint" @keydown="clearUserHints"/>
            <q-select dark outlined color="accent" label-color="accent" transition-show="flip-up"
                      transition-hide="flip-down"
                      v-model="role" :options="options"
                      label="Rolle"/>
          </q-form>
        </q-card-section>
        <q-card-section>
          <q-btn :color="userAddBtnColor" size="md" class="full-width" :icon="userAddBtnIcon" @click="
                 createUser
          "></q-btn>
        </q-card-section>
      </q-card>
    </div>

  </q-page>
</template>

<script>
import {ref} from 'vue'

export default {
  name: "Admin",
  setup() {
    return {
      date: ref('2022/01/01'),
      role: ref(null),
      options: [
        'Employee', 'Manager', 'Ingenieur'
      ]
    }
  },
  data: () => {
    return {
      raceName: '',
      location: '',
      cont: null,
      username: '',
      userNameHint: '',
      password: '',
      passwordHint: '',
      userAddBtnColor: 'accent',
      userAddBtnIcon: 'mdi-plus'
    }
  },
  methods: {
    createRace() {
      alert("test")
    },
    createUser() {
      const url = 'http://limla.ml:8081/api/v1/user/register'
      const data = {
        username: this.username,
        password: this.password,
        rolle: {
          roleName: this.role
        }
      }
      const token = localStorage.getItem("authToken")
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
      }
      let resp
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then(data => {
            if (resp.ok) {
              this.clearUserFields()
              this.userAddBtnColor = "positive"
              this.userAddBtnIcon = "mdi-check"
              setTimeout(() => {
                this.userAddBtnIcon = "mdi-plus"
                this.userAddBtnColor = "accent"
              }, 1500)
            } else if (data.message === `User with username: ${this.username} already exists.`) {
              this.userNameHint = data.message
              this.userAddBtnError()
            } else if (data.message === "Password must be at least 8 characters.") {
              this.passwordHint = data.message
              this.userAddBtnError()
            }
          })
    },
    clearUserFields() {
      this.username = ''
      this.password = ''
      this.role = null
    },
    clearUserHints() {
      this.userNameHint = ''
      this.passwordHint = ''
    },
    userAddBtnError() {
      this.userAddBtnColor = "negative"
      this.userAddBtnIcon = "mdi-alert"
      setTimeout(() => {
        this.userAddBtnIcon = "mdi-plus"
        this.userAddBtnColor = "accent"
      }, 1500)
    }
  }
}
</script>

<style scoped>

</style>