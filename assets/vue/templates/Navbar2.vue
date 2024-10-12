<script setup>
import Language from "../components/Navbar Components/Language.vue";
import MegaMenu from "../components/Widgets/MegaMenu.vue";
import NotifyList from "./NotifyList.vue";
import SearchBar from "./SearchBar.vue";
import Defaults from "../constraints/Defaults";
import ProfileCart from "./ProfileCart.vue";

const properties = defineProps(
    {
      user: {
        type: Object,
        required: true
      },
      languageSupport: {
        type: Array,
        default: ()=> [
          {
            name: 'Türkçe',
            icon: '#',
            active: false
          }
        ]
      },
    }
);
</script>

<template>
  <nav class="navbar navbar-expand align-items-center gap-4">
    <div class="btn-toggle">
      <a href="javascript:">
        <i class="material-icons-outlined">
          menu
        </i>
      </a>
    </div>
    <SearchBar :user="user"/>
    <ul class="navbar-nav gap-1 nav-right-links align-items-center">

      <li class="nav-item d-lg-none mobile-search-btn">
        <a class="nav-link" href="javascript:">
          <i class="material-icons-outlined">search</i>
        </a>
      </li>

      <li class="nav-item dropdown">
        <Language/>
      </li>

      <li class="nav-item dropdown position-static d-md-flex d-none">
        <MegaMenu/>
      </li>

      <li class="nav-item dropdown">
        <MegaMenu :type="Defaults.MegaMenu.type.App"/>
      </li>

      <li class="nav-item dropdown">
        <NotifyList :notification-service="()=>1"/>
      </li>

      <li class="nav-item d-md-flex d-none">
        <RouterLink class="nav-link position-relative" data-bs-toggle="offcanvas" to="#offcanvasCart">
          <i class="material-icons-outlined">
            shopping_cart
          </i>
          <span class="badge-notify">
            8
          </span>
        </RouterLink>
      </li>

      <li class="nav-item dropdown">
        <ProfileCart :user="user"/>
      </li>
    </ul>

  </nav>
</template>

<style scoped>

</style>