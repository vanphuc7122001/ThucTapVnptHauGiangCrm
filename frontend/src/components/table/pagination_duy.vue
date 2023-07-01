<script>
import { inject } from "vue";
export default {
  props: {
    totalRow: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    numberOfPages: {
      type: Number,
      default: 10,
    },
    startRow: {
      type: Number,
      default: 0,
    },
    endRow: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    const emit = inject("emit");
    const updateCurrentPage = (number) => {
      ctx.emit("update:currentPage", number);
    };
    const updateNextPage = (number) => {
      if (number < props.numberOfPages && number > 0) {
        ctx.emit("update:currentPage", number + 1);
      }
    };
    const updatePrevPage = (number) => {
      if (number <= props.numberOfPages && number > 1) {
        ctx.emit("update:currentPage", number - 1);
      }
    };
    return {
      updateCurrentPage,
      updateNextPage,
      updatePrevPage,
    };
  },
};
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mt-2">
    <p class="size-16">
      Hiển thị {{ totalRow == 0 ? 0 : startRow }} đến
      {{ endRow > totalRow ? totalRow : endRow }} trên {{ totalRow }} bản ghi
    </p>
    <ul class="pagination">
      <li @click="updatePrevPage(currentPage)" class="page-item">
        <a class="page-link text-dark material-symbols-outlined h-100" href="#"
          ><span class="size-20">chevron_left</span></a
        >
      </li>
      <li
        @click="updateCurrentPage(value)"
        v-for="(value, index) in numberOfPages"
        class="page-item"
        v-if="numberOfPages < 10"
      >
        <a
          class="page-link h-100 d-flex align-items-center"
          :class="[index == currentPage - 1 ? 'text-blue' : 'text-dark']"
          href="#"
          >{{ value }}</a
        >
      </li>
      <li
        @click="updateCurrentPage(value)"
        v-for="(value, index) in numberOfPages"
        class="page-item"
        v-if="numberOfPages >= 10"
      >
        <a
          class="page-link h-100 d-flex align-items-center"
          :class="[index == currentPage - 1 ? 'text-blue' : 'text-dark']"
          href="#"
          v-if="index < 3"
          >{{ value }}</a
        >
      </li>
      <li
        class="page-item d-flex align-items-center"
        v-if="numberOfPages >= 10"
      >
        <span class="material-symbols-outlined page-link h-100 d-flex align-items-center"> more_horiz </span>
      </li>
      <!-- {{ numberOfPages.length }} -->
      <li
        @click="updateCurrentPage(value)"
        v-for="(value, index) in numberOfPages"
        class="page-item"
        v-if="numberOfPages >= 10"
      >
        <a
          class="page-link h-100 d-flex align-items-center"
          :class="[index == currentPage - 1 ? 'text-blue' : 'text-dark']"
          href="#"
          v-if="index >= numberOfPages - 3"
          >{{ value }}</a
        >
      </li>

      <li @click="updateNextPage(currentPage)" class="page-item">
        <a class="page-link text-dark material-symbols-outlined h-100" href="#"
          ><span class="size-20">chevron_right</span></a
        >
      </li>
    </ul>
  </div>
</template>

<style scoped>
.pagination-css {
  display: flex;
}
.page-link {
  border: 1px solid var(--gray);
  border-collapse: collapse;
  padding: 6px 12px;
  background-color: inherit;
  font-size: 16px;
}
.text-dark {
  color: var(--dark);
}
.text-blue {
  color: blue;
}
</style>
