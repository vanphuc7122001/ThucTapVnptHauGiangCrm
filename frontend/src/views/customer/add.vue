<template>
  <form_wizard_customer
    :id_form="'model-add'"
    @refresh_customer="refresh_customer"
    :resetData="resetData"
  />
</template>

<script>
import { form_wizard_customer } from "../common/import";

export default {
  props: {
    resetData: {
      type: Boolean,
    },
  },
  components: {
    form_wizard_customer,
  },
  setup(_, { emit }) {
    const refresh_customer = () => {
      emit("refresh_customer");
    };
    return {
      refresh_customer,
    };
  },
};
</script>

<style></style>
