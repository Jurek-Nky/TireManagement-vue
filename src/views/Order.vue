<template>
  <q-page class="q-pa-lg">
    <div class="row q-gutter-lg">
      <div class="col-grow">
        <q-card bordered class="q-pa-md shadow-5 bg-primary" rounded>
          <q-card-section class="q-gutter-md">
            <div class="row">
              <div class="col-grow">
                <span class="text-white text-h5">Bestellformular</span>
              </div>
              <div class="col-3 text-white">
                <q-input v-model="contingent" :model-value="contingent" dark dense disable filled label="Kontingent"
                         label-color="white" outlined stack-label style="max-width: 100px" type="text"/>
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
      <div class="col-grow col-md-3">
        <q-card bordered class="q-pa-lg shadow-5 bg-primary" rounded>
          <q-card-section class="text-white text-h5">Timer setzen</q-card-section>
          <q-card-section>
            <div class="q-gutter-y-sm">
              <!-- <q-select dark filled label-color="accent" outlined dense v-model="bestellAuswahl" :options="bestellAuswahlOptions"
                        label="Bestellung auswählen"/> -->
              <q-input v-model="timerValue" dark dense filled label="Zeit eingeben" label-color="white" outlined
                       type="number"/>
              <div>
                <!-- <q-btn class="full-width" color="accent" label="Timer setzen"/> -->
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-mt-lg">
      <q-table
          v-if="rows.length >= 1"
          :columns="columns"
          :rows="rows"
          :rows-per-page-options="[0]"
          card-class="bg-primary bordered col-grow"
          dark
          hide-bottom
          no-data-label="Keine Einträge verfügbar"
          row-key="bezeichnung"
          separator="horizontal"
          title="Bestellübersicht">

        <template v-slot:body-cell-aktion="props">
          <q-td :props="props">
            <q-btn color="negative" dense flat icon="mdi-delete" @click="deleteTireSet(props.row)"></q-btn>
            <q-btn color="accent" dense flat
                   icon="mdi-truck-check" @click="tireSetStatusInStorage(props.row)"></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
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

    }
  },

  computed:{

    orderTimeString() {
      const time = this.$store.state.timer.orderTime
      const hours = Math.floor(time / 60 / 60)
      const minutes = Math.floor(time / 60)
      const seconds = time - (minutes * 60)
      if (hours === 0) {
        if (minutes === 0) {
          return `${seconds}s`
        }
        return `${minutes}
          m:${seconds}s`
      }
      return `${hours}h:${minutes}m:${seconds}s`
    },

    orderTime() {
      return this.$store.state.timer.orderTime
    },
    orderInitialTime() {
      return this.$store.state.timer.orderInitialTime
    },
  },
  methods: {
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
            if (resp.status === 200) {
              this.rows = data;
            }
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
