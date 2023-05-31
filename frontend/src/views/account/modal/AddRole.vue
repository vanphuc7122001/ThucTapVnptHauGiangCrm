<template>
  <!-- The Modal -->
  <div class="modal" id="modal-addrole">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Thêm Chức Vụ</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for="name"
                >Họ Và Tên(<span style="color: red">*</span>):</label
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
                <option value="employee">Nhân Viên</option>
                <option value="manager">Quản Lý</option>
                <option value="leader">Lãnh Đạo</option>
                <option value="admin">Admin</option>
                <!-- Thêm các vai trò khác tương tự vào đây -->
              </select>
            </div>

            <button
              type="submit"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px; float: right"
              @click="create"
              id="addrole"
            >
              <span>Thêm</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive } from "vue";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const Data = reactive({});
    const create = () => {
      if (
        props.item.fullname.length > 0 &&
        props.item.username.length > 0 &&
        props.item.email.length > 0 &&
        props.item.role.length > 0
      ) {
        ctx.emit("create");
      }
    };
    return {
      create,
    };
  },
};
</script>
<script scoped></script>
