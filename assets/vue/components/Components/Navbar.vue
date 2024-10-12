<script setup>
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

import {useRoute} from "vue-router";
const route = useRoute();
import '../../../bootstrap/assets/plugins/simplebar/js/simplebar.min.js';
  const properties = defineProps(
      {
        background: {
          type: String,
          default: 'bg-grd-primary',
          required: false
        },
        header: {
          type: String,
          required: true
        },
        areas:{
          type: Array,
          required: false,
          default: [
            {
              icon: 'home',
              name: 'Anasayfa',
              route: 'Home',
              alt: 'Anasayfa'
            },
            {
              icon: 'store',
              name: 'Mağaza',
              route: 'Home',
              alt: 'Mağaza'
            },
            {
              icon: 'feedback',
              name: 'Bildirimler',
              route: 'Home',
              alt: 'Bildirimler'
            },
            {
              icon: 'event',
              name: 'Takvim',
              route: 'Home',
              alt: 'Takvim'
            },
            {
              icon: 'help_outline',
              name: 'Yardım',
              route: 'Home',
              alt: 'Yardım'
            },
            {
              icon: 'favorite_border',
              name: 'Favorilerim',
              route: 'Home',
              alt: 'Favorilerim'
            },
            {
              icon: 'feedback',
              name: 'Diğer İşlemler',
              route: 'Home',
              alt: 'diğer-işlemler',
              dropdown: true,
              dropdownList: [
                {
                  type:  'subfield',
                  to: 'Home'
                },
                {
                  type:  'subfield',
                  to: 'Home'
                },
                {
                  type:  'divide'
                },
                {
                  type:  'subfield',
                  to: 'Home'
                },
                {
                  type:  'subfield',
                  to: "Home"
                }
              ]
            }
          ]
        }
      }
  );
</script>

<template>
    <!--start main wrapper-->
    <main class="main-wrapper">
        <div class="main-content">
            <div class="card">
                <div class="card-body">


                  <nav :class="`navbar navbar-expand-lg navbar-dark ${properties.background} rounded`">

                    <div class="container-fluid">
                      <a class="navbar-brand" href="javascript:;">
                        {{ properties.header }}
                      </a>
                      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                              data-bs-target="#navbarSupportedContent1" aria-controls="navbarSupportedContent1"
                              aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                      </button>
                      <div class="collapse navbar-collapse" id="navbarSupportedContent1">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
                          <li v-for="area in areas" :class="`nav-item ${area.dropdown ? 'dropdown' : ''}`" :title="area.alt"
                              v-bind="area.dropdown ? { 'data-bs-toggle': 'dropdown' } : {}">
                            <RouterLink
                                :class="`nav-link ${area.dropdown ? 'dropdown-toggle' : ''}
                                ${route.name === area.route ? 'active' : ''} d-flex align-items-center gap-1`"
                                aria-current="page" :to="{name: area.route}">
                              <a>
                                <span class="material-icons-outlined fs-5">
                                  {{ area.icon }}
                                </span>
                                {{ area.name }}
                                <ul v-if="area.dropdown" class="dropdown-menu">
                                  <li v-for="dropdownItem in area.dropdownList">
                                    <hr v-if="dropdownItem.type === 'divide'" class="dropdown-divider">
                                    <RouterLink v-else :to="{ name: dropdownItem.route}" class="dropdown-item">
                                      {{ dropdownItem.name }}
                                    </RouterLink>
                                  </li>
                                </ul>
                              </a>
                            </RouterLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </nav>
                </div>
            </div>

        </div>
    </main>
    <!--end main wrapper-->
</template>