<template>
  <progress
    v-if="progressMax"
    class="progress progress-warning w-full absolute top-0 z-[999]"
    :value="progressValue"
    :max="progressMax"
  ></progress>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    progressMax: {
      type: Number,
      default: 0,
    },
    progressValue: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style lang="scss" scoped></style>
