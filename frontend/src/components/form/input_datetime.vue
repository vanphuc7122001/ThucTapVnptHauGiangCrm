<script>
import {
  ref,
  onMounted,
  onUnmounted,
  defineProps,
  reactive,
  watch,
  onBeforeMount,
} from "vue";
export default {
  props: {
    entryValue: {
      type: String,
      required: true,
      default: "",
    },
    title: {
      type: String,
    },
  },
  setup(props) {
    const data = reactive({
      a: 1,
      activeSelect: false,
      activeClose: false,
    });
    const selectRef = ref(null);

    const handleClickOutside = (event) => {
      if (!selectRef.value.contains(event.target)) {
        data.activeSelect = false;
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    onBeforeMount(() => {
      if (props.options != null) {
        checkShowClose();
      }
    });
    return {
      props,
      data,
      selectRef,
    };
  },
};
</script>

<template>
  <div
    ref="selectRef"
    class="select-border d-flex align-items-center justify-content-between flex-row flex-row-reverse"
    style=""
  >
    <!-- title -->
    <div class="select-title mx-auto">
      <span class="d-flex justify-content-center"
        ><span>{{ title }}</span></span
      >
    </div>
    <!-- content -->
    <div class="d-flex">
      <span
        v-if="entryValue.length > 0"
        class="material-symbols-outlined d-flex align-items-center"
        style="font-size: 20px; cursor: pointer"
        @click="$emit('refresh')"
      >
        close</span
      >
    </div>
    <input
      type="datetime-local"
      class="px-2"
      :value="entryValue"
      @input="$emit('update:entryValue', $event.target.value)"
      style="font-size: 16px"
      @focus="data.activeSelect = true"
    />
    <!-- options -->
  </div>
  <!-- <div class="">
    <select
      class="form-control d-flex justify-content-start"
      :value="entryValue"
      @input="$emit('update:entryValue', $event.target.value)"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.name }}
      </option>
    </select>
  </div> -->
</template>

<style scoped>
.select-border {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid var(--gray);
  border-radius: 5px;
}

input {
  background-color: inherit;
  width: 100%;
  border: 0;
}
.select-title {
  position: absolute;
  top: -10px;
  left: 0;
  /* right: 0; */
}
.select-title span {
  position: relative;
  font-size: 12px;
}
.select-title span span {
  background-color: var(--light);
  padding: 0 5px;
}
.select-content {
  position: absolute;
  top: 0;
  width: 100%;
  border-radius: 5px;
  border: 1px solid var(--gray);
  border-radius: 5px;
  z-index: 10;
  margin-top: 50px;
  background-color: white;
}

.select-option {
  cursor: pointer;
  width: 100%;
}
</style>
