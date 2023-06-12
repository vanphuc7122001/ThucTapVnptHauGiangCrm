<template>
  <form_wizard_customer :id_form="'model-add'" @refresh_customer="refresh_customer"/>
</template>

<script>
import axios from 'axios';
import {
  http_getAll,
  http_getOne,
  http_deleteOne,
  http_update,
  http_create,
  alert_success,
  alert_error,
  alert_delete,
  form_wizard_customer,
  Company_KH,
  Customer_Work,
  Customer,
} from '../common/import'

export default {
  components: {
    form_wizard_customer
  },
  setup(_,{emit}){

    const refresh_customer = () => {
      emit('refresh_customer')
    }
    return {
      refresh_customer
    }
  }


}
</script>

<style></style>