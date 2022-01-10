<template>
  <q-page class="row justify-center items-center">
    <div class="column">
      <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
        <q-card-section>
          <div class="q-pa-md">
            <q-table
                title="Auf Lager:"
                :rows="tireSetRows_inStock"
                :columns="tireSetColumns_inStock"
                row-key="id"
                class="bg-accent"
                dark
                no-data-label="Table is empty"
                :loading="loading_inStock"
            >
              <template v-slot:loading>
                <q-inner-loading showing color="primary"/>
              </template>
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th auto-width/>
                  <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width>
                    <q-btn outline rounded size="sm" color="white" @click="props.expand = !props.expand"
                           :icon="props.expand ? 'mdi-minus' : 'mdi-plus'"/>
                  </q-td>
                  <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                  >

                    <div v-if="col.name==='delete'" class="q-gutter-sm">
                      <q-btn icon="mdi-delete" @click="tireSetDelete(props.row)" flat color="negative"
                             dense></q-btn>
                    </div>
                    <div v-else-if="col.name==='heating'">
                      <q-btn icon="mdi-fire" @click="tireSetStartHeatingTimer(props.row)" color="orange" flat
                             dense></q-btn>
                      <q-btn icon="mdi-stop" @click="tireSetEndHeatingTimer(props.row)" color="negative" flat
                             dense></q-btn>
                    </div>
                    <div v-else-if="col.name==='used'">
                      <q-btn icon="mdi-swap-horizontal" @click="tireSetStatusUsed(props.row)" color="secondary" flat
                             dense></q-btn>
                    </div>
                    <div v-else>
                      {{ col.value }}
                    </div>

                  </q-td>

                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                  <q-td colspan="100%">
                    <q-table
                        title="Tires"
                        :rows="props.row.tires"
                        :columns="tireColumns"
                        row-key="tireID"
                        hide-bottom
                        dark
                        class="bg-secondary"
                    >
                    </q-table>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card-section>
      </q-card>
      <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
        <q-card-section>
          <div class="q-pa-md">
            <q-table
                title="Benutzt:"
                :rows="tireSetRows_used"
                :columns="tireSetColumns_used"
                row-key="id"
                class="bg-accent"
                dark
                no-data-label="Table is empty"
                :loading="loading_used"
            >
              <template v-slot:loading>
                <q-inner-loading showing color="primary"/>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width>
                    <q-btn outline rounded size="sm" color="white" @click="props.expand = !props.expand"
                           :icon="props.expand ? 'mdi-minus' : 'mdi-plus'"/>
                  </q-td>
                  <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                  >

                    <div v-if="col.name==='delete'" class="q-gutter-sm">
                      <q-btn icon="mdi-delete" @click="tireSetDeletBtn(props.row)" flat color="negative"
                             dense></q-btn>
                    </div>
                    <div v-if="col.name==='startHeating'" class="q-gutter-sm">
                      <q-btn icon="mdi-fire" @click="tireSetHeatingTimer(props.row)" color="orange" flat
                             dense></q-btn>
                    </div>
                    <div v-else>
                      {{ col.value }}
                    </div>

                  </q-td>

                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                  <q-td colspan="100%">
                    <q-table
                        title="Tires"
                        :rows="props.row.tires"
                        :columns="tireColumns"
                        row-key="tireID"
                        hide-bottom
                        dark
                        class="bg-secondary"
                    >
                    </q-table>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card-section>
      </q-card>
    </div>

  </q-page>
</template>

<script>

