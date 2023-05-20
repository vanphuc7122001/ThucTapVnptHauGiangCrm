<script>
import { defineProps, inject, watch } from "vue";
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const emit = inject('emit');
    const handleClick = () => {
      ctx.emit('customEvent', 'Hello from ChildComponent');
    };
    return {
      handleClick,
    };
  },
};
</script>

<template>
  <div>
    <button @click="handleClick" type="submit">Button</button>
  </div>
</template>

<style scoped>

</style>
