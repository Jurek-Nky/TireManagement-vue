<template>
  <q-page>
    <q-tabs v-model="tab"
            active-bg-color="accent"
            align="justify"
            class="text-white bg-primary"
            dense
            indicator-color="white" no-caps>
      <q-tab label="Rennen" name="race"/>
      <q-tab label="Benutzer" name="user"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated class="transparent">
      <q-tab-panel class="row justify-center full-height q-gutter-lg" name="race">
        <div class="column">
          <q-card bordered class="shadow-5 bg-primary" rounded>
            <q-card-section class="text-white text-h5">Rennen erstellen</q-card-section>
            <q-card-section>
              <q-input v-model="date" :rules="['date']" dark filled mask="date">
                <template v-slot:append>
                  <q-icon class="cursor-pointer" name="mdi-calendar">
                    <q-popup-proxy ref="qDateProxy" cover transition-hide="scale" transition-show="scale">
                      <q-date v-model="date">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup color="primary" flat label="Close"/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-form class="q-gutter-md">
                <q-input ref="raceName" v-model="raceName" dark dense filled label="Name"
                         label-color="white" type="text"/>
                <q-input ref="location" v-model="location" dark dense filled label="Ort"
                         label-color="white" type="text"/>
                <q-input ref="cont" v-model="cont" dark dense filled label="Kontingent"
                         label-color="white" type="number"/>
                <q-input ref="cont" v-model="raceLength" dark dense filled label="Laenge"
                         label-color="white" type="number"/>
              </q-form>
            </q-card-section>
            <q-card-section>
              <q-btn :color="raceAddBtnColor" :icon="raceAddBtnIcon" class="full-width" size="md"
                     @click="createRace"></q-btn>
            </q-card-section>
          </q-card>
        </div>
        <div class="column">
          <q-card bordered class="shadow-5 bg-primary" rounded>
            <q-card-section class="text-h5 text-white">Prefixes</q-card-section>
            <q-card-section class="q-gutter-md">
              <q-input v-model="prefix_hot" :dense="dense" dark filled label="Hot"/>
              <q-input v-model="prefix_medium" :dense="dense" dark filled label="Medium"/>
              <q-input v-model="prefix_cold" :dense="dense" dark filled label="Cold"/>
              <q-input v-model="prefix_intermediate" :dense="dense" dark filled label="Inters"/>
              <q-input v-model="prefix_dry_wet" :dense="dense" dark filled label="Dry Wet"/>
              <q-input v-model="prefix_heavy_wet" :dense="dense" dark filled label="Heavy Wet"/>
            </q-card-section>
            <q-card-section>
              <q-item-label align="center" class="text-negative">{{ prefixHint }}</q-item-label>
              <q-btn :color="prefixBtnColor" :icon="prefixBtnIcon" class="full-width" size="md"
                     @click="changePrefixes"></q-btn>
            </q-card-section>
          </q-card>
        </div>
        <div class="column">
          <q-table :columns="race_columns"
                   :pagination="{rowsPerPage: 0,sortBy: 'id',descending : true}"
                   :rows="race_rows"
                   card-class="bg-primary bordered"
                   dark
                   hide-bottom
                   row-key="name"
                   title="Rennen">
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn color="white" dense flat icon="mdi-delete" @click="raceDelete(props.row)"></q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-tab-panel>
      <q-tab-panel class="row justify-center full-height q-gutter-lg" name="user">
        <div class="column">
          <q-card bordered class="shadow-5 bg-primary" rounded>
            <q-card-section class="text-white text-h5">Benutzer erstellen</q-card-section>
            <q-card-section>
              <q-form class="q-gutter-sm">
                <q-input v-model="username" :hint="userNameHint" dark dense filled hide-bottom-space
                         label="Username" label-color="white" type="text" @keydown="clearUserHints"/>
                <q-input ref="password" v-model="password" :hint="passwordHint" dark dense filled
                         hide-bottom-space label="Password" label-color="white" type="password"
                         @keydown="clearUserHints"/>
                <q-select v-model="role" :hint="roleHint" :options="options" dark dense filled hide-bottom-space
                          label="Rolle" label-color="white" outlined transition-hide="jump-up" transition-show="jump-down"
                          @add="clearUserHints"/>
              </q-form>
            </q-card-section>
            <q-card-section>
              <q-btn :color="userAddBtnColor" :icon="userAddBtnIcon" class="full-width" size="md" @click="
                 createUser
          "></q-btn>
            </q-card-section>
          </q-card>
        </div>
        <div class="column">
          <q-table :columns="columns"
                   :rows="rows"
                   card-class="bg-primary bordered"
                   dark
                   hide-bottom
                   row-key="name"
                   separator="horizontal"
                   title="Benutzer">
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in props.cols"
                      :key="col.name"
                      :props="props">
                  <div v-if="col.name === 'role' && props.row.rolle.roleName !== 'Admin'">
                    <q-badge class="cursor-pointer" color="accent">
                      {{ col.value }}
                    </q-badge>
                    <q-popup-edit v-slot="scope" v-model="newUserRole" buttons
                                  color="accent" persistent title="Role"
                                  @save="setNewUserRole(props.row)">
                      <q-select v-model="scope.value" :options="options" emit-value>
                      </q-select>
                    </q-popup-edit>

                  </div>
                  <div v-else-if="col.name === 'delete'">
                    <q-btn v-if="props.row.rolle.roleName !== 'Admin'" color="white" dense
                           flat icon="mdi-delete" @click="userDelete(props.row)"></q-btn>
                  </div>
                  <div v-else-if="col.name === 'password'">
                    <q-btn v-if="props.row.rolle.roleName !== 'Admin'" dark dense flat icon="mdi-cached" no-caps/>
                    <q-popup-edit v-slot="scope" v-model="adminResetPasswordField" buttons color="white"
                                  dark @save="adminResetPassword(props.row)">
                      <q-input v-model="scope.value" dark filled label="new password" label-color="white"
                               type="password"></q-input>
                    </q-popup-edit>
                  </div>
                  <div v-else>
                    {{ col.value }}
                  </div>
                </q-td>
              </q-tr>

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
  {name: 'delete', label: 'delete', align: 'center'},
  {name: 'password', label: 'password reset', align: 'center'},
]
const race_columns = [
  {name: 'name', required: true, label: 'Name', align: 'left', field: row => row.name, sortable: true},
  {name: 'date', align: 'left', label: 'Datum', field: row => row.date, sortable: true},
  {name: 'location', align: 'left', label: 'Ort', field: row => row.location, sortable: true},
  {name: 'length', align: 'left', label: 'Laenge', field: row => row.length, sortable: true},
  {name: 'contingent', align: 'left', label: 'Kontingent', field: row => row.tireContingent, sortable: true},
  {name: 'id', required: true, align: 'left', label: 'ID', field: row => row.raceID, sortable: true},
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
      roleHint: '',
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
      adminResetPasswordField: '',
      newUserRole: '',
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
      this.clearUserHints()
      if (this.username.length < 4) {
        this.userNameHint = 'Username must be at least 4 characters'
        return
      } else if (this.password.length < 8) {
        this.passwordHint = 'Password must be at least 8 characters'
        return
      } else if (this.role === '') {
        this.roleHint = 'Select a role'
        return
      }
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
      this.roleHint = ''
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
    },
    setNewUserRole(user) {
      setTimeout(() => {
        console.log(this.adminResetPasswordField)
        const apiUrl = this.$store.state.host.api_url
        let url = new URL(`${apiUrl}/user/update/userrole`)
        url.searchParams.append('id', user.userid)
        url.searchParams.append('role', this.newUserRole)
        const jwt = this.$store.state.user.jwt
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + jwt
          }
        }
        fetch(url, requestOptions)
            .then(response => {
              this.newUserRole = ''
              if (response.status === 200) {
                this.getUserData()
              } else {
                console.log(response)
              }
            })
      }, 5)
    },
    adminResetPassword(user) {
      setTimeout(() => {
        console.log(this.adminResetPasswordField)
        const apiUrl = this.$store.state.host.api_url
        let url = new URL(`${apiUrl}/user/admin/resetpw`)
        url.searchParams.append('id', user.userid)
        url.searchParams.append('pwnew', this.adminResetPasswordField)
        const jwt = this.$store.state.user.jwt
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + jwt
          }
        }
        fetch(url, requestOptions)
            .then(response => {
              this.adminResetPasswordField = ''
              if (response.status !== 200) {
                console.log(response)
              }
            })
      }, 5)
    }
  },
  mounted() {
    this.getUserData()
    this.getRaceData()
    this.getPrefixData()
  }
}
</script>