const tireSetColumns_inStock = [
  {name: 'name', required: true, label: 'ID:', align: 'left', field: row => row.id, sortable: true},
  {name: 'status', align: 'left', label: 'Status', field: row => row.status, sortable: true},
  {name: 'nr', align: 'left', label: 'SetNr', field: row => row.tireSetNr, sortable: true},
  {name: 'delete', label: 'Delete', align: 'center'},
  {name: 'heating', label: 'Heizen', align: 'center'},
  {name: 'used', label: 'Benutzt', align: 'center'},
]
const tireSetColumns_used = [
  {name: 'name', required: true, label: 'ID:', align: 'left', field: row => row.id, sortable: true},
  {name: 'status', align: 'left', label: 'Status', field: row => row.status, sortable: true},
  {name: 'nr', align: 'left', label: 'SetNr', field: row => row.tireSetNr, sortable: true},
  {name: 'delete', label: 'Delete', align: 'center'},
  {name: 'heating', label: 'Heizen', align: 'center'},
  {name: 'used', label: 'Benutzt', align: 'center'},
]
const tireColumns = [
  {name: 'name', required: true, label: 'ID', align: 'left', field: row => row.tireID, sortable: true},
  {
    name: 'bezeichnung',
    required: true,
    label: 'Bezeichnung',
    align: 'left',
    field: row => row.bezeichnung,
    sortable: true
  },
  {
    name: 'art',
    required: true,
    label: 'Art',
    align: 'left',
    field: row => row.art,
    sortable: true
  },
  {
    name: 'mischung',
    required: true,
    label: 'Mischung',
    align: 'left',
    field: row => row.mischung,
    sortable: true
  },
  {name: 'bestellt', required: true, label: 'Bestellt', align: 'left', field: row => row.bestelltUm, sortable: true},
  {name: 'erhalten', required: true, label: 'Erhalten', align: 'left', field: row => row.erhaltenUm, sortable: true},
  {
    name: 'heizbeginn',
    required: true,
    label: 'Heiz-Beginn',
    align: 'left',
    field: row => row.heatingStart,
    sortable: true
  },
  {name: 'heizende', required: true, label: 'Heiz-Ende', align: 'left', field: row => row.heatingStop, sortable: true},
  {
    name: 'temperatur',
    required: true,
    label: 'Temperatur',
    align: 'left',
    field: row => row.heatingTemp,
    sortable: true
  },
]


export default {
  data: () => {
    return {
      loading_inStock: false,
      loading_used: false,
      tireSetColumns_inStock,
      tireSetColumns_used,
      tireColumns,
      tireSetRows_inStock: [],
      tireSetRows_used: []
    }
  },
  methods: {
    getAllTireSets() {
      this.loading_inStock = true
      this.loading_used = true
      this.tireSetRows_used = []
      this.tireSetRows_inStock = []
      // get all tires with status "auf lager"
      const apiUrl = this.$store.state.host.api_url
      let url = new URL(apiUrl + '/tireset/status')
      let data = {
        status: 'auf lager'
      }
      for (let k in data
          ) {
        url.searchParams.append(k, data[k]);
      }
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      let resp1
      fetch(url, requestOptions)
          .then(response => {
            resp1 = response
            return response.json()
          })
          .then(
              data => {
                this.loading_inStock = false
                if (resp1.status === 200) {
                  this.tireSetRows_inStock = data
                } else if (resp1.status === 500) {
                  console.log(data.message)
                }
              }
          )
      // get all tires with status "benutzt"
      url = new URL(apiUrl + '/tireset/status')
      data = {
        status: 'benutzt'
      }
      for (let k in data
          ) {
        url.searchParams.append(k, data[k]);
      }
      let resp2
      fetch(url, requestOptions)
          .then(response => {
            resp2 = response
            return response.json()
          })
          .then(
              data => {
                this.loading_used = false
                if (resp2.status === 200) {
                  this.tireSetRows_used = data
                } else if (resp2.status === 500) {
                  console.log(data.message)
                }
              }
          )
    },
    tireSetDelete(tireSet) {
      const apiUrl = this.$store.state.host.api_url
      const url = `${apiUrl}/tireset/delete/${tireSet.id}`
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      let resp
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then(data => {
                if (resp.ok) {
                  this.getAllTireSets()
                } else {
                  console.log(data)
                }
              }
          )
    }
    ,
    tireSetStartHeatingTimer(tireSet) {
      const apiUrl = this.$store.state.host.api_url
      const url = `${apiUrl}/tireset/update/${tireSet.id}/heatingStart`
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      let resp
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then(data => {
                if (resp.ok) {
                  this.getAllTireSets()
                } else {
                  console.log(data)
                }
              }
          )
    }
    ,
    tireSetEndHeatingTimer(tireSet) {
      const apiUrl = this.$store.state.host.api_url
      const url = `${apiUrl}/tireset/update/${tireSet.id}/heatingStop`
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      let resp
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then(data => {
                if (resp.ok) {
                  this.getAllTireSets()
                } else {
                  console.log(data)
                }
              }
          )
    }
    ,
    tireSetStatusUsed(tireSet) {
      const apiUrl = this.$store.state.host.api_url
      const url = new URL(`${apiUrl}/tireset/update/${tireSet.id}/status`)
      let data = {
        status: 'benutzt'
      }
      for (let k in data
          ) {
        url.searchParams.append(k, data[k]);
      }
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      let resp
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then(data => {
                if (resp.ok) {
                  this.getAllTireSets()
                } else {
                  console.log(data)
                }
              }
          )
    }
    ,
  },
  mounted() {
    this.getAllTireSets()
  }
}
</script>