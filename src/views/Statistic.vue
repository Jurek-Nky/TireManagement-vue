<template>
  <q-page class="row justify-center items-center">
    <div class="column">
      <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
        <q-card-section>
          <div class="q-pa-md" style="max-width: 300px">
            <div class="q-gutter-md">
              <q-select  filled v-model="model" :options="options" label="Race Options" />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <q-card rounded bordered class="q-pa-md q-ma-lg shadow-5 bg-primary">
                <q-card-section>
                  <q-table title="Tires"
                           :rows="tireSetRows_used"
                           :columns="tireSetColumns_used"
                           row-key="id"
                           class="bg-primary"
                           dark
                           no-data-label="Table is empty"
                           :loading="loading_used">
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
                      <q-tr v-if="this.showTire" :props="props">
                        <q-td auto-width>
                          <q-btn outline rounded size="sm" color="white" @click="props.expand = !props.expand"
                                 :icon="props.expand ? 'mdi-minus' : 'mdi-plus'"/>
                        </q-td>
                        <q-td v-for="col in props.cols"
                              :key="col.name"
                              :props="props">
                          <div>
                            {{ col.value }}
                          </div>

                        </q-td>

                      </q-tr>
                      <q-tr v-show="props.expand" :props="props">
                        <q-td colspan="100%">
                          <q-table title="Tires"
                                   :rows="props.row.tires"
                                   :columns="tireColumns"
                                   row-key="tireID"
                                   hide-bottom
                                   dark
                                   class="bg-primary"
                                   bordered>
                          </q-table>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-6">
              <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
                <q-card-section>
                  <q-table title="Wetter"
                           :rows="weather_rows"
                           :columns="weather_columns"
                           row-key="id"
                           class="bg-primary"
                           dark
                           no-data-label="Table is empty"
                           :loading="loading_used">
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
                        <q-td v-for="col in props.cols"
                              :key="col.name"
                              :props="props">
                          <div v-if="col.name==='delete'" class="q-gutter-sm">
                            <q-btn icon="mdi-delete" @click="tireSetDelete(props.row)" flat color="white"
                                   dense></q-btn>
                          </div>
                          <div v-else>
                            {{ col.value }}
                          </div>

                        </q-td>

                      </q-tr>
                      <q-tr v-show="props.expand" :props="props">
                        <q-td colspan="100%">
                          <q-table title="Tires"
                                   :rows="props.row.tires"
                                   :columns="tireColumns"
                                   row-key="tireID"
                                   hide-bottom
                                   dark
                                   class="bg-primary"
                                   bordered>
                          </q-table>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </div>
          </div>
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
  {name: 'cond', label: 'Race options', align: 'left', field: row => row.name, sortable: true},
]
const race_columns = [
  {name: 'name', required: true, label: 'Name', align: 'left', field: row => row.name, sortable: true},
  {name: 'date', align: 'left', label: 'Datum', field: row => row.date, sortable: true},
  {name: 'location', align: 'left', label: 'Ort', field: row => row.location, sortable: true},
  {name: 'length', align: 'left', label: 'Laenge', field: row => row.length, sortable: true},
  {name: 'contingent', align: 'left', label: 'Kontingent', field: row => row.tireContingent, sortable: true},
  {name: 'id', align: 'left', label: 'ID', field: row => row.raceID, sortable: true}
]
const tireSetColumns_used = [
  {name: 'name', required: true, label: 'ID:', align: 'left', field: row => row.id, sortable: true},
  {name: 'status', align: 'left', label: 'Status', field: row => row.status, sortable: true},
  {name: 'nr', align: 'left', label: 'SetNr', field: row => row.tireSetNr, sortable: true},
  {name: 'race', align: 'left', label: 'RaceID', field: row => row.race.raceID, sortable: true}
]
const weather_columns = [
  {
    name: 'weatherConditions',
    required: true,
    label: 'Weather cond',
    align: 'left',
    field: row => row.weatherConditions,
    sortable: true
  },
  {name: 'tracktemperatur', align: 'left', label: 'Track temp', field: row => row.tracktemperatur, sortable: true},
  {name: 'airtemperatur', align: 'left', label: 'Air Temp', field: row => row.airtemperatur, sortable: true},
  {name: 'time', align: 'left', label: 'Time', field: row => row.time, sortable: true},
  {name: 'date', align: 'left', label: 'Date', field: row => row.date, sortable: true},
  {name: 'id', align: 'left', label: 'ID', field: row => row.wetterid, sortable: true}
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
  name: "Statistic",
  setup() {
    const selected = ref([])
    return {
      date: ref('2022/01/01'),
      role: ref(null),
    }
  },
  data: () => {
    return {
      cond: ref(null),
      location: '',
      cont: null,
      username: '',
      rows: [],
      race_rows: [],
      columns,
      race_columns,
      loading_used: false,
      tireSetColumns_used,
      tireColumns,
      tireSetRows_used: [],
      weather_rows: [],
      weather_columns,
      tireIds: [],
      raceIds: [],
      raceNames: [
        {
          rId:'',
          rName:''
        }
      ],
      showTire: false,
      showWeather: false,
      expanded: [],

      model: ref(null),
      options: [
        {
          label: ' ',
          value: ' ',
        }
      ]
    }
  },
  watch: {
    tireSetRows_used(v) {
      console.log(v)
      if (v != null) {
        setTimeout(() => {
          for (let index = 0; index < v.length; index++) {
            //const element = array[index];
            var x = JSON.parse(JSON.stringify(v[index]))
            this.tireIds.push(x.race.raceID);
            var y = JSON.parse(JSON.stringify(this.race_rows[index]))
            this.raceIds.push(y.raceID)
            console.log(this.raceIds)
            var z = JSON.parse(JSON.stringify(this.race_rows[index]))
            this.raceNames.push(z.name)
            this.options.push({label:z.name, value:y.raceID})
          }
        }, 2);
      }
    },
    cond(r) {
      console.log("race: " + r)
    },
    model(m) {
      console.log("model: " + m.value)
      this.getWeatherData(m.value)
      this.tireIds.forEach(id => {
        if (id === m.value) {
          this.showTire = true
        } else {
          this.showTire = false
        }
      });
    }
  },
  methods: {
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
    getAllTireSets() {
      this.loading_used = true
      this.tireSetRows_used = []
      const apiUrl = this.$store.state.host.api_url
      let url = new URL(apiUrl + '/tireset/status')
      let data = {
        status: 'benutzt'
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
                this.loading_used = false
                if (resp1.status === 200) {
                  this.tireSetRows_used = data
                } else if (resp1.status === 500) {
                  console.log(data.message)
                }
              }
          )
    },
    getWeatherData(v) {
      console.log(v)
      this.loading_used = true
      this.weather_rows = []
      const apiUrl = this.$store.state.host.api_url
      let url = new URL(apiUrl + '/weather/race')
      let data = {
        race: v
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
                this.loading_used = false
                if (resp1.status === 200) {
                  this.weather_rows = data
                  this.showWeather = true
                } else if (resp1.status === 500) {
                  console.log(data.message)
                  this.showWeather = false
                }
              }
          )
    },
  },
  mounted() {
    this.getRaceData()
    this.getAllTireSets()
  }
}
</script>

<style scoped>

</style>