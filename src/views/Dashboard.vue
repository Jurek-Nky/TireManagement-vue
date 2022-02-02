<template>
  <q-page class="q-mt-lg q-mx-lg">
    <div class="row justify-center q-gutter-lg">
      <div class="col-grow">
        <q-card bordered class="q-pa-lg shadow-5 bg-primary" rounded>
          <q-card-section class="q-gutter-sm">
            <span class="row text-subtitle1 text-white q-my-lg">To-Do-Liste</span>
            <div class="row">
              <q-input v-model="newNote" dark filled label="neuer Eintrag" label-color="white"
                       @keyup.enter="addItem"></q-input>
              <q-btn color="white" flat icon="mdi-chevron-down" @click="addItem"></q-btn>
            </div>
          </q-card-section>
          <q-separator dark/>
          <q-card-section class="q-gutter-sm">
            <q-list>
              <q-item v-for="(item, index) in noteList" :key="item.id">
                <q-item-section>
                  <span v-if="!item.done" class="text-white text-weight-bolder">{{ item.message }}</span>
                  <span v-else class="text-strike  text-white text-weight-bolder">{{ item.message }}</span>
                </q-item-section>
                <q-item-section avatar class="row">
                  <div v-if="item.done">
                    <q-btn color="white" flat icon="mdi-undo"
                           @click="noteUncheck(item.id,index)"></q-btn>
                    <q-btn color="white" flat icon="mdi-delete"
                           @click="confirmDialog(item.id,index)"></q-btn>
                  </div>
                  <div v-else>
                    <q-btn color="white" flat icon="mdi-check"
                           @click="noteCheck(item.id,index)"></q-btn>
                  </div>
                </q-item-section>
                <q-dialog v-model="confirm">
                  <q-card class="bg-primary">
                    <q-card-section class="row items-center">
                      <span class="q-ml-sm text-white">Do you really want do delete this Note</span>
                    </q-card-section>
                    <q-card-actions align="right">
                      <q-btn v-close-popup color="grey" label="cancel" text-color="white"></q-btn>
                      <q-btn color="negative" label="delete"
                             @click="noteDelete(this.confirmId,this.confirmIndex)"></q-btn>
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-auto">
        <q-card bordered class="q-pa-lg bg-primary shadow-5">
          <q-card-section>
            <span class="text-white text-subtitle1">Wetter timer</span>
          </q-card-section>
          <q-separator dark/>
          <q-card-section>
            <q-circular-progress
                :max="weatherInitialTime"
                :thickness="0.1"
                :value="weatherTime"
                class="text-white q-mb-none q-mt-lg"
                color="accent"
                show-value
                size="240px"
                track-color="dark"
            >
              <span class="text-white text-h4 text-center">{{ weatherTimeString }}</span>
            </q-circular-progress>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-auto">
        <q-card bordered class="q-pa-lg bg-primary shadow-5">
          <q-card-section>
            <span class="text-white text-subtitle1">Bestell timer</span>
          </q-card-section>
          <q-separator dark/>
          <q-card-section>
            <q-circular-progress
                :max="orderInitialTime"
                :thickness="0.1"
                :value="orderTime"
                class="text-white q-mb-none q-mt-lg"
                color="accent"
                show-value
                size="240px"
                track-color="dark"
            >
              <span class="text-white text-h4 text-center">{{ orderTimeString }}</span>
            </q-circular-progress>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

