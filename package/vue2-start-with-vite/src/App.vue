<template>
  <div>
    {{ "count:" + count }}
    <button @click="handleClick">click + 1</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    handleClick() {
      this.count++;
    },
  },
};
</script>
