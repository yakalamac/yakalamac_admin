<script setup>
import NavigationUnique from "../components/SidebarComponents/NavigationUnique.vue";
import NavigationGroup from "../components/SidebarComponents/NavigationGroup.vue";

const properties = defineProps(
    {
      header: {
        type: String,
        required: true
      },
      logo: {
        type: String,
        required: false,
        default: ()=>require('../../image/icon/logo.ico')
      },
      uniques: {
        type: Array,
        required: false,
        default: () => [
          {
            icon: 'home',
            name: 'Ana Sayfa',
            route: 'Home'
          },
          {
            icon: 'shopping_basket',
            name: 'Siparişler',
            route: 'Order'
          },
          {
            icon: 'inventory',
            name: 'Ürünler',
            route: 'Product'
          },
          {
            icon: 'menu',
            name: 'Kategoriler',
            route: 'Product'
          },
          {
            icon: 'widgets',
            name: 'Kolay Market',
            route: 'Product'
          },
          {
            icon: 'account_circle',
            name: 'Uzman Partnerler',
            route: 'Product'
          }
        ]
      },
      groups: {
        type: Array,
        required: false,
        default: () => [
          {
            groupName: 'E-Ticaret Mağazam',
            routes: [
              {
                icon: 'campaign',
                name: 'Duyurular',
                route: 'Product'
              },
              {
                icon: 'perm_media',
                name: 'Sliderlar',
                route: 'Product'
              },
              {
                icon: 'redeem',
                name: 'Kampanyalar',
                route: 'Product'
              },
              {
                icon: 'view_module',
                name: 'Tema/Tasarım',
                route: 'Product'
              },
              {
                icon: 'article',
                name: 'Blok Yazıları',
                route: 'Product'
              },
              {
                icon: 'web_stories',
                name: 'İçerik Yönetimi',
                route: 'Product'
              }
            ]
          },
          {
            groupName: 'Satış Kanallarım',
            routes: [
              {
                icon: 'groups',
                name: 'Satışçılar',
                route: 'Product'
              },
              {
                icon: 'smartphone',
                name: 'Mobil Uygulama',
                route: 'Product'
              }
            ]
          },
          {
            groupName: 'Ayarlar',
            routes: [
              {
                icon: 'settings',
                name: 'Ayarlar',
                route: 'Product'
              },
              {
                icon: 'leak_add',
                name: 'Entegrasyonlar',
                route: 'Product'
              },
              {
                icon: 'chat_bubble_outline',
                name: 'Kolay Destek',
                route: 'Product'
              }
            ]
          }
        ]
      }
    }
);

const onSidebarClose = ()=> document.body.classList.remove("toggled");

</script>

<template>
  <!-- Sidebar -->
    <div class="sidebar-wrapper" v-if="logo && header">

      <div class="simplebar-height-auto-observer-wrapper">
        <div class="simplebar-height-auto-observer"></div>
      </div>

      <div class="simplebar-mask">
        <div class="simplebar-offset" style="right: 0; bottom: 0;">
          <div class="simplebar-content-wrapper" style="height: 100%; overflow: hidden scroll;">
            <div class="simplebar-content" style="padding: 0;">

              <div class="sidebar-header">
                <div class="logo-icon">
                  <img :src="logo" class="logo-img" :alt="header">
                </div>
                <div class="logo-name flex-grow-1">
                  <h5 class="mb-0">
                    {{ header }}
                  </h5>
                </div>
                <div class="sidebar-close" @click="onSidebarClose">
                  <span class="material-icons-outlined">
                    close
                  </span>
                </div>
              </div>

              <div class="sidebar-nav">
                <!-- Navigation -->
                <ul class="metismenu" id="sidenav">
                  <!-- Uniqe Routes -->
                  <NavigationUnique v-if="Array.isArray(uniques)"
                      v-for="unique in uniques"
                      :route="unique.route"
                      :name="unique.name"
                      :icon="unique.icon"
                  />
                  <!-- Unique Routes/ -->
                  <!-- Group Routes -->
                  <NavigationGroup
                      v-for="group in groups"
                      :group-name="group.groupName"
                      :routes="group.routes"
                  />
                  <!-- Group Routes/ -->
                </ul>
                <!-- Navigation/ -->
              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="simplebar-placeholder" style="width: auto; height: 1170px;"></div>

    </div>

    <div class="simplebar-track simplebar-horizontal" style="visibility: hidden;"><div class="simplebar-scrollbar" style="width: 0; display: none;"></div></div>
    <div class="simplebar-track simplebar-vertical" style="visibility: visible;"><div class="simplebar-scrollbar" style="height: 695px; transform: translate3d(0px, 0px, 0px); display: block;"></div></div>
  <!-- Sidebar/ -->
</template>

<style scoped>

</style>