export default {
  name: "Dashboard",
  data: () => {
    return {
      noteList: [],
      newNote: '',
      confirm: false,
      confirmId: '',
      confirmIndex: '',
      interval: null,
    }
  },
  computed: {
    weatherTime() {
      return this.$store.state.timer.weatherTime
    },
    weatherInitialTime() {
      return this.$store.state.timer.weatherInitialTime
    },
    weatherTimeString() {
      const time = this.$store.state.timer.weatherTime
      if (time <= 0) {
        return "abgelaufen"
      }
      const houres = Math.floor(time / 60 / 60)
      const minutes = Math.floor((time - houres * 3600) / 60)
      const seconds = Math.floor(time - (minutes * 60))
      if (houres === 0) {
        if (minutes === 0) {
          return `${seconds}s`
        }
        return `${minutes}m:${seconds}s`
      }
      return `${houres}h:${minutes}m:${seconds}s`
    },
    orderTimeString() {
      let time = this.$store.state.timer.orderTime
      if (time <= 0) {
        return "abgelaufen"
      }
      const houres = Math.floor(time / 60 / 60)
      const minutes = Math.floor((time - houres * 3600) / 60)
      const seconds = Math.floor(time - (minutes * 60))
      if (houres === 0) {
        if (minutes === 0) {
          return `${seconds}s`
        }
        return `${minutes}m:${seconds}s`
      }
      return `${houres}h:${minutes}m:${seconds}s`
    },
    orderTime() {
      return this.$store.state.timer.orderTime
    },
    orderInitialTime() {
      return this.$store.state.timer.orderInitialTime
    }
  },
  methods: {
    confirmDialog(id, index) {
      this.confirm = true
      this.confirmId = id
      this.confirmIndex = index
    },
    getNotes() {
      this.noteList = []
      const apiUrl = this.$store.state.host.api_url
      let url = apiUrl + '/note/get/all'
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + jwt
        },
      }
      let resp;
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            if (response.status !== 200) {
              console.log(response)
            }
            resp = response
            return response.json()
          })
          .then(data => {
            if (resp.status === 200) {
              this.noteList = data
            }
          })
    },
    addItem() {
      if (this.newNote.length > 0) {
        const apiUrl = this.$store.state.host.api_url
        let url = apiUrl + '/note/new'
        const jwt = this.$store.state.user.jwt
        const data = {
          message: this.newNote
        }
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt
          },
          body: JSON.stringify(data)
        }
        let resp
        fetch(url, requestOptions)
            .then(response => {
              resp = response
              return response.json()
            })
            .then(data => {
              if (resp.status === 200) {
                this.noteList.push(data)
                this.newNote = ''
              }
            })
      }

    },
    noteUncheck(id, index) {
      const apiUrl = this.$store.state.host.api_url
      let url = new URL(`${apiUrl}/note/update/${id}/status`)
      url.searchParams.append('s', false)
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + jwt
        }
      }
      let resp
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then(data => {
            if (resp.status === 200) {
              this.noteList[index] = data
            }
          })
    },
    noteCheck(id, index) {
      const apiUrl = this.$store.state.host.api_url
      let url = new URL(`${apiUrl}/note/update/${id}/status`)
      url.searchParams.append('s', true)
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + jwt
        }
      }
      let resp
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then(data => {
            if (resp.status === 200) {
              this.noteList[index] = data
            }
          })
    },
    noteDelete(id, index) {
      const apiUrl = this.$store.state.host.api_url
      let url = `${apiUrl}/note/delete/${id}`
      const jwt = this.$store.state.user.jwt
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + jwt
        }
      }
      fetch(url, requestOptions)
          .then(response => {
            if (response.status === 200) {
              this.confirm = false
              this.getNotes()
            }
          })
    },
    update() {
      this.interval = setInterval(() => {
        let diffList = []
        const apiUrl = this.$store.state.host.api_url
        let url = apiUrl + '/note/get/all'
        const jwt = this.$store.state.user.jwt
        const requestOptions = {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + jwt
          },
        }
        let resp;
        fetch(url, requestOptions)
            .then(response => {
              resp = response
              if (response.status !== 200) {
                console.log(response)
              }
              resp = response
              return response.json()
            })
            .then(data => {
              if (resp.status === 200) {
                diffList = data
                if (diffList.length !== this.noteList.length) {
                  this.getNotes()
                  return
                }
                for (const i in this.noteList) {
                  if (this.noteList[i].id !== diffList[i].id) {
                    this.getNotes()
                    return
                  } else if (this.noteList[i].message !== diffList[i].message) {
                    this.getNotes()
                    return
                  } else if (this.noteList[i].done !== diffList[i].done) {
                    this.getNotes()
                    return
                  }
                }
              }
            })
      }, 10000)
    },
  },
  unmounted() {
    clearInterval(this.interval)
  }
  ,
  mounted() {
    this.getNotes()
    this.update()
  }
}
</script>

<style scoped>

</style>