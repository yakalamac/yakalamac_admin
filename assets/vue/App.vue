<script setup>
import Sidebar from "./templates/Sidebar.vue";
import '../bootstrap';
import '../styles/app.css'
import Place from "./controllers/Place.vue";
import Product from "./controllers/Product.vue";
import Menu from "./controllers/Menu.vue";
import Index from "./controllers/Index.vue";
import Bulk from "./controllers/Bulk.vue";

</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar sabit solda -->
    <Sidebar/>
    <!--
    Bu sorunun çözümü, layout (yerleşim düzeni) ile ilgili.
     Şu anda Sidebar ve içerik (RouterView) bileşenlerin ikisi de üst üste yer alıyor olabilir
     çünkü flexbox ya da grid gibi bir düzenleme kullanmadığınızda, HTML bileşenleri varsayılan olarak dikeyde sıralanır.
    Eğer Sidebar'ı solda sabit tutup, sayfanın geri kalanında içerik
    (örneğin, RouterView ile render edilen Place) görüntülenmesini istiyorsanız, bir flexbox düzeni kullanmalısınız.
    Düzeltme:
    İçerik bileşenlerinin yan yana görünmesini sağlayacak şekilde flex düzeni uygulayacağız.
    <div class="flex h-screen">: Tüm sayfa boyunca (yükseklik olarak) flexbox düzeni oluşturur.
    Bu sayede Sidebar ve içerik bölgesi yatayda yan yana sıralanır.
    <Sidebar />: Sidebar bileşeni sayfanın sol tarafında sabit kalır.
    Flexbox'ta bu div'in genişliği otomatik olarak içeriğine göre belirlenir.
    <div class="flex-1 container mx-auto p-6">: İçerik bölgesi (RouterView),
     flex-1 ile genişliğini Sidebar'ın geri kalanına yayarak kaplar. container mx-auto ile ortalanmış bir düzen oluşturulur.
    Bu düzen sayesinde, Sidebar solda sabit kalırken,
    içerik bölgesi (RouterView ile yüklenen sayfa) sağ tarafta genişliği doldurur.
    Artık içerik Sidebar'ın altında görünmeyecektir, çünkü flex düzeni ile onları yatayda sıraladık.
    -->
    <!-- İçerik alanı -->
    <div class="flex-1 container mx-auto p-6">
      <RouterView/>
    </div>
  </div>
</template>

<style scoped>
</style>