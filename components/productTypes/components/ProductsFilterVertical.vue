<template>
  <div class="card h-100 shadow-sm font-small-3 mb-0">
    <div class="card-content">
      <div class="card-body" style="padding: 0px 12px 12px 12px;">
        <div>
          <div class="row mb-2">
            <vs-button class="ml-1" v-if="isMobile" @click="closeSideBar()" color="primary">
              Aplicar
            </vs-button>
            <a style="border-bottom: 1px solid #007bff; padding-bottom: 1px; color: #007bff;" @click="clearAllFilters()" class="mr-2 ml-2 mt-1">
              Limpar tudo <i class="feather icon-corner-down-left"></i>
            </a>
          </div>

          <span style="color: Grey;" v-if="properties.length > 0 && properties[0].id">Carac. principal</span>
          <div class="mt-1" v-if="properties.length > 0 && properties[0].id">
            <div class="input-group mb-1">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  <i class="feather icon-search"></i>
                </span>
              </div>
              <input
                @input="searchProperties()"
                type="text"
                id="property-search"
                class="form-control"
                placeholder="Buscar característica"
                aria-label="Característica"
                aria-describedby="basic-addon1"
                v-model="propertyInput"
               >
               <span v-if="propertyInput && propertyInput.length" class="input-group-append">
                 <button
                  class="btn bg-transparent border-left-0 border"
                  style="padding: 0.5em;"
                  @click="propertyInput = ''; searchProperties()"
                  type="button"
                 >
                   <i class="fa fa-times"></i>
                 </button>
               </span>
            </div>
            <div>
              <span v-for="property in showProperties" :key="property.id">
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

          <div v-if="volumes.length > 0">
            <vs-divider style="margin-top: 0;"/>
            <span style="color: Grey;">Volume</span>
            <div class="mt-1 mb-1">
              <volume-chips ref="volumeChips" :isMobile="isMobile" />
            </div>
          </div>

          <div v-if="tags.length > 0">
            <vs-divider style="margin-top: 0;"/>
            <span style="color: Grey;">Carac. secundária</span>
            <div class="mt-1">
              <span v-for="group in groups" :key="'group' + group">
                <vs-checkbox
                  v-model="selectedTags"
                  color="#008567"
                  v-for="tag in groupTags(group).sort((a,b)=> a.name.localeCompare(b.name))"
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

          <div v-if="brands.length > 0" class="text-dark mb-1">
            <vs-divider/>
            <span style="color: Grey;">Marca</span>
            <div class="mt-1">
              <brand-chips ref="brandChips" :isMobile="isMobile" />
            </div>
          </div>

        </div>
        <div class="row">
          <vs-button class="ml-1" v-if="isMobile" @click="closeSideBar()" color="primary">
            Aplicar
          </vs-button>
          <a style="border-bottom: 1px solid #007bff; padding-bottom: 1px; color: #007bff;" @click="clearAllFilters()" class="mr-2 ml-2 mt-1">
            Limpar tudo <i class="feather icon-corner-down-left"></i>
          </a>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import BrandChips from "./BrandChips";
import VolumeChips from "./VolumeChips";
var sortBy = require('lodash.sortby');

