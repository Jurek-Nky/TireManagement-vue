<template>
  <q-page>
    <q-tabs v-model="tab"
            dense
            active-bg-color="accent"
            indicator-color="white"
            align="justify"
            class="text-white bg-primary">
      <q-tab name="race" label="Statistik"/>
      <q-tab name="user" label="Reifenübersicht"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated class="transparent">
      <q-tab-panel name="race" class="row justify-center full-height q-gutter-lg">
        <div class="column">
          <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
            <q-card-section>
              <div class="q-pa-md" style="max-width: 300px">
                <div class="q-gutter-md">
                  <q-select dark filled label-color="accent" outlined dense v-model="model" :options="options" label="Race Options" />
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
                    <q-card-section>
                      <q-table title="Race"
                               :rows="race_rows"
                               :columns="race_columns"
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
                            <q-td v-for="col in props.cols"
                                  :key="col.name"
                                  :props="props">
                              <div>
                                {{ col.value }}
                              </div>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </q-card-section>
                  </q-card>
                </div>

                <div class="col-md-12">
                  <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary col">
                    <q-card-section>
                      <div class="row text-h6"> Slicks:
                        <div v-if="this.showTire"> &nbsp;{{ noOfSlicks }} </div>
                        <div v-else> &nbsp;0 </div>
                      </div>
                      <div class="row text-h6"> Inters:
                        <div v-if="this.showTire"> &nbsp;{{ noOfInters }} </div>
                        <div v-else> &nbsp;0 </div>
                      </div>
                      <div class="row text-h6"> Rains:
                        <div v-if="this.showTire"> &nbsp;{{ noOfRains }} </div>
                        <div v-else> &nbsp;0 </div>
                      </div>
                      <div class="row text-h6"> Air temp:
                        <div v-if="this.showTire"> &nbsp;{{ avgAirTemp }} </div>
                        <div v-else> &nbsp;0 </div>
                      </div>
                      <div class="row text-h6"> Track temp:
                        <div v-if="this.showTire"> &nbsp;{{ avgTrackTemp }} </div>
                        <div v-else> &nbsp;0 </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <!--
                <div class="col-md-12 my-card2 q-pa-md" dark>
                  <q-card class="bg-primary text-white q-pa-lg shadow-5" dark>
                    <q-card-section>
                      <apexchart ref="weatherChart" type="area" height="500" weidth="800"  :options="chartOptions" :series="series"></apexchart>
                    </q-card-section>
                  </q-card>
                </div>
                -->

                <div class="col-md-12">
                  <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
                    <q-card-section>
                      <q-table
                          :rows="statistik_rows"
                          :columns="statistik_columns"
                          row-key="name"
                          dark
                          :rows-per-page-options="[0]"
                          card-class="bg-primary bordered"
                          separator="vertical">
                        <template v-slot:loading>
                          <q-inner-loading showing color="primary"/>
                        </template>
                        <template v-slot:header="props">
                          <q-tr :props="props">
                            <q-th
                                v-for="col in props.cols"
                                :key="col.name"
                                :props="props"
                            >
                              <div>
                                {{ col.label }}
                              </div>
                            </q-th>
                          </q-tr>
                        </template>
                        <template v-slot:body="props">
                          <q-tr :props="props" v-if="this.showTire">
                            <q-td v-for="col in props.cols"
                                  :key="col.name"
                                  :props="props">
                              <div v-if="col.value">
                                {{ col.value }}
                              </div>
                              <div v-else>
                                <div v-if="col.label == 'Air Temperature'">
                                  {{ lastAirTemp }}
                                </div>
                                <div v-if="col.label == 'Track Temperature'">
                                  {{ lastTrackTemp }}
                                </div>
                              </div>
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
      </q-tab-panel>
      <q-tab-panel name="user" class="row justify-center full-height q-gutter-lg">
        <div class="col-md-12" v-if="!benutzt">
          <q-card rounded bordered class="q-pa-md q-ma-lg shadow-5 bg-primary">
            <q-card-section>
              <q-table title="Tires"
                       :rows="tireSetRows_used"
                       :columns="tireSetColumns_used"
                       row-key="id"
                       class="bg-primary"
                       dark
                       no-data-label="Table is empty"
                       :loading="loading_used"
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

        <div class="col-md-12" v-if="benutzt">
          <q-card rounded bordered class="q-pa-md q-ma-lg shadow-5 bg-primary">
            <q-card-section>
              <q-table title="Tires"
                       :rows="tireRows"
                       :columns="tireColumns"
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
                    </q-td>
                    <q-td v-for="col in props.cols"
                          :key="col.name"
                          :props="props">
                      <div>
                        {{ col.value }}
                      </div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>
    </q-tab-panels>
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
  {name: 'id', required: true, align: 'left', label: 'ID', field: row => row.raceID, sortable: true},
  {name: 'date', align: 'left', label: 'Datum', field: row => row.date, sortable: true},
  {name: 'location', align: 'left', label: 'Ort', field: row => row.location, sortable: true},
  {name: 'length', align: 'left', label: 'Laenge', field: row => row.length, sortable: true},
  {name: 'contingent', align: 'left', label: 'Kontingent', field: row => row.tireContingent, sortable: true}
]
const tireSetColumns_used = [
  {name: 'name', required: true, label: 'ID:', align: 'left', field: row => row.id, sortable: true},
  {name: 'status', align: 'left', label: 'Status', field: row => row.status, sortable: true},
  {name: 'nr', align: 'left', label: 'SetNr', field: row => row.tireSetNr, sortable: true},
  {name: 'race', align: 'left', label: 'RaceID', field: row => row.race.raceID, sortable: true}
]

