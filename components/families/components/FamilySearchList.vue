<template>
  <div>
    <div v-for="(categories, title) in categoriesWithCollection" :key="title">
      <h6 class="px-2 mb-50">{{titleize(title)}}</h6>
      <ul class="list-group list-group-mf-border pb-1">
        <template v-for="category in categories">
          <li v-if="storeSearch"
            :key="category.category_id"
            class="list-group-item py-50 px-2 rounded-0 bg-transparent border-0"
          >
            <router-link
              :to="{ name: 'public-store-search', params: { keyword: keyword }, query: { category: category.category_id }}"
              class="d-block text-blue"
              :style="isSelected(category.category_id)"
            >{{ category.category_name }} ({{ category.count }})</router-link>
          </li>
          <li v-else
            :key="category.category_id"
            class="list-group-item py-50 px-2 rounded-0 bg-transparent border-0"
          >
            <router-link
              :to="{ name: 'users.search', params: { keyword: keyword }, query: { category: category.category_id }}"
              class="d-block text-blue"
              :style="isSelected(category.category_id)"
            >{{ category.category_name }} ({{ category.count }})</router-link>
          </li>

          <!-- <li
            :key="category.id"
            v-if="category[1]"
            class="list-group-item w-50 py-50 px-2 rounded-0 bg-transparent"
          >
            <router-link
              :to="{ name: 'users.search', params: { keyword: keyword }, query: { category: category[1].id }}"
              class="d-block text-blue"
              :style="isSelected(category[1].id)"
            >{{ category[1].name }} ({{ category[1].count }})</router-link>
          </li> -->
        </template>
      </ul>
    </div>

    <h6 class="px-2 mb-50"></h6>
    <ul class="list-group list-group-mf-border pb-1">
      <template v-for="category in chunkedCategoriesWithoutCollection">
        <li v-if="!storeSearch"
          :key="category.id"
          class="list-group-item py-50 px-2 rounded-0 bg-transparent border-0"
        >
          <router-link
            :to="{ name: 'users.search', params: { keyword: keyword }, query: { category: category[0].id }}"
            class="d-block text-blue"
            :style="isSelected(category[0].id)"
          >{{ category[0].name }} ({{ category[0].count }})</router-link>
        </li>
        <li
          :key="category.id"
          v-if="category[1] && !storeSearch"
          class="list-group-item w-50 py-50 px-2 rounded-0 bg-transparent"
        >
          <router-link
            :to="{ name: 'users.search', params: { keyword: keyword }, query: { category: category[1].id }}"
            class="d-block text-blue"
            :style="isSelected(category[1].id)"
          >{{ category[1].name }} ({{ category[1].count }})</router-link>
        </li>
        <li v-if="storeSearch"
          :key="category.id"
          class="list-group-item py-50 px-2 rounded-0 bg-transparent border-0"
        >
          <router-link
            :to="{ name: 'public-store-search', params: { keyword: keyword }, query: { category: category[0].id }}"
            class="d-block text-blue"
            :style="isSelected(category[0].id)"
          >{{ category[0].name }} ({{ category[0].count }})</router-link>
        </li>
        <li
          :key="category.id"
          v-if="category[1] && !storeSearch"
          class="list-group-item w-50 py-50 px-2 rounded-0 bg-transparent"
        >
          <router-link
            :to="{ name: 'public-store-search', params: { keyword: keyword }, query: { category: category[1].id }}"
            class="d-block text-blue"
            :style="isSelected(category[1].id)"
          >{{ category[1].name }} ({{ category[1].count }})</router-link>
        </li>
      </template>
    </ul>

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
    },
    isSelected(id) {
      if(this.category == id)
        return "background-color: #cdfad9; border-radius: 7px;"
      else
        return ""
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
  mounted() {
  },
  props: {
    categoriesWithCollection: {
      required: true,
    },
    categoriesWithoutCollection: {
      required: true,
    },
    keyword: {
      required: true,
    },
    category: {
      required: true,
    },
    storeSearch: {
      type: Boolean,
    }
  },
};
</script>
