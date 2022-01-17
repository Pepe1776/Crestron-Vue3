<template>
  <div class="toggle">
    <h1>{{ mode }} Mode</h1>
  </div>
  <div id="nav">
    <router-link to="/">Home</router-link>|
    <router-link to="/Living">Living</router-link>
    <router-link to="/Family">Family</router-link>
    <router-link to="/Bedroom">Bedroom</router-link>
    <router-link to="/Backyard">Backyard</router-link>
  </div>
</template>
<script>
export default {
  props: ["mode"],
};
</script>
<style lang="scss">
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
