<template>
  <vs-popup fullscreen
    :title="'Filtrar por característica'"
    :active.sync="propertyDialogStatus"
    @close="closePropertiesDialog"
  >
    <div class="row m-1">
      <div class="input-group mb-1" style="width: 400px;">
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
      </div>
    </div>
    <div class="row m-0">
      <div class="col-12">
        <span v-for="property in showProperties" :key="property.id">
          <vs-chip
            v-if="property.id"
            :vs-value="property.id"
            :class="{ 'vs-chip-success con-color property-selected':selectedProperties.find(b => b === property.id) }"
          >
            <a @click="selectProperty(property.id)">{{ property.name }}</a>
          </vs-chip>
        </span>
      </div>
    </div>
    <div class="row m-0 pt-1 d-flex justify-content-between">
      <vs-button @click="clearProperties" color="primary" type="flat">Limpar filtros</vs-button>
      <vs-button @click="filterSelectedPropertyIds" color="primary" type="filled">Filtrar</vs-button>
    </div>
  </vs-popup>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "PropertyDialog",
  data() {
    return {
      selectedProperties: [],
      selected: undefined,
      propertyInput: null,
      showProperties: [],
      productTypeId: null,
    };
  },
  mounted() {
    this.productTypeId = this.$route.params.productTypeId
    this.getProductTypeProperties(this.productTypeId).then(() => {
      this.showProperties = this.properties
    })
  },
  computed: {
    propertyDialogStatus: {
      get() {
        return this.$store.state.productTypes.properties.propertiesDialogShow;
      },
      set() {
        this.closePropertiesDialog();
      },
    },
    ...mapState("productTypes/properties", ["properties"]),
    ...mapState("productTypes", ["filterOptions"]),
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
      "closePropertiesDialog",
      "getProductTypeProperties",
      "getProductTypeFilteredProperties",
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
      this.setFilterProperties([...this.selectedProperties])
    },

    filterSelectedPropertyIds() {
      this.currentPage = 1
      this.setFilterProperties([...this.selectedProperties])
      this.getProductTypeFilteredBrands(this.filterOptions)
      this.getProductTypeFilteredVolumeOptions(this.filterOptions)
      this.getProductTypeFilteredTags(this.filterOptions)
      this.getProductTypeFilteredProperties(this.filterOptions)
      this.getProducts(this.filterOptions)
      this.closePropertiesDialog()
    },

    clearProperties() {
      this.setFilterProperties([])
      this.selectedProperties = []
      this.getProductTypeFilteredBrands(this.filterOptions)
      this.getProductTypeFilteredVolumeOptions(this.filterOptions)
      this.getProductTypeFilteredTags(this.filterOptions)
      this.getProductTypeFilteredProperties(this.filterOptions)
      this.getProducts(this.filterOptions)
      this.closePropertiesDialog()
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
    }
  },
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
