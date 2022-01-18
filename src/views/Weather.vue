<template>
  <q-page class="row justify-center">
    <div class="my-card q-gutter-md">
      <div class="q-pa-md">
        <q-card class="bg-primary text-white q-pa-lg shadow-5" dark>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input color="accent" v-model.number="airtemp" type="number" label="Luftemperatur in °C"
                       label-color="accent" dark ref="airtemp"/>
              <q-input color="accent" v-model.number="tracktemp" type="number" label="Streckentemperatur in °C"
                       label-color="accent" dark ref="tracktemp"/>
              <q-select color="accent" filled v-model="cond" :options="optionstrack" label="Streckenverhältnis"
                        label-color="accent" dark ref="cond"/>
            </q-form>
          </q-card-section>
          <q-separator dark/>
          <q-card-actions>
            <q-btn class="bg-accent" @click="createWeather" :color="weatherAddBtnColor" :label="weatherAddBtnLabel"/>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <div class="my-card2 q-gutter-md">
      <div class="my-card2 q-pa-md" dark>

        <q-card class="bg-primary text-white q-pa-lg shadow-5" dark>
          <q-card-section>
            <q-table class="bg-primary text-accent"
                     title="Wetterdaten"
                     :rows="rows"
                     :columns="columns"
                     row-key="name"
                     binary-state-sort
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="my-card2 q-gutter-md">
      <div class="my-card2 q-pa-md" dark>
        <q-card class="bg-primary text-white q-pa-lg shadow-5" dark>
          <q-card-section>
            <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import {ref} from 'vue'


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
]

export default {
  name: "Weather",
  data: () => {
    return {

      airtemp: ref(null),
      tracktemp: ref(null),
      cond: ref(null),
      optionstrack: [
        'wet', 'dry', 'drying off ', 'drizzle', 'sunny', 'cloudy'
      ],
      rows: [],
      columns,
      weatherAddBtnColor: 'accent',
      weatherAddBtnLabel: 'Eintragen',
      options: {
        chart: {
          id: 'chart'
        },
      },
      series: [{
        name: 'Streckentemperatur in °C',
        data: [31, 40, 28, 51, 42, 109, 100]
      }, {
        name: 'Lufttemperatur in °C',
        data: [11, 32, 45, 32, 34, 52, 41]
      }],
      chartOptions: {
        chart: {
          height: 350,
          type: 'area'
        },

        dataLabels: {
          style: {},
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          },
        },
      },

    }
  },
  methods: {

    sendandget() {
      this.getData();
      this.createWeather();
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
  },
  mounted() {
    this.getWeatherData()
  }
}
</script>


<style lang="sass" scoped>
.my-card
  width: 30%
  max-width: 200px

  .my-card2
    width: 100%
  max-width: 650px
</style>
