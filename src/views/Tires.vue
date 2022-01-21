<template>
  <q-page>
    <q-tabs
        v-model="tab"
        dense
        active-bg-color="accent"
        indicator-color="white"
        align="justify"
        class="text-white bg-primary"
    >
      <q-tab name="in_store" label="Auf Lager"/>
      <q-tab name="used" label="Benutzt"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated class="transparent">
      <q-tab-panel name="in_store" class="row justify-center full-height q-gutter-lg">
        <div class="column">
          <q-table title="Reifensets"
                   :rows="tireSetRows_inStock"
                   :columns="tireSetColumns_inStock"
                   row-key="id"
                   class="bg-primary"
                   dark
                   no-data-label="Table is empty"
                   :loading="loading_inStock">
            <template v-slot:loading>
              <q-inner-loading showing color="primary"/>
            </template>
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
                  <q-btn outline rounded size="sm" color="white" @click="props.expand = !props.expand"
                         :icon="props.expand ? 'mdi-minus' : 'mdi-plus'"/>
                </q-td>
                <q-td v-for="col in props.cols"
                      :key="col.name"
                      :props="props">
                  <div v-if="col.name==='delete'" class="q-gutter-sm">
                    <q-btn icon="mdi-delete" @click="tireSetDelete(props.row)" flat color="white"
                           dense></q-btn>
                  </div>
                  <div v-else-if="col.name==='heating'">
                    <q-btn icon="mdi-fire" @click="tireSetStartHeatingTimer(props.row)" color="white" flat
                           dense></q-btn>
                    <q-btn icon="mdi-stop" @click="tireSetEndHeatingTimer(props.row)" color="white" flat
                           dense></q-btn>
                  </div>
                  <div v-else-if="col.name==='used'">
                    <q-btn icon="mdi-swap-horizontal" @click="tireSetStatusUsed(props.row)" color="white" flat
                           dense></q-btn>
                  </div>
                  <div v-else-if="col.name === 'pressure'">
                    <q-btn icon="mdi-check" @click="tireSetCalcPressure(props.row)" color="white" flat dense/>
                  </div>
                  <div v-else>
                    {{ col.value }}
                  </div>

                </q-td>

              </q-tr>
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="100%">
                  <q-table title="Reifen"
                           :rows="props.row.tires"
                           :columns="tireColumns"
                           row-key="tireID"
                           hide-bottom
                           dark
                           class="bg-primary"
                           bordered
                           dense>
                    <template v-slot:body="props">
                      <q-tr :props="props">
                        <q-td v-for="col in props.cols"
                              :key="col.name"
                              :props="props">
                          <div v-if="col.name === 'kaltdruck'">
