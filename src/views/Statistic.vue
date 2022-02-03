<template>
  <q-page>
    <q-tabs v-model="tab"
            align="justify"
            class="text-white bg-primary"
            dense
            indicator-color="secondary">
      <q-select v-model="raceSelect" :options="raceSelectOptions" dark dense label="Renne auswaehlen"
                label-color="white" style="width: 300px" bg-color="accent" color="white">
        <template v-slot:prepend>
          <div style="width: 10px"></div>
        </template>
      </q-select>
      <q-tab label="Statistik" name="stats"/>
      <q-tab label="Reifenübersicht" name="used"/>

    </q-tabs>
    <q-tab-panels v-model="tab" animated class="transparent">

      <q-tab-panel name="stats">

        <div class="row q-gutter-x-lg">
          <div class="col-grow col-8 q-mb-lg">
            <q-table :columns="raceColumns"
                     :rows="raceSelectedForTabel"
                     :rows-per-page-options="[0]"
                     class="bg-primary"
                     dark
                     hide-bottom
                     no-data-label="Table is empty"
                     row-key="id"
                     separator="none"
                     title="Renndaten"/>
          </div>
          <div class="col-grow q-mb-lg">
            <q-card bordered class="shadow-5 bg-primary col" rounded>
              <q-card-section class="row">
                <div class="col-grow text-white text-subtitle1">
                  Anzahl der benutzen Reifen:
                  <div class="row text-white"> Slicks:
                    <div v-if="tireArtCount[0] !== null"> &nbsp;{{ tireArtCount[0] }}</div>
                    <div v-else> &nbsp;0</div>
                  </div>
                  <div class="row text-white"> Inters:
                    <div v-if="tireArtCount[1] !== null"> &nbsp;{{ tireArtCount[1] }}</div>
                    <div v-else> &nbsp;0</div>
                  </div>
                  <div class="row text-white"> Rains:
                    <div v-if="tireArtCount[2] !== null"> &nbsp;{{ tireArtCount[2] }}</div>
                    <div v-else> &nbsp;0</div>
                  </div>
                </div>
                <q-separator class="q-mr-md" dark vertical/>
                <div class="col-grow text-white text-subtitle1">
                  Durchschnittstemperaturen:
                  <div class="row text-white"> Luft:
                    <div v-if="averageTemp[0] !== 0"> &nbsp;{{ averageTemp[0] }}</div>
                    <div v-else> 0</div>
                  </div>
                  <div class="row text-white"> Strecke:
                    <div v-if="averageTemp[1] !== 0"> &nbsp;{{ averageTemp[1] }}</div>
                    <div v-else> &nbsp;0</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-grow col-10">
            <q-table
                :columns="statisticColumns"
                :rows="statisticRows"
                :rows-per-page-options="[0]"
                card-class="bg-primary bordered"
                dark
                hide-no-data row-key="name"
                title="Benutze Reifensets">
            </q-table>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel class="row justify-center full-height q-gutter-lg" name="used">
        <q-table :columns="tireSetColumns_used"
                 :pagination="{rowsPerPage: 0}"
                 :rows="tireSetRows_used"
                 class="bg-primary col-grow"
                 dark
                 no-data-label="Table is empty"
                 row-key="id"
                 title="Benutzt">
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
                <q-btn :icon="props.expand ? 'mdi-minus' : 'mdi-plus'" color="white" outline rounded size="sm"
                       @click="props.expand = !props.expand"/>
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
                <q-table :columns="tireColumns"
                         :rows="props.row.tires"
                         bordered
                         class="bg-primary"
                         dark
                         hide-bottom
                         row-key="tireID"
                         title="Tires"/>
              </q-td>
            </q-tr>
          </template>
        </q-table>

      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
