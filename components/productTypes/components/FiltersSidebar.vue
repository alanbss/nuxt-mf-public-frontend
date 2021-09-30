<template>
  <vs-sidebar ref="sidebar" position-right  parent="body" default-index="1"  color="primary" class="sidebarx" spacer v-model="active">
    <products-filter-vertical ref="filters" :isMobile="true" @close-sidebar="closeSidebarVar" style="overflow-x: hidden;" />
  </vs-sidebar>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ProductsFilterVertical from "~/components/productTypes/components/ProductsFilterVertical";

export default {
  name: "FiltersSidebar",
  data() {
    return {
      active: false
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
      document.getElementById('hidden-element').click();
    },
    updateFilters() {
      this.$refs.filters.getUpdatedFilters()
    }
  },
  components: {
    ProductsFilterVertical
  },
  props: {
    openSidebar: {
      type: Boolean,
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
