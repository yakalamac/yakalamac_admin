<script setup>
import {ref} from "vue";
import Table from "../../templates/Table.vue";
import Elasticsearch from "../../../http/elasticsearch/elasticsearch";

const placeData = ref([]);


</script>

<template>
  <Table
      :data="()=>Elasticsearch
    .places()
    .then(
        response => response.ok ? response.result.hits().hitsAsData() : console.error(response.result)
        )"
      :definitions="[
          {
            header: 'ID',
            field: 'id',
            truncate: {
              showOnHover: true,
              maxLength: 7,
              remain: '###'
            }
          },
          {
            header: 'Name',
            field: 'name'
          },
            {
              header: 'Address',
              field: 'address.longAddress'
            } ,
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
          targetRoute: 'PlaceDetail'
        }"
      :pagination="{
        paginator: (page)=> Elasticsearch
        .places(page)
        .then(
            response => response.ok ? response.result
            .hits()
            .hitsAsData()
            : console.error(response)
            )
        }"
  />
</template>

<style scoped>
/* İsteğe bağlı stil ekleyebilirsiniz */
</style>
