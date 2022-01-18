<script>
import Toggle from "@/components/Toggle";
export default {
  props: ["mode"],
  components: {
    Toggle,
  },
};
</script>

<template>
  <header>
    <nav>
      <router-link :class="active" class="nav-link" to="/">Home</router-link>
      <router-link class="nav-link" to="/Living">Living</router-link>
      <router-link class="nav-link" to="/Family">Family</router-link>
      <router-link class="nav-link" to="/Bedroom">Bedroom</router-link>
      <router-link class="nav-link" to="/Backyard">Backyard</router-link>
    </nav>
    <h1>{{ mode }} Mode</h1>
    <Toggle :mode="mode" @toggle="$emit('toggle')" />
  </header>
</template>

<style lang="scss">
@import "../Sass/abstracts.scss";

header {
  bottom: 0;
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px, 25px;
  height: 6rem;
  background-color: $color5;
  transition: background 0.3s ease-in-out;
  text-transform: uppercase;
  font-weight: 900;
}
header h1 {
  font-size: 2rem;
  text-transform: uppercase;
  font-weight: 900;
}
header nav {
  display: flex;
  height: 6rem;
  transition: all 0.3s ease-in-out;
}
header nav .nav-link {
  display: flex;
  align-items: center;
  padding: 0px 15px;
  font-size: 3rem;
  border-radius: 2rem;
}
header nav .nav-link:hover {
  background-color: $color6;
  transform: scale(1.2);
}
.dark header {
  background: $color1;
}
// #nav {
//   padding: 30px;
// }

nav a {
  font-weight: bold;
  color: $color8;
}
nav a .router-link:active {
  color: $color3;
}
.dark header nav .nav-link:visited {
  color: $color6;
}
.dark header nav .nav-link:hover {
  background-color: $active;
  transform: scale(1.2);
}
.dark header nav .nav-link:active {
  background-color: $active;
  transform: scale(1.2);
}
.active {
  background-color: $active;
  transform: scale(1.2);
}
</style>
