<script setup>
import {onMounted} from "vue";
import NavigationBar from "../templates/NavigationBar.vue";
import Sidebar2 from "../templates/Sidebar2.vue";


onMounted(function (){
  window.onscroll=function (){
    const navbar = document.querySelector('.top-header .navbar');
    if(window.scrollTop > 60)
      navbar?.classList.add('sticky-header');
    else
      navbar?.classList.remove('sticky-header');
  };
});


const onMouseEnter = ()=>{
  if(!document.body.classList.contains('toggled'))
    document.body.classList.add("sidebar-hovered");
};

const onMouseLeave = ()=>{
  if(!document.body.classList.contains("toggled"))
    document.body.classList.remove("sidebar-hovered");
};
</script>

<template>
  <header class="top-header z-0">
    <NavigationBar
        class="navbar"
        :user="{

        }"
        header="Admin"
    />
  </header>
  <aside @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" data-simplebar="true"
         class="sidebar-wrapper z-0"
  >
  <Sidebar2 header="Yakalamaç"/>
  </aside>
  <main class="main-wrapper">
    <div class="main-content">
      <RouterView/>
    </div>
  </main>
  <footer class="page-footer">

  </footer>


</template>

<style >

</style>