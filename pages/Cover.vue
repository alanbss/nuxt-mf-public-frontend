<template>
  <div>
    <section
      id="hero"
      class="d-flex align-items-center"
      :style="imgBackground"
      style="height: 50vh; margin-top: 70px;"
    >
      <div class="container">
        <h1 data-aos="fade-up" class="text-center">
          Cote ao mesmo tempo de várias distribuidoras
        </h1>
        <h2 data-aos="fade-up" data-aos-delay="400" class="text-center" style="margin-bottom: 10px;">
          Alimentos | Bebidas | Embalagens | Limpeza | Utensílios
        </h2>
        <div class="row justify-content-center">
          <div>
            <div
              class="bg-white shadow-sm rounded p-2"
              data-aos="fade-right"
              data-aos-delay="150"
              style="margin-bottom: 20px;"
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
                      @input="loadCep()"
                      style="
                        max-width: 90px;
                        padding-left: 5px;
                        border-radius: 0px 5px 5px 0px;
                      "
                      autofocus
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
                        <i
                          v-if="this.userType == 'PF'"
                          class="feather icon-user"
                        />
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
                  <button
                    id="btnEntrar"
                    type="submit"
                    class="btn btn-primary btn-block btn-size"
                    @click=" activateButton(); show = !show;"
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
                  Alguns fornecedores não atendem CPF, então a quantidade de
                  produtos a disposição pode ser menor.
                </p>
              </div>
              <div class="dropdown-divider" />
              <div class="text-right">
                <p class="mt-1 mb-0">É comprador ou distribuidor cadastrado?</p>
                <login-dropdown linkText="Fazer login" />
              </div>

              <div
                class="card shadow-sm p-1"
                style="background-color: #0cb695; margin-top: -15px"
                v-if="originCatalog"
              >
                <vs-row vs-w="12">
                  <h4 style="color: white">
                    Cote e veja os preços de {{ originSupplier }} e outros
                    fornecedores!
                  </h4>
                  <h5 style="color: white; font-weight: bolder">
                    Acesse agora. É grátis!
                  </h5>
                </vs-row>
              </div>
            </div>
          </div>
        </div>
        <zipcode-not-found-modal
          :openPopup="openNoZipcode"
          @update-modal="updateZipcodeNotFound"
        />
        <mailing-list-modal
          :openPopup="openUnavailableUf"
          @update-modal="updateUnavailableUf"
          :uf="ufId"
        />
        <no-suppliers-modal :openPopup="openNoSuppliers" />
      </div>
    </section>
    <section style="padding:0px !important; ">
      <div class="p-1" style="background: #f57f17">
        <h4
          class="text-center"
          style=" color: #fff;
                  font-size: 20px;
                  text-shadow: 1px 1px rgb(0 0 0 / 50%);"
        >
          Sem tempo para cotar?
        </h4>
        <h1
          class="text-center"
          style="font-size: 34px;
                 font-weight: 400;
                 color: #fff;
                 text-shadow: 1px 1px rgb(0 0 0 / 50%);"
        >
          Pedir direto
        </h1>
        <h4
          class="text-center"
          style="color: #fff;
                 font-size: 20px;
                 text-shadow: 1px 1px rgb(0 0 0 / 50%);"
        >
          Escolha o fornecedor
        </h4>
      </div>
      <div class="row p-1" style="justify-content: center">
        <div
          class="card m-2"
          v-for="supplier in allAutoSuppliers"
          v-bind:key="supplier.id"
          style="width: 300px; height: 115px;  justify-content: center"
        >
          <div class="row" style="flex-wrap: nowrap; align-items: center;">
            <div v-if="supplier.user.userPicture" class="col" style="text-align: center;">
              <img :src="supplier.user.userPicture.picture" style=" width: 100px; height: 100px;" />
            </div>
            <div v-else class="col" style="text-align: center;">
              <img
                src="~/assets/images/avatar-default.png"
                style=" width: 100px; height: 100px;" 
              />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title" style="">
                  {{ supplier.user.name }}
                </h5>
                <router-link :to="{ name: 'public-store', params: { supplierSlug: supplier.nameForUrl }}">Abrir loja direta</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <main id="main">
      <section id="services" class="services">
        <div class="container">
          <div class="section-title" data-aos="fade-up">
            <h2>
              <span
                class="position-relative"
                style="top: -5px"
                data-toggle="counter-up"
                >{{ totalSuppliers }}</span
              >
              fornecedores online
            </h2>
            <p>Para seu restaurante, padaria, minimercado</p>
          </div>
          <div class="row">
            <div
              class="col-md-6 col-lg-3 mb-5 mb-lg-0"
              v-for="(family, index) in familiesWithTotals"
              :key="family.id"
            >
              <div
                class="icon-box"
                data-aos="fade-up"
                data-aos-delay="100"
                style="height: 280px"
              >
                <div
                  v-if="index == 0"
                  class="services-img"
                  :style="{
                    backgroundImage:
                      'url(' +
                      require('~/assets/images/img-alimentos-e-bebidas.jpg') +
                      ')',
                  }"
                ></div>
                <div
                  v-if="index == 1"
                  class="services-img"
                  :style="{
                    backgroundImage:
                      'url(' +
                      require('~/assets/images/img-embalagens.jpg') +
                      ')',
                  }"
                ></div>
                <div
                  v-if="index == 2"
                  class="services-img"
                  :style="{
                    backgroundImage:
                      'url(' + require('~/assets/images/img-limpeza.jpg') + ')',
                  }"
                ></div>
                <div
                  v-if="index == 3"
                  class="services-img"
                  :style="{
                    backgroundImage:
                      'url(' +
                      require('~/assets/images/img-utensilios.jpg') +
                      ')',
                  }"
                ></div>
                <div class="p-4">
                  <h4 class="title">
                    <a href="">{{ family.name }}</a>
                  </h4>
                  <p class="description">
                    <span data-toggle="counter-up">{{
                      family.totalProducts
                    }}</span>
                    produtos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="highlights" class="highlights">
        <div class="container">
          <div class="row">
            <div
              class="
                image
                col-xl-5
                d-flex
                align-items-stretch
                justify-content-center justify-content-xl-start
              "
              data-aos="fade-right"
              data-aos-delay="150"
              style="align-self: center;"
            >
              <div class="dropdown-divider" />
              <iframe
                :width="videoWidth"
                :height="videoHeight"
                src="https://www.youtube.com/embed/2fy0UrdVE-0"
                title="YouTube video player"
                autoplay
                style="padding-top: 5px; border: none"
              />
            </div>
            <div
              class="col-xl-7 d-flex align-items-stretch pt-4 pt-xl-0"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <div
                class="content d-flex flex-column justify-content-center"
                style="margin-left: 0"
              >
                <p class="pb-2">
                  <strong
                    >Simplifique a rotina de compras no seu restaurante,
                    padaria, minimercado</strong
                  >
                </p>
                <div class="row">
                  <div class="col-md-6 d-md-flex align-items-md-stretch">
                    <div class="hig-box">
                      <i class="bx bxs-package"></i>
                      <span>Escolha os produtos</span>
                      <p class="pr-5">
                        De alimentos à utensílios, de tudo para atender seu
                        negócio
                      </p>
                    </div>
                  </div>
                  <div class="col-md-6 d-md-flex align-items-md-stretch">
                    <div class="hig-box">
                      <i class="bx bx-calculator"></i>
                      <span>Emita a cotação</span>
                      <p>
                        Faça cotações para vários fornecedores numa só tacada
                      </p>
                    </div>
                  </div>
                  <div class="col-md-6 d-md-flex align-items-md-stretch">
                    <div class="hig-box">
                      <i class="bx bxs-badge-dollar"></i>
                      <span>Compare preços</span>
                      <p>
                        Compare preços e escolha o melhor custo-beneficio para
                        seu negócio
                      </p>
                    </div>
                  </div>
                  <div class="col-md-6 d-md-flex align-items-md-stretch">
                    <div class="hig-box">
                      <i class="bx bx-send"></i>
                      <span>Emita pedidos de compra</span>
                      <p>
                        Emita pedidos de compra separados por diferentes
                        fornecedores
                      </p>
                    </div>
                  </div>
                </div>
                <p class="pt-3">
                  <a
                    href="#hero"
                    class="btn-to-top btn btn-primary mr-2"
                    style="color: white"
                    >Cotar agora</a
                  >
                  <small>É grátis, simples e não precisa instalar nada</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="logos" class="logos section-bg">
        <div class="container">
          <div class="section-title" data-aos="fade-up">
            <h3>Alguns fornecedores parceiros que estão conosco</h3>
          </div>
          <carousel
            :items="6"
            :dots="false"
            :margin="80"
            :loop="true"
            :nav="false"
            :autoplay="true"
            :autoplayHoverPause="true"
            :slideBy="5"
            :autoplayTimeout="3000"
          >
            <div
              v-for="slide in slides"
              v-bind:key="slide.id"
              class="logo-wrap"
            >
              <div class="logo-item">
                <img
                  :src="slide.photoURL"
                  alt=""
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  style="min-width: 100px; min-height: 100px"
                />
                <h4>{{ slide.name }}</h4>
              </div>
            </div>
          </carousel>
        </div>
      </section>
      <section
        class="gradient-overlay"
        :style="{
          color: '#fff',
          background:
            'url(' + require('~/assets/images/bg-fornecedor.jpg') + ')',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundOrigin: 'center',
        }"
      >
        <div class="container">
          <div class="row d-flex align-items-center">
            <div class="col-lg-8">
              <h2 style="font-weight: 700; color: white">
                Quer vender através do Meu Fornecedor?
              </h2>
              <p class="pt-1" style="max-width: 430px">
                Se você fornece produtos para restaurantes e similares, nós
                podemos ser o seu novo canal de vendas.
              </p>
              <p class="mb-0">Cadastre sua indústria ou distribuidora</p>
            </div>
            <div class="col-lg-4">
              <div class="text-lg-right text-center pt-4 pt-lg-0">
                <a
                  href="javascript:void(0);"
                  @click="openPartner = true"
                  class="btn btn-outline-light rounded-pill py-2 px-3"
                  style="color: white; border-outline: white"
                >
                  <strong>Entre em contato</strong>
                </a>
              </div>
            </div>
          </div>
        </div>
        <partner-modal :openPopup="openPartner" @update-modal="closePopup" />
      </section>
    </main>
  </div>
