<template id="loginTemplate">
  <form class="form">
    <input type="text" id="inputFirstName" class="form-content" placeholder="Vorname">
    <input type="text" id="inputLastName" class="form-content" placeholder="Nachname">
    <input type="password" id="inputPassword" class="form-content" placeholder="Passwort">
    <Button text="Login" color="green" @click="login"/>
  </form>
</template>

<script>
import Button from "@/components/Button"

export default {
  name: "Login",
  components: {
    Button
  }, methods: {
    async login() {
      const url = "localhost:8081/api/v1/user/login"
      const data = {
        firstName: "admin",
        lastName: "admin",
        password: "12345678"
      }
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      }
      console.log("payload:" + requestOptions.body)

      await fetch("http://localhost:8081/api/v1/user/all",{headers:{'accept':'html/text'}})
      .then(response => console.log(response))

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