<template>
  <div v-if="!$auth.check() && $route.name != 'public-store' && $route.name != 'public-store-search'" class="nav-item mt-1">
    <a
      v-if="this.activedUf != 'null'"
      @click.prevent="active = true"
      data-toggle="modal"
      data-target="#navegando-como"
      class=" rounded text-body d-block"
      style="background: #eee; padding:10px 15px; margin:10px"
    >
      <span class="menu-title" style="color: black !important">
        Navegando como...
        <br />
        <span class="font-small-3" style="color: blue !important">
          {{abbreviation}} / {{ activedUf }} &nbsp;
          <span class="text-primary" style="color: black !important">Alterar</span>
        </span>
      </span>
    </a>

    <vs-prompt
      :title="'Navegando como...'"
      :buttons-hidden="true"
      @close="active = false"
      :active.sync="active"
    >
      <div class="modal-body">
        <p
          class="font-small-3"
        >
          Importante: Alterar estas informações fará você perder a cotação que possa já ter começado.
        </p>
        <hr />

        <div class="form-body">
          <div class="row">
            <div class="col-md-6 col-12">
              <div class="form-group">
                <label for class="font-weight-bold">CEP</label>
                <input v-model="cepCopy"
                       v-mask="'#####-###'"
                       type="text"
                       class="form-control"
                       :style="
                         errorColor == 'red' ?
                         'border-radius: 5px 5px 5px 5px; border: solid 1px red;' :
                         'border-radius: 5px 5px 5px 5px;'"
                />
                <div v-if="error" style="margin-top: 5px; color: red;">
                  {{ error }}
                </div>
              </div>

            </div>
            <div class="col-md-6 col-12">
              <div class="form-group">
                <label for class="font-weight-bold">Cotar como...</label>
                <select v-model="supplierServesCopy" class="custom-select" id>
                  <option value="PJ">Pessoa jurídica</option>
                  <option value="PF">Pessoa física</option>
                </select>
              </div>
            </div>
            <div class="col-12">
              <button
                @click.prevent="saveOptions"
                type="button"
                class="btn btn-primary waves-effect waves-light w-100"
                data-dismiss="modal"
              >Alterar</button>
            </div>
          </div>
        </div>
      </div>
    </vs-prompt>
    <no-suppliers-modal :openPopup="openNoSuppliers" :cancel="true" v-if="opened" />
    <mailing-list-modal :openPopup="openUnavailableUf" :uf="ufId" @update-modal="updateUnavailableUf" v-if="opened"/>
    <zipcode-not-found-modal :openPopup="openNoZipcode" @update-modal="updateZipcodeNotFound" v-if="opened"/>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import { mapActions, mapState, mapGetters } from "vuex";
import NoSuppliersModal from "~/components/cover/NoSuppliersModal";
import StateService from "@/resources/users/services/StateService";
import ProductsService from "@/resources/products/services/index";
import ClientProductQuoteCartService from '@/resources/clients/services/clients.product.quote.cart.services';
import ZipcodeNotFoundModal from "@/resources/users/components/ZipcodeNotFoundModal";
import MailingListModal from "@/resources/users/components/MailingListModal";

