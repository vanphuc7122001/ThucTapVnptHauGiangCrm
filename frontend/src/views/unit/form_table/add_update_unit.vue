<script></script>

<template>
  <!-- The Modal -->
  <div class="modal" id="model-add">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Level</h4>
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
              <select
                class="pl-2 form-control"
                @change="getLevel"
                v-model="selectValue"
                required
              >
                <option disabled selected hidden value="#"></option>
                <option
                  :value="`${value.lev_id}`"
                  :key="index"
                  v-for="(value, index) in levels"
                >
                  {{ value.lev_name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="name"
                >Tên đơn vị(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                v-model="newData.uni_name"
                required
              />
              <div style="color: red">
                {{ errors.uni_name }}
              </div>
            </div>
            <button
              type="submit"
              v-if="newData.uni_id == ''"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
            >
              Thêm
            </button>
            <button
              type="submit"
              v-if="newData.uni_id != ''"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
            >
              Sửa
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
export default {
  name: "Add",
  props: {
    newData: { type: Object },
  },
  setup({ newData }, ntx) {
    const levels = reactive([
      { lev_id: 1, lev_name: "Tổng công ty VNPT " },
      { lev_id: 2, lev_name: "Phòng" },
    ]);
    const selectValue = ref("");
    const errors = reactive({
      lev_id: "",
      uni_name: "",
    });
    const getLevel = (event) => {
      console.log(event.target.value);
      newData.lev_id = event.target.value;
    };
    const validate = () => {
      let valid = ref(true);
      errors.lev_id = "";
      errors.uni_name = "";
      if (newData.lev_id.trim() == "") {
        errors.lev_id = "Level is not empty";
        valid.value = false;
      }
      if (newData.uni_name.trim() == "") {
        errors.uni_name = "Name is not empty";
        valid.value = false;
      }
      console.log(errors);
      return valid;
    };
    const save = async () => {
      if (validate().value) {
        console.log("save:", newData);
        ntx.emit("addorupdate", newData);
        selectValue.value = "";
      } else {
        console.log("Data not empty");
      }
    };
    const turn_off = () => {
      document.getElementById("model-add").style.display = "none";
    };
    return { save, levels, getLevel, turn_off, selectValue, errors };
  },
};
</script>
