<template>
  <div>
    <vs-popup title="Selecione a categoria" :active.sync="open">
      <div :style="isMobile ? 'padding-bottom: 36px;' : ''">
        <div
          v-for="(family, index1) in catalog"
          :key="index1"
          style="margin-bottom: 8px;;"
        >
          <h5><span v-html="getFamilyIcon(index1)"></span> {{ index1 }}</h5>
          <span v-if="index1 == 'Alimentos e bebidas'">
            <span v-if="Object.keys(family).length > 1">
              <span
                v-for="(collection, index2) in family"
                :key="index2"
                :vs-value="index2"
                style="display: inline-block; float: none;"
              >
                <vs-chip v-if="selectedCollection && selectedCollection == index2" style="background-color: #bc5100;" class="public-chip text-white font-small-2 font-weight-bold">
                  <a @click="selectCollection(index1, index2)" style="">
                    {{ index2 }}
                  </a>
                </vs-chip>
                <vs-chip v-else>
                  <a @click="selectCollection(index1, index2)" style="">
                    {{ index2 }}
                  </a>
                </vs-chip>
              </span>
            </span>
            <span v-else>
              <span
                v-for="(collection, index2) in family"
                :key="index2"
              >
                <span
                  v-for="(category, index3) in collection"
                  :key="index3"
                  :vs-value="index3"
                  style="display: inline-block; float: none;"
                >
                  <span v-if="category.length > 1">
                    <vs-chip
                      v-if="selectedCategory && selectedFamily && selectedCategory == index3 && selectedFamily == index1"
                      style="background-color: #f57f17;" class="public-chip text-white font-small-2 font-weight-bold"
                    >
                      <a @click="selectCategory(index1, index2, index3)" style="">
                        {{ index3 }}
                      </a>
                    </vs-chip>
                    <vs-chip v-else >
                      <a @click="selectCategory(index1, index2, index3)" style="">
                        {{ index3 }}
                      </a>
                    </vs-chip>
                  </span>
                  <span v-else>
                    <span
                      v-for="(type, index4) in category"
                      :key="index4"
                      :vs-value="index4"
                      style="display: inline-block; float: none;"
                    >
                      <vs-chip>
                        <a @click="selectProductType(type.productTypeId)">
                          {{ type.productType }}
                        </a>
                      </vs-chip>
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
          <span v-else>
            <span
              v-for="(collection, index2) in family"
              :key="index2"
            >
              <span
                v-for="(category, index3) in collection"
                :key="index3"
                :vs-value="index3"
                style="display: inline-block; float: none;"
              >
                <span v-if="category.length > 1">
                  <vs-chip
                    v-if="selectedCategory && selectedFamily && selectedCategory == index3 && selectedFamily == index1"
                    style="background-color: #f57f17;" class="public-chip text-white font-small-2 font-weight-bold"
                  >
                    <a @click="selectCategory(index1, index2, index3)" style="">
                      {{ index3 }}
                    </a>
                  </vs-chip>
                  <vs-chip v-else >
                    <a @click="selectCategory(index1, index2, index3)" style="">
                      {{ index3 }}
                    </a>
                  </vs-chip>
                </span>
                <span v-else>
                  <span
                    v-for="(type, index4) in category"
                    :key="index4"
                    :vs-value="index4"
                    style="display: inline-block; float: none;"
                  >
                    <vs-chip>
                      <a @click="selectProductType(type.productTypeId)">
                        {{ type.productType }}
                      </a>
                    </vs-chip>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </div>
      </div>
    </vs-popup>
  </div>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";

export default {
  name: "StoreFamiliesModal",
  data() {
    return {
      open: false,

    }
  },
  created() {

  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    },
    open() {
      this.$emit('update-modal', this.open)
    }
  },
  computed: {
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    selectCategory(familyName, collectionName, categoryName) {
      this.$emit('selected-category', { family: familyName, collection: collectionName, category: categoryName })
      this.open = false
    },
    selectCollection(familyName, collectionName) {
      this.$emit('selected-collection', { family: familyName, collection: collectionName })
      this.open = false
    },
    selectProductType(productTypeId) {
      this.$emit('selected-product-type', productTypeId)
      this.open = false
    },
    getFamilyIcon(family) {
      switch(family) {
        case 'Alimentos e bebidas':
          return '<img src="' + require(`@/assets/images/maca.svg`) + '" alt="*" width="16">'
        case 'Embalagens':
          return '<i class="feather icon-shopping-bag mr-25"></i>'
        case 'Limpeza':
          return '<img src="' + require(`@/assets/images/window-cleaner.svg`) + '" alt="*" width="16">'
        case 'Utensílios':
          return '<i class="fa fa-cutlery mr-25"></i>'
      }
      return null
    },
  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
    catalog: {
      type: Object,
      required: true,
    },
    selectedCategory: {
      type: String
    },
    selectedCollection: {
      type: String
    },
    selectedFamily: {
      type: String
    }
  },
  components: {

  },
};
</script>
