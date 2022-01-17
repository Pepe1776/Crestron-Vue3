<template>
  <header>
    <h1>{{ mode }} Mode</h1>
    <Toggle :mode="mode" @toggle="$emit('toggle')" />
    <nav>
      <router-link class="nav-link" to="/">Home</router-link>
      <router-link class="nav-link" to="/Living">Living</router-link>
      <router-link class="nav-link" to="/Family">Family</router-link>
      <router-link class="nav-link" to="/Bedroom">Bedroom</router-link>
      <router-link class="nav-link" to="/Backyard">Backyard</router-link>
    </nav>
    </header>
</template>
<script>
import Toggle from '@/components/Toggle'
export default {
  props: ["mode"],
  components: {
    Toggle,
  }
};
</script>
<style lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px, 25px;
  height: 60px;
  background-color: #bdf7ffc3;
  transition: background 0.3s ease-in-out;
}
header h1 {
  font-size: 32px;
  text-transform: uppercase;
  font-weight: 900;
}
header nav {
  display: flex;
  height: 60px;
}
header nav .nav-link {
  display: flex;
  align-items: center;
  padding: 0px 15px;
}
header nav .nav-link:hover {
  background-color: #75e8fcb0;
}
.dark header {
  background: #15202b;
}
// #nav {
//   padding: 30px;
// }

nav a {
  font-weight: bold;
  color: #2c3e50;
}
nav a .router-link:active {
  color: #3996d4;
}
.dark header nav .nav-link:visited {
  color: #c9e1f1;
}
.dark header nav .nav-link:hover {
  background-color: #101520;
}
</style>
