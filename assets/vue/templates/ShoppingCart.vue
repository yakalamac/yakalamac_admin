<script setup>
  const properties = defineProps({
    orders:{
      type: Array,
      default:()=>[]
    }
  });
</script>

<template>
  <!-- Cart -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasCart">
    <!-- Header -->
    <div class="offcanvas-header border-bottom h-70">
      <h5 class="mb-0" id="offcanvasRightLabel">
        {{ orders.length === 0 ? 'Sipariş Yok' : `${orders.length} Yeni Sipariş`}}
      </h5>
      <a href="javascript:;" class="primaery-menu-close" data-bs-dismiss="offcanvas">
        <i class="material-icons-outlined">close</i>
      </a>
    </div>
    <!-- Header/ -->
    <!-- Body -->
    <div class="offcanvas-body p-0">
      <!-- Order List -->
      <div v-if="orders" class="order-list">
      <!-- Order List Content -->
        <div v-for="order in orders" class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
          <div class="order-img">
            <img :src="order.image" class="img-fluid rounded-3" width="75" alt="">
          </div>
          <div class="order-info flex-grow-1">
            <h5 class="mb-1 order-title">
              {{ order.name }}
            </h5>
            <p class="mb-0 order-price">{{ order.price }}₺</p>
          </div>
          <div class="d-flex">
            <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
            <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
          </div>
        </div>
        <!-- Order List Content/ -->
      </div>
      <!-- Order List/ -->
    </div>
    <!-- Body/ -->
    <!-- Footer -->
    <div class="offcanvas-footer h-70 p-3 border-top">
      <div class="d-grid">
        <button type="button" class="btn btn-grd btn-grd-primary" data-bs-dismiss="offcanvas">
          Ürünlere Git
        </button>
      </div>
    </div>
    <!-- Footer/ -->
  </div>
  <!-- Cart/ -->
</template>

<style scoped>

</style>