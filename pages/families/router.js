const routes = [
  {
    path: "/familia/:familyId",
    name: "family",
    component: () => import("@/resources/families/views/Family.vue"),
  },
]

export default routes
