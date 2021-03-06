<template>
  <q-page class="q-pa-lg">
    <div class="row q-mb-lg">
      <div class="col-grow col-10">
        <q-card bordered class="q-pa-md shadow-5 bg-primary" rounded>
          <q-card-section class="q-gutter-md">
            <div class="row">
              <div class="col-grow">
                <span class="text-white text-h5">Bestellformular</span>
              </div>
              <div class="col-auto text-white">
                <q-input v-model="contingent" dark dense filled label="Kontingent" label-color="white"
                         outlined readonly stack-label type="text"/>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-select v-model="art" :options="reifenartOptions" dark dense filled label="Reifenart auswählen"
                      label-color="white"
                      outlined>
              <template v-slot:error>
                Please choose one option!
              </template>
            </q-select>
            <q-select v-model="mischung" :options="mischungOptions" dark dense filled label="Mischung auswählen"
                      label-color="white"
                      outlined/>
            <q-select v-model="modification" :options="modificationOptions" dark dense filled
                      label="Bearbeitungsvariante auswählen"
                      label-color="white" outlined/>
          </q-card-section>
          <q-card-section>
            <q-btn :color="orderAddBtnColor" :label="orderAddBtnLabel" class="full-width" label-color="white"
                   @click="setOrderData"/>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-gutter-lg justify-center">
      <div class="col-grow">
        <q-card bordered class="q-pa-sm shadow-5 bg-primary" rounded>
          <q-card-section class="text-white text-h5" style="text-align: center">Bestelltimer</q-card-section>
          <q-card-section>
            <q-separator dark/>
            <div class="q-gutter-y-sm" style="text-align: center">
              <q-circular-progress
                  :max="orderInitialTime"
                  :thickness="0.1"
                  :value="orderTime"
                  class="text-white q-mb-none q-mt-lg"
                  color="accent"
                  show-value
                  size="150px"
                  track-color="dark"
              >
                <span class="text-white text-h5 text-center">{{ orderTimeString }}</span>
              </q-circular-progress>
              <q-input v-model="initialTime" dark dense filled label="Zeit eingeben" label-color="white" outlined/>
              <q-btn class="full-width" color="accent" label="Timer setzen" label-color="white"
                     @click="addTimerToTiresetList(initialTime)"/>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-grow col-9">
        <q-table
            v-if="rows.length >= 1"
            :columns="columns"
            :rows="rows"
            :rows-per-page-options="[0]"
            card-class="bg-primary bordered"
            dark
            dense
            hide-bottom
            no-data-label="Keine Einträge verfügbar"
            row-key="bezeichnung"
            separator="horizontal"
            title="Bestellübersicht"
        >
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
              <q-td>
                <q-checkbox :model-value="(selected.includes(props.row))"
                            color="secondary" dark
                            size="sm"
                            @click="(!selected.includes(props.row))?selected.push(props.row):selected.splice(selected.indexOf(props.row),1)"/>
              </q-td>
              <q-td v-for="col in props.cols"
                    :key="col.name"
                    :props="props">
                <div v-if="col.name === 'orderTimer'">
                  <q-badge :color="timerColor(col.value)" text-color="white">
                    {{ formatedTimer(props.row.orderTimer) }}
                  </q-badge>
                </div>
                <div v-else-if="col.name === 'aktion'">
                  <q-btn color="white" dense flat icon="mdi-delete" @click="deleteTireSet(props.row)"></q-btn>
                  <q-btn color="white" dense flat icon="mdi-truck-check"
                         @click="tireSetStatusInStorage(props.row)"></q-btn>
                </div>
                <div v-else>
                  {{ col.value }}
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import {ref} from 'vue'

