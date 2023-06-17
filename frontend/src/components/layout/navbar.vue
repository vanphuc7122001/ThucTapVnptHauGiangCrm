<script>
import { defineEmits, inject, reactive } from "vue";

export default {
  props: {

  },
  setup(props, ctx) {
    const data = reactive({
      employeeName: sessionStorage.getItem("employeeName"),
      role: sessionStorage.getItem("role")
    })
    const emit = inject('emit');
    const updateMenuResponsive = () => {
      console.log('starting')
      ctx.emit("updateMenuResponsive", "true");
    };
    return {
      updateMenuResponsive,
      data
    };
  },
};
</script>

<template>
  <nav
    class="w-100 d-flex align-items-center justify-content-between border-nav"
  >
    <a class="text-dark h5 my-auto d-none d-xl-block ml-3">PERSONAL CRM SYSTEM</a>
    <a class="d-xl-none d-sm-block text-dark h5 my-auto"
      ><span class="material-symbols-outlined cursor-pointer" @click="$emit('showMenu')"> menu </span></a
    >
    <div class="d-flex align-content-center justify-content-between">
      <a class="text-dark d-flex align-items-center"
        ><span class="material-symbols-outlined cursor-pointer">
          search
        </span></a
      >
      <a class="text-dark d-flex align-items-center mx-2"
        ><span class="material-symbols-outlined cursor-pointer">
          translate
        </span></a
      >
      <a class="text-dark d-flex align-items-center"
        ><span class="material-symbols-outlined cursor-pointer">
          light_mode
        </span></a
      >
      <a class="text-dark d-flex align-items-center mx-2"
        ><span class="material-symbols-outlined cursor-pointer">
          notifications
        </span></a
      >
      <div class="d-flex align-content-center mr-3 my-1">
        <img
          class="rounded-circle avatar cursor-pointer"
          src="https://s1.media.ngoisao.vn/resize_580/news/2022/06/08/trieu-le-dinh-3-ngoisaovn-w1365-h2048.jpg"
          alt="Avatar"
        />
        <div
          class="d-xl-flex color-dark d-none flex-column align-items-center justify-content-center ml-2"
        >
          <span class="size-14">{{ data.employeeName }}</span>
          <span class="size-14">{{ data.role }}</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.color-dark {
  color: var(--dark);
}
.border-nav {
  border: 1px solid var(--gray);
  border-radius: 5px;
}
.avatar {
  width: 50px;
  height: 50px;
}
.italic-text {
  font-style: italic;
}
.cursor-pointer {
  cursor: pointer;
}
.font-size-13 {
  font-size: 13px;
}
</style>
