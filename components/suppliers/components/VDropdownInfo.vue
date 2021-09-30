<template>
  <vs-dropdown class="ml-2">
    <a class="a-icon" href="#">
      <i class="feather icon-info"></i><span class="d-md-inline d-none ml-25">Informações</span>
    </a>

    <vs-dropdown-menu>
      <vs-dropdown-item>
        <p class="p-1 m-0 font-small-3">
          {{ supplier.user.name }}<br>
          {{ supplier.user.cnpj }}<br>
          {{ supplier.user.street }}, {{ supplier.user.addressDetails }}<br>
          {{ supplier.user.neighborhood }} - {{ supplier.user.city }} / {{ supplier.user.stateUf }}<br>
          {{ supplier.user.zipcode }}
        </p>
      </vs-dropdown-item>
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<script>

export default {
  name: "VDropdownInfo",
  components: {
    
  },
  props: {
    supplier: {
      type: Object,
      required: true,
    },
  },
};
</script>
