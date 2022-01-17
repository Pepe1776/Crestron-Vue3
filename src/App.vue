<script>
import Nav from "@/components/Nav";
export default {
  name: "app",
  data() {
    return {
      mode: "dark",
    };
  },
  components: {
    Nav,
  },
};
</script>

<template>
  <div class="app" :class="mode">
    <Nav :mode="mode" />
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.app {
  width: 100vw;
  min-height: 100vh;
  background-color: #c0cfdb;
  color: #15202b;
}
.dark {
  background-color: #080d11;
  color: #f3f3f3;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
