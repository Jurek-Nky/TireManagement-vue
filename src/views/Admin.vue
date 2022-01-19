<template>
  <q-page>
    <q-tabs v-model="tab"
            dense
            active-bg-color="accent"
            indicator-color="white"
            align="justify"
            class="text-white bg-primary">
      <q-tab name="race" label="Rennen"/>
      <q-tab name="user" label="Benutzer"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated class="transparent">
      <q-tab-panel name="race" class="row justify-center full-height q-gutter-lg">
        <div class="column">
          <q-card rounded bordered class="shadow-5 bg-primary">
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
          <q-card rounded bordered class="shadow-5 bg-primary">
            <q-card-section class="text-h5 text-white">Prefixes</q-card-section>
            <q-card-section>
              <q-input v-model="prefix_hot" label="Hot" :dense="dense" dark type="number"/>
              <q-input v-model="prefix_medium" label="Medium" :dense="dense" dark type="number"/>
              <q-input v-model="prefix_cold" label="Cold" :dense="dense" dark type="number"/>
              <q-input v-model="prefix_intermediate" label="Inters" :dense="dense" dark type="number"/>
              <q-input v-model="prefix_dry_wet" label="Dry Wet" :dense="dense" dark type="number"/>
              <q-input v-model="prefix_heavy_wet" label="Heavy Wet" :dense="dense" dark type="number"/>
            </q-card-section>
            <q-card-section>
              <q-item-label class="text-negative" align="center">{{ prefixHint }}</q-item-label>
              <q-btn :color="prefixBtnColor" size="md" class="full-width" :icon="prefixBtnIcon"
                     @click="changePrefixes"></q-btn>
            </q-card-section>
          </q-card>
        </div>
        <div class="column">
          <q-table title="Rennen"
                   :rows="race_rows"
                   :columns="race_columns"
                   row-key="name"
                   hide-bottom
                   dark
                   card-class="bg-primary bordered"
                   separator="vertical">
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn icon="mdi-delete" @click="raceDelete(props.row)" color="white" flat dense></q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-tab-panel>
      <q-tab-panel name="user" class="row justify-center full-height q-gutter-lg">
        <div class="column">
          <q-card rounded bordered class="shadow-5 bg-primary">
            <q-card-section class="text-white text-h5">Benutzer erstellen</q-card-section>
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
        <div class="column">
          <q-table title="Benutzer"
                   :rows="rows"
                   :columns="columns"
                   row-key="name"
                   hide-bottom
                   dark
                   card-class="bg-primary bordered"
                   separator="horizontal">
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn icon="mdi-delete" @click="userDelete(props.row)" color="white" flat dense
                       v-if="props.row.rolle.roleName !== 'Admin'"></q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
const columns = [
  {name: 'name', required: true, label: 'username', align: 'left', field: row => row.username, sortable: true},
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
  data: () => {
    return {
      options: [
        'Employee', 'Manager', 'Ingenieur'
      ],
      role: '',
      date: new Date().toISOString(),
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
      tab: 'race',
      prefix_hot: 0,
      prefix_medium: 0,
      prefix_cold: 0,
      prefix_intermediate: 0,
      prefix_dry_wet: 0,
      prefix_heavy_wet: 0,
      prefixBtnColor: 'accent',
      prefixBtnIcon: 'mdi-check',
      prefixHint: '',
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

    },
    getPrefixData() {
      const apiUrl = this.$store.state.host.api_url
      const url = apiUrl + '/race/prefixes'
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
            this.prefix_hot = data[0].toString()
            this.prefix_medium = data[1].toString()
            this.prefix_cold = data[2].toString()
            this.prefix_intermediate = data[3].toString()
            this.prefix_dry_wet = data[4].toString()
            this.prefix_heavy_wet = data[5].toString()
          })
    },
    changePrefixes() {
      const prefList = [this.prefix_hot,
        this.prefix_medium,
        this.prefix_cold,
        this.prefix_intermediate,
        this.prefix_dry_wet,
        this.prefix_heavy_wet]
      console.log(prefList)
      let checkIfDuplicatesExist = arr => {
        return new Set(arr).size !== arr.length
      }
      if (checkIfDuplicatesExist(prefList)) {
        this.prefixHint = 'Liste hat doppelte Einträge'
        this.prefixBtnColor = 'negative'
        setTimeout(() => {
          this.prefixHint = ''
          this.prefixBtnColor = 'accent'
        }, 1500)
      } else if (prefList.includes('')) {
        this.prefixHint = 'Liste hat leere Einträge'
        this.prefixBtnColor = 'negative'
        setTimeout(() => {
          this.prefixHint = ''
          this.prefixBtnColor = 'accents'
        }, 1500)
      } else {
        const apiUrl = this.$store.state.host.api_url
        const url = apiUrl + '/race/prefixes'
        const jwt = this.$store.state.user.jwt
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt
          },
          body: JSON.stringify(prefList)
        }
        console.log(JSON.stringify(prefList))
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
              this.prefixBtnColor = 'positive'
              setTimeout(() => {
                this.prefixBtnColor = 'accent'
              }, 1500)

            })
      }
    }
  },
  mounted() {
    this.getUserData()
    this.getRaceData()
    this.getPrefixData()
  }
}
</script>