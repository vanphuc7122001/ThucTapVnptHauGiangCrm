<template>
  <div class="modal" id="model-add">
  <div class="modal-dialog">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title" style="font-size: 15px;">Thêm loại khách hàng</h4>
        <button type="button" class="close" data-dismiss="modal">
          &times;
        </button>
      </div>
      <!-- Modal body -->
      <div class="modal-body">
          <form-customer-type-phuc  :btnName="'Thêm'" @add="handleAdd"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import FormCustomerTypePhuc from '../../components/form/form-customer-type-phuc.vue'
export default {
  components: {
      FormCustomerTypePhuc
  },

  setup(_, context){
    const handleAdd = (value) => {
      context.emit('add' , value)
    }

    return {
      handleAdd
    }
  }

}
</script>

<style>

</style>