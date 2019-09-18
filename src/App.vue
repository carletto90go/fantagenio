<template>
  <div id="app">

   <div id="nav">
          <router-link v-if="authenticated" to="/login" v-on:click.native="logout()" replace>Logout</router-link>
   </div>
          <router-view @authenticated="setAuthenticated" />
  </div>
</template>
<script>
    export default {
        name: 'App',
        data() {
            return {
                authenticated: false,
                mockAccount: {
                    username: "dio",
                    password: "porco"
                }
            }
        },
        mounted() {
            if(!this.authenticated) {
                this.$router.replace({ name: "login" });
            }
        },
        methods: {
            setAuthenticated(status) {
                this.authenticated = status;
            },
            logout() {
                this.authenticated = false;
            }
        }
    }
</script>
/* script per mostrare componente Login RICORDA DI ATTIVARLO NEL HTML //  <Login/>
<script>
import Login from './components/Login.vue'

export default {
   name: 'app',
   components: {
     Login
   }
 }
</script>
*/

<style>
#app {
   background: #76b852; /* fallback for old browsers */
   background: -webkit-linear-gradient(right, #525eb8, #6fa1c2);
   background: -moz-linear-gradient(right, #525eb8, #6fa1c2);
   background: -o-linear-gradient(right, #525eb8, #6fa1c2);
   background: linear-gradient(to left, #525eb8, #6fa1c2);
   font-family: "Roboto", sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
}
body{
background: -webkit-linear-gradient(right, #525eb8, #6fa1c2);
}
</style>
