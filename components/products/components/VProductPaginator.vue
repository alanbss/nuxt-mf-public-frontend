<template>
  <div class="centered-paginator">
    <vs-pagination :total="totalPages" v-model="currentPage" :max="10" :color="'#7367F0'" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "VProductPaginator",
  mounted() {
    this.$el.querySelector(".vs-row").style.removeProperty("justify-content");
  },
  watch: {
    currentPage(pageNumber) {
      this.userSelectedPage(pageNumber);
      this.getProductsByPageNumber();
    },
  },
  computed: {
    ...mapState("pagination", ["totalPages"]),
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage;
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value);
      },
    },
  },
  methods: {
    ...mapActions("pagination", ["userSelectedPage"]),
    ...mapActions("productTypes", ["getProductsByPageNumber"]),
  },
};
</script>
