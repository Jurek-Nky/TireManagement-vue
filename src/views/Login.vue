<template>
  <div class="wallpaper">
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
  </div>

</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      username: '',
      password: '',
      token: '',
      overlay: true
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
                  localStorage.setItem("authToken", data)
                  this.token = data
                  await this.setNameAndRole(this.username)
                  await this.$emit("authenticated", true)
                  await this.$router.replace('/dashboard')

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
      const requestOptions = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + this.token},
      }
      let resp;
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then(data => {
            localStorage.setItem("username", username)
            localStorage.setItem("role", data.roleName)
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
  margin-right: auto;
  margin-left: auto;
  border: 5px;

}

.wallpaper {
  width: 100%;
  height: 100%;
  background-image: url('../../public/background.jpg');
  background-size: cover;
}

h2 {
  color: dodgerblue;
  padding: 0 0 10px 15px;
}
</style>