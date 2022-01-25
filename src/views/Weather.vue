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
            <apexchart ref="weatherChart" type="area" height="500" weidth="500"  :options="chartOptions" :series="series"></apexchart>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class ="my-card2 q-gutter-md">
      <div class="my-card2 q-pa-md" dark>

        <q-card class="bg-primary text-white q-pa-lg shadow-5" dark>
          <q-card-section>

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
    let timeAll;

    return {

      airtemp: ref(null),
      tracktemp: ref(null),
      cond: ref(null),
      optionstrack: [
        'wet', 'dry', 'drying off ', 'drizzle', 'sunny', 'cloudy'
      ],
      rows: [],
      location: null,
      columns,
      chartDataAir:[],
      chartDatatrack:[],
      weatherAddBtnColor: 'accent',
      weatherAddBtnLabel: 'Eintragen',
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
          foreColor: '#2a9d8f' ,
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
          theme: "dark",

          x: {
            format: 'HH/mm/ss'
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

    getDiagramData() {
      this.chartDataAir = []
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
              //this.series.data1(data[i].airtemperatur);
              this.series[0].data.push(data[i].tracktemperatur);
              this.series[1].data.push(data[i].airtemperatur);


            }
            return
            });



    },

    getRaceLoctaion(){
      const apiUrl = 'https://limla.ml:8443/api/v1/race/all'
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
          (this.location.data[0].location);

          })
    },



 /*   getWeatherforecast(){
      const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='++'&appid=328d654fb1486a9cf4fd992026fafb41'
      const url = apiUrl

      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',

        },
      }
      fetch(url, requestOptions)
          .then(response => {
            if (response.status !== 200) {
              console.log(response)
              return

            }
            328d654fb1486a9cf4fd992026fafb41
            return response.json()
          })


    },
    */

    updateSeriesLine() {
      this.$refs.weatherChart.updateSeries([{
        data: this.series.data,
      }], false, true);
    },

  },

  mounted(){
    this.getRaceLoctaion()

    this.getWeatherData()
    this.getDiagramData()



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