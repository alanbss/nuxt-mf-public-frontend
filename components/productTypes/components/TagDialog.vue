<template>
  <vs-popup
    @close="closeTagsDialog"
    :title="'Filtrar por característica'"
    :active.sync="tagDialogStatus"
  >
    <div class="row m-0">
      <div class="col-12">
        <span v-for="group in groups" :key="'group' + group">
          <vs-checkbox
            v-model="selectedTags"
            v-for="tag in groupTags(group)"
            :key="tag.id"
            :vs-value="tag.id"
            style="justify-content: left;"
          >
            {{ tag.name }}
          </vs-checkbox>
          <br>
        </span>
      </div>
    </div>
    <div class="row m-0 pt-1 d-flex justify-content-between">
      <vs-button @click="clearTags" color="primary" type="flat">Limpar filtros</vs-button>
      <vs-button @click="filterSelectedTagsIds" color="primary" type="filled">Filtrar</vs-button>
    </div>
  </vs-popup>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "TagDialog",
  data() {
    return {
      selectedTags: [],
      selected: undefined,
      lastGroup: undefined,
      productTypeId: null,
    };
  },
  mounted() {
    this.productTypeId = this.$route.params.productTypeId
    this.getProductTypeTags(this.productTypeId)
  },
  computed: {
    groups() {
      return [...new Set(this.tags.map(tag => tag.group_id))]
    },
    tagDialogStatus: {
      get() {
        return this.$store.state.productTypes.tags.tagsDialogShow;
      },
      set() {
        this.closeTagsDialog();
      },
    },
    ...mapState("productTypes/tags", ["tags"]),
    ...mapState("productTypes", ["filterOptions"]),
  },
  methods: {
    ...mapActions("productTypes", ["getProducts", "setFilterTags"]),
    ...mapActions("productTypes/packagings", ["getProductTypeFilteredVolumeOptions"]),
    ...mapActions("productTypes/brands", ["getProductTypeFilteredBrands"]),
    ...mapActions("productTypes/properties", ["getProductTypeFilteredProperties"]),
    ...mapActions("productTypes/tags", [
      "closeTagsDialog",
      "getProductTypeTags",
      "getProductTypeFilteredTags"
    ]),

    groupTags(group) {
      return this.tags.filter(tag => tag.group_id == group)
    },

    chipClass(tag) {
      let tagSelected = this.selectedTags.find(
        (b) => (b.id == tag.id)
      )

      if(tagSelected)
        return 'vs-chip-success con-color brand-selected'
      else
        return ''
    },

    // selectVolume(tag) {
    //   let tagSelected = this.selectedTags.find(
    //     (b) => (b.id == tag.id)
    //   )
    //
    //   if (!tagSelected) {
    //     this.selectedTags.push()
    //   } else {
    //     this.selectedTags = this.selectedTags.filter(
    //       (b) => (b.id != tag.id)
    //     )
    //   }
    // },

    filterSelectedTagsIds() {
      this.currentPage = 1
      this.setFilterTags([...this.selectedTags])
      this.getProductTypeFilteredBrands(this.filterOptions)
      this.getProductTypeFilteredVolumeOptions(this.filterOptions)
      this.getProductTypeFilteredTags(this.filterOptions)
      this.getProductTypeFilteredProperties(this.filterOptions)
      this.getProducts(this.filterOptions)
      this.closeTagsDialog()
    },

    clearTags() {
      this.currentPage = 1
      this.setFilterTags([])
      this.selectedTags = []
      this.getProductTypeFilteredBrands(this.filterOptions)
      this.getProductTypeFilteredVolumeOptions(this.filterOptions)
      this.getProductTypeFilteredTags(this.filterOptions)
      this.getProductTypeFilteredProperties(this.filterOptions)
      this.getProducts(this.filterOptions)
      this.closeTagsDialog()
    }
  },
};
</script>

<style scoped>
.brand-selected a {
  color: white;
}

.con-exemple-prompt {
  padding: 10px;
  padding-bottom: 0px;
}
</style>
