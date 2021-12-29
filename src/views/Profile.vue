<template>
  <div class="container">
    <div class="component" ref="loginForm">
      <input disabled type="text"
             class="form-control"
             id="userName"
             ref="nameLable"
             style="background-color:#b8b8b8;  color: black">
      <input type="password"
             class="form-control"
             id="inputPwOld"
             placeholder="Passwort"
             ref="oldPasswordField"
             @input="clearError">
      <small ref="smallOldPw" :hidden=true>falsches Passwort</small>
      <input type="password"
             class="form-control"
             id="inputPwNew"
             placeholder="neues Passwort"
             ref="newPasswordField"
             @input="clearError">
      <small ref="smallNewPw" :hidden=true>Passwort muss mindestens 8 Buchstaben lang sein</small>
      <input type="password"
             class="form-control"
             id="inputPwVerify"
             placeholder="Passwort wiederholen"
             ref="verifyPasswordField"
             @input="clearError">
      <small ref="smallVerifyPw" :hidden=true>Passwörter stimmen nicht überein</small>
      <button type="button"
              class="btn"
              @click="resetPw"
              ref="resetButton">Passwort ändern
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: "Profile",
  components: {},
  data() {
    return {
      username: "",
      passwordOld: "",
      passwordNew: "",
      token: ""
    }
  }, methods: {
    clearError() {
      this.$refs.smallOldPw.hidden = true
      this.$refs.smallNewPw.hidden = true
      this.$refs.smallVerifyPw.hidden = true
      this.$refs.oldPasswordField.classList.remove("password-error")
      this.$refs.newPasswordField.classList.remove("password-error")
      this.$refs.verifyPasswordField.classList.remove("password-error")

    },
    resetPw() {
      this.$refs.smallOldPw.hidden = true
      this.$refs.smallNewPw.hidden = true
      this.$refs.smallVerifyPw.hidden = true
      this.$refs.oldPasswordField.classList.remove("password-error")
      this.$refs.newPasswordField.classList.remove("password-error")
      this.$refs.verifyPasswordField.classList.remove("password-error")

      this.passwordOld = document.getElementById("inputPwOld").value
      if (document.getElementById("inputPwVerify").value === document.getElementById("inputPwNew").value) {
        this.passwordNew = document.getElementById("inputPwNew").value
      } else {
        this.$refs.verifyPasswordField.classList.add("password-error")
        this.$refs.newPasswordField.classList.add("password-error")
        this.$refs.smallVerifyPw.hidden = false
        return
      }
      // create url and add params
      const url = new URL('http://limla.ml:8081/api/v1/user/resetpw')
      const data = {
        pwold: this.passwordOld,
        pwnew: this.passwordNew,
        username: this.username
      }
      for (let k in data) {
        url.searchParams.append(k, data[k]);
      }
      const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`},
      }
      let resp;
      fetch(url, requestOptions)
          .then(response => {
            resp = response
            return response.json()
          })
          .then(data => {

            if (!resp.ok) {
              if (data.message === "Wrong password.") {
                this.$refs.oldPasswordField.classList.add("password-error")
                this.$refs.smallOldPw.hidden = false
              } else if (data.message === "Password must be at least  8 characters long.") {
                this.$refs.newPasswordField.classList.add("password-error")
                this.$refs.smallNewPw.hidden = false
              }
              return;
            }
            this.$refs.resetButton.classList.add("btn-change-success")
            this.$refs.resetButton.innerText = "Passwort wurde erfolgreich geändert"
            this.$refs.resetButton.disabled = true
            let button = this.$refs.resetButton
            let oldPw = this.$refs.oldPasswordField
            let newPw = this.$refs.newPasswordField
            let veriPw = this.$refs.verifyPasswordField
            setTimeout(function () {
              button.classList.remove("btn-change-success")
              button.innerText = "Passwort ändern"
              button.disabled = false
              oldPw.value = ""
              newPw.value = ""
              veriPw.value = ""
            }, 1800)
          }).catch(error => {
        console.log(error)
      })


    }
  },
  mounted() {
    // this.username = localStorage.getItem("username")
    this.username = localStorage.getItem("username")
    this.$refs.nameLable.placeholder = 'Username: ' + this.username
    this.token = localStorage.getItem("authToken");
  }
}

</script>

<style scoped>
template {
  margin: 0;
}

.container {
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
}

.component {
  display: grid;
  margin-left: auto;
  margin-right: auto;
  border: 5px;
  border-bottom-color: white;
}

.password-error {
  border: 2px solid red;
}

.btn-change-success {
  background-color: green;
}

small {
  color: red;
  padding: 0 15px 15px;
  font-size: 12px;
}

</style>