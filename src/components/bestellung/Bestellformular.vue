<template>
  <div class="container mt-2">
    <div class="row" style="align-items:normal">
      <div class="col-sm-2">
        <div style="margin-top: 35px">
          <strong>Vorderachse</strong>
        </div>
        <div style="margin-top: 55px">
          <strong>Hinterachse</strong>
        </div>
      </div>

      <div class="col-sm-2">
        <label class="form-label">Reifenart</label>
        <select class="form-select" id="frontart">
          <option value>Reifenart auswählen</option>
          <option>Slicks</option>
          <option>Inters</option>
          <option>Rains</option>
        </select>
        <label class="form-label mt-2">Reifenart</label>
        <select class="form-select " id="rearart">
          <option value>Reifenart auswählen</option>
          <option>Slicks</option>
          <option>Inters</option>
          <option>Rains</option>
        </select>
      </div>
      <div class="col-sm-2">
        <label class="form-label">Mischung</label>
        <select class="form-select" id="frontmischung">
          <option value>Mischung auswählen</option>
          <option>Cold</option>
          <option>Medium</option>
          <option>Hot</option>
          <option>Intermediate</option>
          <option>Dry_wet</option>
          <option>Heavy_wet</option>
        </select>
        <label class="form-label mt-2">Mischung</label>
        <select class="form-select" id="rearmischung">
          <option value>Mischung auswählen</option>
          <option>Cold</option>
          <option>Medium</option>
          <option>Hot</option>
          <option>Intermediate</option>
          <option>Dry_wet</option>
          <option>Heavy_wet</option>
        </select>
      </div>
      <div class="col-sm-2">
        <label class="form-label">Bearbeitungsvariante</label>
        <select class="form-select">
          <option value>Variante auswählen</option>
          <option>Siped</option>
          <option>Extra grooved</option>
          <option>Extra grooved & siped</option>
        </select>
        <label class="form-label mt-2">Bearbeitungsvariante</label>
        <select class="form-select">
          <option value>Variante auswählen</option>
          <option>Siped</option>
          <option>Extra grooved</option>
          <option>Extra grooved & siped</option>
        </select>
      </div>
      <div class="col-sm-2">
        <label class="form-label">Dauer eingeben</label>
        <input id="time" type="number" class="form-control">
        <!-- <button onClick="setTimer()" class="btn btn-primary btn-md mt-2">Timer setzen</button> -->
        <v-btn
            color="primary"
        >Timer setzen
        </v-btn>
      </div>
      <div class="col-sm-2">
        <label class="form-label">Timer</label>
        <input id="timefield" class="form-control" style="max-width: max-content" type="text" placeholder=""
               disabled>
      </div>

    </div>
    <div>
      <!-- <button id="bestellen" onClick="addValues()" class="btn btn-primary btn-md" style="margin-top: 60px"
              type="submit">Bestellen
      </button> -->
      <v-btn block
             color="primary"
             style="margin-top: 35px; "

      >Bestellen
      </v-btn>
    </div>
  </div>


</template>

<script>

import Button from "./Button";
export default {
  name: "Bestellformular",
  components: {Button},
}

</script>

<style scoped>
  body{
    color:  white;
  }
</style>