<!--                            {{ col.value }}-->
                            <q-badge color="accent" outline text-color="white">
                              {{ col.value }}
                            </q-badge>
                            <q-popup-edit v-model="props.row.kaltdruck" v-slot="scope" title="Kaltdruck"
                                          color="accent" class="column" buttons
                                          @save="setColdPressure(props.row)" persistent>
                              <q-input v-model="scope.value" dense autofocus type="number" @keydown.enter="scope.set()"/>
                            </q-popup-edit>
                          </div>
                          <div v-else>
                            {{ col.value }}
                          </div>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div class="column">
          <q-card class="bg-primary">
            <q-card-section class="q-gutter-y-sm">
              <div class="row justify-center text-white text-subtitle1">Kaltdruck</div>
              <div class="row items-center q-gutter-x-sm q-mb-md">
                <q-input dense dark filled v-model="tireTempCold" type="number"
                         label="Felgentemperatur" @keyup="setAllPressure"/>
              </div>
              <div class="row q-gutter-x-sm">
                <q-input dense dark filled v-model="pressureFL" type="number" label="Vorne Links"
                         @keyup="setSinglePressure(pressureFL,'FL')"/>
                <q-input dense dark filled v-model=" pressureFR" type="number" label="Vorne Rechts"
                         @keyup="setSinglePressure(pressureFR,'FR')"/>

              </div>
              <div class="row q-gutter-x-sm">
                <q-input dense dark filled v-model="pressureRL" type="number" label="Hinten Links"
                         @keyup="setSinglePressure(pressureRL,'RL')"/>
                <q-input dense dark filled v-model="pressureRR" type="number" label="Hinten Rechts"
                         @keyup="setSinglePressure(pressureRR,'RR')"/>
              </div>
            </q-card-section>
            <q-separator dark></q-separator>
            <q-card-section class="q-gutter-y-sm">
              <div class="row text-white text-subtitle1 justify-center">Berechneter Reifendruck</div>
              <div class="row q-gutter-x-sm">
                <q-input disable dense dark filled v-model="pressureCalcFL" label="Vorne Links"/>
                <q-input disable dense dark filled v-model="pressureCalcFR" label="Vorne Rechts"/>
              </div>
              <div class="row q-gutter-x-sm">
                <q-input disable dense dark filled v-model="pressureCalcRL" label="Hinten Links"/>
                <q-input disable dense dark filled v-model="pressureCalcRR" label="Hinten Rechts"/>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>
      <q-tab-panel name="used" class="row justify-center full-height q-gutter-lg">
        <div class="column">
          <q-table title="Benutzt"
                   :rows="tireSetRows_used"
                   :columns="tireSetColumns_used"
                   row-key="id"
                   class="bg-primary"
                   dark
                   no-data-label="Table is empty"
                   :loading="loading_used">
            <template v-slot:loading>
              <q-inner-loading showing color="primary"/>
            </template>
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
                  <q-btn outline rounded size="sm" color="white" @click="props.expand = !props.expand"
                         :icon="props.expand ? 'mdi-minus' : 'mdi-plus'"/>
                </q-td>
                <q-td v-for="col in props.cols"
                      :key="col.name"
                      :props="props">
                  <div v-if="col.name==='delete'" class="q-gutter-sm">
                    <q-btn icon="mdi-delete" @click="tireSetDelete(props.row)" flat color="white"
                           dense></q-btn>
                  </div>
                  <div v-else>
                    {{ col.value }}
                  </div>

                </q-td>

              </q-tr>
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="100%">
                  <q-table title="Tires"
                           :rows="props.row.tires"
                           :columns="tireColumns"
                           row-key="tireID"
                           hide-bottom
                           dark
                           class="bg-primary"
                           bordered>
                  </q-table>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>

