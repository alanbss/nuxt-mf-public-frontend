<template>
  <div class="content-wrapper">
    <div class="content-body">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title color-mf-laranja">
                <i class="feather icon-map mr-50 font-medium-2"></i> Defina sua área de entrega/atendimento
              </h4>
            </div>
            <div class="card-content">
              <div class="card-body">
                <p class="mb-50 font-weight-bold">Defina as regiões que você entrega.</p>
                <p
                  class="font-small-3"
                >Não faz entregas? Então defina a área de alcance das suas lojas.</p>
                <p
                  class="font-weight-bold mt-2 delivery"
                >Apenas os clientes localizados nas regiões definidas abaixo encontrarão você.</p>

                <ul class="list-group list-group-flush">
                  <region-item-list :state="state" v-for="state in supplierStates" :key="state.id" />
                </ul>
              </div>
            </div>
            <div class="card-footer p-1 text-center">
              <button
                type="submit"
                @click.prevent="redirectToServicesConditions"
                class="btn btn-primary waves-effect waves-light"
              >
              <b-spinner v-if="buttonLoading" small/>
              <span v-else>Salvar e sair</span>
              </button>
            </div>
          </div>

          <vs-prompt not-close
            :button-cancel="false"
            :title="stateName"
            :active.sync="modalStatus"
            @accept="disableStateSupplierModal"
            accept-text=" Salvar "
            color="#0391D1"
            type="flat"
          >
            <region-modal-content :region="region" v-for="region in regions" :key="region.id" />
          </vs-prompt>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegionItemList from "~/components/suppliers/components/RegionItemList";
import RegionModalContent from "~/components/suppliers/components/RegionModalContent";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "DeliveryAreas",
  data() {
    return {
      modalStatus: false,
      buttonLoading: false
    };
  },
  mounted() {
    this.getSupplierStates();
    this.addStylesToListGroup();
  },
  updated() {
    this.modalStatus = this.supplierStatesModal;
    this.addStylesToModal();
  },
  computed: {
    ...mapState("suppliers", ["supplierStates", "supplierStatesModal"]),
    ...mapGetters("suppliers", ["stateName", "regions"]),
  },
  methods: {
    ...mapActions("suppliers", [
      "getSupplierStates",
      "disableStateSupplierModal",
    ]),
    addStylesToModal() {
      let div = document.querySelector(".vs-dialog-text");

      if (div !== null) {
        div.style.maxHeight = "400px";
        div.style.overflowY = "auto";
      }
    },
    addStylesToListGroup() {
      let div = document.querySelector(".list-group");

      if (div !== null) {
        div.style.maxHeight = "400px";
        div.style.overflowY = "auto";
      }
    },
    redirectToServicesConditions() {
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        this.$router.push({ name: "service-conditions" });
      }, 300);
    },
  },
  components: {
    RegionItemList,
    RegionModalContent,
  },
};
</script>

<style scoped>
.delivery {
  color: #d11b6d;
}
</style>