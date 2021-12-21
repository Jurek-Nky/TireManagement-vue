<template>
  <NavBar/>
</template>

<script>
import NavBar from "../NavBar";

export default {
  components: {NavBar}
}


</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

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
  padding: 5px;
  border-radius: 10px;
}

.btn {
  display: inline-block;
  background: dodgerblue;
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
  transform: scale(0.97);
}

.btn-block {
  display: block;
  width: 100%;
}

.form-control {
  background: white;
  color: #252525;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: text;
  font-size: 15px;
  font-family: inherit;
}
</style>
