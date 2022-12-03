<script setup></script>

<template>
  <div id="loading" class="fade-in">
    <div class="loading-block fade-in">
      <div id="loading-image"></div>
      <div id="loading-info">
        <div v-for="(condition, index) in cond">
          <div v-if="condition">
            {{ msg[index] }}
          </div>
        </div>
      </div>
      <div id="loading-remarks">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cond: {
      type: Array,
      required: true,
    },
    msg: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
#loading {
  position: absolute;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-block {
  width: 300px;
  padding: 2em;
  color: #21202e;
  background-color: white;
  /* border: #21202e 3px solid; */
  /* border-radius: 10px; */
  box-shadow: 0px 0px 20px gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
}

#loading-remarks {
  margin: 16px;
}

#loading-image {
  width: 108px;
  height: 108px;
  background: url(@/assets/bean-eater-loading.gif) center center no-repeat;
  background-size: contain;
}

#loading-info {
  font-size: x-large;
}
</style>
