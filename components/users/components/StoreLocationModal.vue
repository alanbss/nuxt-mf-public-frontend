<template>
  <div>
    <vs-popup title="Defina sua localização" :active.sync="open">
      <h3 v-show="supplier">{{ supplier.user.name }}</h3>
      <div
        class="bg-white shadow-sm rounded p-2"
        data-aos="fade-right"
        data-aos-delay="150"
        style="margin-bottom: 20px"
      >
        <div class="row" style="margin: 0px; max-height: 70px">
          <div class="form-group">
            <label
              ><small><strong>Seu CEP</strong></small></label
            >
            <div class="input-group">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <i class="feather icon-map-pin" />
                </div>
              </div>
              <input
                id="cepInput"
                data-vv-name="zipcode"
                v-mask="'#####-###'"
                input
                type="tel"
                pattern="[0-9]*"
                novalidate
                class="form-control required"
                v-model="zipcode"
                :style="
                  errorColor == 'red' ?
                  'max-width: 90px; padding-left: 5px; border-radius: 0px 5px 5px 0px; border: solid 1px red;' :
                  'max-width: 90px; padding-left: 5px; border-radius: 0px 5px 5px 0px;'"
                autofocus
              />
              <!-- <b-tooltip
                v-if="show && isDisabled"
                :show.sync="show"
                target="cepInput"
                placement="top"
              >
                Digite seu CEP
              </b-tooltip> -->
            </div>
            <small
              id=""
              class="form-text text-muted mt-1"
              :style="
                'max-width: 90px; color: ' + errorColor + '!important; margin: 5px 0px 0px 0px !important;'"
              ><b>{{ cityText }}</b></small
            >
          </div>
          <div class="form-group">
            <label
              ><small><strong>Você é...</strong></small></label
            >
            <div class="input-group">
              <div v-if="!isMobile" class="input-group-prepend">
                <div class="input-group-text">
                  <i
                    v-if="this.userType == 'PJ'"
                    class="feather icon-briefcase"
                  />
                  <i v-if="this.userType == 'PF'" class="feather icon-user" />
                </div>
              </div>
              <select
                class="custom-select select-size"
                id=""
                v-model="userType"
                style="padding-left: 5px"
              >
                <option v-if="isMobile" value="PJ">CNPJ</option>
                <option v-else value="PJ">Pessoa jurídica</option>
                <option v-if="isMobile" value="PF">CPF</option>
                <option v-else value="PF">Pessoa física</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>&nbsp;</label>
            <vs-tooltip ref="minTooltip" text="É preciso preencher os campos ao lado." :active="isDisabled" position="bottom">
              <span>
                <button
                  id="btnEntrar"
                  type="submit"
                  class="btn btn-primary btn-block btn-size"
                  @click="setParams()"
                  :disabled="isDisabled"
                  style="
                    background: linear-gradient(
                      45deg,
                      rgba(3, 145, 209, 1) 50%,
                      rgba(5, 242, 240, 1) 100%
                    );
                    font-weight: 800;
                    opacity: 1;
                  "
                >
                  Entrar
                </button>
              </span>
              <span>&nbsp;</span>
            </vs-tooltip>
          </div>
        </div>
        <div
          v-if="userType == 'PF'"
          class="alert alert-dark font-small-3"
          role="alert"
          style="max-width: fit-content; margin-top: 20px"
        >
          <p align="justify">
            Alguns fornecedores não atendem CPF, então a quantidade de produtos
            a disposição pode ser menor.
          </p>
        </div>
        <div class="dropdown-divider" />
        <div class="text-right">
          <p class="mt-1 mb-0">Já tem cadastro?</p>
          <login-dropdown linkText="Entrar" />
        </div>
      </div>
    </vs-popup>
    <vs-popup title="" :active.sync="openFailed">
      <div class="row m-0 d-flex justify-content-center">
        <h5>
          Que pena...<br />
          Infelizmente nossa área de atendimento não abrange a sua região.
        </h5>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { mask } from "vue-the-mask";
import SupplierService from "~/components/suppliers/services/index";
import LoginDropdown from "~/components/login/LoginDropdown";

