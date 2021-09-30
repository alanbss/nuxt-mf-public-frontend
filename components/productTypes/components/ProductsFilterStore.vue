<template>
  <div class="card h-100 shadow-sm font-small-3 mb-0">
    <div class="card-content">
      <div class="card-body" style="padding: 0px 12px 12px 12px;">
        <div>
          <div class="row mb-2">
            <vs-button class="ml-1" v-if="isMobile" @click="closeSideBar()" color="primary">
              Aplicar
            </vs-button>
            <a style="border-bottom: 1px solid #007bff; padding-bottom: 1px; color: #007bff;" @click="clearFilters()" class="mr-2 ml-2 mt-1">
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

          <div v-if="showVolumes.length > 0">
            <vs-divider style="margin-top: 0;"/>
            <span style="color: Grey;">Volume</span>
            <div class="mt-1 mb-1">
              <div class="row" v-if="showVolumes.length">
                <div class="col-12">
                  <vs-chip
                    v-for="volume in showVolumes"
                    :key="volume.unit + volume.packaging + volume.quantity"
                    :vs-value="volume.unit + volume.packaging + volume.quantity"
                    :class="volumeChipClass(volume)"
                  >
                    <a @click="selectVolume(volume)">{{ volume.packaging }} {{ volume.quantity }} {{ volume.unit }}</a>
                  </vs-chip>
                </div>
              </div>
            </div>
          </div>

          <div v-if="tags.length > 0">
            <vs-divider style="margin-top: 0;"/>
            <span style="color: Grey;">Carac. secundária</span>
            <div class="mt-1">
              <span v-for="group in uniqueTagGroups" :key="'group' + group">
                <vs-checkbox
                  v-model="selectedTags"
                  color="#008567"
                  v-for="tag in tagsFromGroup(group)"
                  :key="tag"
                  :vs-value="tag"
                  style="justify-content: left;"
                >
                  {{ tag }}
                </vs-checkbox>
                <br>
              </span>
            </div>
          </div>

          <div v-if="brands.length > 0" class="text-dark mb-1">
            <vs-divider/>
            <span style="color: Grey;">Marca</span>
            <div class="mt-1">
              <span>
                <div class="input-group mb-1">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">
                      <i class="feather icon-search"></i>
                    </span>
                  </div>
                  <input
                    @input="searchBrands()"
                    type="text"
                    class="form-control"
                    placeholder="Buscar marca"
                    aria-label="Marca"
                    aria-describedby="basic-addon1"
                    v-model="brandInput"
                   >
                   <span v-if="brandInput && brandInput.length" class="input-group-append">
                     <button
                      class="btn bg-transparent border-left-0 border"
                      style="padding: 0.5em;"
                      @click="brandInput = ''; searchBrands()"
                      type="button"
                     >
                       <i class="fa fa-times"></i>
                     </button>
                   </span>
                </div>
                <vs-chip
                  v-for="brand in showBrands"
                  :key="brand.id"
                  :vs-value="brand.id"
                  :class="brandsChipClass(brand.id)"
                  style="display: inline-block; float: none;"
                >
                  <a :class="brandsChipClass(brand.id)" style="margin-top: 6px;" v-if="brand.name" @click="selectBrand(brand)">{{ brand.name }}</a>
                  <a :class="brandsChipClass(brand.id)" style="margin-top: 6px;" v-else @click="selectBrand(brand)">(marca não def.)</a>
                </vs-chip>
              </span>
            </div>
          </div>

        </div>
        <div class="row">
          <vs-button class="ml-1" v-if="isMobile" @click="closeSideBar()" color="primary">
            Aplicar
          </vs-button>
          <a style="border-bottom: 1px solid #007bff; padding-bottom: 1px; color: #007bff;" @click="clearFilters()" class="mr-2 ml-2 mt-1">
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

