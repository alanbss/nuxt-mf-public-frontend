<template>
  <!-- Modal - Filtro Fornecedores -->
  <vs-popup title="Filtrar fornecedores" :active.sync="open">
    <span class="d-block font-weight-normal font-small-3 mb-2">Filtrar por fornecedor</span>

    <ul class="list-unstyled mb-0">
      <li
        v-for="supplier in suppliers"
        :key="supplier.id"
        class="d-flex justify-content-between align-items-center py-25">
        <div class="vs-radio-con vs-radio-primary">
          <input
            type="radio"
            name="fornecedor-filtro"
            :value="supplier"
            v-model="selectedSupplier">
          <span class="vs-radio">
            <span class="vs-radio--border"></span>
            <span class="vs-radio--circle"></span>
          </span>
          <span>{{ supplier.name }}</span>
        </div>
      </li>
    </ul>

    <button type="button" @click="filterOrders()" class="btn btn-primary float-right px-1" style="width: 70px">
      <b-spinner v-if="buttonLoading" small />
      <span v-else>Filtrar</span> 
      </button>
  </vs-popup>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      selectedSupplier: undefined,
      open: false,
      buttonLoading: false
    }
  },
  computed: {
    suppliers() {
      let suppliers = this.orders.map(order => ({ name: order.supplierName, id: order.supplierId }))
      let unique = Array.from(new Set(suppliers.map(JSON.stringify))).map(JSON.parse)
      return unique
    }
  },
  methods: {
    filterOrders() {
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        this.$emit('supplierSelected', this.selectedSupplier)
        this.open = false  
      }, 300);
    }
  },
  watch: {
    popupActive() {
      this.open = this.popupActive
    },
    open(val) {
      this.$emit('update-open', val)
    }
  },
  props: {
    orders: {
      type: Array,
      required: true
    },
    popupActive: {
      type: Boolean,
      required: true
    }
  },
};
</script>
