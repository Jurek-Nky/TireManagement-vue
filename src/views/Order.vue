<template>
  <q-page>
    <div class="row">
      <div class="col-md-6">
        <q-card rounded bordered class="q-pa-md q-ma-lg shadow-5 bg-primary">
          <q-card-section class="text-white text-h5">Bestellformular</q-card-section>
          <q-card-section>
            <div class="q-gutter-y-sm">
              <q-select dark filled label-color="accent" outlined dense v-model="art" :options="reifenartOptions"
                        label="Reifenart auswählen"/>
              <q-select dark filled label-color="accent" outlined dense v-model="mischung" :options="mischungOptions"
                        label="Mischung auswählen"/>
              <q-select dark filled label-color="accent" outlined dense v-model="bearbeitungsvariante"
                        :options="bearbeitungsvarianteOptions" label="Bearbeitungsvariante auswählen"/>
              <q-btn label-color="accent" class="full-width" :color="orderAddBtnColor" :label="orderAddBtnLabel"
                     @click="setOrderData"/>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-6">
        <q-card rounded bordered class="q-pa-lg q-ma-lg shadow-5 bg-primary">
          <q-card-section class="text-white text-h5">Timer setzen</q-card-section>
          <q-card-section>
            <div class="q-gutter-y-sm">
              <q-input v-model="timer" dark filled label-color="accent" outlined dense type="text" disable/>
              <q-input dark filled label-color="accent" outlined dense type="number" label="Zeit eingeben"/>
              <div>
                <q-btn class="full-width" color="accent" label="Timer setzen"/>
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
              no-data-label="Keine Einträge verfügbar">

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
  {name: 'bezeichnung', sortable: true,label: 'Bezeichnung', align: 'center', field: row => row.tires[0].bezeichnung},
  {name: 'art', sortable: true, label: 'Reifenart', align: 'center', field: row => row.tires[0].art},
  {name: 'mischung', sortable: true, label: 'Mischung', align: 'center', field: row => row.tires[0].mischung},
  {
    name: 'bearbeitungsvariante',
    label: 'Bearbeitungsvariante',
    align: 'center',
    field: row => row.bearbeitungsvariante
  },
  {name: 'status', label: 'Status', align: 'center', field: row => row.status},
  {name: 'aktion', label: 'Aktion', align: 'center'}
]

export default {
  name: "Order",

  data: () => {
    return {
      art: ref(null),
      reifenartOptions: [
        'Slicks', 'Inters', 'Rains'
      ],
      mischung: ref(null),
      mischungOptions: [
        'Cold', 'Medium', 'Hot', 'Intermediate', 'Dry_wet', 'Heavy-wet'
      ],
      bearbeitungsvariante: ref(null),
      bearbeitungsvarianteOptions: [
        'Siped', 'Extra Grooved', 'Extra Grooved & Siped'
      ],
      columns,
      rows: [],
      orderAddBtnColor: 'accent',
      orderAddBtnLabel: 'Bestellen',
      uhrzeit: ref('17:30')

    }
  },
  methods: {

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
              console.log(response)
              return
            }
            return response.json()
          })
          .then(() => {
            if (resp.status === 200) {
              this.getOrderData()
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
      this.bearbeitungsvariante = ""
    },
    deleteTireSet(tireSet){
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
    }
  },

  mounted() {
    this.getOrderData()
  }


}
</script>

<style scoped>

</style>