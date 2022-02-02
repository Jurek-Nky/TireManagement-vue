<template>
  <q-page>
    <q-tabs v-model="tab"
            active-bg-color="accent"
            align="justify"
            class="text-white bg-primary"
            dense
            indicator-color="white"
            no-caps>
      <q-tab label="Eintragen" name="input"/>
      <q-tab label="Tabelle" name="weather_table"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated class="transparent">
      <q-tab-panel class="row q-col-gutter-md full-height" name="input">

        <div class="col-grow col-6">
          <q-card class="bg-primary text-white q-pa-lg shadow-5 full-height " dark>
            <q-card-section class="text-white text-h5">Wetterdaten eintragen</q-card-section>
            <q-card-section>
              <q-form class="q-gutter-md">
                <q-input ref="airtemp" v-model.number="airtemp" color="accent" dark dense filled
                         label="Lufttemperatur in °C" label-color="white" type="number"/>
                <q-input ref="tracktemp" v-model.number="tracktemp" color="accent" dark dense filled
                         label="Streckentemperatur in °C" label-color="white" type="number"/>
                <q-select ref="cond" v-model="cond" :options="optionstrack" color="accent" dark dense filled
                          label="Streckenverhältnis" label-color="white"/>
              </q-form>
            </q-card-section>
            <q-separator dark/>
            <q-form class="q-gutter-md">
              <q-card-section>
                <q-btn :color="weatherAddBtnColor" :label="weatherAddBtnLabel" class="bg-accent"
                       @click="createWeather"/>
              </q-card-section>
            </q-form>
          </q-card>
        </div>


        <div class="col-auto" dark>
            <q-card bordered class="q-pa-lg bg-primary shadow-5 full-height">
              <q-card-section class="text-white text-h5" style="text-align: center">Wettertimer</q-card-section>
              <q-separator dark/>
              <q-card-section>
                <q-circular-progress
                    :max="weatherInitialTime"
                    :thickness="0.1"
                    :value="weatherTime"
                    class="text-white q-mb-none q-mt-lg"
                    color="accent"
                    show-value
                    size="240px"
                    track-color="dark"
                >
                  <span class="text-white text-h4 text-center">{{ weatherTimeString }}</span>
                </q-circular-progress>
              </q-card-section>
            </q-card>
        </div>

        <div class="col-grow">
          <q-card class="bg-primary text-white q-pa-lg shadow-5 full-height " dark>
            <q-card-section class="text-white text-h5" style="text-align: center">Wettervorhersage abrufen</q-card-section>
            <q-card-section>
              <div id="app" :class="typeof weather.main != 'undefined' && weather.main.temp > 16 ? 'warm' : ''">
                <main>
                  <div class="search-box text-white" dark>
                    <q-input v-model="query" class="search-bar text-white" color="white"
                             dark
                             dense
                             filled
                             label="Ort eingeben..."
                             label-color="white"
                             q-field
                             type="text"
                             @keypress="fetchWeather"
                    />
                  </div>

                  <div v-if="typeof weather.main != 'undefined'" class="weather-wrap">
                    <div class="location-box">
                      <div class="location">{{ weather.name }}, {{ weather.sys.country }}</div>
                      <div class="date">{{ dateBuilder() }}</div>
                    </div>
                    <div class="weather-box">
                      <div class="temp">{{ Math.round(weather.main.temp) }}°c</div>
                      <div class="weather">{{ weather.weather[0].main }}</div>
                    </div>

                  </div>

                </main>
              </div>
            </q-card-section>
          </q-card>
        </div>


        <div class="row fit content-md-center">
          <div class="col-grow col-12">
            <q-card class="bg-primary text-white q-pa-lg shadow-5 " dark>
              <q-card-section class="text-white text-h5" style="text-align: center">Wetterdiagramm</q-card-section>
              <q-card-section>
                <apexchart ref="weatherChart" :options="chartOptions" :series="series" height="450px"
                           type="area"></apexchart>
              </q-card-section>

            </q-card>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel class="fit row justify-center full-height q-gutter-lg" name="weather_table">
        <div class="justify-center col-grow q-gutter-md" dark>
            <q-card class="bg-primary text-white q-pa-lg shadow-5" dark>
              <q-card-section>
                <q-table :columns="columns"
                         :rows="rows"
                         :rows-per-page-options="[0]"
                         binary-state-sort
                         class="bg-primary text-white"
                         row-key="name"
                         title="Wetterdaten"
                >
                  <template v-slot:body-cell-aktion="props">
                    <q-td :props="props">
                      <q-btn color="white" dense flat icon="mdi-delete" @click="confirmDialog(props.row)"></q-btn>
                      <q-dialog v-model="confirm">
                        <q-card class="bg-primary">
                          <q-card-section class="row items-center">
                            <span class="q-ml-sm text-white">Do you really want do delete this Note</span>
                          </q-card-section>
                          <q-card-actions align="right">
                            <q-btn v-close-popup color="grey" label="cancel" text-color="white"></q-btn>
                            <q-btn color="negative" label="delete"
                                   @click="deleteWeather(this.confirmId)"></q-btn>
                          </q-card-actions>
                        </q-card>
                      </q-dialog>
                    </q-td>
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
import {useQuasar} from 'quasar'

