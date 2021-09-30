const routes = [
  {
    path: "/categoria/:categoryId",
    name: "category",
    component: () => import("~/components/categories/views/Category.vue"),
  },
]

export default routes
