<template>
  <li class="list-group-item px-25">
    <a
      :id="`state-${stateId}`"
      @click="enableStateSupplierModal(stateId)"
      class="d-block text-body"
    >
      <i class="feather icon-chevron-right mt-1 float-right font-medium-3"></i>
      <strong class="font-medium-2">{{stateName}}</strong>
      <span class="d-block mt-25">{{regionsQuantity}} regiões definidas</span>
    </a>
  </li>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "RegionItemList",
  methods: {
    ...mapActions("suppliers", ["enableStateSupplierModal"]),
  },
  computed: {
    stateId() {
      return this.state.id;
    },
    stateName() {
      return this.state.name;
    },
    regionsQuantity() {
      return this.state.regions_quantity;
    },
  },
  props: {
    state: {
      type: Object,
      required: true,
    },
  },
};
</script>