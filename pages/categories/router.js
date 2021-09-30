const routes = [
  {
    path: "/categoria/:categoryId",
    name: "category",
    component: () => import("@/resources/categories/views/Category.vue"),
  },
]

export default routes
