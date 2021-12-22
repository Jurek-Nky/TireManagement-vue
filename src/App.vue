<template>
  <Sidebar/>
</template>

<script>
import Bestellformular from "./components/bestellung/Bestellformular";
import Sidebar from "./components/Sidebar";
export default {
  name: 'App',
  components: {

    Bestellformular,
    Sidebar,

  }
}


</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');

* {
  /*box-sizing: border-box;*/
  margin: 0;
  padding: 5px;
}

body {
  font-family: 'Poppins', sans-serif;
}

.container {
  margin: 5px auto;
  overflow: auto;
  /*border: 2px solid black;*/
  padding: 5px;
  border-radius: 10px;
}

.btn {
  display: inline-block;
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}

.btn:focus {
  outline: none;
}

.btn:active {
  transform: scale(0.98);
}

.btn-block {
  display: block;
  width: 100%;
}
</style>
