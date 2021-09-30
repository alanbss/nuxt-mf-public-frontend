<template>
  <div style="margin-top: 80px; margin-left:20px;">
    <div><h3>Todos os produtos</h3></div>
    <div v-for="(productType, index) in this.allProductTypes" v-bind:key="index">
      <vs-list v-if="productType.type.quantity > 0">
        <router-link
          :to="{ name: 'cotar-produto', params: { familyName: formatString(productType.family),
                                                  categoryName: formatString(productType.category),
                                                  productTypeName: formatString(productType.type.productType)
                                                }
                }"
        >
          <vs-list-header :title="productType.type.productType"></vs-list-header>
        </router-link>
      </vs-list>
    </div>
  </div>
</template>

<script>
var uniqBy = require('lodash.uniqby');
var sortBy = require('lodash.sortby');
import ClientService from "@/resources/clients/services/catalog";
export default {
  data() {
    return {
      catalog: null,
      allProductTypes: [],
      showProductTypes: [],
    };
  },
  created() {
    ClientService.getAllCatalog().then((response) => {
      this.catalog = response.data;
      this.createOptionsSctructures(this.catalog)
    });
  },
  computed: {},
  methods: {
    createOptionsSctructures(suppliers) {
      var data = null;
      for (var i in suppliers) {
        data = suppliers;
        for(let family in data) {
          for(let collection in data[family]) {
            for(let category in data[family][collection]) {
              for(var j = 0; j < data[family][collection][category].length; j++) {
                if(!this.allProductTypes.find(type => type.productTypeId == data[family][collection][category][j].productTypeId))
                  this.allProductTypes.push({ family: family, collection: collection, category: category, type: data[family][collection][category][j] })
              }
            }
          }
        }
      }
      this.allProductTypes = uniqBy(this.allProductTypes, 'type.productTypeId')
      this.allProductTypes = sortBy(this.allProductTypes, 'type.productType')
    },
    
    normalizeString(s) {
      var r = s.toLowerCase();
      r = r.replace(new RegExp("[àáâãäå]", "g"), "a");
      r = r.replace(new RegExp("ç", "g"), "c");
      r = r.replace(new RegExp("[èéêë]", "g"), "e");
      r = r.replace(new RegExp("[ìíîï]", "g"), "i");
      r = r.replace(new RegExp("[òóôõö]", "g"), "o");
      r = r.replace(new RegExp("[ùúûü]", "g"), "u");
      return r;
    },
    formatString(string) {
      return this.normalizeString(string).replace(/\s+/g, "-");
    },
  },
};
</script>
