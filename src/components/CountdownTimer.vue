<template>
  <div id="counting" class="fade-in">
    <div class="counting-block fade-in">
      <div class="counter">
        <div class="nums">
          <span v-for="num in numbers">{{ num }}</span>
        </div>
        <h4>准备！</h4>
      </div>
      <div class="final">
        <h1>GO</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CountdownTimer",
  emits: ["end"],
  props: {
    value: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    numbers() {
      return [...Array(this.value + 1).keys()].reverse();
    },
  },
  mounted() {
    const nums = document.querySelectorAll(".nums span");
    const counter = document.querySelector(".counter");
    const finalMessage = document.querySelector(".final");
    const penultimate = nums.length - 1;
    nums[0].classList.add("in");
    nums.forEach((num, idx) => {
      num.addEventListener("animationend", (e) => {
        if (e.animationName.startsWith("goIn") && idx !== penultimate) {
          num.classList.remove("in");
          num.classList.add("out");
        } else if (
          e.animationName.startsWith("goOut") &&
          num.nextElementSibling
        ) {
          num.nextElementSibling.classList.add("in");
        } else {
          counter.classList.add("hide");
          finalMessage.classList.add("show");
          this.$emit("end");
        }
      });
    });
  },
};
</script>

<style scoped>
#counting {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.counting-block {
  width: 100px;
  height: 100px;
  padding: 2em;
  color: #21202e;
  background-color: white;
  box-shadow: 0px 0px 20px gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
}

.counter {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.counter.hide {
  transform: translate(-50%, -50%) scale(0);
  animation: hide 0.2s ease-out;
}

@keyframes hide {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    transform: translate(-50%, -50%) scale(0);
  }
}

.final {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
}

.final.show {
  transform: translate(-50%, -50%) scale(1);
  animation: show 0.3s ease-in;
}

@keyframes show {
  0% {
    transform: translate(-50%, -50%) scale(0);
  }

  80% {
    transform: translate(-50%, -50%) scale(1.4);
  }

  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

.nums {
  color: #3498db;
  position: relative;
  font-size: 50px;
  overflow: hidden;
  width: 250px;
  height: 50px;
}

.nums span {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(120deg);
  transform-origin: bottom center;
}

.nums span.in {
  transform: translate(-50%, -50%) rotate(0deg);
  animation: goIn 0.5s ease-in-out;
}

.nums span.out {
  animation: goOut 0.5s ease-in-out;
}

@keyframes goIn {
  0% {
    transform: translate(-50%, -50%) rotate(120deg);
  }

  30% {
    transform: translate(-50%, -50%) rotate(-20deg);
  }

  60% {
    transform: translate(-50%, -50%) rotate(10deg);
  }

  90%,
  100% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
}

@keyframes goOut {
  0%,
  30% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  60% {
    transform: translate(-50%, -50%) rotate(20deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(-120deg);
  }
}

h4 {
  font-size: 20px;
  margin: 5px;
  text-transform: uppercase;
}
</style>