const tireColumns = [
  {name: 'name', required: true, label: 'ID', align: 'left', field: row => row.tireID, sortable: true, sortOrder: 'da'},
  {name: 'bezeichnung', required: true, label: 'Bezeichnung', align: 'left', field: row => row.bezeichnung, sortable: true},
  {name: 'benutztUm', required: true, label: 'BenutztUm', align: 'left', field: row => row.benutztUm, sortable: true},
  {name: 'art', required: true, label: 'Art', align: 'left', field: row => row.art, sortable: true},
  {name: 'mischung', required: true, label: 'Mischung', align: 'left', field: row => row.mischung, sortable: true},
  {name: 'bestellt', required: true, label: 'Bestellt', align: 'left', field: row => row.bestelltUm, sortable: true},
  {name: 'erhalten', required: true, label: 'Erhalten', align: 'left', field: row => row.erhaltenUm, sortable: true},
  {name: 'laufleistung',required: true, label: 'Laufleistung', align: 'left', field: row => row.laufleistung, sortable: true},
  {name: 'modification',required: true, label: 'Modification', align: 'left', field: row => row.modification, sortable: true},
  {name: 'heizbeginn',required: true, label: 'Heiz-Beginn', align: 'left', field: row => row.heatingStart, sortable: true},
  {name: 'heizende', required: true, label: 'Heiz-Ende', align: 'left', field: row => row.heatingStop, sortable: true},
  {name: 'temperatur', required: true, label: 'Temperatur', align: 'left', field: row => row.heatingTemp, sortable: true},
]
const statistik_columns = [
  {name: 'mischung', required: true, align: 'left', label: 'Mischung', field: row => row.mischung, sortable: true},
  {name: 'modification', required: true, align: 'left', label: 'Modification', field: row => row.modification, sortable: true},
  {name: 'benutztUm', align: 'left', label: 'BenutztUm', field: row => row.benutztUm, sortable: true},
  {name: 'airtemperatur', align: 'left', label: 'Air Temperature', field: row => row.airtemperatur, sortable: true},
  {name: 'tracktemperatur', align: 'left', label: 'Track Temperature', field: row => row.tracktemperatur, sortable: true}
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
      benutzt: false,
      cond: ref(null),
      art: ref(null),
      reifenartOptions: [
        'Slicks', 'Inters', 'Rains'
      ],
      location: '',
      cont: null,
      username: '',
      rows: [],
      race_rows: [],
      races: [],
      statistiknull_rows: [],
      statistik_rows: [],
      new_statistik_rows: [],

      columns,
      race_columns,
      statistik_columns,

      loading_used: false,
      tireSetColumns_used,
      tireColumns,
      tireSetRows_used: [],

      tireRows: [],
      weather_rows: [],
      tireIds: [],
      raceIds: [],
      tab: 'race',
      raceNames: [
        {
          rId:'',
          rName:''
        }
      ],
      showTire: false,
      showWeather: false,
      showRace: false,

      expanded: [],
      noOfSlicks: 0,
      noOfInters: 0,
      noOfRains: 0,
      airTemp: 0,
      avgAirTemp: 0,
      trackTemp: 0,
      avgTrackTemp: 0,
      wetterNoOfRows: 0,
      lastAirTemp: 0,
      lastTrackTemp: 0,

      model: ref(null),
      options: [{
        label: ' ',
        value: ' ',
      }
      ],

    }
  },
  watch: {
    tireSetRows_used(v) {
      if (v != null) {
        setTimeout(() => {
          for (let index = 0; index < v.length; index++) {
            var x = JSON.parse(JSON.stringify(v[index]))
            this.tireIds.push(x.race.raceID);
            var y = JSON.parse(JSON.stringify(this.race_rows[index-1]))
            this.raceIds.push(y.raceID)
          }
        }, 2);
      }
    },
    races(v) {
      if (v != null) {
        setTimeout(() => {
          for (let index = 0; index < v.length; index++) {
            var y = JSON.parse(JSON.stringify(this.races[index]))
            this.raceIds.push(y.raceID)
            var z = JSON.parse(JSON.stringify(this.races[index]))
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
      this.getRaceData(m.value)
      this.getTireSets(m)
      this.getWeatherData(m.value)
      //this.getTireSets(m.value)
      this.tireIds.forEach(id => {
        if (id === m.value) {
          this.showTire = true
          this.noOfSlicks = 0
        } else {
          this.showTire = false
          this.noOfSlicks = 0
        }
      });
    },
    art(m) {
      console.log("art: " + m)
      this.benutzt = true
      this.getTireSets(m)

    },
  },
  computed: {
    chartOptions: function() {
      return {
        chart: {
          foreColor: 'white' ,
          height: 400,
          type: 'area'
        },
        markers: {
          colors: ['#F44336', '#E91E63', '#9C27B0']
        },
        dataLabels: {
          style: {
            colors: ['#F44336', '#E91E63', '#9C27B0']
          },
          enabled: false,
          textAnchor: 'start',
          style: {
            colors: ['#fff']
          },
          formatter: (value) => {
            //console.log(this.getmData())
            return value
          },
          offsetX: 0,
          dropShadow: {
            enabled: true
          }
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {

        },
        tooltip: {
          theme: "dark",
        },
      }
    },
  },
  methods: {
    getRaceAllData() {
      this.races = []
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
            this.races = data
          })
    },
    getRaceData(v) {
      this.loading_used = true
      this.race_rows = []
      const apiUrl = this.$store.state.host.api_url
      const url = new URL(apiUrl + '/race/id')
      let data = {
        id: v
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
                  this.race_rows[0] = data
                  this.getTireSets(v)
                  this.showRace = true
                } else if (resp1.status === 500) {
                  console.log(data.message)
                  this.showRace = false
                }
              }
          )
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
    getTireSets(a) {
      this.loading_used = true
      this.tireRows = []
      //this.noOfSlicks = 0
      //this.noOfInters = 0
      //this.noOfRains = 0
      //this.avgAirTemp = 0
      //this.avgTrackTemp = 0

      const apiUrl = this.$store.state.host.api_url
      const url = new URL(apiUrl + '/tire/all')
      let data = {
        art: a
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
                  for(let i=0; i<=data.length-1; i++) {
                    //if (data[i].art == a) {
                    this.tireRows[i] = data[i]
                    if (data[i].art == "Slicks") { this.noOfSlicks = this.noOfSlicks + 1 }
                    if (data[i].art == "Inters") { this.noOfInters = this.noOfInters  + 1 }
                    if (data[i].art == "Rains") { this.noOfRains = this.noOfRains + 1 }
                    //}
                  }
                } else if (resp1.status === 500) {
                  console.log(data.message)
                }
              }
          )
    },
    getWeatherData(v) {
      this.loading_used = true
      this.weather_rows = []
      this.airTemp = 0
      this.avgAirTemp = 0
      this.trackTemp = 0
      this.avgTrackTemp = 0
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
                  console.log(this.new_statistik_rows.length)

                  for(let i=0; i<=data.length-1; i++) {
                    this.weather_rows[i] = data[i]
                    if (this.weather_rows[i].airtemperatur == 0) {
                      //this.statistik_rows[i].airtemperatur = "0"
                    }
                    else this.statistik_rows[i].airtemperatur = this.weather_rows[i].airtemperatur;
                    this.statistik_rows[i].tracktemperatur = this.weather_rows[i].tracktemperatur;
                    this.airTemp += this.weather_rows[i].airtemperatur
                    this.trackTemp += this.weather_rows[i].tracktemperatur
                    this.wetterNoOfRows = i
                  }

                  this.lastAirTemp = this.weather_rows[this.wetterNoOfRows].airtemperatur
                  this.lastTrackTemp = this.weather_rows[this.wetterNoOfRows].tracktemperatur


                  this.avgAirTemp =  this.airTemp/this.weather_rows.length
                  this.avgAirTemp = this.avgAirTemp.toFixed(2)
                  this.avgTrackTemp = this.trackTemp/this.weather_rows.length
                  this.avgTrackTemp = this.avgTrackTemp.toFixed(2)
                } else if (resp1.status === 500) {
                  console.log(data.message)
                }
              }
          )
    },
    getStatistikData() {
      this.loading_used = true
      this.statistik_rows = []
      const apiUrl = 'https://limla.ml:8443/api/v1/tire/all'
      const url = apiUrl
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
              console.log(response)
              return
            }
            return response.json()
          })
          .then(data => {
            //this.statistik_rows = data
            var index = 0
            for(let i=0; i<data.length; i++) {
              if (data[i].modification == null || data[i].modification == "" || data[i].benutztUm == null) {
                this.statistiknull_rows[i] = data[i]
              } else {
                this.statistik_rows[index] = data[i]
                console.log( index + " " + this.statistik_rows[index].benutztUm)
                index = index + 1
              }
              this.new_statistik_rows = this.statistik_rows
            }

            /*
            for (let i = 0; i < data.length; i++) {
              //this.series.data1(data[i].airtemperatur);
              if (data[i].mischung == "Cold") this.race_rows[i] = data[i].benutztUm
              if (data[i].mischung == "Hot") this.race_rows[i] = data[i].benutztUm
              if (data[i].mischung == "Medium") this.race_rows[i] = data[i].benutztUm
            }
            */
          });
    },
  },
  mounted() {
    this.getAllTireSets()
    this.getRaceAllData()
    this.getStatistikData()
  }
}
</script>

<style scoped>
.col {
  color: white
}
</style>