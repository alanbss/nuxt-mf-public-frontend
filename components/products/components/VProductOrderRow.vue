<template>
  <tr>
    <td style="width: 25%;" class="align-top">
      <span class="mr-1">{{ productCardTitle }}</span>
    </td>
    <td style="width: 25%;" class="align-top">
      <span class="mr-1 font-weight-bold">Cebola</span>
    </td>
    <td style="width: 25%;" class="align-top">
      <span>S/ lactose; Light</span>
    </td>
    <td style="width: 15%;" class="align-top">
        <span class="disabled-opacity">Lorem ipsum dolor sit amet, consectetur elit.</span>
    </td>
    <td style="width: 5%;" class="align-top">
        <a href="https://static.carrefour.com.br/medias/sys_master/images/images/h20/hdb/h00/h00/13740811419678.jpg" data-toggle="lightbox" title="Foto do produto" data-title="Maionese"><i class="feather icon-image font-medium-3"></i></a>
    </td>
    <td style="width: 10%;" class="align-top">
        Display | 90 g | 24 unid.
    </td>
    <td style="width: 8%;" class="align-top">
        Cx. c/ 4
    </td>
    <td style="width: 10%;" class="align-top">
        R$ 106,68
    </td>
    <td style="width: 7%;" class="align-top">
        <strong class="text-success">9.999</strong>
    </td>
    <td style="width: 10%;" class="align-top">
        <strong class="text-dark">R$ 99.999,00</strong>
    </td>
    <td style="width: 10%;" class="align-top">
        HM-CE 9024
    </td>
  </tr>
</template>

<script>
import cardTitle from "@/resources/products/mixins/cardTitle";

export default {
  name: "VProductOrderRow",

  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  components: {

  },
  mixins: [cardTitle]
};
</script>