</template>

<style scoped src="~/assets/css/cover.css"></style>

<style>
.btn-outline-light {
  color: #f8f9fa;
  border-color: #f8f9fa;
}
.btn-outline-light:hover {
  color: #212529 !important;
  background-color: #f8f9fa;
  border-color: #f8f9fa;
}
.btn-outline-light.focus,
.btn-outline-light:focus {
  box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5);
}
.card-size {
  min-width: 580px !important;
  min-height: 500px !important;
}
.btn-size {
  width: 220px !important;
}
.select-size {
  max-width: inherit !important;
}
@media screen and (max-width: 760px) {
  .btn-size {
    width: 112px !important;
  }
  .card-size {
    min-width: 360px !important;
  }
  .select-size {
    min-width: fit-content !important;
  }
  .section-title h2::before,
  .section-title h2::after {
    display: none !important;
  }
}
</style>

<script>
// import FamilyCard from "~/components/families/components/FamilyCard";
// import MeuFornecedorBanner from "~/components/home/MeuFornecedorBanner";
// import ProductListEmptyBanner from "~/components/home/ProductListEmptyBanner";

import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { mask } from "vue-the-mask";
import carousel from "vue-owl-carousel";
import LoginDropdown from "~/components/login/LoginDropdown";
import PartnerModal from "~/components/users/components/PartnerModal";
import MailingListModal from "~/components/users/components/MailingListModal";
import ZipcodeNotFoundModal from "~/components/users/components/ZipcodeNotFoundModal";
import NoSuppliersModal from "~/components/cover/NoSuppliersModal";
import ProductsService from "~/components/products/services/index";
import StateService from "~/components/users/services/StateService";
import SuppliersService from "~/components/suppliers/services/index";
import FamiliesService from "~/components/families/services/index";

