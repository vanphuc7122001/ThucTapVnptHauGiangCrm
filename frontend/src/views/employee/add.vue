<script>
import { reactive } from "vue";
import Select from "../../components/form/select.vue";
export default {
  components: {
    Select,
  },
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({});
    const create = () => {
      if (props.item.name.length > 0 && props.item.content.length > 0) {
        ctx.emit("create");
      }
    };
    return {
      create,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <!-- The Modal -->
  <div class="modal" id="model-add">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Thêm thông tin nhân viên mới
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="/action_page.php" class="was-validated">
            <div class="form-group">
              <label for="name"
                >Họ và tên(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                v-model="item.name"
                required
              />
            </div>
            <div class="form-group">
              <label for="birthday"
                >Ngày sinh(<span style="color: red">*</span>):</label
              >
              <input
                type="date"
                class="form-control"
                id="birthday"
                name="birthday"
                v-model="item.birthday"
                required
              />
            </div>
            <div class="form-group">
              <label for="address"
                >Địa chỉ(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="address"
                name="address"
                v-model="item.address"
                required
              />
            </div>
            <div class="form-group">
              <label for="phone"
                >Số điện thoại(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="phone"
                name="phone"
                v-model="item.phone"
                required
              />
            </div>
            <div class="form-group">
              <label for="email"
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
              <label for="center"
                >Trung tâm(<span style="color: red">*</span>):</label
              >
              <Select :title="`Trung tâm`" :entryValue="`Trung tâm`" />
            </div>
            <div class="form-group">
              <label for="department"
                >Phòng(<span style="color: red">*</span>):</label
              >
              <Select :title="`Phòng`" :entryValue="`Phòng`" />
            </div>
            <div class="form-group">
              <label for="department"
                >Đơn vị(<span style="color: red">*</span>):</label
              >
              <Select :title="`Đơn vị`" :entryValue="`Đơn vị`" />
            </div>
            <b-button
              type="submit"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
              @click="clickAdd"
              id="add"
              data-dismiss="modal"
            >
              <span>Thêm</span>
            </b-button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
