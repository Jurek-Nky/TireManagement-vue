<template>
  <q-page>
    <q-tabs v-model="tab"
            dense
            active-bg-color="accent"
            indicator-color="white"
            align="justify"
            class="text-white bg-primary"
            no-caps>
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
                   :loading="loading_inStock"
                   :pagination="{rowsPerPage: 0}">
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
                    <q-btn icon="mdi-stop" @click="tireSetEndHeatingTimer(props.row)" color="white" flat dense></q-btn>
                  </div>
                  <div v-else-if="col.name==='used'">
                    <q-btn icon="mdi-cached" @click="tireSetStatusUsed(props.row)" flat color="white" dense></q-btn>
                  </div>
                  <div v-else-if="col.name === 'pressure'">
                    <q-btn icon="mdi-tune" @click="tiresetCalcPressure(props.row)" color="white" flat dense/>
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
                          <div v-if="col.name === 'modification'">
                            <q-badge v-if="col.value === null || col.value === ''" color="accent"
                                     text-color="white" class="cursor-pointer">
                              {{ "----" }}
                            </q-badge>
                            <q-badge v-else color="accent" text-color="white" class="cursor-pointer">
                              {{ col.value }}
                            </q-badge>
                            <q-popup-edit v-model="props.row.modification" v-slot="scope" color="accent"
                                          title="Bearbeitungsvariante" buttons @save="setModification(props.row)"
                                          persistent>
                              <q-select v-model="scope.value" :options="modificationOptions" emit-value>
                              </q-select>
                            </q-popup-edit>

                          </div>
                          <div v-else-if="col.name === 'laufleistung'">
                            <q-badge v-if="col.value === null || col.value === ''" color="accent"
                                     text-color="white" class="cursor-pointer">
                              {{ "----" }}
                            </q-badge>
                            <q-badge v-else color="accent" text-color="white" class="cursor-pointer">
                              {{ col.value }}
                            </q-badge>
                            <q-popup-edit v-model="props.row.laufleistung" v-slot="scope" color="accent"
                                          title="Laufleistung" buttons @save="setLaufleistung(props.row)"
                                          persistent>
                              <q-input v-model="scope.value" label="laufleistung" stack-label></q-input>
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
          <q-card class="bg-primary" v-if="pressureCalcTireset !== null">
            <q-card-section class="text-subtitle1 text-white">
              Reifendruck anpassen
            </q-card-section>
            <q-card-section class="q-gutter-md">
              <q-input v-model="tireTemp" stack-label
                       label="Felgentemperatur Richtwert" dark filled/>
              <q-input v-model="this.tireTempMeasured" stack-label
                       label="Felgentemperatur gemessen" dark filled/>
            </q-card-section>
            <q-card-section class="column q-gutter-y-md">
              <div class="row q-gutter-x-md">
                <q-card>
                  <q-card-section class="column" style="width: 180px">
                    <span>Position: {{ this.pressureCalcTireset.tires[0].position }}</span>
                    <q-separator/>
                    <q-input v-model="this.pressureCalcTireset.tires[0].kaltdruck" stack-label label="Kaltdruck" dense
                             label-color="black"/>
                    <q-input v-model="this.pressureCalcTireset.tires[0].kaltdruckModified" stack-label
                             label="Kaltdruck modifiziert" readonly dense label-color="black"/>
                    <q-checkbox class="q-mt-md" v-model="this.pressureCalcTireset.tires[0].bleeded" label="bleeded"
                                dense
                                color="accent"
                                @update:model-value="setTireBleeded(this.pressureCalcTireset.tires[0])"/>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn label="berechnen" color="accent" dense
                           @click="calculateModifiedPressure(this.pressureCalcTireset.tires[0])"/>
                  </q-card-actions>
                </q-card>
                <q-card>
                  <q-card-section class="column" style="width: 180px">
                    <span>Position: {{ this.pressureCalcTireset.tires[1].position }}</span>
                    <q-separator/>
                    <q-input v-model="this.pressureCalcTireset.tires[1].kaltdruck" stack-label label="Kaltdruck" dense
                             label-color="black"/>
                    <q-input v-model="this.pressureCalcTireset.tires[1].kaltdruckModified" stack-label
                             label="Kaltdruck modifiziert" readonly dense label-color="black"/>
                    <q-checkbox class="q-mt-md" v-model="this.pressureCalcTireset.tires[1].bleeded" label="bleeded"
                                dense
                                color="accent" @update:model-value="setTireBleeded(this.pressureCalcTireset.tires[1])"/>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn label="berechnen" color="accent" dense
                           @click="calculateModifiedPressure(this.pressureCalcTireset.tires[1])"/>
                  </q-card-actions>
                </q-card>
              </div>
              <div class="row q-gutter-x-md">
                <q-card>
                  <q-card-section class="column" style="width: 180px">
                    <span>Position: {{ this.pressureCalcTireset.tires[2].position }}</span>
                    <q-separator/>
                    <q-input v-model="this.pressureCalcTireset.tires[2].kaltdruck" stack-label label="Kaltdruck" dense
                             label-color="black"/>
                    <q-input v-model="this.pressureCalcTireset.tires[2].kaltdruckModified" stack-label
                             label="Kaltdruck modifiziert" readonly dense label-color="black"/>
                    <q-checkbox class="q-mt-md" v-model="this.pressureCalcTireset.tires[2].bleeded" label="bleeded"
                                dense
                                color="accent" @update:model-value="setTireBleeded(this.pressureCalcTireset.tires[2])"/>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn label="berechnen" color="accent" dense
                           @click="calculateModifiedPressure(this.pressureCalcTireset.tires[2])"/>
                  </q-card-actions>
                </q-card>
                <q-card>
                  <q-card-section class="column" style="width: 183px">
                    <span>Position: {{ this.pressureCalcTireset.tires[3].position }}</span>
                    <q-separator/>
                    <q-input v-model="this.pressureCalcTireset.tires[3].kaltdruck" stack-label label="Kaltdruck" dense
                             label-color="black"/>
                    <q-input v-model="this.pressureCalcTireset.tires[3].kaltdruckModified" stack-label
                             label="Kaltdruck modifiziert" readonly dense label-color="black"/>
                    <q-checkbox class="q-mt-md" v-model="this.pressureCalcTireset.tires[3].bleeded" label="bleeded"
                                dense
                                color="accent" @update:model-value="setTireBleeded(this.pressureCalcTireset.tires[3])"/>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn label="berechnen" color="accent" dense
                           @click="calculateModifiedPressure(this.pressureCalcTireset.tires[3])"/>
                  </q-card-actions>
                </q-card>
              </div>

            </q-card-section>
          </q-card>
        </div>
        <div class="column">
          <q-card class="bg-primary" v-if="pressureCalcTireset !== null">
            <q-card-section class="text-subtitle1 text-white">
              Bleed berechnen
            </q-card-section>
            <q-card-section class="q-gutter-md">
              <q-input v-model="bleedConstant" stack-label label="Anpasskonstante" dark filled/>
              <q-input v-model="trackTemp" stack-label label="Streckentemperatur Richtwert" dark filled/>
              <q-input v-model="trackTempMeasured" stack-label label="Streckentemperatur gemessen" dark filled/>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn class="q-mb-sm" label="berechnen" color="accent" @click="calculateBleed"/>
              <q-dialog v-model="alert">
                <q-card class="bg-accent">
                  <q-card-section>
                    <div class="text-center">{{ alertText }}</div>
                  </q-card-section>
                </q-card>
              </q-dialog>
            </q-card-actions>
            <q-separator dark/>
            <q-card-section class="q-gutter-md">
              <q-input v-model="bleedCalc" stack-label label="berechneter Bleed" dark filled readonly/>
              <q-input v-model="bleedCalcModified" stack-label
                       :label="`angepasster Bleed @ ${this.pressureCalcTireset.tires[0].heatingTemp}℃`" dark filled
                       readonly/>
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
                   :loading="loading_used"
                   :pagination="{rowsPerPage: 0}">
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
  {name: 'nr', align: 'left', label: 'SetNr', field: row => row.tireSetNr, sortable: true},
  {name: 'type', align: 'left', label: 'Art', field: row => row.tires[0].art},
  {name: 'mixture', align: 'left', label: 'Mischung', field: row => row.tires[0].mischung},
  {name: 'delete', label: 'Delete', align: 'center'},
  {name: 'heating', label: 'Heizen', align: 'center'},
  {name: 'used', label: 'Benutzt', align: 'center'},
  {name: 'pressure', label: 'Druck berechnen', align: 'center'},
]
const tireSetColumns_used = [
  {name: 'tireSetID', required: true, label: 'ID:', align: 'left', field: row => row.id, sortable: true},
  {name: 'status', align: 'left', label: 'Status', field: row => row.status, sortable: true},
  {name: 'nr', align: 'left', label: 'SetNr', field: row => row.tireSetNr, sortable: true},
  {name: 'type', align: 'left', label: 'Art', field: row => row.tires[0].art},
  {name: 'mixture', align: 'left', label: 'Mischung', field: row => row.tires[0].mischung},
  {name: 'delete', label: 'Delete', align: 'center'},
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
    label: 'Heiztemperatur',
    align: 'center',
    field: row => row.heatingTemp,
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
      modificationOptions: [
        {label: 'Siped', value: 'Siped'},
        {label: 'Extra Grooved', value: 'Extra Grooved'},
        {label: 'Extra Grooved & Siped', value: 'Extra Grooved & Siped'},
        {label: 'none', value: ''}],
      pressureCalcTireset: null,
      tireTemp: 30,
      tireTempMeasured: null,
      bleedConstant: 0.005,
      trackTemp: 10,
      trackTempMeasured: null,
      bleedCalc: 0,
      bleedCalcModified: 0,
      alert: false,
      alertText: '',
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
    pressureModified(pressureGiven, temperatureTireGiven, temperatureTireMeasured) {
      const pg = Number(pressureGiven)
      const ttg = Number(temperatureTireGiven)
      const ttm = Number(temperatureTireMeasured)
      // pressureGiven * (temperatureTireMeasured + 273.15)               temperatureTireMeasured - temperatureTireGiven
      // --------------------------------------------------   + 1.013 *   ----------------------------------------------
      //        temperatureTireGiven + 273.15                                     temperatureTireGiven + 293.15
      return ((pg * (ttm + 273.15) / (ttg + 273.15)) + 1.013 * ((ttm - ttg) / (ttg + 293.15)))
    },
    pressureBleed(modificationConstant, temperatureTrackMeasured, temperatureTrackGiven) {
      const mc = Number(modificationConstant)
      const ttm = Number(temperatureTrackMeasured)
      const ttg = Number(temperatureTrackGiven)
      return (mc * (ttm - ttg))
    },
    pressureBleedHot(modificationConstant, temperatureTrackMeasured, temperatureTrackGiven, temperatureTireMeasured, temperatureTireHot) {
      const bleed = this.pressureBleed(modificationConstant, temperatureTrackMeasured, temperatureTrackGiven)
      const ttm = Number(temperatureTireMeasured)
      const tth = Number(temperatureTireHot)
      // bleed * (temperatureTireHot + 273.15)              temperatureTireHot - temperatureTireMeasured
      // -------------------------------------  + 1.013 *   --------------------------------------------
      //    temperatureTireMeasured + 273.15                      temperatureTireMeasured + 293.15
      return ((bleed * (tth + 273.15) / (ttm + 273.15)) + 1.013 * ((tth - ttm) / (ttm + 273.15)))
    },
    setModification(tire) {
      setTimeout(() => {
        const apiUrl = this.$store.state.host.api_url
        let url = new URL(`${apiUrl}/tire/update/${tire.tireID}/modification`)
        url.searchParams.append('mod', tire.modification)
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
      }, 1)
    },
    setTireBleeded(tire) {
      setTimeout(() => {
        const apiUrl = this.$store.state.host.api_url
        let url = new URL(`${apiUrl}/tire/update/${tire.tireID}`)
        url.searchParams.append('bleed', tire.bleeded)
        const jwt = this.$store.state.user.jwt
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + jwt
          },
        }
        let resp
        fetch(url, requestOptions)
      }, 1)
    },
    tiresetCalcPressure(tireset) {
      this.pressureCalcTireset = tireset
      this.tireTempMeasured = tireset.tires[0].kaltdruckTempMeasured
    },
    calculateModifiedPressure(tire) {
      if (this.tireTempMeasured === 0 || tire.kaltdruck === 0 || this.tireTemp === 0) {
        return
      }
      tire.kaltdruckTemp = this.tireTemp
      tire.kaltdruckTempMeasured = this.tireTempMeasured
      const pm = this.pressureModified(tire.kaltdruck, tire.kaltdruckTemp, tire.kaltdruckTempMeasured)
      tire.kaltdruckModified = pm.toFixed(4)

      setTimeout(() => {
        const apiUrl = this.$store.state.host.api_url
        let url = new URL(`${apiUrl}/tire/update/${tire.tireID}`)
        url.searchParams.append('kaltdruck', tire.kaltdruck)
        url.searchParams.append('ktm', tire.kaltdruckTempMeasured)
        url.searchParams.append('kt', tire.kaltdruckTemp)
        url.searchParams.append('km', tire.kaltdruckModified)
        const jwt = this.$store.state.user.jwt
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + jwt
          },
        }
        let resp
        fetch(url, requestOptions)
      }, 1)
    },
    calculateBleed() {
      if (this.tireTempMeasured === null) {
        this.alert = true
        this.alertText = 'Fuer diese Berechnung muss eine gemessene Felgentemperatur eingegeben werden.'
        return
      }
      if (this.trackTempMeasured === null) {
        this.alert = true
        this.alertText = 'Fuer diese Berechnung muss eine gemessene Streckentemperatur eingegeben werden'
        return
      }
      this.bleedCalc = this.pressureBleed(this.bleedConstant, this.trackTempMeasured, this.trackTemp).toFixed(4)
      this.bleedCalcModified = this.pressureBleedHot(this.bleedConstant, this.trackTempMeasured, this.trackTemp, this.tireTempMeasured, this.pressureCalcTireset.tires[0].heatingTemp).toFixed(4)
    },
    setLaufleistung(tire) {
      setTimeout(() => {
        const apiUrl = this.$store.state.host.api_url
        let url = new URL(`${apiUrl}/tire/update/${tire.tireID}`)
        url.searchParams.append('ll', tire.laufleistung)
        const jwt = this.$store.state.user.jwt
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + jwt
          },
        }
        let resp
        fetch(url, requestOptions)
      }, 1)
    },

  }
  ,
  mounted() {
    this.getAllTireSets()
  }
}
</script>
