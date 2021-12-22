<template>
  <div class="center">
    <h2>Login:</h2>
    <input type="text"
           id="inputUsername"
           class="form-control"
           placeholder="username"
           ref="username">
    <br>
    <input type="password"
           id="inputPassword"
           class="form-control"
           placeholder="password"
           ref="pw">
    <button class="btn"
            v-on:click="login()"
            ref="btnLogin">Login
    </button>
  </div>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      this.username = this.$refs.username.value
      this.password = this.$refs.pw.value
      const data = {
        username: this.username,
        password: this.password
      }
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      };
      let resp;
      const url = 'http://limla.ml:8081/api/v1/user/login'
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then(async (data) => {
                if (data.status === 401) {
                  alert(data.message)
                  return
                }
                if (resp.status === 200) {
                  console.log(this.$refs.btnLogin.color)
                  localStorage.setItem("authToken", data)
                  this.setNameAndRole(this.username)
                }
              }
          )
          .catch(error => {
            console.log(error)
            alert(error)
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
      const token = JSON.stringify('Bearer ' + localStorage.getItem("authToken"))
      const requestOptions = {
        method: 'GET',
        headers: {'Authorization': token},
      }
      let resp;
      fetch(url, requestOptions)
          .then(response => {
            resp = response;
            response.json();
          })
          .then(data => {
            console.log(data)
          })


    }
  }
}
</script>

<style scoped>
template {
  margin: 0;
}

.center {
  max-width: 400px;
  display: grid;
  /*margin-top: 20vh;*/
  margin-right: auto;
  margin-left: auto;
  border: 5px;
}

h2 {
  color: dodgerblue;
  padding: 0 0 10px 15px;
}
</style>