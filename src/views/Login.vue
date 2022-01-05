<template>
  <q-page class="row justify-center items-center bg-image">
    <div class="column">
      <div class="row">
        <q-card rounded bordered class="q-pa-lg shadow-5 bg-primary">
          <q-card-section>
            <div class="text-white text-h5">Login</div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">

              <q-input label-color="accent" dark filled v-model="username" type="text" label="username"/>
              <q-input label-color="accent" dark filled v-model="password" type="password" label="password"/>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn color="accent" size="lg" class="full-width" label="Login" @click="login"/>
          </q-card-actions>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      const data = {
        username: this.username,
        password: this.password
      }
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      }
      let resp;
      const url = 'http://limla.ml:8081/api/v1/user/login'
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then((data) => {
            if (data.status === 401) {
              alert(data.message)
              return
            }
            if (resp.status === 200) {
              this.setNameAndRole(this.username)
            }
          })
          .catch(error => {
            console.log(error)
            alert("an error occurred check the console for further information")
          })
    },
    async setNameAndRole(username) {
      const url = new URL('http://limla.ml:8081/api/v1/user/role')
      const data = {
        u: username
      }
      for (let k in data) {
        url.searchParams.append(k, data[k]);
      }
      const token = this.$store.getters.getUserToken
      const requestOptions = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + token},
      }
      let resp;
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then(data => {
            this.$store.commit('login', {
              name: username,
              role: data.roleName
            })
            this.$router.push('/dashboard')
          })
    }
  }
}
</script>

<style>
.bg-image {
  background-image: url('../assets/background.jpg');
  background-repeat: no-repeat;
  background-size: auto 100%;
}
</style>