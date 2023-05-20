<script>
import HelloWorld from "./components/HelloWorld.vue";
import { defineComponent, reactive, watch, ref, computed } from "vue";
export default {
  components: {
    HelloWorld,
  },
  setup() {
    const data = reactive({
      data1: 1,
    });
    const data2 = ref('abc');
    const fff = () => {
      console.log("Hello World");
    }
    watch(data2, (newVal, oldVal) => {
      fff();
      console.log(`Name changed from ${oldVal} to ${newVal}`);
    });
    const width = ref(10);
    const height = ref(5);

    const area = computed(() => {
      return width.value * height.value;
    });
    return {
      data,
      data2,
      area
    }
  }
};
</script>

<template>
  {{ area }} {{ data2 }}
  <HelloWorld :active="`false`" @customEvent="(value) => data2 = value" />
</template>

<style scoped></style>