export default {
  name: "StoreLocationModal",
  data() {
    return {
      zipcode: undefined,
      userType: 'PJ',
      open: false,
      openFailed: false,
      cityText: "",
      allowedUf: false,
      showTooltip: true,
      errorColor: 'black',
    };
  },
  created() {},
  watch: {
    openPopup() {
      this.open = this.openPopup;
    },
    open() {
      this.$emit("update-modal", this.open);
    },
    // cityId(newValue) {
    //   if (newValue && newValue != "erro") {
    //     setTimeout(() => {
    //       this.cityText = this.informedCity + "/" + this.informedUF;
    //       if (this.informedUF) this.checkSupplierStoreParams(this.informedUF);
    //     }, 100);
    //   } else if (newValue == "erro") {
    //     this.cityText = "CEP não encontrado";
    //     this.$vs.loading.close();
    //     this.openNoZipcode = true;
    //     this.allowedUf = false;
    //   }
    // },
    // ufId(newValue) {
    //   if (newValue) {
    //     setTimeout(() => {
    //       this.cityText = this.informedCity + "/" + this.informedUF;
    //       if (this.informedUF) this.checkSupplierStoreParams(this.informedUF);
    //     }, 100);
    //   }
    // },
  },
  computed: {
    ...mapGetters("navigationFilters", [
      "params",
      "informedCity",
      "informedUF",
    ]),
    isDisabled() {
      if (
        this.userType &&
        this.zipcode &&
        this.zipcode.length == 9
      )
        return false;
      else return true;
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true;
      } else {
        return false;
      }
    },
    cityId() {
      return this.informedCity;
    },
    ufId() {
      return this.informedUF;
    },
  },
  methods: {
    ...mapActions("navigationFilters", [
      "setCep",
      "setCity",
      "setRegion",
      "setSupplierServes",
      "clearCity",
      "clearFilterParams",
      "setAllowed"
    ]),
    loadCep() {
      if (this.zipcode.length == 9) {
        this.clearCity();
        this.$vs.loading({ type: "point" });
        this.setCep(this.zipcode)
        this.setCity(this.zipcode).then(() => {
          if(this.informedCity == 'erro') {
            this.cityText = "CEP não encontrado";
            this.$vs.loading.close();
            this.allowedUf = false;
            this.errorColor = 'red';
          } else {
            this.errorColor = 'black';
            this.setRegion().then(() => {
              this.cityText = this.informedCity + "/" + this.informedUF;
              if(this.informedUF)
                this.checkSupplierStoreParams(this.informedUF)
            })
          }
        })
      }
    },
    // loadCep() {
    //   if (this.zipcode.length == 9) {
    //     this.clearCity();
    //     this.$vs.loading({ type: "point" });
    //     this.setCep(this.zipcode);
    //   }
    // },
    setParams() {
      // this.$vs.loading()
      if (this.userType != this.typeId) {
        this.setSupplierServes(this.userType);
      }
      this.loadCep()
      // if (this.allowedUf){
      //   this.$emit("allow-zipcode", true);
      // }
      // else{
      //   this.clearFilterParams()
      // }
      // this.open = false;
      //this.$router.go();
    },
    checkSupplierStoreParams(uf) {
      if (uf) {
        SupplierService.checkSupplierStoreParams(
          uf,
          this.cityId,
          this.userType,
          this.supplier.id
        ).then((response) => {
          if (
            response?.data["available"] &&
            response?.data["available"] === "no"
          ) {
            //this.openUnavailableUf = true
            this.allowedUf = false;
            this.open = false;
            this.openFailed = true;
            this.setAllowed(false)
            this.$emit("allow-zipcode", false);
          } else if (
            response.data["available"] &&
            response.data["available"] == "yes"
          ) {
            this.allowedUf = true;
            this.setAllowed(true)
            this.open = false
            this.$emit("allow-zipcode", true);
          }
          this.$vs.loading.close();
        });
      }
    },
  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
    supplier: {
      type: Object,
      required: false,
    },
  },
  directives: {
    mask,
  },
  components: {
    LoginDropdown,
  },
};
</script>
