<template>
  <div class="col mb-2">
    <div class="card h-100 font-small-3 mb-1 shadow-sm">
      <div class="card-body p-1">
        <div class="card-text text-center">
          <p class="mt-1">
            <i :class="iconName" class="feather font-large-2 text-muted"></i>
          </p>
          <p class="font-weight-bold font-medium-2 my-2">{{configurationName}}</p>
          <p class="mb-0 mt-1">
            <router-link
              :to="{ name: routeName }"
              class="btn btn-primary waves-effect waves-light"
            >Definir</router-link>
          </p>
        </div>
      </div>
      <card-footer-service-conditions :configuration="configuration" />
    </div>
  </div>
</template>

<script>
import CardFooterServiceConditions from "./CardFooterServiceConditions";

export default {
  name: "VCardServiceConditions",
  components: {
    CardFooterServiceConditions,
  },
  props: {
    configuration: {
      type: Boolean,
      required: true,
    },
    configurationName: {
      type: String,
      required: true,
    },
    iconName: {
      type: String,
      required: true,
    },
    routeName: {
      type: String,
      required: true,
    },
  },
};
</script>