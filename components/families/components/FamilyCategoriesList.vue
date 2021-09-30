<template>
  <div class="col-xl-4 col-12">
    <div class="card font-small-3">
      <div class="card-body px-0 py-0">
        <div v-for="(categories, title) in categoriesWithCollection" :key="title">
          <h6 class="px-2 mt-2 mb-75">{{titleize(title)}}</h6>
          <ul class="list-group flex-row flex-wrap list-group-mf-border border-bottom pb-1">
            <template v-for="category in chunk(categories)">
              <li
                :key="category.id"
                class="list-group-item w-50 py-50 px-2 rounded-0 bg-transparent border-0"
              >
                <router-link
                  :to="{ name: 'category', params: { categoryId: category[0].id }}"
                  class="d-block text-dark"
                >{{ category[0].name }}</router-link>
              </li>

              <li
                :key="category.id"
                v-if="category[1]"
                class="list-group-item w-50 py-50 px-2 rounded-0 bg-transparent"
              >
                <router-link
                  :to="{ name: 'category', params: { categoryId: category[1].id }}"
                  class="d-block text-dark"
                >{{ category[1].name }}</router-link>
              </li>
            </template>
          </ul>
        </div>

        <h6 class="px-2 mt-2 mb-75"></h6>
        <ul class="list-group flex-row flex-wrap list-group-mf-border border-bottom pb-1">
          <template v-for="category in chunkedCategoriesWithoutCollection">
            <li
              :key="category.id"
              class="list-group-item w-50 py-50 px-2 rounded-0 bg-transparent border-0"
            >
              <router-link
                :to="{ name: 'category', params: { categoryId: category[0].id }}"
                class="d-block text-dark"
              >{{ category[0].name }}</router-link>
            </li>
            <li
              :key="category.id"
              v-if="category[1]"
              class="list-group-item w-50 py-50 px-2 rounded-0 bg-transparent"
            >
              <router-link
                :to="{ name: 'category', params: { categoryId: category[1].id }}"
                class="d-block text-dark"
              >{{ category[1].name }}</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FamilyCategoriesList",
  methods: {
    chunk(arr) {
      return Array.from({ length: Math.ceil(arr.length / 2) }, (v, i) =>
        arr.slice(i * 2, i * 2 + 2)
      );
    },
    titleize(title) {
      return title.replace(/^[a-z]/, x => x.toUpperCase())
    }
  },
  computed: {
    chunkedCategoriesWithoutCollection() {
      let categoriesWithCollection = this.categoriesWithoutCollection;

      if (categoriesWithCollection) {
        return this.chunk(categoriesWithCollection);
      } else {
        return null;
      }
    },
  },
  props: {
    categoriesWithCollection: {
      required: true,
    },
    categoriesWithoutCollection: {
      required: true,
    },
  },
};
</script>