const raceColumns = [
  {name: 'id', required: true, align: 'left', label: 'ID', field: row => row.raceID, sortable: true},
  {name: 'date', align: 'left', label: 'Datum', field: row => row.date, sortable: true},
  {name: 'location', align: 'left', label: 'Ort', field: row => row.location, sortable: true},
  {name: 'length', align: 'left', label: 'Laenge', field: row => row.length, sortable: true},
  {name: 'contingent', align: 'left', label: 'Kontingent', field: row => row.tireContingent, sortable: true}
]
const statisticColumns = [
  {name: 'mischung', required: true, align: 'left', label: 'Mischung', field: row => row.mischung, sortable: true},
  {name: 'benutztUm', align: 'left', label: 'BenutztUm', field: row => row.benutztUm, sortable: true},
  {name: 'airtemperatur', align: 'left', label: 'Air Temperature', field: row => row.airtemperatur, sortable: true},
  {
    name: 'tracktemperatur',
    align: 'left',
    label: 'Track Temperature',
    field: row => row.tracktemperatur,
    sortable: true
  }
]
const tireColumns = [
  {name: 'tireID', required: true, label: 'ID', align: 'left', field: row => row.tireID, sortable: true},
  {name: 'position', required: true, label: 'Position', align: 'left', field: row => row.position, sortable: true},
  {
    name: 'modification',
    required: true,
    label: 'Bearbeitungsvariante',
    align: 'left',
    field: row => row.modification,
    sortable: true
  },
  {
    name: 'laufleistung',
    label: 'Laufleistung',
    align: 'left',
    field: row => row.laufleistung,
    sortable: true
  },
  {name: 'bestellt', required: true, label: 'Bestellt', align: 'left', field: row => row.bestelltUm, sortable: true},
  {name: 'erhalten', required: true, label: 'Erhalten', align: 'left', field: row => row.erhaltenUm, sortable: true},
  {name: 'benutzt', required: true, label: 'Benutzt', align: 'left', field: row => row.benutztUm, sortable: true},
  {
    name: 'heatingStart',
    required: true,
    label: 'Heiz-Beginn',
    align: 'left',
    field: row => row.heatingStart,
    sortable: true
  },
  {
    name: 'heatingStop',
    required: true,
    label: 'Heiz-Ende',
    align: 'left',
    field: row => row.heatingStop,
    sortable: true
  },
  {
    name: 'temperatur',
    required: true,
    label: 'Heiztemperatur',
    align: 'center',
    field: row => row.heatingTemp,
    sortable: true
  },
]
const tireSetColumns_used = [
  {name: 'tireSetID', required: true, label: 'ID:', align: 'left', field: row => row.id, sortable: true},
  {name: 'status', align: 'left', label: 'Status', field: row => row.status, sortable: true},
  {name: 'nr', align: 'left', label: 'SetNr', field: row => row.tireSetNr, sortable: true},
  {name: 'type', align: 'left', label: 'Art', field: row => row.tires[0].art},
  {name: 'mixture', align: 'left', label: 'Mischung', field: row => row.tires[0].mischung},
]
export default {
  name: "Statistic.vue",
  computed: {
    raceSelectOptions() {
      if (this.raceRows !== []) {
        let returnData = []
        for (let i = 0; i < this.raceRows.length; i++) {
          returnData.push({
            value: this.raceRows[i].raceID,
            label: this.raceRows[i].name
          })
        }
        return returnData
      }
      return []
    },
    raceSelectedForTabel() {
      for (let i = 0; i < this.raceRows.length; i++) {
        if (this.raceRows[i].raceID === this.raceSelect.value) {
          let retArr = []
          retArr.push(this.raceRows[i])
          return retArr
        }
      }
      return []
    },
    tireArtCount() {
      let retArr = [0, 0, 0]
      let selectedRace = null
      for (let i = 0; i < this.raceRows.length; i++) {
        if (this.raceRows[i].raceID === this.raceSelect.value) {
          selectedRace = this.raceRows[i]
        }
      }
      if (selectedRace === null) {
        return []
      }
      for (let i = 0; i < selectedRace.tireSets.length; i++) {
        if (selectedRace.tireSets[i].tires[0].art === 'Slicks') {
          retArr[0]++
        } else if (selectedRace.tireSets[i].tires[0].art === 'Inters') {
          retArr[1]++
        } else if (selectedRace.tireSets[i].tires[0].art === 'Rains') {
          retArr[2]++
        }
      }
      return retArr
    },
    averageTemp() {
      let retArr = []
      let selectedRace = null
      for (let i = 0; i < this.raceRows.length; i++) {
        if (this.raceRows[i].raceID === this.raceSelect.value) {
          selectedRace = this.raceRows[i]
        }
      }
      if (selectedRace === null) {
        return []
      }
      let airTemp = 0
      let trackTemp = 0
      if (selectedRace.weather.length === 0) {
        return [airTemp, trackTemp]
      }
      for (let i = 0; i < selectedRace.weather.length; i++) {
        airTemp = airTemp + selectedRace.weather[i].airtemperatur
        trackTemp = trackTemp + selectedRace.weather[i].tracktemperatur
      }
      retArr.push(Math.floor(airTemp / selectedRace.weather.length))
      retArr.push(Math.floor(trackTemp / selectedRace.weather.length))
      return retArr
    },
    statisticRows() {
      let retArr = []
      let selectedRace = null
      for (let i = 0; i < this.raceRows.length; i++) {
        if (this.raceRows[i].raceID === this.raceSelect.value) {
          selectedRace = this.raceRows[i]
        }
      }
      if (selectedRace === null || selectedRace.weather.length === 0 || selectedRace.tireSets.length === 0) {
        return []
      }
      for (let i = 0; i < selectedRace.tireSets.length; i++) {
        if (selectedRace.tireSets[i].status === 'benutzt') {
          let indexOfLowDiffWeather = 0
          console.log(selectedRace.weather[0].time)
          console.log(selectedRace.tireSets[i].tires[0].benutztUm)
          let valueOfLowDiffWeather = this.timediff(selectedRace.weather[0].time.split("T")[1].split(".")[0], selectedRace.tireSets[i].tires[0].benutztUm)
          for (let j = 0; j < selectedRace.weather.length; j++) {
            if (this.timediff(selectedRace.weather[j].time.split("T")[1].split(".")[0], selectedRace.tireSets[i].tires[0].benutztUm) < valueOfLowDiffWeather) {
              indexOfLowDiffWeather = j
              valueOfLowDiffWeather = this.timediff(selectedRace.weather[j].time.split("T")[1].split(".")[0], selectedRace.tireSets[i].tires[0].benutztUm)
            }
          }
          retArr.push({
            mischung: selectedRace.tireSets[i].tires[0].mischung,
            benutztUm: selectedRace.tireSets[i].tires[0].benutztUm,
            airtemperatur: selectedRace.weather[indexOfLowDiffWeather].airtemperatur,
            tracktemperatur: selectedRace.weather[indexOfLowDiffWeather].tracktemperatur,
          })
        }
      }
      return retArr
    },
    tireSetRows_used() {
      let retArr = []
      let selectedRace = null
      for (let i = 0; i < this.raceRows.length; i++) {
        if (this.raceRows[i].raceID === this.raceSelect.value) {
          selectedRace = this.raceRows[i]
        }
      }
      if (selectedRace === null) {
        return []
      }
      for (let i = 0; i < selectedRace.tireSets.length; i++) {
        if (selectedRace.tireSets[i].status === 'benutzt') {
          retArr.push(selectedRace.tireSets[i])
        }
      }
      return retArr
    },

  },
  data: () => {
    return {
      tab: 'stats',
      raceSelect: '',
      raceColumns: raceColumns,
      raceRows: [],
      selectedRace: null,
      statisticColumns: statisticColumns,
      tireSetColumns_used: tireSetColumns_used,
      tireColumns: tireColumns,

    }
  },
  methods: {
    timediff(time, time2) {
      const timeSplit = time.split(':')
      const timeSplit2 = time2.split(':')
      const hourDiff = (timeSplit[0] - timeSplit2[0])
      const minuteDiff = (timeSplit[1] - timeSplit2[1])
      const secondDiff = (timeSplit[2] - timeSplit2[2])
      return Math.abs(hourDiff * 3600 + minuteDiff * 60 + secondDiff)
    },
    getAllRaces() {
      this.raceRows = []
      const apiUrl = this.$store.state.host.api_url
      const url = new URL(apiUrl + '/race/all')
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      fetch(url, requestOptions)
          .then(response => {
            return response.json()
          })
          .then(data => {
                this.raceRows = data
              }
          )
    }
  },
  mounted() {
    this.getAllRaces()
  }
}
</script>

<style scoped>

</style>