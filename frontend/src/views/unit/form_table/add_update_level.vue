<template>
  <!-- The Modal -->
  <div class="modal" id="model-add">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Cấp</h4>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            @click="turn_off"
          >
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form @submit.prevent="save" class="was-validated">
            <div class="form-group">
              <label for="name"
                >Tên cấp(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                v-model="newData.lev_name"
                required
              />
              <div style="color: red">
                {{ errors.lev_name }}
              </div>
            </div>
            <button
              v-if="newData.lev_id != ''"
              type="submit"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
            >
              Sửa
            </button>
            <button
              v-if="newData.lev_id == ''"
              type="submit"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
            >
              Thêm
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
export default {
  name: "Add",
  props: {
    newData: { type: Object },
  },

  setup({ newData }, ntx) {
    const errors = reactive({
      lev_name: "",
    });
    const validate = () => {
      let valid = ref(true);
      errors.lev_name = "";

      if (newData.lev_name.trim() == "") {
        errors.lev_name = "Name is not empty";
        valid.value = false;
      }
      console.log(errors);
      return valid;
    };
    const save = async () => {
      if (validate().value) {
        ntx.emit("addorupdate", newData);
      } else {
        console.log("Data not empty");
      }
    };
    const turn_off = () => {
      document.getElementById("model-add").style.display = "none";
    };
    return { save, turn_off, errors };
  },
};
</script>
