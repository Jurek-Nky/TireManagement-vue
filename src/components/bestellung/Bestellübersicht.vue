<template>
  <h1>Bestellübersicht</h1>
  <v-data-table
      dense
      :headers="headers"
      :items="orders"
      item-key="uhrzeit"
      class="elevation-1"
  ></v-data-table>
</template>

<script>
export default {
  name: "Bestellübersicht",
  data: () => ({
    orders: [
      {
        uhrzeit: '12.45',
        reifenart: 'Slicks',
        mischung: 'cold',
        bezeichnung:'1xx',
        bearbeitungsvariante:'Extra grooved',
        status: 'Bestellt'
      }
    ],
    headers: [

      { text: 'Uhrzeit',
        align: 'start',
        sortable: false,
        value: 'uhrzeit',},
      { text: 'Reifenart', value: 'reifenart' },
      { text: 'Mischung', value: 'mischung' },
      { text: 'Bezeichnung', value: 'bezeichnung' },
      { text: 'Bearbeitungsvariante', value: 'bearbeitungsvariante' },
      { text: 'Status', value: 'status' }
    ],
  }),
}
</script>

<style scoped>

</style>