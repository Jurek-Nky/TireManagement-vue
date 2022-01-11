<template>
  <div class="q-pa-sm">
    <q-card rounded bordered class="q-pa-md shadow-5 bg-primary">
      <q-card-section>
        <div class="row">
          <div class="col-sm-6" style="padding: 5px">
            <div class="q-gutter-y-sm">
                <strong>Bestellformular</strong>
                <q-select dark filled label-color="accent" outlined dense v-model="model" :options="reifenart" label="Reifenart auswählen"/>
                <q-select dark filled label-color="accent" outlined dense v-model="model" :options="mischung" label="Mischung auswählen"/>
                <q-select dark filled label-color="accent" outlined dense v-model="model" :options="bearbeitungsvariante" label="Bearbeitungsvariante auswählen"/>
                <q-btn label-color="accent" class="full-width" color="primary" label="Bestellen" />
            </div>
          </div>
          <div class="col-sm-6" style="padding: 5px">
            <div class="q-gutter-y-sm">
              <strong>Timer setzen</strong>
              <q-input dark filled label-color="accent" outlined dense type="text" disable/>
              <q-input dark filled label-color="accent" outlined dense type="number" label="Zeit eingeben"/>
              <q-btn v-model="model" label-color="accent" class="full-width" color="primary" label="Timer setzen" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>

import { ref } from 'vue'
export default {
  name: "Bestellformular",
  data() {
    return {
      model: ref(null),
      reifenart: [
        'Slicks','Inters', 'Rains'
      ],
      mischung: [
        'Cold', 'Medium', 'Hot', 'Intermediate', 'Dry_Wet', 'Heavy-Wet'
      ],
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