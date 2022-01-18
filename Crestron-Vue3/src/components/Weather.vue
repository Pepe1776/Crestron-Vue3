<script>
import VueWeather from "vue-weather-widget";

export default {
  components: {
    VueWeather,
  },
};
</script>

<template>
  <!-- Open Weather Map -->
  <vue-weather
    api-key="ff70f70eb00b538370940bc7e3a97883"
    units="us"
    :latitude="33.3062"
    :longitude="111.8413"
  />
</template>
