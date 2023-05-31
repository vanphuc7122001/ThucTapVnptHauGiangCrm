<template>
  <div class="modal" id="model-edit">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px;">Edit Customer</h4>
          <button type="button" class="close" data-dismiss="modal" @click="$emit('cancel')">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form-customer-phuc :item="item" :btnName="'Cập nhật'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formCustomerPhuc from '../../components/form/form-customer-phuc.vue';

export default {
  props: {
    item: {
      type: Object
    }
  },
  components: {
    formCustomerPhuc
  }
}
</script>

<style></style>