const columns = [
  {name: 'uhrzeit', sortable: true, label: 'Uhrzeit', align: 'center', field: row => row.tires[0].bestelltUm},
  {name: 'tireSetNr', sortable: true, label: 'Reifenset-Nr', align: 'center', field: row => row.tireSetNr},
  {name: 'bezeichnung', sortable: true, label: 'Bezeichnung', align: 'center', field: row => row.tires[0].bezeichnung},
  {name: 'art', sortable: true, label: 'Reifenart', align: 'center', field: row => row.tires[0].art},
  {name: 'mischung', sortable: true, label: 'Mischung', align: 'center', field: row => row.tires[0].mischung},
  {
    name: 'modification',
    label: 'Bearbeitungsvariante',
    align: 'center',
    field: row => row.tires[0].modification
  },
  {name: 'orderTimer', sortable: true, label: 'Abholbereit in', align: 'center', field: row => row.orderTimer},
  {name: 'status', label: 'Status', align: 'center', field: row => row.status},
  {name: 'aktion', label: 'Aktion', align: 'center'}
]

export default {
  name: "Order",

  data: () => {
    return {
      timerValue: ref(null),
      art: ref(null),
      reifenartOptions: [
        'Slicks', 'Inters', 'Rains'
      ],
      mischung: ref(null),
      mischungOptions: [
        'Cold', 'Medium', 'Hot', 'Intermediate', 'Dry_wet', 'Heavy_wet'
      ],
      modification: ref(null),
      modificationOptions: [
        'Siped', 'Extra Grooved', 'Extra Grooved & Siped'
      ],
      bestellAuswahl: ref(null),
      bestellAuswahlOptions: [],
      columns,
      rows: [],
      contingent: 0,
      orderAddBtnColor: 'accent',
      orderAddBtnLabel: 'Bestellen',
      initialTime: ref(null),
      getSelectedString: '',
      selected: [],
      interval: null,

    }
  },

  computed: {

    orderTimeString() {
      let time = this.$store.state.timer.orderTime
      if (time <= 0) {
        return "abgelaufen"
      }
      const houres = Math.floor(time / 60 / 60)
      time = time - (houres * 60 * 60)
      const minutes = Math.floor(time / 60)
      time = time - (minutes * 60)
      const seconds = time
      if (houres === 0) {
        if (minutes === 0) {
          return `${seconds}s`
        }
        return `${minutes}m:${seconds}s`
      }
      return `${houres}h:${minutes}m:${seconds}s`
    },
    orderTime() {
      return this.$store.state.timer.orderTime
    },
    orderInitialTime() {
      return this.$store.state.timer.orderInitialTime
    },
  },
  methods: {
    update() {
      this.interval = setInterval(() => {
        for (let i = 0; i < this.rows.length; i++) {
          if (this.rows[i].orderTimer !== '' && this.rows[i].orderTimer !== null && this.rows[i].orderTimer >= 0) {
            this.rows[i].orderTimer--
          }
        }
      }, 1000)
    },
    formatedTimer(time) {
      if (time === '' || time === null) {
        return 'Nicht Bereit'
      }
      if (time < 0) {
        return "Abholbereit"
      }
      const houres = Math.floor(time / 60 / 60)
      const minutes = Math.floor((time - houres * 3600) / 60)
      const seconds = Math.floor(time - (minutes * 60))
      if (houres === 0) {
        if (minutes === 0) {
          return `${seconds}s`
        }
        return `${minutes}m:${seconds}s`
      }
      return `${houres}h:${minutes}m:${seconds}s`
    },
    timerColor(time) {
      if (time > 0) {
        return 'accent'
      } else if (time < 0) {
        return 'positive'
      }
      return 'negative'
    },
    clearOrderTimer(tireSet) {
      tireSet.orderTimer = ''
    },
    addTimerToTiresetList(timerTime) {
      this.addTimerToDB(timerTime)
      const apiUrl = this.$store.state.host.api_url
      let timeReady = new Date()
      timeReady.setMinutes(timeReady.getMinutes() + Number(timerTime))
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      for (const selectedKey in this.selected) {
        this.selected[selectedKey].orderTimer = timerTime * 60
        const url = `${apiUrl}/tireset/update/${this.selected[selectedKey].id}/orderTimer?orderTimer=${timeReady.getHours()}:${timeReady.getMinutes()}:${timeReady.getSeconds()}`
        fetch(url, requestOptions)
      }
      this.selected = []
    },
    addTimerToDB(timerTime) {
      this.$store.commit("pauseOrderTimer")
      const apiUrl = this.$store.state.host.api_url
      const url = new URL(`${apiUrl}/tire/ordertimer?time=${timerTime}`)
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      fetch(url, requestOptions)
    },
    getOrderData() {
      this.rows = []
      const apiUrl = this.$store.state.host.api_url
      const url = new URL(`${apiUrl}/tireset/status`)
      const data = {
        status: 'bestellt'
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
      let resp
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then(data => {
            if (resp.status === 200) {
              this.rows = data;
              for (const rowsKey in this.rows) {
                if (this.rows[rowsKey].orderTimer !== '' && this.rows[rowsKey].orderTimer !== null) {
                  const now = new Date()
                  const orderReady = new Date()
                  orderReady.setHours(this.rows[rowsKey].orderTimer.split(":")[0])
                  orderReady.setMinutes(this.rows[rowsKey].orderTimer.split(":")[1])
                  orderReady.setSeconds(this.rows[rowsKey].orderTimer.split(":")[2])
                  this.rows[rowsKey].orderTimer = (orderReady.getTime() - now.getTime()) / 1000
                }
              }
            }
          })
    },
    setOrderData() {
      const apiUrl = this.$store.state.host.api_url
      const url = new URL(`${apiUrl}/tireset/new`)
      const FL = {
        art: this.art,
        mischung: this.mischung,
        modification: this.modification,
        position: 'FL'
      }
      const FR = {
        art: this.art,
        mischung: this.mischung,
        modification: this.modification,
        position: 'FR'
      }
      const RL = {
        art: this.art,
        mischung: this.mischung,
        modification: this.modification,
        position: 'RL'
      }
      const RR = {
        art: this.art,
        mischung: this.mischung,
        modification: this.modification,
        position: 'RR'
      }
      const data = {
        status: 'bestellt',
        tires: [
          FL, FR, RL, RR
        ]
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
              return
            }
            return response.json()
          })
          .then(() => {
            if (resp.status === 200) {
              this.getOrderData()
              this.getContingent()
              this.clearOrderFields()
              this.orderAddBtnLabel = 'Erfolgreich bestellt'
              this.orderAddBtnColor = 'positive'
              setTimeout(() => {
                this.orderAddBtnColor = 'accent'
                this.orderAddBtnLabel = 'Bestellen'
              }, 1500)
            }
          })

    },

    clearOrderFields() {
      this.art = ""
      this.mischung = ""
      this.modification = ""
      this.timerValue = ""
    },
    deleteTireSet(tireSet) {
      const apiUrl = this.$store.state.host.api_url
      const url = `${apiUrl}/tireset/delete/${tireSet.id}`
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      fetch(url, requestOptions)
          .then(response => {
            this.getOrderData()
            return response.json()
          })
          .then(data => {
                if (response.ok) {
                  this.getAllTireSets()
                } else {
                  console.log(data)
                }
              }
          )
    },

    tireSetStatusInStorage(tireSet) {
      const apiUrl = this.$store.state.host.api_url
      const url = new URL(`${apiUrl}/tireset/update/${tireSet.id}/status`)
      let data = {
        status: 'auf lager'
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
                  this.getOrderData()
                } else {
                  console.log(data)
                }
              }
          )
    },
    getContingent() {
      this.contingent = []
      const apiUrl = this.$store.state.host.api_url
      const url = apiUrl + '/race/contingent'
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
            this.contingent = data
          })
    },
  },

  mounted() {
    this.getOrderData()
    this.getContingent()
    this.update()
  }


}

</script>

<style scoped>

</style>
