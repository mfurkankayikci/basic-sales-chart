<script setup lang="ts">
const props = defineProps(["class"]);

const classNames = `section ${props.class}`;
</script>

<template>
  <section :class="classNames">
    <div class="container mx-auto">
      <slot />
    </div>
  </section>
</template>
