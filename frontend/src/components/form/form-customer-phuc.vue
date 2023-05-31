<template>
  <div class="container">
    <!-- {{ item }} -->
    <img
      v-if="checkView"
      class="rounded-circle mx-auto d-block"
      :src="viewData.avatar"
      alt=""
      height="100"
    />
    <form @submit.prevent class="mt-2">
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="name">Tên (<span style="color: red">*</span>)</label>
          <input
            type="text"
            class="form-control"
            id="name"
            :disabled="checkView"
            :value="viewData.name"
          />
        </div>
        <div class="form-group col-md-6">
          <label for="birthdate"
            >Ngày sinh (<span style="color: red">*</span>)</label
          >
          <input
            type="date"
            class="form-control"
            id="birthdate"
            :value="viewData.birthdate"
            :disabled="checkView"
          />
        </div>
      </div>
      <div class="form-group">
        <label for="address">Địa chỉ (<span style="color: red">*</span>)</label>
        <input
          type="text"
          class="form-control"
          id="address"
          :disabled="checkView"
          :value="viewData.address"
        />
      </div>
      <div class="form-group">
        <label for="phone">Sdt (<span style="color: red">*</span>)</label>
        <input
          type="text"
          class="form-control"
          id="phone"
          :disabled="checkView"
          :value="viewData.phone"
        />
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="email">Email (<span style="color: red">*</span>)</label>
          <input
            type="text"
            class="form-control"
            id="email"
            :disabled="checkView"
            :value="viewData.email"
          />
        </div>
        <div class="form-group col-md-6" v-if="!checkView">
          <label for="type"> Loại khách hàng </label>
          <select id="type" class="form-control">
            <option selected>--Chọn--</option>
            <option>VIP</option>
          </select>
        </div>
        <div class="form-group col-md-6" v-if="checkView">
          <label for=""> Loại khách hàng </label>
          <input
            type="text"
            name=""
            id=""
            class="form-control"
            :value="viewData.type"
            disabled
          />
        </div>
      </div>
      <div class="form-group" v-if="!checkView">
        <input type="file" class="form-control" id="avatar" />
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="wor_current_workplace">Nơi đang công tác</label>
          <input
            type="text"
            class="form-control"
            id="wor_current_workplace"
            :disabled="checkView"
            :value="viewData.wor_current_workplace"
          />
        </div>
        <div class="form-group col-md-6">
          <label for="wor_current_position">Chức vụ đang công tác</label>
          <input
            type="text"
            class="form-control"
            id="wor_current_position"
            :disabled="checkView"
            :value="viewData.wor_current_position"
          />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="wor_work_history">Quá trình công tác</label>
          <input
            type="text"
            class="form-control"
            id="wor_work_history"
            :disabled="checkView"
            :value="viewData.wor_work_history"
          />
        </div>
        <div class="form-group col-md-6">
          <label for="wor_work_temp">Nhiệm kỳ</label>
          <input
            type="text"
            class="form-control"
            id="wor_work_temp"
            :disabled="checkView"
            :value="viewData.wor_work_temp"
          />
        </div>
      </div>

      <div class="form">
        <div class="form-group ">
          <label for="wor_work_history">Công ty</label>
          <input
            type="text"
            class="form-control"
            id="wor_work_history"
            :disabled="checkView"
            :value="viewData.wor_work_history"
          />
        </div>
      </div>

      <button v-if="!view" type="submit" class="btn btn-primary">
        {{ btnName }}
      </button>
    </form>
  </div>
</template>

<script>
import { computed, reactive } from "vue";
export default {
  props: {
    title: {
      type: String,
    },
    btnName: {
      type: String,
    },
    view: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
    },
  },

  setup(props) {
    const viewData = reactive({
      ...props.item,
    });

    console.log(viewData.birthdate);
    const tagView = props.view;
    const checkView = computed(() => {
      return props.view ? true : false;
    });

    console.log(tagView);

    return {
      checkView,
      tagView,
      viewData,
    };
  },
};
</script>

<style></style>
