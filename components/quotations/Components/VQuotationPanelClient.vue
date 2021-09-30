<template>
  <div :class="whichClass">
    <div class="card-body">
      <div class="row">
        <div class="col-md-4 col-6">
            <p class="font-weight-bold text-uppercase font-small-2">Dados</p>
            <p class="mb-0 font-small-3">
                <span class="d-block">{{ client.user.name }}</span>
                <span class="d-block">{{ client.user.cnpj }}</span>
            </p>
        </div>
        <div class="col-md-4 col-6">
            <p class="font-weight-bold text-uppercase font-small-2">Endereço</p>
            <p class="mb-0 font-small-3">
                {{ client.user.street }}<br>
                {{ client.user.neighborhood }} - {{ client.user.city }} / {{ client.user.stateUf }}<br>
                {{ client.user.zipcode }}
            </p>
        </div>
        <div class="col-md-4">
            <p class="font-weight-bold text-uppercase font-small-2">Contato</p>
            <p class="mb-0 font-small-3">
                <span class="d-block"><i class="fa fa-phone mr-50 text-primary"></i> {{ client.user.phone }}</span>
                <span class="d-block"><i class="fa fa-envelope-o mr-50 text-primary"></i> {{ client.user.email }}</span>
            </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {

    }
  },
  mounted() {

  },
  computed: {
    whichClass() {
      if(this.noMargin)
        return "card shadow-sm m-0 pb-1"
      else
        return "card shadow-sm m-1"
    }
  },
  methods: {

  },
  props: {
    client: {
      type: Object,
      required: true
    },
    noMargin: {
      type: Boolean
    }
  },
};
</script>
