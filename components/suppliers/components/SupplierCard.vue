<template>
  <div class="row" :style="this.mobileBrowser ? 'margin:5px;' : 'margin: 15px;' ">
    <a style="color: black" :href="$router.resolve({name: 'public-store', params: { supplierSlug: supplier.nameForUrl }}).href">
      <div
        class="card m-2"
        style="
          width: 300px;
          height: 115px;
          justify-content: center;
          margin: 0 !important;
        "
      >
        <div class="row" style="flex-wrap: nowrap; align-items: center; padding: 15px;     width: inherit;">
          <img
            class="p-1"
            v-if="supplier.user.userPicture"
            :src="supplier.user.userPicture.picture"
            style="width: 100px; height: 100px"
          />

          <img
            v-else
            class="p-1"
            :src="noImageSrc"
            style="width: 100px; height: 100px"
          />

          <div
            style="display: flex; flex-direction: column; margin: 0; padding: 0;     width: inherit;"
          >
            <span class="card-title" style="font-size: 1.2rem">
              {{ supplier.user.name }}
            </span>
            <div style="display: flex; flex-direction: row; justify-content:space-between;">
                <div style="display: flex; flex-direction: row;">
                    <div v-for="(family, index) in catalog" :key="index" class="rounded-circle">
                        <span v-html="getFamilyIcon(index)"></span>
                    </div>
                </div>
                <!-- <vs-chip v-if="this.offersPerSupplier > 0" style="color: white; background: indianred">{{ this.offersPerSupplier }} Ofertas</vs-chip> -->
            </div>
            <span style="font-size: 0.8rem">Min. R$ {{ supplier.minimumOrderValue.slice(0, -2) }}</span>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>
<style>
    .rounded-circle{
        margin-right: 5px;
        background: lightgray;
        padding: 4px;
        box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%) !important;
    }
</style>
<script>
import SuppliersService from "~/components/suppliers/services/index";

export default {
  name: "SupplierCard",
  data() {
    return {
        catalog: [],
        offersPerSupplier: [],
        noImageSrc: require(`~/assets/images/avatar-default.png`),
        familyIcon: null,
        mobileBrowser: false,
    };
  },
  created() {
    this.isMobile();
    // SuppliersService.getOfferProductsBySupplier(this.supplier.id).then((response2) => {
    //     this.offersPerSupplier = response2.data.length;
    //   });
    SuppliersService.getCatalogById(this.supplier.id).then((response) => {
        this.catalog = response.data
    })
  },
  computed: {},
  methods: {
    getFamilyIcon(family) {
      switch(family) {
        case 'Alimentos e bebidas':
          return '<img src="' + require(`~/assets/images/apple.png`) + '" alt="*" width="16">'
        case 'Embalagens':
          return '<img src="' + require(`~/assets/images/shopping-bag.png`) + '" alt="*" width="16">'
        case 'Limpeza':
          return '<img src="' + require(`~/assets/images/spray.png`) + '" alt="*" width="16">'
        case 'Utensílios':
          return '<img src="' + require(`~/assets/images/restaurant.png`) + '" alt="*" width="16">'
      }
      return null
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
  },
  props: {
    supplier: {
      type: Object,
      required: true,
    },
  },
};
</script>
