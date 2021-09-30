<template>
  <vs-popup fullscreen
    :title="'Filtrar por marca'"
    :active.sync="brandDialogStatus"
    @close="closeBrandsDialog"
  >
    <div class="row m-1">
      <div class="input-group mb-1" style="width: 400px;">
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
      </div>
    </div>
    <div class="row m-0">
      <div class="col-12">
        <vs-chip
          v-for="brand in showBrands"
          :key="brand.id"
          :vs-value="brand.id"
          :class="chipClass(brand.id)"
        >
          <a v-if="brand.name" @click="selectBrand(brand)">{{ brand.name }}</a>
          <a v-else @click="selectBrand(brand)">(marca não def.)</a>
        </vs-chip>
      </div>
    </div>
    <div class="row m-0 pt-1 d-flex justify-content-between">
      <vs-button @click="clearBrands" color="primary" type="flat">Limpar filtros</vs-button>
      <vs-button @click="filterSelectedBrandsIds" color="primary" type="filled">Filtrar</vs-button>
    </div>
  </vs-popup>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "BrandDialog",
  data() {
    return {
      selectedBrands: [],
      selected: undefined,
      brandInput: null,
      showBrands: [],
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
    brandDialogStatus: {
      get() {
        return this.$store.state.productTypes.brands.brandsDialogShow;
      },
      set() {
        this.closeBrandsDialog();
      },
    },
    ...mapState("productTypes/brands", ["brands"]),
    ...mapState("productTypes", ["filterOptions"]),
  },
  watch: {
    brandDialogStatus() {
      this.selectedBrands = this.brands.filter(brand => this.filterOptions.data.brand_ids.includes(brand.id))
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
        )
      } else {
        this.selectedBrands.push(brand);
      }
      this.setFilterBrands(this.selectedBrands.map((brand) => brand.id))
    },

    filterSelectedBrandsIds() {
      this.currentPage = 1
      this.getProductTypeFilteredBrands(this.filterOptions)
      this.getProductTypeFilteredVolumeOptions(this.filterOptions)
      this.getProductTypeFilteredTags(this.filterOptions)
      this.getProductTypeFilteredProperties(this.filterOptions)
      this.getProducts(this.filterOptions)
      this.closeBrandsDialog()
    },

    clearBrands() {
      this.setFilterBrands([])
      this.selectedBrands = []
      this.getProductTypeFilteredBrands(this.filterOptions)
      this.getProductTypeFilteredVolumeOptions(this.filterOptions)
      this.getProductTypeFilteredTags(this.filterOptions)
      this.getProductTypeFilteredProperties(this.filterOptions)
      this.getProducts(this.filterOptions)
      this.closeBrandsDialog()
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

    chipClass(id) {
      if(this.selectedBrands.find(b => b.id === id))
        return 'vs-chip-success con-color brand-selected'
      else
        return 'brand-not-selected'
    }

  },
};
</script>

<style scoped>
.brand-selected a {
  color: white;
}

.brand-not-selected {
  background-color: LightGray;
}

.con-exemple-prompt {
  padding: 10px;
  padding-bottom: 0px;
}
</style>
