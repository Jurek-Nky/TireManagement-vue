<template>
  <q-layout view="lHh lpR fFf">
    <q-header elevated>
      <q-toolbar class="bg-primary">
        <q-btn flat @click="toggleLeftDrawer" round dense icon="mdi-menu"/>
        <q-toolbar-title>Reifenverwaltung</q-toolbar-title>
        <q-btn flat @click="logout" dense icon="mdi-logout">logout</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" class="bg-accent">
      <!-- drawer content -->
      <q-list padding class="rounded-borders">
        <q-item class="text-white" clickable v-ripple v-for="item in items" :key="item.title" link :to="item.to">
          <q-item-section avatar>
            <q-icon :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{ item.title }}
          </q-item-section>
        </q-item>
      </q-list>
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
  },
  methods: {
    logout() {
      localStorage.clear()
      this.$router.push('/login')
    }
  },
  data: () => ({
    drawer: null,
    items: [
      {title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard'},
      {title: 'Bestellungen', icon: 'mdi-timer', to: '/bestellungen'},
      {title: 'Bestand', icon: 'mdi-database', to: '/bestand'},
      {title: 'Wetter', icon: 'mdi-weather-cloudy', to: '/wetter'},
      {title: 'Profil', icon: 'mdi-account', to: '/profile'},
      {title: 'Admin', icon: 'mdi-account-lock', to: '/admin'},

    ],
  }),
}
</script>
