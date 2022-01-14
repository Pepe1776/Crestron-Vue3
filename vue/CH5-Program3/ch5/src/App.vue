<template>
  <div id="app">
    {{ VolumeHorizontal }}
  </div>
</template>

<script>
import navitems from "@/assets/data/navitems.json";

export default {
  name: "App",
  components: {},
  data() {
    return {
      navListItems: navitems
    };
  },
  methods: {},
  computed: {},
  created() {},
  mounted() {}
};
</script>

<style>
html {
  width: 100%;
  height: 100%;
}

/* fixed position to fix scrolling and other anomolies */
</style>
