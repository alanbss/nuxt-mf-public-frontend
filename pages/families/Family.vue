<template>
  <div v-if="family" class="content-wrapper pb-0">
    <div class="content-header row">
      <div class="content-header-left col-12 mb-2">
        <div class="row breadcrumbs-top">
          <div class="col-12">
            <h2 class="content-header-title mb-0">
              {{ family.name }}
              <a @click.prevent.stop="$refs.familyMenu.open($event)" class="mr-1 collection-line font-medium-1" href="javascript:void(0)">
                <span style="text-decoration: underline;">Mudar</span>
              </a>
            </h2>
            <vue-context ref="familyMenu">
              <li v-for="fam in families" :key="fam.name">
                <a class="mf-item-list" v-if="fam.name != family.name" @click.prevent="goToFamily(fam)">
                  <span v-html="getFamilyIcon(fam.name)"></span> {{ fam.name }}
                </a>
              </li>
            </vue-context>
          </div>
        </div>
      </div>
    </div>
    <div class="content-body">
      <div class="row">
        <div class="col-xl-12 col-12">
          <family-card :family="family" :products="productsFromFamily(familyId)" :familyPage="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FamilyCard from "~/components/families/components/FamilyCard";
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css';
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Family",
  data() {
    return {
      familyId: this.$route.params.familyId,
      family: null,
      families: null
    };
  },
  mounted() {
    //this.getUsedWithCategories(this.familyId);
    //this.getProducts(this.familyId);
    this.getUsedFamilies().then((response) => {
      this.family = response.find(obj => obj.id == this.familyId)
      this.families = response
    })
    this.getRandomProductsFromFamily(this.familyId)
    this.getRandomProducts()
  },

  computed: {
    ...mapState("families", ["products"]),
    ...mapState("products", ["randomProducts", "familyProducts"]),
    ...mapGetters("families", [
      "chunckedProductsFromFamily",
      "categoriesWithCollection",
      "categoriesWithoutCollection",
      "familiesWithChunckedProducts",
    ]),

    maxPerScreen() {
      if(window.innerWidth >= 1910) {
        return 6
      } else if(window.innerWidth >= 1680 && window.innerWidth < 1910) {
        return 5
      } else if(window.innerWidth >= 1450 && window.innerWidth < 1680) {
        return 4
      } else if(window.innerWidth >= 1220 && window.innerWidth < 1450) {
        return 3
      } else if(window.innerWidth >= 1000 && window.innerWidth < 1220) {
        return 4
      } else {
        return 2
      }
    },

    widthRatio() {
      return ((window.innerWidth / this.maxPerScreen) / window.innerWidth) * 100
    },

    // currentPage: {
    //   get() {
    //     return this.$store.state.pagination.currentPage;
    //   },
    //   set(value) {
    //     this.$store.dispatch("pagination/setCurrentPage", value);
    //   },
    // },
  },
  watch: {

  },
  methods: {
    ...mapActions("families", ["getUsedWithCategories", "getProducts", "getFamilies", "getUsedFamilies"]),
    ...mapActions("products", ["getRandomProductsFromFamily", "getRandomProducts"]),
    productsFromFamily(id) {
      for(var i = 0; i < this.familyProducts.length; i++) {
        if(this.familyProducts[i].familyId == id)
          return this.familyProducts[i].products
      }
      return null
    },
    getFamilyIcon(family) {
      switch(family) {
        case 'Alimentos e bebidas':
          return '<img src="' + require(`~/assets/images/maca.svg`) + '" alt="*" width="16">'
        case 'Embalagens':
          return '<i class="feather icon-shopping-bag mr-25"></i>'
        case 'Limpeza':
          return '<img src="' + require(`~/assets/images/window-cleaner.svg`) + '" alt="*" width="16">'
        case 'Utensílios':
          return '<i class="fa fa-cutlery mr-25"></i>'
      }
      return null
    },
    goToFamily(family) {
      this.$router.push({ name: 'family', params: { familyId: family.id }})
      window.location.reload()
    }

  },
  components: {
    FamilyCard,
    VueContext
  },
};
</script>