export default {
  name: "ProductsFilter",
  data() {
    return {
      showProperties: [],
      propertyInput: null,
      selectedProperties: [],
      selectedTags: [],
      productTypeId: null,
    };
  },
  computed: {
    ...mapState("productTypes/properties", ["properties"]),
    ...mapState("productTypes/packagings", ["volumes"]),
    ...mapState("productTypes/brands", ["brands"]),
    ...mapState("productTypes/tags", ["tags"]),
    ...mapState("productTypes", ["filterOptions"]),
    groups() {
      return [...new Set(this.tags.map(tag => tag.group_id))]
    },
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
    properties() {
      this.showProperties = sortBy(this.properties, 'name')
    },
    selectedTags() {
      this.filterTags()
    }
  },
  methods: {
    ...mapActions("productTypes", ["getProducts", "setFilterProductType", "setFilterProperties", "setFilterTags"]),
    ...mapActions("productTypes/brands", ["showBrandsDialog", "getProductTypeFilteredBrands", "getProductTypeBrands"]),
    ...mapActions("productTypes/packagings", ["showVolumesDialog", "getProductTypeFilteredVolumeOptions", "getProductTypeVolumeOptions"]),
    ...mapActions("productTypes/tags", [
      "closeTagsDialog",
      "getProductTypeTags",
      "getProductTypeFilteredTags"
    ]),
    ...mapActions("productTypes/properties", [
      "getProductTypeProperties",
      "showPropertiesDialog",
      "getProductTypeFilteredProperties"
    ]),
    closeSideBar() {
      this.$emit('close-sidebar')
    },
    filterTags() {
      this.currentPage = 1
      this.setFilterTags([...this.selectedTags])
      if(!this.isMobile) {
        this.getProductTypeFilteredBrands(this.filterOptions)
        this.getProductTypeFilteredVolumeOptions(this.filterOptions)
        this.getProductTypeFilteredTags(this.filterOptions)
        this.getProductTypeFilteredProperties(this.filterOptions)
        this.getProducts(this.filterOptions)
      }
    },
    selectProperty(id) {
      let selectedProperty = this.selectedProperties.find((b) => b === id);

      if(selectedProperty) {
        this.selectedProperties = this.selectedProperties.filter(
          (propertyChip) => propertyChip !== id
        )
      } else {
        this.selectedProperties.push(id);
      }
      this.setFilterProperties([...this.selectedProperties])
      if(!this.isMobile) {
        this.currentPage = 1
        this.getProductTypeFilteredBrands(this.filterOptions)
        this.getProductTypeFilteredVolumeOptions(this.filterOptions)
        this.getProductTypeFilteredTags(this.filterOptions)
        this.getProductTypeFilteredProperties(this.filterOptions)
        this.getProducts(this.filterOptions)
      }
    },
    propertyChipClass(id) {
      if(this.selectedProperties.includes(id))
        return 'mb-1 chip-mf-selected brand-selected'
      else
        return 'mb-1 chip-mf'
    },
    clearAllFilters() {
      this.$refs.volumeChips.clearVolumes()
      this.$refs.brandChips.clearBrands()
      this.setFilterProperties([])
      this.selectedProperties = []
      this.setFilterTags([])
      this.selectedTags = []
      this.getProductTypeFilteredBrands(this.filterOptions)
      this.getProductTypeFilteredVolumeOptions(this.filterOptions)
      this.getProductTypeFilteredTags(this.filterOptions)
      this.getProductTypeFilteredProperties(this.filterOptions)
      if(this.isMobile)
        this.closeSideBar()
    },
    getUpdatedFilters() {
      this.currentPage = 1
      this.getProductTypeFilteredBrands(this.filterOptions)
      this.getProductTypeFilteredVolumeOptions(this.filterOptions)
      this.getProductTypeFilteredTags(this.filterOptions)
      this.getProductTypeFilteredProperties(this.filterOptions)
      this.getProducts(this.filterOptions)
    },
    groupTags(group) {
      return this.tags.filter(tag => tag.group_id == group)
    },
    searchProperties() {
      if(this.propertyInput != null && this.propertyInput != '') {
        this.showProperties = this.properties.filter(
          (propertyChip) => propertyChip.id && this.normalizeString(propertyChip.name).match(this.normalizeString(this.propertyInput))
        )
      } else {
        this.showProperties = sortBy(this.properties, 'name')
      }
    },
    normalizeString(s) {
      var r = s.toLowerCase();
      r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
      r = r.replace(new RegExp("ç", 'g'),"c");
      r = r.replace(new RegExp("[èéêë]", 'g'),"e");
      r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
      r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
      r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
      return r;
    }
  },
  mounted() {
    this.productTypeId = this.$route.params.productTypeId
    this.getProductTypeProperties(this.productTypeId).then(() => {
      this.showProperties = sortBy(this.properties, 'name')
    })
    this.getProductTypeTags(this.productTypeId)
    this.getProductTypeBrands(this.productTypeId)
    this.getProductTypeVolumeOptions(this.productTypeId)
  },
  components: {
    BrandChips,
    VolumeChips,
  },
  props: {
    isMobile: {
      type: Boolean
    }
  }
};
</script>
