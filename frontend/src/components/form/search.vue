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
    <input
      type="text"
      class="px-2"
      @input="$emit('update:searchText', $event.target.value)"
      style="font-size: 16px"
      placeholder="Tìm kiếm"
      @focus="(data.activeSelect = true), $emit('refresh')"
    />
    <!-- options -->
    <div
      v-if="entryValue.length == 0 && data.activeSelect == true"
      class="select-content overflow-auto d-flex flex-column align-items-start justify-content-start"
    >
      <span
        v-for="(option, index) in options"
        :key="index"
        class="select-option py-1 px-2 d-flex align-items-center justify-content-between"
      >
        <span
          @click="
            [
              $emit('choseSearch', option._id),
              (data.activeSelect = false),
              (title = option.name),
            ]
          "
          class="mr-2"
          style="cursor: pointer; font-size: 15px"
          onmouseover="this.style.color='green';"
          onmouseout="this.style.color='';"
          >{{ option.name }}</span
        >
      </span>
    </div>
  </div>
  <!-- <input
    type="text"
    class="form-control"
    placeholder="Tìm kiếm"
    @input="$emit('update:searchText', $event.target.value)"
  /> -->
</template>

<script>
import { ref, onMounted, onUnmounted, reactive } from "vue";
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    entryValue: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
  },
  setup() {
    const data = reactive({
      searchText: "",
      activeSelect: false,
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

    return {
      data,
      selectRef,
    };
  },
};
</script>

<style scoped>
.container {
  background-color: #f8f9fa;
  height: 100vh;
  display: flex;
  align-items: center;
}

.input-group {
  width: 100%;
}
.form-control {
  background-color: inherit;
  border: 1px solid var(--gray);
}
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
