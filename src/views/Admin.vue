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
            <q-input dense label-color="accent" dark filled v-model="raceLength" type="number"
                     label="Laenge" ref="cont"/>
          </q-form>
        </q-card-section>
        <q-card-section>
          <q-btn :color="raceAddBtnColor" size="md" class="full-width" :icon="raceAddBtnIcon"
                 @click="createRace"></q-btn>
        </q-card-section>
      </q-card>
    </div>
    <div class="column">
      <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
        <q-card-section>
          <q-table
              title="Rennen"
              :rows="race_rows"
              :columns="race_columns"
              row-key="name"
              hide-bottom
              dark
              card-class="bg-primary bordered"
              separator="vertical"
          >
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn icon="mdi-delete" @click="raceDelete(props.row)" color="negative" dense></q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
    <div class="column">
      <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
        <q-card-section>
          <div class="q-pa-md">
            <q-table
                title="Benutzer"
                :rows="rows"
                :columns="columns"
                row-key="name"
                hide-bottom
                dark
                card-class="bg-primary bordered"
                separator="vertical"
            >
              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <q-btn icon="mdi-delete" @click="userDelete(props.row)" color="negative" dense
                         v-if="props.row.rolle.roleName !== 'Admin'"></q-btn>
                </q-td>
              </template>
            </q-table>
          </div>
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
            <q-select dark outlined color="accent" label-color="accent" transition-show="jump-down"
                      transition-hide="jump-up"
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

const columns = [
  {name: 'name', required: true, label: 'username:', align: 'left', field: row => row.username, sortable: true},
  {name: 'role', align: 'left', label: 'role', field: row => row.rolle.roleName, sortable: true},
  {name: 'id', align: 'left', label: 'id', field: row => row.userid, sortable: true},
  {name: 'action', label: 'actions', align: 'left'},
]
const race_columns = [
  {name: 'name', required: true, label: 'Name', align: 'left', field: row => row.name, sortable: true},
  {name: 'date', align: 'left', label: 'Datum', field: row => row.date, sortable: true},
  {name: 'location', align: 'left', label: 'Ort', field: row => row.location, sortable: true},
  {name: 'length', align: 'left', label: 'Laenge', field: row => row.length, sortable: true},
  {name: 'contingent', align: 'left', label: 'Kontingent', field: row => row.tireContingent, sortable: true},
  {name: 'id', align: 'left', label: 'ID', field: row => row.raceID, sortable: true},
  {name: 'action', label: 'actions', align: 'left'},
]
export default {
  name: "Admin",
  setup() {
    const selected = ref([])
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
      raceLength: '',
      username: '',
      userNameHint: '',
      password: '',
      passwordHint: '',
      userAddBtnColor: 'accent',
      userAddBtnIcon: 'mdi-plus',
      raceAddBtnColor: 'accent',
      raceAddBtnIcon: 'mdi-plus',
      rows: [],
      race_rows: [],
      columns,
      race_columns,

    }
  },
  methods: {
    createRace() {
      const apiUrl = this.$store.state.host.api_url
      const url = apiUrl + '/race/new'
      const data = {
        date: this.date.replaceAll('/', '-'),
        length: this.length,
        location: this.location,
        name: this.raceName,
        tireContingent: this.cont
      }
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt
        },
        body: JSON.stringify(data)
      }
      let resp;
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            if (response.status !== 200) {
              console.log(response)
              return
            }
            return response.json()
          })
          .then(() => {
            this.getRaceData()
            this.clearRaceFields()
            this.raceAddBtnIcon = 'mdi-check'
            this.raceAddBtnColor = 'positive'
            setTimeout(() => {
              this.raceAddBtnColor = 'accent'
              this.raceAddBtnIcon = 'mdi-plus'
            }, 1500)
          })
    },
    clearRaceFields() {
      this.raceName = ''
      this.location = ''
      this.cont = ''
      this.raceLength = ''
    },
    createUser() {
      const apiUrl = this.$store.state.host.api_url
      const url = apiUrl + '/user/register'
      const data = {
        username: this.username,
        password: this.password,
        rolle: {
          roleName: this.role
        }
      }
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt
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
              this.getUserData()
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
    },
    getUserData() {
      const apiUrl = this.$store.state.host.api_url
      const url = apiUrl + '/user/all'
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + jwt
        }
      }
      fetch(url, requestOptions)
          .then(response => {
            if (response.status !== 200) {
              console.log(response)
              return
            }
            return response.json()
          })
          .then(data => {
            this.rows = data
          })
    },
    userDelete(user) {
      const jwt = this.$store.state.user.jwt
      const apiUrl = this.$store.state.host.api_url
      const url = `${apiUrl}/user/${user.userid}/delete`
      const requestOptions = {
        method: 'Delete',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      fetch(url, requestOptions)
          .then(response => {
            if (response.ok) {
              this.getUserData()
            }
          })

    },
    getRaceData() {
      this.race_rows = []
      const apiUrl = this.$store.state.host.api_url
      const url = apiUrl + '/race/all'
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt
        },
      }
      fetch(url, requestOptions)
          .then(response => {
            if (response.status !== 200) {
              return
            }
            return response.json()
          })
          .then(data => {
            this.race_rows = data
          })
    },
    raceDelete(race) {
      const jwt = this.$store.state.user.jwt
      const apiUrl = this.$store.state.host.api_url
      const url = `${apiUrl}/race/delete/${race.raceID}`
      const requestOptions = {
        method: 'Delete',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      fetch(url, requestOptions)
          .then(response => {
            if (response.ok) {
              this.getRaceData()
            }
          })

    }
  },
  mounted() {
    this.getUserData()
    this.getRaceData()
  }
}
</script>

<style scoped>

</style>