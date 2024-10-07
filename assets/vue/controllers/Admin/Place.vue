<script setup>
import Table from "../../templates/Table.vue";
import Elasticsearch from "../../../http/elasticsearch/elasticsearch";

</script>

<template>
  <Table
      :data="(page, perPage)=>Elasticsearch
    .places(page, perPage)
    .then(
        response => response.ok ? response.result.hits().hitsAsData() : console.error(response.result)
        )"
      :definitions="[
          {
            header: 'Kimlik',
            field: 'id',
            truncate: {
              showOnHover: true,
              maxLength: 7,
              remain: '..'
            }
          },
          {
            header: 'İşletme Adı',
            field: 'name'
          },
          {
              header: 'Adres',
              field: 'address.longAddress',
              truncate: {
                showOnHover: true,
                maxLength: 10
              }
            },
            {
              header: 'Sahipli',
              field: 'owner'
            }
      ]"
      :identifierKey="`id`"
      :editable="{
          active: true,
          targetRoute: 'PlaceDetail',
          actionName: 'Sil',
          actionHeader: 'düzenle'
        }"
      :deletable="{
          active: true,
          targetRoute: 'PlaceDetail',
          actionName: 'Düzenle'
        }"
      :pagination="{
        perPage: 100,
        paginator: (page, perPage)=>Elasticsearch
        .places(page, perPage)
        .then(
            response => response.ok ? response.result
            .hits()
            .hitsAsData()
            : console.error(response.result)
            )
        }"
  />
</template>

<style scoped>
/* İsteğe bağlı stil ekleyebilirsiniz */
</style>
