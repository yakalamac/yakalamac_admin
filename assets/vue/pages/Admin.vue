<script setup>
import Navbar2 from "../templates/Navbar2.vue";
import {onMounted} from "vue";

onMounted(function (){
  window.onscroll=function (){
    if(window.scrollTop > 60)
      document.querySelector('.top-header .navbar').classList.add('sticky-header');
    else
      document.querySelector('.top-header .navbar').classList.remove('sticky-header');
  };
});
</script>

<template>
  <header class="top-header">
    <Navbar2 class="navbar"
        :user="{

        }"
        header="Admin"
    />
  </header>

</template>

<style scoped>

</style>