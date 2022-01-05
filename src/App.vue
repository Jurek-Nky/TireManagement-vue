<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated v-if="(usernameComp !== '')">
      <q-toolbar class="bg-primary">
        <q-btn flat @click="toggleLeftDrawer" round dense icon="mdi-menu"/>
        <q-toolbar-title>Reifenverwaltung</q-toolbar-title>
        <q-badge class="q-mr-lg text-subtitle1" outline color="accent" :label="username" v-if="(usernameComp !== '')"/>
        <q-btn class="text-subtitle1" color="negative" @click="logout" dense icon="mdi-logout">logout</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" class="bg-accent" v-if="(usernameComp !== '')">
      <!-- drawer content -->
      <!-- admin items-->
      <q-list padding class="rounded-borders" v-if="(this.$store.state.user.userRole === 'Admin')">
        <q-item class="text-white" clickable v-ripple v-for="item in adminItems" :key="item.title" link :to="item.to">
          <q-item-section avatar>
            <q-icon :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{ item.title }}
          </q-item-section>
        </q-item>
      </q-list>
      <!--manager items-->
      <q-list padding class="rounded-borders" v-if="this.$store.state.user.userRole === 'Manager'">
        <q-item class="text-white" clickable v-ripple v-for="item in manItems" :key="item.title" link :to="item.to">
          <q-item-section avatar>
            <q-icon :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{ item.title }}
          </q-item-section>
        </q-item>
      </q-list>
      <!--ingenieur items-->
      <q-list padding class="rounded-borders" v-if="this.$store.state.user.userRole === 'Ingenieur'">
        <q-item class="text-white" clickable v-ripple v-for="item in ingItems" :key="item.title" link :to="item.to">
          <q-item-section avatar>
            <q-icon :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{ item.title }}
          </q-item-section>
        </q-item>
      </q-list>
      <!--employee items-->
      <q-list padding class="rounded-borders" v-if="this.$store.state.user.userRole === 'Employee'">
        <q-item class="text-white" clickable v-ripple v-for="item in empItems" :key="item.title" link :to="item.to">
          <q-item-section avatar>
            <q-icon :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{ item.title }}
          </q-item-section>
        </q-item>
      </q-list>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container style="background-color: #1E1E2F">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {ref} from 'vue'

export default {
  setup() {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },mounted() {
    console.log(this.$store.state.user.userName)
  },
  methods: {
    logout() {
      this.$store.commit('logout')
      console.log('Username: ' + this.$store.getters.getUserName + ', Userrole:  ' + this.$store.getters.getUserRole + ', Token:  ' + this.$store.getters.getUserToken)
      this.$router.push('/login')
    }
  }, computed: {
    usernameComp() {
      if (this.$store.state.user.userName !== '') {
        this.username = this.$store.state.user.userName
        return this.username
      }
      return ''
    }
  },
  data: () => ({
    drawer: null,
    username: '',
    adminItems: [
      {title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard'},
      {title: 'Bestellungen', icon: 'mdi-timer', to: '/bestellungen'},
      {title: 'Bestand', icon: 'mdi-database', to: '/bestand'},
      {title: 'Wetter', icon: 'mdi-weather-cloudy', to: '/wetter'},
      {title: 'Profil', icon: 'mdi-account', to: '/profile'},
      {title: 'Admin', icon: 'mdi-account-lock', to: '/admin'},
    ],
    ingItems: [
      {title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard'},
      {title: 'Bestand', icon: 'mdi-database', to: '/bestand'},
      {title: 'Wetter', icon: 'mdi-weather-cloudy', to: '/wetter'},
      {title: 'Profil', icon: 'mdi-account', to: '/profile'},

    ],
    manItems: [
      {title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard'},
      {title: 'Bestellungen', icon: 'mdi-timer', to: '/bestellungen'},
      {title: 'Bestand', icon: 'mdi-database', to: '/bestand'},
      {title: 'Wetter', icon: 'mdi-weather-cloudy', to: '/wetter'},
      {title: 'Profil', icon: 'mdi-account', to: '/profile'},
    ],
    empItems: [
      {title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard'},
      {title: 'Bestellungen', icon: 'mdi-timer', to: '/bestellungen'},
      {title: 'Wetter', icon: 'mdi-weather-cloudy', to: '/wetter'},
      {title: 'Profil', icon: 'mdi-account', to: '/profile'},
    ],
  }),
}
</script>