const columns = [
  {name: 'time', label: 'Uhrzeit', align: 'left', field: row => row.time.split(".")[0].split("T")[1], sortable: true},
  {name: 'airtemp', label: 'Lufttemperatur in °C', align: 'left', field: row => row.airtemperatur, sortable: true},
  {
    name: 'tracktemp',
    label: 'Streckentemperatur in °C',
    align: 'left',
    field: row => row.tracktemperatur,
    sortable: true
  },
  {name: 'cond', label: 'Streckenverhältnis', align: 'left', field: row => row.weatherConditions, sortable: true},
  {name: 'aktion', label: 'Aktion', align: 'center'},
]


export default {


  name: "Weather",

  data: () => {


    return {

      api_key: '328d654fb1486a9cf4fd992026fafb41',
      url_base: 'https://api.openweathermap.org/data/2.5/',
      confirm: false,
      confirmId: '',
      confirmIndex: '',
      query: '',
      weather: {},
      tab: 'input',
      airtemp: ref(null),
      tracktemp: ref(null),
      cond: ref(null),
      optionstrack: [
        'wet', 'dry', 'drying off ', 'drizzle', 'sunny', 'cloudy'
      ],
      countdown: ref(null),
      rows: [],
      value: 81,
      columns,
      weatherAddBtnColor: 'accent',
      weatherAddBtnLabel: 'Eintragen',
      countdownStartBtnLabel: 'Starten',
      options: {
        chart: {
          id: 'chart'
        },
      },
      series: [{
        name: 'Streckentemperatur in °C',
        color: '#f4a261',
        data: [],
      }, {
        name: 'Lufttemperatur in °C',
        color: '#168aad' ,
        data: [],
      }],
      chartOptions: {
        chart: {
          foreColor: 'white',
          height: 350,
          type: 'area',

        },

        markers: {
          colors: ['#F44336', '#E91E63', '#9C27B0']
        },
        dataLabels: {
          style: {
            colors: ['#F44336', '#E91E63', '#9C27B0']
          },
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        tooltip: {
          theme: "dark",
        },
      },
    }
  },
  computed: {
    weatherTime() {
      return this.$store.state.timer.weatherTime
    },
    weatherInitialTime() {
      return this.$store.state.timer.weatherInitialTime
    },
    weatherTimeString() {
      const time = this.$store.state.timer.weatherTime
      if (time <= 0) {
        return "abgelaufen"
      }
      const houres = Math.floor(time / 60 / 60)
      const minutes = Math.floor(time / 60)
      const seconds = time - (minutes * 60)
      if (houres === 0) {
        if (minutes === 0) {
          return `${seconds}s`
        }
        return `${minutes}m:${seconds}s`
      }
      return `${houres}h:${minutes}m:${seconds}s`
    },
  },
    methods: {
      confirmDialog(id) {
        this.confirm = true
        this.confirmId = id

      },
      createWeather() {
        const apiUrl = this.$store.state.host.api_url
        const url = new URL(apiUrl + '/weather/new')
        const data = {
          airtemp: this.airtemp,
          tracktemp: this.tracktemp,
          cond: this.cond,
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
              this.getWeatherData()
              this.getDiagramData()
              this.clearWeatherFields()
              this.orderAddBtnLabel = 'Erfolgreich eingetragen'
              this.orderAddBtnColor = 'positive'
              setTimeout(() => {
                this.orderAddBtnColor = 'accent'
                this.orderAddBtnLabel = 'Eintragen'
              }, 1500)
            })
      },
      clearWeatherFields() {
        this.airtemp = ''
        this.tracktemp = ''
        this.cond = ''
      },
      getWeatherData() {
        const apiUrl = 'https://limla.ml:8443/api/v1/weather/all'
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
              this.rows = data
            })
      },
      deleteWeather(weather) {
        const apiUrl = this.$store.state.host.api_url
        const url = `${apiUrl}/weather/delete/${weather.wetterid}`
        const jwt = this.$store.state.user.jwt
        const requestOptions = {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + jwt
          },
        }
        fetch(url, requestOptions)
            .then(response => {
              if (response.status === 200) {
                this.confirm = false
                this.getWeatherData()
              } else if (response.status === 500) {
                console.log(response.message)
              }
            })
      },
      getDiagramData() {
        this.series[0].data = []
        this.series[1].data = []
        const apiUrl = 'https://limla.ml:8443/api/v1/weather/all'
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
              let updateData = []
              for (const dataKey in data) {
                updateData = {
                  x: data[dataKey].time.split(".")[0].split("T")[1],
                  y: data[dataKey].tracktemperatur
                }
                this.series[0].data.push(updateData)
                updateData = {
                  x: data[dataKey].time.split(".")[0].split("T")[1],
                  y: data[dataKey].airtemperatur
                }
                this.series[1].data.push(updateData)
              }
            });
      },
      fetchWeather(e) {
        if (e.key == "Enter") {
          fetch(`${this.url_base}weather?q=${this.query}&units=metric&APPID=${this.api_key}`)
              .then(res => {
                return res.json();
              }).then(this.setResults);
        }
      },
      setResults(results) {
        this.weather = results;
        this.weather.icon = results;
      },
      dateBuilder() {
        let d = new Date();
        let months = ["Januar", "Feburar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
        let days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();
        return `${day} ${date} ${month} ${year}`;w
      },
      getTimer(){
        const apiUrl = 'https://limla.ml:8443/api/v1/weather/timer'
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
              this.weatherTimeString = data
            })

      }
    },

    mounted() {
      this.getWeatherData()
      this.getDiagramData()


    }
  }


</script>


<style lang="sass" scoped>

body
  font-family: Arial, Helvetica, sans-serif


.search-box
  width: 100%
  margin-bottom: 30px
  text-underline-color: white


.search-box .search-bar

  width: 100%
  padding: 10px
  text-underline-color: white
  color: #264653
  font-size: 20px
  background: none
  background-color: #264653


.search-box .search-bar:focus

  background-color: #264653


.location-box .location
  color: #FFF
  font-size: 20px
  font-weight: 500
  text-align: center
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25)

.location-box .date
  color: #FFF
  font-size: 15px
  font-weight: 300
  font-style: italic
  text-align: center

.weather-box
  text-align: center

.weather-box .temp
  display: inline-block
  padding: 10px 15px
  color: #FFF
  font-size: 50px
  font-weight: 900
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25)
  border-radius: 10px
  margin: 30px 0px
  box-shadow: 3px 6px rgba(0, 0, 0, 0.25)

.weather-box .weather
  color: #FFF
  font-size: 20px
  font-weight: 700
  font-style: italic
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25)

</style>
