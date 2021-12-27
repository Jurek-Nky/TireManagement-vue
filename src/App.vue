<template>
  <v-app id="app">
    <v-navigation-drawer
        v-model="drawer"
        app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Menu
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
          dense
          nav
      >
        <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="item.to"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
    >
      <v-app-bar-nav-icon
          @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>Reifenverwaltung</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="this.$router.push('/profile')">
        <v-icon left>mdi-account-box</v-icon>
        <span>profile</span>
      </v-btn>
      <v-btn color="red" @click="logout">
        <v-icon left>mdi-logout-variant</v-icon>
        <span>logout</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import router from "@/router";
export default {
  data: () => ({
    drawer: null,
    items: [
      {title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard'},
      {title: 'Bestellungen', icon: 'mdi-order-bool-ascending-variant', to: '/bestellungen'},
      {title: 'Bestand', icon: 'mdi-database', to: '/bestand'},
      {title: 'Wetter', icon: 'mdi-weather-cloudy', to: '/wetter'},

    ]
  }),
  methods: {
    logout() {
      localStorage.clear()
      this.$router.replace({name: 'login'})
    }
  },
  mounted() {
    this.drawer = false
  }

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
