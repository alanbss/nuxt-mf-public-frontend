<template>
  <vs-sidebar ref="sidebar" position-right  parent="body" default-index="1"  color="primary" class="sidebarx" spacer v-model="active">
    <products-filter-store
      ref="filters"
      :isMobile="true"
      @close-sidebar="closeSidebarVar"
      @updated-filters="updatedFilters"
      @clear-filters="clearFilters"
      style="overflow-x: hidden;"
      :products="products"
      :properties="properties"
      :tags="tags"
      :brands="brands"
      :volumes="volumes"
      :uniqueTagGroups="uniqueTagGroups"
    />
  </vs-sidebar>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ProductsFilterStore from "@/resources/productTypes/components/ProductsFilterStore";

export default {
  name: "FiltersSidebarStore",
  data() {
    return {
      active: false,
      currentTypeId: null,
      properties: [],
      tags: [],
      brands: [],
      volumes: [],
      uniqueTagGroups: []
    };
  },
  mounted() {

  },
  computed: {

  },
  watch: {
    openSidebar(newVal) {
      this.active = newVal
    },
    active(newVal) {
      this.$emit('update-sidebar', newVal)
    }
  },
  methods: {
    closeSidebarVar() {
      this.$emit('apply-filters')
      document.getElementById('hidden-element').click()
    },
    // updateFilters() {
    //   this.$refs.filters.getUpdatedFilters()
    // },
    loadNew() {
      if(this.products && this.products.length) {
        if(this.currentTypeId != this.products[0].productTypeId)
          this.$refs.filters.clearFilters()

        var tagsArray = [].concat.apply([], this.products.map(prod => prod.secondaryCharacteristics))
        var propertiesArray = this.products.map(prod => ({ name: prod.propertyName, id: prod.propertyId }))
        var brandsArray = this.products.map(prod => ({ name: prod.brandName, id: prod.brandId }))
        var volumesArray = this.products.map(prod => ({ packaging: prod.packagingName, quantity: prod.quantity, unit: prod.unitsOfMeasurementName }))
        this.properties = propertiesArray.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
        this.uniqueTagGroups = [...new Set([].concat.apply([], this.products.map(prod => prod.tags)).map(tag => tag.tag_group_id))]
        this.tags = [].concat.apply([], this.products.map(prod => prod.tags))
        this.brands = brandsArray.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
        this.volumes = volumesArray.filter((v, i, a) => a.findIndex(t => (t.packaging === v.packaging && t.quantity === v.quantity && t.unit === v.unit)) === i)

        this.currentTypeId = this.products[0].productTypeId
        setTimeout(() => {
          this.$refs.filters.updateShown()
        }, 300)
      }
    },
    updatedFilters(filters) {
      this.$emit('update-products', { brands: filters.brands, properties: filters.properties, volumes: filters.volumes, tags: filters.tags, productTypeId: this.currentTypeId })
    },
    clearFilters() {
      this.$emit('clear-filters')
    }
  },
  components: {
    ProductsFilterStore
  },
  props: {
    openSidebar: {
      type: Boolean,
      required: true
    },
    products: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.property-selected a {
  color: white;
}

.con-exemple-prompt {
  padding: 10px;
  padding-bottom: 0px;
}
</style>