const tireSetColumns_inStock = [
  {name: 'tireSetID', required: true, label: 'ID:', align: 'left', field: row => row.id, sortable: true},
  {name: 'status', align: 'left', label: 'Status', field: row => row.status, sortable: true},
  {name: 'nr', align: 'left', label: 'SetNr', field: row => row.tireSetNr, sortable: true},
  {name: 'delete', label: 'Delete', align: 'center'},
  {name: 'heating', label: 'Heizen', align: 'center'},
  {name: 'used', label: 'Benutzt', align: 'center'},
  {name: 'pressure', label: 'Druck berechnen', align: 'center'},
]
const tireSetColumns_used = [
  {name: 'tireSetID', required: true, label: 'ID:', align: 'left', field: row => row.id, sortable: true},
  {name: 'status', align: 'left', label: 'Status', field: row => row.status, sortable: true},
  {name: 'nr', align: 'left', label: 'SetNr', field: row => row.tireSetNr, sortable: true},
  {name: 'delete', label: 'Delete', align: 'center'},
]
const tireColumns = [
  {name: 'tireID', required: true, label: 'ID', align: 'left', field: row => row.tireID, sortable: true},
  {name: 'position', required: true, label: 'Position', align: 'left', field: row => row.position, sortable: true},
  {
    name: 'bezeichnung',
    required: true,
    label: 'Bezeichnung',
    align: 'left',
    field: row => row.bezeichnung,
    sortable: true
  },
  {
    name: 'art',
    required: true,
    label: 'Art',
    align: 'left',
    field: row => row.art,
    sortable: true
  },
  {
    name: 'mischung',
    required: true,
    label: 'Mischung',
    align: 'left',
    field: row => row.mischung,
    sortable: true
  }, {
    name: 'modification',
    required: true,
    label: 'Bearbeitungsvariante',
    align: 'left',
    field: row => row.modification,
    sortable: true
  },
  {name: 'bestellt', required: true, label: 'Bestellt', align: 'left', field: row => row.bestelltUm, sortable: true},
  {name: 'erhalten', required: true, label: 'Erhalten', align: 'left', field: row => row.erhaltenUm, sortable: true},
  {
    name: 'heizbeginn',
    required: true,
    label: 'Heiz-Beginn',
    align: 'left',
    field: row => row.heatingStart,
    sortable: true
  },
  {name: 'heizende', required: true, label: 'Heiz-Ende', align: 'left', field: row => row.heatingStop, sortable: true},
  {
    name: 'temperatur',
    required: true,
    label: 'Temperatur',
    align: 'left',
    field: row => row.heatingTemp,
    sortable: true
  }, {
    name: 'kaltdruck',
    required: true,
    label: 'Kaltdruck',
    align: 'left',
    field: row => row.kaltdruck,
    sortable: true
  },
]


