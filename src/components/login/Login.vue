<template id="loginTemplate">
  <input type="text" id="inputUsername" class="form-content" placeholder="username" ref="username">
  <input type="password" id="inputPassword" class="form-content" placeholder="password" ref="pw">
  <button v-on:click="login()" ref="btnLogin">login</button>
  <textarea ref="testTextArea"></textarea>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      btnColor: "green"
    }
  },
  methods: {
    login() {
      const data = {
        username: this.$refs.username.value,
        password: this.$refs.pw.value
      }
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      };
      const url = 'http://limla.ml:8081/api/v1/user/login'
      fetch(url, requestOptions)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
                if (data.status === 401) {
                  alert(data.message)
                  return
                }
                console.log(this.$refs.btnLogin.color)
                localStorage.setItem("authToken", data)
              }
          )
          .catch(error => {
            console.log(error)
            alert(error)
          })

    }
  }
}
</script>

<style>
form {
  display: grid;
  align-items: center;
  margin: auto;
  max-width: 300px;
}

.form-content {
  display: inline-block;
  color: #000;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: text;
}
</style>