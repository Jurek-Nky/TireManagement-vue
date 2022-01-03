<template>
<h1>Bestellungen</h1>
  <Bestellformular/>
<v-divider/>
  <Bestellübersicht/>
</template>

<script>
import Bestellformular from "../components/bestellung/Bestellformular";
import Bestellübersicht from "../components/bestellung/Bestellübersicht";
export default {
  name: "Order",
  components: {Bestellübersicht, Bestellformular},
}
</script>

<style scoped>

</style>