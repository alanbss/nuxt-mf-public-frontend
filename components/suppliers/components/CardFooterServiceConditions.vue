<template>
  <div v-if="configuration" class="card-footer p-1 text-center font-weight-bold bg-success">
    <span class="text-white">
      <i class="feather icon-check mr-50 font-medium-1"></i> Pronto!
    </span>
  </div>

  <div v-else class="card-footer p-1 text-center font-weight-bold bg-danger">
    <span class="text-white">
      <i class="feather icon-alert-circle mr-50 font-medium-1"></i> Ainda não definiu
    </span>
  </div>
</template>

<script>
export default {
  name: "CardFooterServiceConditions",
  props: {
    configuration: {
      type: Boolean,
      required: true
    }
  }
};
</script>