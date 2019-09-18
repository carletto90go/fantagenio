<template>
  <div  id="login" class="login-page">
    <h1 class="titolo">Benvenuto su Fantagenio!</h1>
    <div class="form">
      <form class="login-form">
        <input type="text" name="username" v-model="input.username" placeholder="username"/>
        <input type="password" name="password" v-model="input.password" placeholder="password"/>
        <button type="button" v-on:click="login()">login</button>
      </form>
       <pre>
       {{output}}
       </pre>
    </div>
  </div>
</template>

<script>
  export default {
        name: 'login',
        data() {
            return {
                input: {
                    username: "carlo",
                    password: "manu19",
                    output: ""
                }
            }
        },
        methods: {
            login() {

            console.log(this.input.username);

                if(this.input.username != "" && this.input.password != "") {
                         let currentObj = this;
                         this.axios.post('https://hidden-ocean-91661.herokuapp.com/login',
                         {

                         "request":{
                                        username: this.input.username,
                                        password: this.input.password
                                    }})
                                    .then(function (response) {
                                   //    this.output = response.data;
                                        console.log(response.data);
                                   //      this.$emit("authenticated", true);
                                         currentObj.$router.replace({ name: "bet" });
                                    })
                                    .catch(function (error) {
                                     currentObj.input.output = error;

                                      //  console.error(error);

                                    });
                  //              }
                 //   if(this.input.username == 'dio' && this.input.password == 'porco') {

                    } else {
                        console.log("The username and / or password is incorrect");

                    }
//                }
//                 else {
//                    console.log("A username and password must be present");
//                }
            }
        }
    }


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto:300);

.login-page {
  width: 360px;
  padding: 8% 0 0;
  margin: auto;
}
.form {
  position: relative;
  z-index: 1;
  background: #FFFFFF;
  max-width: 360px;
  margin: 0 auto 100px;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}
.form input {
  font-family: "Roboto", sans-serif;
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
}
.form button {
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  outline: 0;
  background: #525eb8;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #FFFFFF;
  font-size: 14px;
  -webkit-transition: all 0.3 ease;
  transition: all 0.3 ease;
  cursor: pointer;
}
.form button:hover,.form button:active,.form button:focus {
  background: #6fa1c2;
}
.form .message {
  margin: 15px 0 0;
  color: #b3b3b3;
  font-size: 12px;
}
.form .message a {
  color: #4CAF50;
  text-decoration: none;
}
.form .register-form {
  display: none;
}
.container {
  position: relative;
  z-index: 1;
  max-width: 300px;
  margin: 0 auto;
}
.container:before, .container:after {
  content: "";
  display: block;
  clear: both;
}
.container .info {
  margin: 50px auto;
  text-align: center;
}
.container .info h1 {
  margin: 0 0 15px;
  padding: 0;
  font-size: 36px;
  font-weight: 300;
  color: #1a1a1a;
}
.container .info span {
  color: #4d4d4d;
  font-size: 12px;
}
.container .info span a {
  color: #000000;
  text-decoration: none;
}
.container .info span .fa {
  color: #EF3B3A;
}
.titolo{
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  outline: 0;
  background: #525eb8;
  width: 90%;
  border: 0;
  padding: 15px;
  color: #FFFFFF;
  font-size: 20px;
  -webkit-transition: all 0.3 ease;
  transition: all 0.3 ease;
  cursor: pointer;
  text-align: center;
}

</style>
