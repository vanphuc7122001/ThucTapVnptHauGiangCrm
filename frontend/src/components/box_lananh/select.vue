<template>
    <div>
      <select class="pl-2 mr-2" v-model="selectedOption" style="padding: 5px">
        <option disabled selected hidden value=""></option>
        <option v-for="(val, index) in field" :key="index" :value="val.value">
          {{ val.name }}
        </option>
      </select>
    </div>
  </template>
  <script>
  import { watch, ref } from "vue";
  export default {
    name: "select",
    props: {
      field: { type: Array },
    },
    setup(props, { emit }) {
      const selectedOption = ref("week");
  
      watch([selectedOption], ([newValue1, oldValue1]) => {
        emit("option", newValue1);
      });
  
      return { selectedOption };
    },
  };
  </script>