export default {
  name: "ProductsFilter",
  data() {
    return {
      showProperties: [],
      showBrands: [],
      showVolumes: [],
      propertyInput: null,
      selectedProperties: [],
      selectedBrands: [],
      selectedTags: [],
      selectedVolumes: [],
      productTypeId: null,
      brandInput: null,
    };
  },
  computed: {
    // ...mapState("productTypes/properties", ["properties"]),
    // ...mapState("productTypes/packagings", ["volumes"]),
    // ...mapState("productTypes/brands", ["brands"]),
    // ...mapState("productTypes/tags", ["tags"]),
    ...mapState("productTypes", ["filterOptions"]),
  },
  watch: {
    // properties() {
    //   this.showProperties = this.properties
    // },
    selectedTags() {
      this.$emit('updated-filters', { volumes: this.selectedVolumes, brands: this.selectedBrands, tags: this.selectedTags, properties: this.selectedProperties })
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
    updateShown() {
      this.showProperties = this.properties
      this.showBrands = this.brands
      this.showVolumes = this.volumes
    },
    volumeChipClass(volume) {
      let volumeSelected = this.selectedVolumes.find(
        (b) => (b.unit == volume.unit &&
                b.packaging == volume.packaging &&
                b.quantity == volume.quantity)
      )

      if(volumeSelected)
        return 'chip-mf-selected brand-selected'
      else
        return 'chip-mf brand-not-selected'
    },
    brandsChipClass(id) {
      if(this.selectedBrands.find(b => b === id))
        return 'chip-mf-selected brand-selected'
      else
        return 'chip-mf brand-not-selected public-chip'
    },
    selectVolume(volume) {
      let volumeSelected = this.selectedVolumes.find(
        (b) => (b.unit == volume.unit &&
                b.packaging == volume.packaging &&
                b.quantity == volume.quantity)
      )

      if (!volumeSelected) {
        this.selectedVolumes.push(volume)
      } else {
        this.selectedVolumes = this.selectedVolumes.filter(
          (b) => (b.unit != volume.unit ||
                  b.packaging != volume.packaging ||
                  b.quantity != volume.quantity)
        )
      }
      this.$emit('updated-filters', { volumes: this.selectedVolumes, brands: this.selectedBrands, tags: this.selectedTags, properties: this.selectedProperties })
      //this.setFilterPackagings([...this.selectedVolumes])
    },
    searchBrands() {
      if(this.brandInput != null && this.brandInput != '') {
        this.showBrands = this.brands.filter(
          (brandChip) => this.normalizeString(brandChip.name).match(this.normalizeString(this.brandInput))
        )
      } else {
        this.showBrands = this.brands
      }
    },
    closeSideBar() {
      this.$emit('close-sidebar')
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
      this.$emit('updated-filters', { volumes: this.selectedVolumes, brands: this.selectedBrands, tags: this.selectedTags, properties: this.selectedProperties })
    },
    propertyChipClass(id) {
      if(this.selectedProperties.includes(id))
        return 'mb-1 chip-mf-selected brand-selected'
      else
        return 'mb-1 chip-mf'
    },
    clearFilters() {
      this.selectedProperties = []
      this.selectedBrands = []
      this.selectedTags = []
      this.selectedVolumes = []
      this.$emit('updated-filters', { volumes: this.selectedVolumes, brands: this.selectedBrands, tags: this.selectedTags, properties: this.selectedProperties })
    },
    searchProperties() {
      if(this.propertyInput != null && this.propertyInput != '') {
        this.showProperties = this.properties.filter(
          (propertyChip) => propertyChip.id && this.normalizeString(propertyChip.name).match(this.normalizeString(this.propertyInput))
        )
      } else {
        this.showProperties = this.properties
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
    },
    selectBrand(brand) {
      let brandSelected = this.selectedBrands.includes(brand.id)

      if (brandSelected) {
        this.selectedBrands = this.selectedBrands.filter(
          (brandChip) => brandChip !== brand.id
        );
      } else {
        this.selectedBrands.push(brand.id);
      }

      this.$emit('updated-filters', { volumes: this.selectedVolumes, brands: this.selectedBrands, tags: this.selectedTags, properties: this.selectedProperties })
    },
    tagsFromGroup(group) {
      var tags = this.tags.filter(tag => tag.tag_group_id == group).map(obj => obj.name)
      return [...new Set(tags)]
    }
  },
  mounted() {

  },
  components: {
    // BrandChips,
    // VolumeChips,
  },
  props: {
    isMobile: {
      type: Boolean
    },
    volumes: {
      type: Array,
      required: true
    },
    brands: {
      type: Array,
      required: true
    },
    properties: {
      type: Array,
      required: true
    },
    tags: {
      type: Array,
      required: true
    },
    uniqueTagGroups: {
      type: Array,
      required: true
    }
  }
};
</script>