export default {
  data() {
    return {
      show: false,
      zipcode: undefined,
      userType: null,
      openNoSuppliers: false,
      openNoZipcode: false,
      openUnavailableUf: false,
      hasType: false,
      cityText: "",
      totalSuppliers: 0,
      familiesWithTotals: [],
      allAutoSuppliers: [],
      data: [],
      openPartner: false,
      allowedUf: false,
      lastUF: null,
      slides: [
        {
          id: 1,
          name: "Companhia da Terra",
          photoURL: require("~/assets/images/1.png"),
        },
        {
          id: 2,
          name: "Galetos Distribuidora",
          photoURL: require("~/assets/images/2.png"),
        },
        {
          id: 3,
          name: "Ideal Alimentos",
          photoURL: require("~/assets/images/3.png"),
        },
        {
          id: 4,
          name: "Império da Carne",
          photoURL: require("~/assets/images/4.png"),
        },
        {
          id: 5,
          name: "J.A. Distribuidora",
          photoURL: require("~/assets/images/5.png"),
        },
        {
          id: 6,
          name: "Jean Veleiro",
          photoURL: require("~/assets/images/6.png"),
        },
        {
          id: 7,
          name: "Empório Nutall",
          photoURL: require("~/assets/images/7.png"),
        },
        {
          id: 8,
          name: "Petisco Distribuidora",
          photoURL: require("~/assets/images/8.png"),
        },
        {
          id: 9,
          name: "Sabor Nobre",
          photoURL: require("~/assets/images/9.png"),
        },
        {
          id: 10,
          name: "Sammy Gelados",
          photoURL: require("~/assets/images/10.png"),
        },
        {
          id: 11,
          name: "Sampa's Brasil",
          photoURL: require("~/assets/images/11.png"),
        },
        {
          id: 12,
          name: "Santo Churras",
          photoURL: require("~/assets/images/12.png"),
        },
        {
          id: 13,
          name: "Super Baratão",
          photoURL: require("~/assets/images/13.png"),
        },
        {
          id: 14,
          name: "Super Boi",
          photoURL: require("~/assets/images/14.png"),
        },
        {
          id: 15,
          name: "Talimpo",
          photoURL: require("~/assets/images/15.png"),
        },
        {
          id: 16,
          name: "DeMarchi",
          photoURL: require("~/assets/images/16.png"),
        },
        {
          id: 17,
          name: "Soluções Produtos de Higiene",
          photoURL: require("~/assets/images/17.png"),
        },
        {
          id: 18,
          name: "Delifruta",
          photoURL: require("~/assets/images/18.png"),
        },
        {
          id: 19,
          name: "Folhas Verdes",
          photoURL: require("~/assets/images/19.png"),
        },
        {
          id: 20,
          name: "VitalClean",
          photoURL: require("~/assets/images/20.png"),
        },
        {
          id: 21,
          name: "FortFood Distribuidora",
          photoURL: require("~/assets/images/21.png"),
        },
        {
          id: 22,
          name: "Ovos Avine",
          photoURL: require("~/assets/images/22.png"),
        },
        {
          id: 23,
          name: "Gosto Mineiro",
          photoURL: require("~/assets/images/23.png"),
        },
        {
          id: 24,
          name: "FC Distribuidora",
          photoURL: require("~/assets/images/24.png"),
        },
      ],
    };
  },
  async created() {
    let total = await SuppliersService.getTotalSuppliers();
    this.totalSuppliers = total.data;
    let families = await FamiliesService.getFamiliesWithTotalProducts();
    this.familiesWithTotals = families.data;
  },
  mounted() {
    SuppliersService.getAll().then((response) => {
      this.allAutoSuppliers = response.data;
    });
    // window.addEventListener('scroll', this.handleScroll)
  },
  computed: {
    ...mapState("navigationFilters", ["supplierServes"]),
    ...mapGetters("families", ["familiesWithChunckedProducts"]),
    ...mapGetters("users/products", ["productListIsEmpty"]),
    ...mapGetters("navigationFilters", [
      "params",
      "informedCity",
      "informedUF",
    ]),
    imgBackground() {
      return (
        "background-image: url(" + require(`~/assets/images/bg-hero.jpg`) + ")"
      );
    },
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
    typeId() {
      return this.supplierServes;
    },
    originCatalog() {
      if (this.$route.query.originCatalog) return true;
      else return false;
    },
    originSupplier() {
      if (this.$route.query.originSupplier)
        return this.$route.query.originSupplier;
      else return null;
    },
    btnStyle() {
      return 'background: #ffffff; color: #f2e50e; border-width:thin; border: 1px solid #BBBB; border-radius: 5px; margin: 0 0 0 10px; padding: 5px; display: block; position: relative; font-family: "Open Sans", sans-serif; font-weigth:600';
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true;
      } else {
        return false;
      }
    },
    videoWidth() {
      if (this.isMobile) {
        return 320;
      } else return 520;
    },
    videoHeight() {
      if (this.isMobile) {
        return 180;
      } else return 300;
    },
  },
  watch: {
    typeId(newValue) {
      if (newValue) {
        this.checkForProducts({
          region_id: this.params.region_id,
          serves_type: newValue,
        });
        this.hasType = true;
      }
    },
    cityId(newValue) {
      if (newValue && newValue != "erro") {
        setTimeout(() => {
          this.cityText = this.informedCity + "/" + this.informedUF;
          if (this.informedUF) this.checkForUf(this.informedUF);
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
          if (this.informedUF) this.checkForUf(this.informedUF);
        }, 100);
      }
    },
  },
  methods: {
    ...mapActions("navigationFilters", [
      "setCep",
      "setSupplierServes",
      "clearCity",
      "clearFilterParams",
    ]),
    activateButton() {
      if (!this.isDisabled) {
        return this.setParams();
      } else {
        return 0;
      }
    },
    loadCep() {
      this.clearFilterParams();
      this.cityText = "";
      this.openUnavailableUf = false;
      if (this.zipcode.length == 9) {
        this.clearCity();
        this.$vs.loading({ type: "point" });
        this.setCep(this.zipcode);
      }
    },
    setParams() {
      this.$vs.loading();
      if (this.userType == this.typeId) {
        this.checkForProducts({
          region_id: this.params.region_id,
          serves_type: this.typeId,
        });
      } else {
        this.setSupplierServes(this.userType);
      }
    },
    checkForUf(uf) {
      if (uf) {
        StateService.checkForAvailableUf(uf).then((response) => {
          this.lastUf = uf;
          if (
            response?.data["available"] &&
            response?.data["available"] === "no"
          ) {
            this.openUnavailableUf = true;
            this.allowedUf = null;
          } else if (
            response.data["available"] &&
            response.data["available"] == "yes"
          ) {
            this.openUnavailableUf = false;
            this.allowedUf = true;
          }
          this.$vs.loading.close();
        });
      }
    },
    checkForProducts(params) {
      ProductsService.hasProducts(params).then((response) => {
        this.$vs.loading.close();
        if (response.data["has"] && response.data["has"] == "yes") {
          this.$router.push({ name: "home" });
        } else this.openNoSuppliers = true;
      });
    },
    openNoSuppliersModal() {
      this.openNoSuppliers = true;
    },
    updateUnavailableUf(value) {
      this.openUnavailableUf = value;
    },
    updateZipcodeNotFound(value) {
      this.openNoZipcode = value;
    },
    // handleScroll() {
    //   if (window.scrollY > 100) {
    //     this.$refs.backToTop.style.display = "inline"
    //   } else {
    //     this.$refs.backToTop.style.display = "none"
    //   }
    // },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    closePopup(value) {
      this.openPartner = value;
      this.clearFilterParams();
    },
  },
  directives: {
    mask,
  },
  components: {
    LoginDropdown,
    NoSuppliersModal,
    PartnerModal,
    ZipcodeNotFoundModal,
    MailingListModal,
    carousel,
  },
};
</script>

<style></style>
