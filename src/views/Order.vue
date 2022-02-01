<template>
  <q-page>
    <div class="row">
      <div class="col-md-6">
        <q-card rounded bordered class="q-pa-md q-ma-lg shadow-5 bg-primary">
          <q-card-section>
            <div class="row">
              <div class="col-sm-10 text-white text-h5">
                Bestellformular
              </div>
              <div class="col-sm-2 text-white" style="align-content: end">
                Kontingent:
                <q-input v-model="contingent" dark filled label-color="white" outlined dense type= "text" readonly :model-value = "contingent"/>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="q-gutter-y-sm">
              <q-select dark filled label-color="white" outlined dense v-model="art" :options="reifenartOptions"
                        label="Reifenart auswählen">
                <template v-slot:error>
                Please choose one option!
                </template>
              </q-select>
              <q-select dark filled label-color="white" outlined dense v-model="mischung" :options="mischungOptions"
                        label="Mischung auswählen"/>
              <q-select dark filled label-color="white" outlined dense v-model="modification"
                        :options="modificationOptions" label="Bearbeitungsvariante auswählen"/>
              <q-btn label-color="white" class="full-width" :color="orderAddBtnColor" :label="orderAddBtnLabel"
                     @click="setOrderData"/>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-sm-3">
        <q-card rounded bordered class="q-pa-sm q-ma-lg shadow-5 bg-primary">
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
                  size="170px"
                  track-color="dark"
              >
                <span class="text-white text-h4 text-center">{{ orderTimeString }}</span>
              </q-circular-progress>
              <q-input v-model="initialTime" dark filled label-color="white" outlined dense type="number" label="Zeit eingeben"/>
              <q-btn label-color="white" class="full-width" color="accent" label="Timer setzen" @click="setOrderTimer"/>
              <div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-card rounded bordered class="q-pa-md q-ma-lg shadow-5 bg-primary">
      <div class="column">
        <q-card-section>
          <q-table
              title="Bestellübersicht"
              :rows="rows"
              :columns="columns"
              row-key="bezeichnung"
              hide-bottom
              dark
              card-class="bg-primary bordered"
              separator="horizontal"
              no-data-label="Keine Einträge verfügbar"
              :rows-per-page-options="[0]">

            <template v-slot:body-cell-aktion="props">
              <q-td :props="props">
                <q-btn icon="mdi-delete" @click="deleteTireSet(props.row)" color="negative" dense flat></q-btn>
                <q-btn icon="mdi-truck-check" @click="tireSetStatusInStorage(props.row)" color="accent"
                       dense flat></q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import {ref} from 'vue'

const columns = [
  {name: 'uhrzeit', sortable: true, label: 'Uhrzeit', align: 'center', field: row => row.tires[0].bestelltUm},
  {name:'tireSetNr', sortable: true, label: 'Reifenset-Nr', align: 'center', field: row => row.tireSetNr},
  {name: 'bezeichnung', sortable: true,label: 'Bezeichnung', align: 'center', field: row => row.tires[0].bezeichnung},
  {name: 'art', sortable: true, label: 'Reifenart', align: 'center', field: row => row.tires[0].art},
  {name: 'mischung', sortable: true, label: 'Mischung', align: 'center', field: row => row.tires[0].mischung},
  {
    name: 'modification',
    label: 'Bearbeitungsvariante',
    align: 'center',
    field: row => row.tires[0].modification
  },
  {name: 'orderTimer', sortable: true, label: 'Abholbereit in', align: 'center'},
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
      contingent : 0,
      orderAddBtnColor: 'accent',
      orderAddBtnLabel: 'Bestellen',
      initialTime: ref(null)
    }
  },

  computed:{

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
        return `${minutes}
          m:${seconds}s`
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
    setOrderTimer() {

    },
    updateOrderTimer(tireSet){
        const apiUrl = this.$store.state.host.api_url
        const url = `${apiUrl}/tireset/update/${tireSet.id}/orderTimer`
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

    getTimerValue(){
      const x = document.getElementById("orderValue").value
      print(parseInt(x))
      return parseInt(x)
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
            console.log(data)
            this.rows = data
          })
    },
    setOrderData() {
      const apiUrl = this.$store.state.host.api_url
      const url = new URL(`${apiUrl}/tireset/new`)
      const exempleTire = {
        art: this.art,
        mischung: this.mischung,
        modification: this.modification,
      }
      const data = {
        status: 'bestellt',
        tires: [
          exempleTire,
          exempleTire,
          exempleTire,
          exempleTire
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
  }


}

</script>

<style scoped>

</style>