export default {
  data: () => {
    return {
      tab: 'in_store',
      loading_inStock: false,
      loading_used: false,
      tireSetColumns_inStock,
      tireSetColumns_used,
      tireColumns,
      tireSetRows_inStock: [],
      tireSetRows_used: [],
      tireTempCold: null,
      pressureRL: null,
      pressureFL: null,
      pressureRR: null,
      pressureFR: null,
      pressureCalcRL: null,
      pressureCalcFL: null,
      pressureCalcRR: null,
      pressureCalcFR: null,
      pressureVars: [],
    }
  },
  methods: {
    getAllTireSets() {
      this.loading_inStock = true
      this.loading_used = true
      this.tireSetRows_used = []
      this.tireSetRows_inStock = []
      // get all tires with status "auf lager"
      const apiUrl = this.$store.state.host.api_url
      let url = new URL(apiUrl + '/tireset/status')
      let data = {
        status: 'auf lager'
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
      let resp1
      this.tireSetRows_inStock = []
      this.loading_inStock = true
      fetch(url, requestOptions)
          .then(response => {
            this.loading_inStock = false
            resp1 = response
            return response.json()
          })
          .then(
              data => {
                if (resp1.status === 200) {
                  this.tireSetRows_inStock = data
                } else if (resp1.status === 500) {
                  console.log(data.message)
                }
              }
          )
      // get all tires with status "benutzt"
      url = new URL(apiUrl + '/tireset/status')
      data = {
        status: 'benutzt'
      }
      for (let k in data
          ) {
        url.searchParams.append(k, data[k]);
      }
      let resp2
      this.tireSetRows_used = []
      this.loading_used = true
      fetch(url, requestOptions)
          .then(response => {
            this.loading_used = false
            resp2 = response
            return response.json()
          })
          .then(data => {
                if (resp2.status === 200) {
                  this.tireSetRows_used = data
                } else if (resp2.status === 500) {
                  console.log(data.message)
                }
              }
          )
    },
    tireSetDelete(tireSet) {
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
            if (response.status === 200) {
              this.getAllTireSets()
            } else if (response.status === 500) {
              console.log(response.message)
            }
          })

    },
    tireSetStartHeatingTimer(tireSet) {
      const apiUrl = this.$store.state.host.api_url
      const url = `${apiUrl}/tireset/update/${tireSet.id}/heatingStart`
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
                  this.getAllTireSets()
                } else {
                  console.log(data)
                }
              }
          )
    },
    tireSetEndHeatingTimer(tireSet) {
      const apiUrl = this.$store.state.host.api_url
      const url = `${apiUrl}/tireset/update/${tireSet.id}/heatingStop`
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
                  this.getAllTireSets()
                } else {
                  console.log(data)
                }
              }
          )
    },
    tireSetStatusUsed(tireSet) {
      const apiUrl = this.$store.state.host.api_url
      const url = new URL(`${apiUrl}/tireset/update/${tireSet.id}/status`)
      const data = {
        status: 'benutzt'
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
                  this.getAllTireSets()
                } else {
                  console.log(data)
                }
              }
          )
    },
    getPressureVars() {
      const apiUrl = this.$store.state.host.api_url
      let url = apiUrl + '/race/pressureVars'
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      let resp1
      fetch(url, requestOptions)
          .then(response => {
            resp1 = response
            return response.json()
          })
          .then(data => {
            this.pressureVars = data
          })
    },
    setAllPressure() {
      if (this.pressureFL !== null) {
        this.pressureCalcFL = Number(this.pressureFL) * (Number(this.tireTempCold) + this.pressureVars[0]) /
            this.pressureVars[1] + this.pressureVars[2] * (Number(this.tireTempCold) -
                this.pressureVars[3]) / this.pressureVars[1]
      }
      if (this.pressureFR !== null) {
        this.pressureCalcFR = Number(this.pressureFR) * (Number(this.tireTempCold) + this.pressureVars[0]) /
            this.pressureVars[1] + this.pressureVars[2] * (Number(this.tireTempCold) -
                this.pressureVars[3]) / this.pressureVars[1]
      }
      if (this.pressureRL !== null) {
        this.pressureCalcRL = Number(this.pressureRL) * (Number(this.tireTempCold) + this.pressureVars[0]) /
            this.pressureVars[1] + this.pressureVars[2] * (Number(this.tireTempCold) -
                this.pressureVars[3]) / this.pressureVars[1]
      }
      if (this.pressureRR !== null) {
        this.pressureCalcRR = Number(this.pressureRR) * (Number(this.tireTempCold) + this.pressureVars[0]) /
            this.pressureVars[1] + this.pressureVars[2] * (Number(this.tireTempCold) -
                this.pressureVars[3]) / this.pressureVars[1]
      }
    },
    setSinglePressure(pressure, tire) {
      if (this.tireTempCold === null) return
      const calcValue = Number(pressure) * (Number(this.tireTempCold) + this.pressureVars[0]) /
          this.pressureVars[1] + this.pressureVars[2] * (Number(this.tireTempCold) -
              this.pressureVars[3]) / this.pressureVars[1]
      switch (tire) {
        case 'FL': {
          this.pressureCalcFL = calcValue
          break
        }
        case 'FR': {
          this.pressureCalcFR = calcValue
          break
        }
        case 'RL': {
          this.pressureCalcRL = calcValue
          break
        }
        case 'RR': {
          this.pressureCalcRR = calcValue
          break
        }
      }
    },
    tireSetCalcPressure(tireset) {
      this.pressureFL = tireset.tires[0].kaltdruck
      this.pressureFR = tireset.tires[1].kaltdruck
      this.pressureRL = tireset.tires[2].kaltdruck
      this.pressureRR = tireset.tires[3].kaltdruck
      this.setAllPressure()
    },
    setColdPressure(tire) {
      setTimeout(() => {
        const apiUrl = this.$store.state.host.api_url
        let url = new URL(`${apiUrl}/tire/update/${tire.tireID}`)
        url.searchParams.append('kaltdruck', tire.kaltdruck)
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
                    this.getAllTireSets()
                  } else {
                    console.log(data)
                  }
                }
            )
      }, 5)

    }
  }
  ,
  mounted() {
    this.getAllTireSets()
    this.getPressureVars()
  }
}
</script>