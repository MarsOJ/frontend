<template>
  <div class="hair-salon-bar-container">
    <div
      :style="{ width: `${width}px`, height: `${height}px`, '--score': score }"
      class="bar"
    ></div>
  </div>
</template>

<script>
export default {
  name: "ScoreBar",
  props: {
    width: {
      type: [String, Number],
      required: true,
    },
    height: {
      type: [String, Number],
      required: true,
    },
    score: {
      type: String,
      default: "100px",
    },
  },
};
</script>

<style lang="scss" scoped>
$main-color: #4169aa;
$sub-color: #c29292;
.bar {
  position: relative;
  margin: auto;
  border-radius: 20px;
  background: $main-color;
  overflow: hidden;

  &::before {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    width: 200px;
    height: 1400px;
    background: repeating-linear-gradient(
        45deg,
        $sub-color,
        $sub-color 10px,
        transparent 11px,
        transparent 19px,
        $sub-color 20px
      )
      no-repeat 0 0;
    animation: move 1s linear infinite;
  }
}

@keyframes move {
  from {
    background-position: -56px var(--score);
  }
  to {
    background-position: 0 var(--score);
  }
}
</style>
