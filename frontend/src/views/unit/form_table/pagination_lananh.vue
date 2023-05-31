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
  setup(props, { emit }) {
    // const emit = inject("emit");
    const updateCurrentPage = (number) => {
      emit("updateCurrentPage", number);
    };
    const updateNextPage = (number) => {
      if (number < props.numberOfPages && number > 0) {
        emit("updateCurrentPage", number + 1);
      }
    };
    const updatePrevPage = (number) => {
      if (number <= props.numberOfPages && number > 1) {
        emit("updateCurrentPage", number - 1);
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
    <p>
      Showing {{ totalRow == 0 ? 0 : startRow }} to
      {{ endRow > totalRow ? totalRow : endRow }} of {{ totalRow }} entries
    </p>
    <ul class="pagination">
      <li @click="updatePrevPage(currentPage)" class="page-item">
        <a class="page-link text-dark" href="#">Previous</a>
      </li>
      <li
        @click="updateCurrentPage(value)"
        :key="index"
        v-for="(value, index) in numberOfPages"
        class="page-item"
      >
        <a
          class="page-link"
          :class="[index == currentPage - 1 ? 'text-blue' : 'text-dark']"
          href="#"
          >{{ value }}</a
        >
      </li>
      <li @click="updateNextPage(currentPage)" class="page-item">
        <a class="page-link text-dark" href="#">Next</a>
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
  padding: 8px 12px;
  background-color: inherit;
  font-size: 14px;
}
.text-dark {
  color: var(--dark);
}
.text-blue {
  color: blue;
}
</style>
