<template>
  <q-page class="row justify-center items-center bg-image">
    <div class="column">
      <div class="row">
        <q-card rounded bordered class="q-pa-lg shadow-5 bg-primary">
          <q-card-section class="row justify-center">
<!--            <div class="text-white text-h5">Login</div>-->
              <q-img src="../assets/lms_logo_midsize.png" width="200px"/>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">

              <q-input label-color="accent" dark filled v-model="username" type="text" label="username"
                       @keydown.enter="login"/>
              <q-input label-color="accent" dark filled v-model="password" type="password" label="password"
                       @keydown.enter="login"/>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md" :class="{ shake: error }">
            <q-btn color="accent" size="lg" class="full-width" label="Login" @click="login" v-if="!error"/>
            <q-btn color="negative" icon="mdi-alert" size="lg" class="full-width" v-else-if="error"/>
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
      error: false,
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
      const apiUrl = this.$store.state.host.api_url
      const url = apiUrl + '/user/login'
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then((data) => {
            if (resp.status === 200) {
              this.setNameAndRole(this.username, data)
            } else if (data.status !== 200) {
              this.error = true
              setTimeout(() => {
                this.error = false
              }, 1000)
            }

          })
          .catch(error => {
            console.log(error)
          })
    },
    async setNameAndRole(username, jwt) {
      const apiUrl = this.$store.state.host.api_url
      const url = new URL(apiUrl + '/user/role')
      const data = {
        u: username
      }
      for (let k in data) {
        url.searchParams.append(k, data[k]);
      }
      const requestOptions = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + jwt},
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
              role: data.roleName,
              jwt: jwt
            })
            this.$router.push('/dashboard')
          })
    }
  },
  mounted() {
    if (this.$store.state.user.jwt !== ''){
      this.$router.push('/dashboard')
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

.shake {
  animation: shake 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

</style>