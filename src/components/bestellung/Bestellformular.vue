<template>
  <div class="container mt-2">
    <div class="row g-3">
      <div class="col-sm-2">
        <div style="margin-top: 35px; margin-left: 60px">
          <strong>Vorderachse</strong>
        </div>
        <div style="margin-top: 55px; margin-left: 60px">
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

      <div class="col-md-2 pt-2">
        <button id="bestellen" onClick="addValues()" class="btn btn-primary btn-md" style="margin-top: 60px"
                type="submit">Bestellen
        </button>
      </div>
      <div class="col-sm-2">
        <label class="form-label">Dauer eingeben</label>
        <input id="time" type="number" class="form-control">
        <button onClick="setTimer()" class="btn btn-primary btn-md mt-2">Timer setzen</button>
      </div>
      <div class="col-sm-2">
        <label class="form-label">Timer</label>
        <input id="timefield" class="form-control" style="max-width: max-content" type="text" placeholder=""
               disabled>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "Bestellformular",

}
</script>

<style scoped>
  body{
    color:  white;
  }
</style>