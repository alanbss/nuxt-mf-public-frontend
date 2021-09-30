<template>
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
      :class="chipClass(brand.id)"
      style="display: inline-block; float: none;"
    >
      <a :class="chipClass(brand.id)" style="margin-top: 6px;" v-if="brand.name" @click="selectBrand(brand)">{{ brand.name }}</a>
      <a :class="chipClass(brand.id)" style="margin-top: 6px;" v-else @click="selectBrand(brand)">(marca não def.)</a>
    </vs-chip>
  </span>

</template>

<script>
import { mapState, mapActions } from "vuex";
var sortBy = require('lodash.sortby');

export default {
  name: "BrandDialog",
  data() {
    return {
      selectedBrands: [],
      brandInput: null,
      showBrands: [],
      selected: undefined,
      productTypeId: null,
    };
  },
  mounted() {
    this.productTypeId = this.$route.params.productTypeId
    this.getProductTypeBrands(this.productTypeId).then(() => {
      
      this.showBrands = this.brands
    })
  },
  computed: {
    ...mapState("productTypes", ["filterOptions"]),
    ...mapState("productTypes/brands", ["brands"]),
    ...mapState("productTypes/properties", ["properties"]),
    brandDialogStatus: {
      get() {
        return this.$store.state.productTypes.brands.brandsDialogShow;
      },
      set() {
        this.closeBrandsDialog();
      },
    },
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage;
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value);
      },
    },
  },
  watch: {
    brands() {
      this.showBrands = sortBy(this.brands, 'name')
    }
  },
  methods: {
    ...mapActions("productTypes", ["getProducts", "setFilterBrands"]),
    ...mapActions("productTypes/packagings", ["getProductTypeFilteredVolumeOptions"]),
    ...mapActions("productTypes/tags", ["getProductTypeFilteredTags"]),
    ...mapActions("productTypes/properties", ["getProductTypeFilteredProperties"]),
    ...mapActions("productTypes/brands", [
      "closeBrandsDialog",
      "getProductTypeBrands",
      "getProductTypeFilteredBrands"
    ]),

    selectBrand(brand) {
      let brandSelected = this.filterOptions.data.brand_ids.includes(brand.id)

      if (brandSelected) {
        this.selectedBrands = this.selectedBrands.filter(
          (brandChip) => brandChip.id !== brand.id
        );
      } else {
        this.selectedBrands.push(brand);
      }
      if(!this.isMobile)
        this.filterSelectedBrandsIds()
      else
        this.setFilterBrands(this.selectedBrands.map((brand) => brand.id))
    },

    filterSelectedBrandsIds() {
      this.currentPage = 1
      this.setFilterBrands(this.selectedBrands.map((brand) => brand.id))
      this.getProductTypeFilteredBrands(this.filterOptions)
      this.getProductTypeFilteredVolumeOptions(this.filterOptions)
      this.getProductTypeFilteredTags(this.filterOptions)
      this.getProductTypeFilteredProperties(this.filterOptions)
      this.getProducts(this.filterOptions)
    },

    clearBrands() {
      this.setFilterBrands([])
      this.selectedBrands = []
      this.getProductTypeFilteredBrands(this.filterOptions)
      this.getProductTypeFilteredVolumeOptions(this.filterOptions)
      this.getProductTypeFilteredTags(this.filterOptions)
      this.getProductTypeFilteredProperties(this.filterOptions)
      this.getProducts(this.filterOptions)
    },

    chipClass(id) {
      if(this.selectedBrands.find(b => b.id === id))
        return 'chip-mf-selected brand-selected'
      else
        return 'chip-mf brand-not-selected public-chip'
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
  },
  props: {
    isMobile: {
      type: Boolean
    }
  }
};
</script>

<style scoped>
.brand-selected a {
  color: white;
}

/* .brand-not-selected {

} */

.con-exemple-prompt {
  padding: 10px;
  padding-bottom: 0px;
}
</style>
