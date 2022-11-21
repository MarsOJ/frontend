<template>
  <a class="scroll-up" :class="{
    'appear': display,
    'disappear': !display,
  }" @click="scrollUp();">
    <img src="../assets/right-arrow.png" />
    <i class="fa fa-chevron-up"></i>
  </a>
</template>

<script>
export default {
  props: {
    display: Boolean,
  },
  emits: ["scrollup"],
  methods: {
    scrollUp() {
      this.$emit("scrollup");
    }
  }
}
</script>

<style scoped>
.scroll-up {
  display: inline;
  border-radius: 0px;
  bottom: 0px;
  padding: 3px;
  height: 40px;
  opacity: 1;
  position: fixed;
  right: 60px;
  text-align: center;
  width: 60px;
  overflow: hidden;
  z-index: 9999;
  color: #ffffff;
  background-color: #00a8b1;
  font-size: 1.000rem;
  line-height: 1.9;
  cursor: pointer;
}

.scroll-up img {
  margin-top: 8px;
  width: 30%;
  transform: rotate(-90deg);
  filter: invert(1);
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.appear {
  animation: fadeIn ease 0.3s;
  animation-fill-mode: forwards;
}

.disappear {
  animation: fadeOut ease 0.3s;
  animation-fill-mode: forwards;
}
</style>