<template>
  <div class="row">
    <div class="col-md-6">
    <q-card rounded bordered class="q-pa-md q-ma-lg shadow-5 bg-primary">
      <q-card-section class="text-white text-h5">Bestellformular</q-card-section>
      <q-card-section>
            <div class="q-gutter-y-sm">
                <q-select dark filled label-color="accent" outlined dense v-model="reifenartM" :options="reifenart" label="Reifenart auswählen"/>
                <q-select dark filled label-color="accent" outlined dense v-model="mischungM" :options="mischung" label="Mischung auswählen"/>
                <q-select dark filled label-color="accent" outlined dense v-model="bearbeitungsvarianteM" :options="bearbeitungsvariante" label="Bearbeitungsvariante auswählen"/>
                <q-btn label-color="accent" class="full-width" color="accent" label="Bestellen" />
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
</template>

<script>

import { ref } from 'vue'

export default {
  name: "Bestellformular",
  data() {
    return {
      reifenartM: ref(null),
      reifenart: [
        'Slicks','Inters', 'Rains'
      ],

      mischungM: ref(null),
      mischung: [
        'Cold', 'Medium', 'Hot', 'Intermediate', 'Dry_Wet', 'Heavy-Wet'
      ],
      bearbeitungsvarianteM: ref(null),
      bearbeitungsvariante: [
        'Siped', 'Extra Grooved', 'Extra Grooved & Siped'
      ]
    }
  }

}

</script>

<style scoped>
  body{
    color:  white;
  }
</style>