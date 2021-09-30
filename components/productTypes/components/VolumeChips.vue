<template>
  <span v-if="showVolumes.length">
    <!-- <div class="input-group mb-1">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">
          <i class="feather icon-search"></i>
        </span>
      </div>
      <input
        @input="searchVolumes()"
        type="text"
        class="form-control"
        placeholder="Buscar volume"
        aria-label="Volume"
        aria-describedby="basic-addon1"
        v-model="volumeInput"
       >
    </div> -->
    <div class="row">
      <div class="col-12">
        <vs-chip
          v-for="volume in showVolumes"
          :key="volume.volume.units_of_measurement_id + volume.volume.packaging_id + volume.volume.product_quantity"
          :vs-value="volume.volume.units_of_measurement_id + volume.volume.packaging_id + volume.volume.product_quantity"
          :class="chipClass(volume.volume)"
        > 
          <a v-if="volume.volume.packaging_name == 'Und.' && volume.volume.product_quantity == 1" @click="selectVolume(volume.volume)">{{ volume.volume.packaging_name }}</a>
          <a v-else @click="selectVolume(volume.volume)">{{ volume.volume.packaging_name }} {{ volume.volume.product_quantity }} {{ volume.volume.units_of_measurement_name }}</a>
        </vs-chip>
      </div>
    </div>
  </span>
</template>

<script>
import { mapState, mapActions } from "vuex";
var sortBy = require('lodash.sortby');

export default {
  name: "VolumeChips",
  data() {
    return {
      selectedVolumes: [],
      selected: undefined,
      volumeInput: null,
      showVolumes: [],
      searchStructure: [],
      productTypeId: null,
    };
  },
  mounted() {
    this.productTypeId = this.$route.params.productTypeId
    this.getProductTypeVolumeOptions(this.productTypeId)
  },
  computed: {
    ...mapState("productTypes/packagings", ["volumes"]),
    ...mapState("productTypes", ["filterOptions"]),
    volumeDialogStatus: {
      get() {
        return this.$store.state.productTypes.packagings.volumesDialogShow;
      },
      set() {
        this.closeVolumesDialog();
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
    volumes() {
      this.searchStructure = []
      for(var i = 0; i < this.volumes.length; i++) {
        this.searchStructure.push({ volume: this.volumes[i],
                                searchName: this.volumes[i].packaging_name + ' ' +
                                            this.volumes[i].product_quantity + ' ' +
                                            this.volumes[i].units_of_measurement_name
                              })
        this.showVolumes = sortBy(this.searchStructure, 'searchName')
      }
    }
  },
  methods: {
    ...mapActions("productTypes", ["getProducts", "setFilterPackagings"]),
    ...mapActions("productTypes/tags", ["getProductTypeFilteredTags"]),
    ...mapActions("productTypes/brands", ["getProductTypeFilteredBrands"]),
    ...mapActions("productTypes/properties", ["getProductTypeFilteredProperties"]),
    ...mapActions("productTypes/packagings", [
      "closeVolumesDialog",
      "getProductTypeVolumeOptions",
      "getProductTypeFilteredVolumeOptions"
    ]),

    chipClass(volume) {
      let volumeSelected = this.selectedVolumes.find(
        (b) => (b.units_of_measurement_id == volume.units_of_measurement_id &&
                b.packaging_id == volume.packaging_id &&
                b.quantity == volume.product_quantity)
      )

      if(volumeSelected)
        return 'chip-mf-selected brand-selected'
      else
        return 'chip-mf brand-not-selected'
    },

    selectVolume(volume) {
      let volumeSelected = this.selectedVolumes.find(
        (b) => (b.units_of_measurement_id == volume.units_of_measurement_id &&
                b.packaging_id == volume.packaging_id &&
                b.quantity == volume.product_quantity)
      )

      if (!volumeSelected) {
        this.selectedVolumes.push({ units_of_measurement_id: volume.units_of_measurement_id,
                                    packaging_id: volume.packaging_id,
                                    quantity: volume.product_quantity })
      } else {
        this.selectedVolumes = this.selectedVolumes.filter(
          (b) => (b.units_of_measurement_id != volume.units_of_measurement_id ||
                  b.packaging_id != volume.packaging_id ||
                  b.quantity != volume.product_quantity)
        )
      }
      if(!this.isMobile)
        this.filterSelectedVolumesIds()
      else
        this.setFilterPackagings([...this.selectedVolumes])
    },

    filterSelectedVolumesIds() {
      this.currentPage = 1
      this.setFilterPackagings([...this.selectedVolumes])
      this.getProductTypeFilteredBrands(this.filterOptions)
      this.getProductTypeFilteredVolumeOptions(this.filterOptions)
      this.getProductTypeFilteredTags(this.filterOptions)
      this.getProductTypeFilteredProperties(this.filterOptions)
      this.getProducts(this.filterOptions)
    },

    clearVolumes() {
      this.selectedVolumes = []
      this.setFilterPackagings([])
      this.filterSelectedVolumesIds()
    },

    searchVolumes() {
      if(this.volumeInput != null && this.volumeInput != '') {
        this.showVolumes = this.searchStructure.filter(
          (volumeChip) => this.normalizeString(volumeChip.searchName).match(this.normalizeString(this.volumeInput))
        )
      } else {
        this.showVolumes = this.searchStructure
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