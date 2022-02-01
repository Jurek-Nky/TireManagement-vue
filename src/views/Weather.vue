<template>
  <q-page>
    <q-tabs v-model="tab"
            dense
            active-bg-color="accent"
            indicator-color="white"
            align="justify"
            class="text-white bg-primary"
            no-caps>
      <q-tab name="input" label="Eintragen"/>
      <q-tab name="weather_table" label="Tabelle"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated class="transparent">
      <q-tab-panel name="input" class="row q-col-gutter-md full-height">

        <div class="col-6">
        <q-card class="bg-primary text-white q-pa-lg shadow-5 full-height " dark>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input color="accent" v-model.number="airtemp" type="number" label="Lufttemperatur in °C"
                       label-color="white" dark ref="airtemp"/>
              <q-input color="accent" v-model.number="tracktemp" type="number" label="Streckentemperatur in °C"
                       label-color="white" dark ref="tracktemp"/>
              <q-select color="accent" filled v-model="cond" :options="optionstrack" label="Streckenverhältnis"
                        label-color="white" dark ref="cond"/>
            </q-form>
          </q-card-section>
          <q-separator dark/>
          <q-form class="q-gutter-md">
          <q-card-actions>
            <q-btn class="bg-accent" @click="createWeather" :color="weatherAddBtnColor" :label="weatherAddBtnLabel"/>
          </q-card-actions>
          </q-form>
        </q-card>
    </div>



          <div class="col-2" dark>
            <q-card class="bg-primary text-white q-pa-lg shadow-5 full-height " dark>

              <q-card-section>
                <q-form class="q-gutter-md">
                <div class="base-timer">
                  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g class="base-timer__circle">
                      <circle class="base-timer__path-elapsed text-white" cx="50" cy="50" r="45"></circle>
                      <path

                          :stroke-dasharray="circleDasharray"
                          class="base-timer__path-remaining"
                          :class="remainingPathColor"
                          d="
                            M 50, 50
                            m -45, 0
                            a 45,45 0 1,0 90,0
                            a 45,45 0 1,0 -90,0
                          "
                      ></path>
                    </g>
                  </svg>
                  <span class="base-timer__label">{{ formattedTimeLeft }}</span>

                </div>
                <q-form class="q-gutter-md">
                  <q-input color="accent" v-model.number="countdown" type="number" label="Minuten"
                           label-color="white" dark ref="countdown"/>
                </q-form>
                <q-card-actions>
                  <q-btn class="bg-accent" @click="this.startTimer" :color="weatherAddBtnColor" :label="countdownStartBtnLabel"/>
                </q-card-actions>
                </q-form>
              </q-card-section>

            </q-card>
            </div>

        <div class="col-4">
            <q-card class="bg-primary text-white q-pa-lg shadow-5 full-height " dark>
              <q-card-section>
                <div id="app" :class="typeof weather.main != 'undefined' && weather.main.temp > 16 ? 'warm' : ''">
                  <main>
                    <div class="search-box text-white" dark>
                    <q-input outlined label="Ort eingeben..." type="text"
                             q-field
                             color="white"
                             label-color="white"
                             class="search-bar text-white"
                             v-model="query"
                             dark
                             @keypress="fetchWeather"
                    />
                    </div>

                    <div class="weather-wrap" v-if="typeof weather.main != 'undefined'">
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
        <div class="col-12">
        <q-card class="bg-primary text-white q-pa-lg shadow-5 " dark>
          <q-card-section>
            <apexchart ref="weatherChart" type="area" height="750px" :options="chartOptions" :series="series"></apexchart>
          </q-card-section>

        </q-card>
        </div>
</div>
      </q-tab-panel>

      <q-tab-panel name="weather_table" class="fit row justify-center full-height q-gutter-lg">
    <div class="justify-center q-gutter-md">
      <div class=" q-pa-md" dark>

        <q-card class="bg-primary text-white q-pa-lg shadow-5" dark>
          <q-card-section>
            <q-table class="bg-primary text-white"
                     title="Wetterdaten"
                     :rows="rows"
                     :columns="columns"
                     :rows-per-page-options="[0]"
                     row-key="name"
                     binary-state-sort
            >
            <template v-slot:body-cell-aktion="props">
              <q-td :props="props">
                <q-btn icon="mdi-delete" @click="confirm(id)" color="white" dense flat></q-btn>
              </q-td>
            </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import {ref} from 'vue'
import { useQuasar } from 'quasar'

