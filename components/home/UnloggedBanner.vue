<template>
  <section
    class="card mb-1 text-white"
    :class="this.mobileBrowser == true ? 'banner-mobile' : 'banner-desktop'"
  >
    <div
      style="display: flex; flex-direction: row; justify-content: space-between"
    >
      <div
        style="
          display: flex;
          flex-direction: column;
          padding: 20px;
          width: 100%;
        "
      >
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          "
        >
          <h3 style="color: white">
            Simplifique as compras do seu restaurante ou minimercado
          </h3>
          <button
            v-if="this.activedUf == 'null' && !this.mobileBrowser"
            @click="active2 = true"
            class="btn-primary"
            style="background: #4b088a !important"
          >
            <img
              class="invert"
              src="~/assets/images/map.png"
              style="height: 20px; filter: invert(1)"
            />
            <span style="font-weight: 600"> Definir CEP </span>
          </button>
        </div>
        <h5 style="color: white">É grátis e simples</h5>
      </div>
    </div>
    <vs-prompt
      :title="'Defina sua localização'"
      :buttons-hidden="true"
      @close="active2 = false"
      :active.sync="active2"
    >
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
                autofocus
                id="cepInput"
                data-vv-name="zipcode"
                v-mask="'#####-###'"
                input
                type="tel"
                pattern="[0-9]*"
                novalidate
                class="form-control required"
                v-model="zipcode"
                @input="loadCep()"
                style="
                  max-width: 90px;
                  padding-left: 5px;
                  border-radius: 0px 5px 5px 0px;
                "
              />
              <b-tooltip
                v-if="show && isDisabled"
                :show.sync="show"
                target="cepInput"
                placement="top"
              >
                Digite seu CEP
              </b-tooltip>
            </div>
            <small
              id=""
              class="form-text text-muted mt-1"
              style="
                max-width: 90px;
                color: black !important;
                margin: 5px 0px 0px 0px !important;
              "
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
                <option value="PJ">Pessoa jurídica</option>
                <option value="PF">Pessoa física</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>&nbsp;</label>
            <button
              id="btnEntrar"
              type="submit"
              class="btn btn-primary btn-block btn-size"
              @click="setParams()"
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
    </vs-prompt>
  </section>
</template>

<style>
.btn-primary {
  color: #fff;
  background-color: #7367f0;
  border-color: #7367f0;
  border: 0 solid transparent;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  line-height: 1;
  border-radius: 0.4285rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.banner-desktop {
  background: linear-gradient(
    120deg,
    rgb(112, 60, 120) 0%,
    rgb(185, 89, 199) 50%,
    rgb(226, 107, 244) 100%
  );
  position: absolute;
  z-index: 99;
  width: 100%;
  top: 65px;
  left: 0;
}
.banner-mobile {
  background: linear-gradient(
    120deg,
    rgb(112, 60, 120) 0%,
    rgb(185, 89, 199) 50%,
    rgb(226, 107, 244) 100%
  );
  position: absolute;
  z-index: 99;
  width: 100%;
  top: 65px;
  left: 0;
}
</style>

<script>
import { mapActions, mapGetters } from "vuex";
import { mask } from "vue-the-mask";
import LoginDropdown from "~/components/login/LoginDropdown";

export default {
  data() {
    return {
      mobileBrowser: undefined,
      zipcode: undefined,
      userType: null,
      cityText: "",
      allowedUf: false,
      show: false,
      active2: false,
      activedUf: null,
    };
  },
  created() {
    this.isMobile();
    this.activedUf = this.informedUF
  },
  watch: {
    cityId(newValue) {
      if (newValue && newValue != "erro") {
        setTimeout(() => {
          this.cityText = this.informedCity + "/" + this.informedUF;
          // if (this.informedUF) this.checkSupplierStoreParams(this.informedUF);
        }, 100);
      } else if (newValue == "erro") {
        this.cityText = "CEP não encontrado";
        this.$vs.loading.close();
        this.openNoZipcode = true;
        this.allowedUf = false;
      }
    },
    ufId(newValue) {
      if (newValue) {
        setTimeout(() => {
          this.cityText = this.informedCity + "/" + this.informedUF;
          // if (this.informedUF) this.checkSupplierStoreParams(this.informedUF);
        }, 100);
      }
    },
  },
  computed: {
    ...mapGetters("navigationFilters", [
      "params",
      "informedCity",
      "informedUF",
    ]),

    isDisabled() {
      if (
        this.params.region_id &&
        this.userType &&
        this.zipcode &&
        this.zipcode.length == 9 &&
        this.allowedUf
      )
        return false;
      else return true;
    },
    cityId() {
      return this.informedCity;
    },
    ufId() {
      return this.informedUF;
    },
  },
  methods: {
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
    ...mapActions("navigationFilters", [
      "setCep",
      "setSupplierServes",
      "clearCity",
      "clearFilterParams",
    ]),

    loadCep() {
      if (this.zipcode.length == 9) {
        this.clearCity();
        this.$vs.loading({ type: "point" });
        this.setCep(this.zipcode);
      }
    },
    setParams() {
      // this.$vs.loading()
      if (this.userType != this.typeId) {
        this.setSupplierServes(this.userType);
      }
      if (this.allowedUf) {
        this.$emit("allow-zipcode", true);
      }
      this.open = false;
      this.$router.go();
    },
  },
  directives: {
    mask,
  },
  components: {
    LoginDropdown,
  }
}
</script>
