<script setup>
import MegaMenuWidget from "../Components/MegaMenuWidget.vue";
import Defaults from "../../constraints/Defaults";
import {onMounted} from "vue";

const fromType = function (type){
  switch (type){
    case Defaults.MegaMenu.type.Card:
      return 'done_all';
    case Defaults.MegaMenu.type.App:
      return 'apps';
  }
};

const classListFromType = function (type){
    switch (type){
      case Defaults.MegaMenu.type.Card:
        return "dropdown-menu dropdown-menu-end mega-menu shadow-lg p-4 p-lg-5";
      case Defaults.MegaMenu.type.App:
        return "dropdown-menu dropdown-menu-end dropdown-apps shadow-lg p-3";
    }
};

const widgetDivClassListFromType = function (type){
  switch (type){
    case Defaults.MegaMenu.type.App:
      return "border rounded-4 overflow-hidden";
    case Defaults.MegaMenu.type.Card:
      return "mega-menu-widgets";
  }
};

const properties = defineProps({
  widgets: {
    type: Array
  },
  icon: {
    type: String,
    required: false,
  },
  type: {
    type: Number,
    required: false,
    default: ()=>Defaults.MegaMenu.type.Card
  },
  size:{
    type: Number,
    required: false,
    default: ()=>3
  }
});

onMounted(function (){
  if(properties.type === Defaults.MegaMenu.type.App && Array.isArray(properties.widgets))
  {
    const array = [];
    for(let i=0; i<properties.size; i++)
    {
        const row = [];
        for(let j=i*properties.size; j<(i+1)*properties.size; j++)
          row.push(properties.widgets[j]);
        array.push(row);
    }
    properties.widgets = array;
  }
});
</script>

<template>
  <!-- Header -->
  <a class="nav-link dropdown-toggle dropdown-toggle-nocaret" data-bs-auto-close="outside"
     data-bs-toggle="dropdown" href="javascript:">
    <i class="material-icons-outlined">
      {{ icon ?? fromType(type) }}
    </i>
  </a>
  <!-- Header/ -->
  <!-- Body -->
  <div :class="classListFromType(type)" id="mega-menu-content">
    <!-- Container -->
    <div id="mega-menu-widgets" :class="widgetDivClassListFromType(type)">
      <!-- Mega Menu Card Container -->
      <div v-if="widgets && widgets.length && type === Defaults.MegaMenu.type.Card"
           id="mega-menu-widget-container-div" class="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4 g-lg-5">
        <MegaMenuWidget
            v-for="widget in widgets"
            :header="widget.header"
            :content="widget.content"
            :image="widget.image"
            :type="type"
        />
      </div>
      <!-- Mega Menu Card Container/ -->
      <!-- Mega Menu App Container -->
      <div v-else-if="widgets && widgets.length && type === Defaults.MegaMenu.type.App"
           v-for="(row, rowIndex) in widgets" :key="rowIndex"
           id="mega-menu-widget-container-div"
           class="row row-cols-3 g-0 border-bottom">
        <!-- Mega Menu App Row -->
        <div v-for="(app, appIndex) in row" :key="appIndex" class="col border-end">
          <!-- Mega Menu App Column -->
          <div class="app-wrapper d-flex flex-column gap-2 text-center">
            <!-- Mega Menu App Icon -->
            <div class="app-icon">
              <img :src="app.icon" width="36" :alt="app.name">
            </div>
            <!-- Mega Menu App Icon/ -->
            <!-- Mega Menu App Body -->
            <div class="app-name">
              <p class="mb-0">
                {{ app.name }}
              </p>
            </div>
            <!-- Mega Menu App Body/ -->
          </div>
          <!-- Mega Menu App Column/ -->
        </div>
        <!-- Mega Menu App Row/ -->
      </div>
      <!-- Mega Menu App Container/ -->
    </div>
    <!-- Container/ -->
  </div>
  <!-- Body/ -->
</template>

<style scoped>
/** Silence is golden **/
</style>