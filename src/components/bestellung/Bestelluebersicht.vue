<template>
  <q-card rounded bordered class="q-pa-md q-ma-lg shadow-5 bg-primary">
    <div class="column">
      <q-card-section>
        <q-table
          title="Bestellübersicht"
          :rows="rows"
          :columns="columns"
          row-key=""
          hide-bottom
          dark
          card-class="bg-primary bordered"
          separator="vertical">

        </q-table>

      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import {ref} from 'vue'

const rows = [
  {bezeichnung: '1xx',
  reifenart: 'Slick',
  mischung: 'Cold',
  bearbeitungsvariante: 'Siped',
  uhrzeit: '16:00'}
]

const columns = [
  {bezeichnung: 'bezeichnung', required: true, label: 'Bezeichnung', align: 'left', field: row => row.bezeichnung},
  {reifenart: 'reifenart', label: 'Reifenart', align: 'left', field: row => row.reifenart},
  {mischung: 'mischung', label: 'Mischung', align: 'left', field: row => row.mischung},
  {bearbeitungsvariante: 'bearbeitungsvariante', label: 'Bearbeitungsvariante', align: 'left', field: row => row.bearbeitungsvariante},
  {uhrzeit: 'uhrzeit', label: 'Uhrzeit', align: 'left', field: row => row.uhrzeit}
]

export default {
  name: "Bestelluebersicht",
  data: () => {

    return {
      rows,
      columns
    }
  },
  methods:{
    getOrderData(){
      this.rows = []
      const apiUrl = this.$store.state.host.api_url
      const url = new URL(`${apiUrl}/tireset/status/`)
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
      fetch(url, requestOptions)
          .then(response => {
            if (response.status !== 200) {
              return
            }
            return response.json()
          })
          .then(data => {
            this.rows = data
          })

    },
    setOrderData(){
      const apiUrl = this.$store.state.host.api_url
      const url = new URL(`${apiUrl}/tireset/status/`)
      const data = {

      }

    }
  },
  mounted(){
    this.getOrderData()
  }
}
</script>

<style scoped>

</style>