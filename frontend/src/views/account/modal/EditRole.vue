<template>
  <!-- The Modal -->
  <div class="modal" id="model-editrole">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Sửa Chức Vụ</h4>
          <button
            @click="$emit('cancel')"
            type="button"
            class="close"
            data-dismiss="modal"
          >
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form class="was-validated">
            <div class="form-group">
              <label for="name"
                >Họ Tên(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="fullname"
                name="fullname"
                v-model="item.fullname"
                required
              />
            </div>
            <div class="form-group">
              <label for="name"
                >Tên Đăng Nhập(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="username"
                name="username"
                v-model="item.username"
                required
              />
            </div>
            <div class="form-group">
              <label for="name"
                >Email(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="email"
                name="email"
                v-model="item.email"
                required
              />
            </div>
            <div class="form-group">
              <label for="role">Chức Vụ(<span style="color: red">*</span>):</label>
              <select
                class="form-control"
                id="role"
                name="role"
                v-model="item.role"
                required
              >
                <option value="">Chọn Chức Vụ</option>
                <option value="Employee">Nhân Viên</option>
                <option value="Manager">Quản Lý</option>
                <option value="Leader">Lãnh Đạo</option>
                <option value="Admin">Admin</option>
                <!-- Thêm các vai trò khác tương tự vào đây -->
              </select>
            </div>
            <button
              type="button"
              class="btn btn-warning px-3 py-2"
              style="font-size: 14px"
              @click="create"
              id="edit"
            >
              <span>Sửa</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, computed } from "vue";

export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({});
    const update = () => {
      if (
        props.item.fullname.length > 0 &&
        props.item.username.length > 0 &&
        props.item.email.length > 0 &&
        props.item.birthday.length > 0 &&
        props.item.registrationdate.length > 0
      ) {
        ctx.emit("update");
      }
    };
    return {
      update,
    };
  },
};
</script>

<style scoped>
.show-modal {
  display: block;
  opacity: 1;
  pointer-events: auto;
}
</style>
