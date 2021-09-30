<template>
  <div class="col-xl-4 col-12">
    <div class="card font-small-3">
      <div class="card-body px-0 py-1">
        <ul class="list-group flex-row flex-wrap list-group-mf-border">
          <li
            v-for="productType in productTypes"
            :key="productType.id"
            class="list-group-item w-50 px-2 rounded-0 bg-transparent"
          >
            <router-link
              :to="{ name: 'product-type', params: { productTypeId: productType.id }}"
              class="d-block text-dark"
            >{{productType.name}}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductTypesList",
  props: {
    productTypes: {
      type: Array,
      required: true
    }
  }
};
</script>