const columns = [
  {name: 'time', label: 'Uhrzeit', align: 'left', field: row => row.time, sortable: true},
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

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 300;
const ALERT_THRESHOLD = 60;


const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

let TIME_LIMIT = 0;

export default {


  name: "Weather",
  setup (){
    const $q = useQuasar()

    function confirm(id) {
      this.cId = id
      $q.dialog({
        dark: true,
        message: 'Do you really want to DELETE this input ?',
        color: 'primary',
        cancel:{
          push: true,
        },
        persistent: true,
        ok:{
          label :'DELETE',
          color: 'negative'
        }

      }).onOk(() => {
        this.deleteWeather(props.row)
      }).onOk(() => {
        this.deleteWeather(props.row)
      }).onCancel(() => {

      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
      }
        return{confirm}
  },
  data: () => {



    return {

      api_key: '328d654fb1486a9cf4fd992026fafb41',
      url_base: 'https://api.openweathermap.org/data/2.5/',
      query: '',
      weather: {},
      tab: 'input',
      airtemp: ref(null),
      tracktemp: ref(null),
      cond: ref(null),
      timePassed: 0,
      timerInterval: null,
      optionstrack: [
        'wet', 'dry', 'drying off ', 'drizzle', 'sunny', 'cloudy'
      ],
      countdown: ref(null),
      rows: [],
      value: 81,
      columns,
      cId: '',
      weatherAddBtnColor: 'accent',
      weatherAddBtnLabel: 'Eintragen',
      countdownStartBtnLabel: 'Starten',
      options: {
        chart: {
          id: 'chart'
        },
      },



      series:
          [{
            name: 'Streckentemperatur in °C',
            data: [null],
          },
            {
              name: 'Lufttemperatur in °C',
              data: [null],
            },],

      chartOptions: {
        chart: {
          foreColor: 'white' ,
          height: 350,
          type: 'area'
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
        xaxis: {
        },

        tooltip: {

    //  x: { format: "HH:mm:ss" },

          theme: "dark",
        },
      },

    }
  },
  computed: {
    circleDasharray() {
      return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
    },

    formattedTimeLeft() {
      const timeLeft = this.timeLeft;
      const minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;

      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      return `${minutes}:${seconds}`;
    },

    timeLeft() {
      return TIME_LIMIT - this.timePassed;
    },

    timeFraction() {
      const rawTimeFraction = this.timeLeft / TIME_LIMIT;
      return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    },

    remainingPathColor() {
      const { alert, warning, info } = COLOR_CODES;

      if (this.timeLeft <= alert.threshold) {
        return alert.color;
      } else if (this.timeLeft <= warning.threshold) {
        return warning.color;
      } else {
        return info.color;
      }
    }
  },

  watch: {
    timeLeft(newValue) {
      if (newValue === 0) {
        this.onTimesUp();
      }
    }
  },



  methods: {

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
              this.getWeatherData()
            } else if (response.status === 500) {
              console.log(response.message)
            }
          })
    },

    getDiagramData() {
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
            for (let i = 0; i < data.length; i++) {
              this.series[0].data.push(data[i].tracktemperatur);
              this.series[1].data.push(data[i].airtemperatur);

            }
            return
            });




    },


    onTimesUp() {
      clearInterval(this.timerInterval);
    },

    startTimer() {
      this.getMinutes();
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);

    },
    getMinutes(){
      TIME_LIMIT =(this.countdown * 60);
    },

    fetchWeather (e) {
      if (e.key == "Enter") {
        fetch(`${this.url_base}weather?q=${this.query}&units=metric&APPID=${this.api_key}`)
            .then(res => {
              return res.json();
            }).then(this.setResults);
      }
    },
    setResults (results) {
      this.weather = results;
      this.weather.icon = results;
    },

    dateBuilder () {
      let d = new Date();
      let months = ["Januar", "Feburar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
      let days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();
      return `${day} ${date} ${month} ${year}`;
    }


  },

  mounted(){
    this.getWeatherData()
    this.getDiagramData()



  }
}



</script>


<style scoped lang="sass" >

 .base-timer
  position: relative
  width: 150px
  height: 150px

  &__svg
    transform: scaleX(-1)


  &__circle
    fill: none
    stroke: none

  &__path-elapsed
    stroke-width: 7px
    stroke: grey


  &__path-remaining
    stroke-width: 7px
    stroke-linecap: round
    transform: rotate(90deg)
    transform-origin: center
    transition: 1s linear all
    fill-rule: nonzero
    stroke: currentColor

    &.green
      color: rgb(65, 184, 131)


    &.orange
      color: orange


    &.red
      color: red



  &__label
    position: absolute
    width: 150px
    height: 150px
    top: 0
    display: flex
    align-items: center
    justify-content: center
    font-size: 48px

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
