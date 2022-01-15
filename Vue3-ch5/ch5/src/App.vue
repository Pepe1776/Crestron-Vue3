<script lang="ts"></script>

<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <h1 class="text-9xl font-bold underline">Hello world!</h1>
  </div>
  <router-view />
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html {
  font-size: 10px;
}
</style>
