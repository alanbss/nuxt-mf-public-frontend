<template>
  <div class="row mt-2">
    <div class="col-12">
      <div class="card shadow-sm mb-0">
        <div class="card-content">
          <div class="card-body py-1">
            <div>
              Escolha suas preferências
              <div class="mt-1" style="overflow-x: auto; white-space: nowrap;" v-if="properties.length > 0 && properties[0].id">
                <a href="javascript:void(0)" @click="showPropertiesDialog" style="float: left; font-size: 1.5em;">
                  <i style="margin-top: 10px; margin-right: 6px;" class="feather icon-filter"></i>
                </a>
                <div style="overflow-x: auto; white-space: nowrap;">
                  <span v-for="property in properties" :key="property.id">
                    <vs-chip
                      v-if="property.id"
                      :class="propertyChipClass(property.id)"
                      :vs-value="property.id"
                      style="display: inline-block; float: none;"
                    >
                      <a style="margin-top: 6px;" @click="selectProperty(property.id)">{{ property.name }}</a>
                    </vs-chip>
                  </span>
                </div>
              </div>

              <property-dialog ref="propertyDialog" />

              <div v-if="volumes.length > 0">
                <vs-divider style="margin-top: 0;"/>
                <a href="javascript:void(0)" @click="showVolumesDialog" style="float: left; font-size: 1.5em;">
                  <i style="margin-top: 10px; margin-right: 6px;" class="feather icon-filter"></i>
                </a>
                <div style="overflow-x: auto; white-space: nowrap;">
                  <volume-chips ref="volumeChips" />
                </div>
              </div>

              <volume-dialog />

              <div v-if="brands.length > 0" class="mr-2 text-dark mb-1">
                <vs-divider/>
                <a href="javascript:void(0)" @click="showBrandsDialog" style="float: left; font-size: 1.5em;">
                  <i style="margin-top: 12px; margin-right: 6px;" class="feather icon-filter"></i>
                </a>
                <div style="overflow-x: auto; white-space: nowrap;">
                  <brand-chips ref="brandChips" />
                </div>
              </div>

              <brand-dialog />

            </div>
            <div class="row d-flex justify-content-between">
              <a v-if="tags.length > 0" @click="showTagsDialog" class="mr-2 ml-2 mt-1">
                <i class="feather icon-filter"></i> <span style="border-bottom: 1px solid #000; padding-bottom: 1px;">Mais filtros</span>
              </a>
              <a style="float: right; border-bottom: 1px solid #007bff; padding-bottom: 1px; color: #007bff;" @click="clearAllFilters()" class="mr-2 ml-2 mt-1">
                Limpar filtros
              </a>
            </div>

            <tag-dialog ref="tagDialog" />


          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import PropertyDialog from "./PropertyDialog";
import BrandDialog from "./BrandDialog";
import BrandChips from "./BrandChips";
import VolumeDialog from "./VolumeDialog";
import VolumeChips from "./VolumeChips";
import TagDialog from "./TagDialog";
import HorizontalScroll from 'vue-horizontal-scroll'
import 'vue-horizontal-scroll/dist/vue-horizontal-scroll.css'

export default {
  name: "ProductsFilter",
  data() {
    return {
      selectedProperties: [],
      productTypeId: null,
    };
  },
  computed: {
    ...mapState("productTypes/properties", ["properties"]),
    ...mapState("productTypes/packagings", ["volumes"]),
    ...mapState("productTypes/brands", ["brands"]),
    ...mapState("productTypes/tags", ["tags"]),
    ...mapState("productTypes", ["filterOptions"]),
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage;
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value);
      },
    },
    propertyDialogStatus: {
      get() {
        return this.$store.state.productTypes.properties.propertiesDialogShow;
      },
      set() {
        this.closePropertiesDialog();
      },
    },
  },
  watch: {
    propertyDialogStatus() {
      this.selectedProperties = [...this.filterOptions.data.property_ids]
    }
  },
  methods: {
    ...mapActions("productTypes", ["getProducts", "setFilterProductType", "setFilterProperties"]),
    ...mapActions("productTypes/brands", ["showBrandsDialog", "getProductTypeFilteredBrands"]),
    ...mapActions("productTypes/packagings", ["showVolumesDialog", "getProductTypeFilteredVolumeOptions"]),
    ...mapActions("productTypes/tags", ["showTagsDialog", "getProductTypeFilteredTags"]),
    ...mapActions("productTypes/properties", [
      "getProductTypeProperties",
      "showPropertiesDialog",
      "getProductTypeFilteredProperties"
    ]),
    selectProperty(id) {
      let selectedProperty = this.selectedProperties.find((b) => b === id);

      if(selectedProperty) {
        this.selectedProperties = this.selectedProperties.filter(
          (propertyChip) => propertyChip !== id
        )
      } else {
        this.selectedProperties.push(id);
      }
      this.currentPage = 1
      this.setFilterProperties([...this.selectedProperties])
      this.getProductTypeFilteredBrands(this.filterOptions)
      this.getProductTypeFilteredVolumeOptions(this.filterOptions)
      this.getProductTypeFilteredTags(this.filterOptions)
      this.getProductTypeFilteredProperties(this.filterOptions)
      this.getProducts(this.filterOptions)
    },
    propertyChipClass(id) {
      if(this.selectedProperties.includes(id))
        return 'mb-1 vs-chip-success con-color brand-selected'
      else
        return 'mb-1'
    },
    clearAllFilters() {
      this.$refs.volumeChips.clearVolumes()
      this.$refs.brandChips.clearBrands()
      this.$refs.tagDialog.clearTags()
      this.$refs.propertyDialog.clearProperties()
      this.getProductTypeFilteredBrands(this.filterOptions)
      this.getProductTypeFilteredVolumeOptions(this.filterOptions)
      this.getProductTypeFilteredTags(this.filterOptions)
      this.getProductTypeFilteredProperties(this.filterOptions)
      this.selectedProperties = [...this.filterOptions.data.property_ids]
    },
  },
  mounted() {
    this.productTypeId = this.$route.params.productTypeId
    this.getProductTypeProperties(this.productTypeId)
  },
  components: {
    PropertyDialog,
    BrandDialog,
    BrandChips,
    VolumeDialog,
    VolumeChips,
    TagDialog,
  }
};
</script>
