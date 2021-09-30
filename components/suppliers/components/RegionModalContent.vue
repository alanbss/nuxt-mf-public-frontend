<template>
  <div>
    <div class="vs-checkbox-con vs-checkbox-primary mb-25 mt-2">
      <input
        :id="`region-${regionId}`"
        v-model="regionCopy.checked"
        @click="regionHandler"
        type="checkbox"
        value
      />
      <span class="vs-checkbox">
        <span class="vs-checkbox--check">
          <i class="vs-icon feather icon-check"></i>
        </span>
      </span>
      <span class="font-weight-bold">{{regionCopy.name}}</span>
    </div>

    <div class="pl-2 mb-2 font-small-3">
      <a href="#" @click.prevent="showCities" role="button" class="ml-50">Lista de municípios</a>

      <div v-show="show" class="pl-25">
        <span v-for="city in cities" :key="city.id" class="d-block pt-50">
          <i class="feather icon-chevron-right text-muted"></i>
          {{city.name}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import RegionService from "~/components/suppliers/services/regions";
import RegionCitiesService from "~/components/suppliers/services/regionCities";

export default {
  name: "RegionModalContent",
  data() {
    return {
      show: false,
      regionCopy: Object.assign({}, this.region),
      cities: [],
    };
  },
  computed: {
    regionId() {
      return this.regionCopy.id;
    },
  },
  methods: {
    showCities() {
      this.show = !this.show;

      if (this.show && !this.cities.length) {
        this.getCitiesFromRegion();
      }
    },
    async regionHandler() {
      if (this.regionCopy.checked) {
        await RegionService.removeRegion(this.regionCopy.id);
      } else {
        await RegionService.saveRegion(this.regionCopy.id);
      }
    },
    async getCitiesFromRegion() {
      let response = await RegionCitiesService.getCities(this.regionCopy.id);

      this.cities = response.data;
    },
  },
  props: {
    region: {
      type: Object,
      required: true,
    },
  },
};
</script>