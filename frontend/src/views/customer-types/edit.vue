<template>
  <!-- <form-customer-type-phuc :title="'Update Customer Type'" :btnName="'Update'"/> -->
  <div class="modal" id="model-edit">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 18px">
            Sửa loại khách hàng
          </h4>
          <button type="button" class="close" data-dismiss="modal" @click="$emit('cancel')">
            &times;
          </button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <div class="container">
            <form @submit.prevent>
              <div class="form-group">
                <label for="name">Name (<span style="color: red;">*</span>)</label>
                <input type="text" class="form-control" id="name" placeholder="" v-model="item.name" required />
              </div>
              <button type="submit" class="btn btn-primary" @click="handleUpdate(item)">
                Cập nhật
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formCustomerTypePhuc from "../../components/form/form-customer-type-phuc.vue";
export default {
  components: { formCustomerTypePhuc },
  props: {
    item: {
      type: Object,
    },
  },

  setup(props, context) {
    const handleUpdate = async (item) => {
      context.emit('update', {...item})
    }


    return {
      handleUpdate,
      
    }
  },
};
</script>

<style></style>