export default {
  name: "FilterProducts",
  data() {
    return {
      active: false,
      cepCopy: "",
      supplierServesCopy: "PJ",
      regionChanged: false,
      openUnavailableUf: false,
      openNoSuppliers: false,
      openNoZipcode: false,
      oldParams: null,
      activedUf: null,
      savedUf: null,
      opened: false,
      errorColor: 'black',
      error: null,
    };
  },
  mounted() {
    this.activedUf = this.informedUF
    this.cepCopy = this.informedZipcode
    if(this.params.serves_type)
      this.supplierServesCopy = this.params.serves_type
  },
  watch: {
    // changedRegion(newValue) {
    //   if(this.supplierServes == this.supplierServesCopy) {
    //     this.checkForProducts({ region_id: newValue.id, serves_type: this.supplierServes })
    //   }
    //   this.regionChanged = true
    // },
    // changedServes() {
    //   if(this.supplierServes == this.supplierServesCopy && this.regionChanged)
    //     this.checkForProducts({ region_id: this.region.id, serves_type: this.supplierServes })
    // },
    // cityId(newValue) {
    //   if(newValue && newValue != 'erro') {
    //     setTimeout(() => {
    //     this.$vs.loading.close()
    //     if(this.informedUF)
    //       this.checkForUf(this.informedUF)
    //     }, 300);
    //   } else if (newValue == 'erro') {
    //     this.$vs.loading.close()
    //     this.openNoZipcode = true
    //     this.active = false
    //     this.allowedUf = false
    //   }
    // },
    // ufId(newValue) {
    //   if(newValue) {
    //     setTimeout(() => {
    //       this.$vs.loading.close()
    //       if(this.informedUF)
    //         this.checkForUf(this.informedUF)
    //     }, 300);
    //   }
    // }
  },
  computed: {
    ...mapState("navigationFilters", ["cep", "region", "supplierServes"]),
    ...mapGetters("navigationFilters", ["abbreviation", "informedUF","informedCity", "params", "informedZipcode"]),
    changedRegion() {
      return this.region
    },
    changedServes() {
      return this.supplierServes
    },
    cityId() {
      return this.informedCity
    },
    ufId() {
      return this.informedUF
    },
    typeId() {
      return this.supplierServes
    },
  },
  methods: {
    ...mapActions("navigationFilters", [
      "setCep",
      "setSupplierServes",
      "clearCity",
      "setCity",
      "setRegion",
      "setAllowed",
      "clearFilterParams"
    ]),

    saveOptions() {
      this.oldParams = { cep: this.informedZipcode, serves: this.params.serves_type }
      //this.setSupplierServes(this.supplierServesCopy)
      //this.setCep(this.cepCopy)
      this.loadCep()
      // ClientProductQuoteCartService.clearQuoteCart()
      // this.active = false;
      // this.activedUf = this.savedUf
      this.opened = true
    },
    checkForUf(uf) {
      if (uf) {
        StateService.checkForAvailableUf(uf).then((response) => {
          this.lastUf = uf;
          if (
            response?.data["available"] &&
            response?.data["available"] === "no"
          ) {
            this.openUnavailableUf = true
            this.allowedUf = null
            this.setAllowed(false)
            this.active = false
            this.clearFilterParams()
          } else if (
            response.data["available"] &&
            response.data["available"] == "yes"
          ) {
            this.setSupplierServes(this.supplierServesCopy)
            this.openUnavailableUf = false
            this.allowedUf = true
            this.active = false
            this.setAllowed(true)
            this.savedUf = uf
            this.$router.go()
          }
          this.$vs.loading.close()
        });
      }
    },
    // checkForUf(uf) {
    //   if(uf) {
    //     StateService.checkForAvailableUf(uf).then((response) => {
    //       this.lastUf = uf
    //       this.$nextTick(()=>{
    //         if(response?.data['available'] && response?.data['available'] == 'no') {
    //           this.active = false;
    //           this.openUnavailableUf = true
    //           this.allowedUf = false
    //         } else if (response.data['available'] && response.data['available'] == 'yes') {
    //           this.allowedUf = true
    //           this.savedUf = uf
    //         }
    //       })
    //     })
    //   }
    // },
    checkForProducts(params) {
      ProductsService.hasProducts(params).then((response) => {
        if(response.data['has'] && response.data['has'] == 'yes') {
          this.$router.go()
        } else {
          this.setSupplierServes(this.oldParams.serves)
          this.setCep(this.oldParams.cep)
          this.openNoSuppliers = true
        }
      })
    },
    loadCep() {
      if (this.cepCopy.length == 9) {
        this.clearCity();
        this.$vs.loading({ type: "point" });
        this.setCep(this.cepCopy)
        this.setCity(this.cepCopy).then(() => {
          if(this.informedCity == 'erro') {
            this.error = "CEP não encontrado";
            this.$vs.loading.close();
            this.allowedUf = false;
            this.errorColor = 'red';
            this.setCep(this.oldParams.cep);
          } else {
            this.errorColor = 'black';
            this.setRegion().then(() => {
              //this.cityText = this.informedCity + "/" + this.informedUF;
              if(this.informedUF)
                this.checkForUf(this.informedUF)
            })
          }
        })
      }
    },
    openNoSuppliersModal() {
      this.openNoSuppliers = true
    },
    updateUnavailableUf(value) {
      this.openUnavailableUf = value
    },
    updateZipcodeNotFound(value) {
      this.openNoZipcode = value
    },
  },
  components: {
    NoSuppliersModal,
    ZipcodeNotFoundModal,
    MailingListModal
  },
  directives: {
    mask,
  },
};
</script>
