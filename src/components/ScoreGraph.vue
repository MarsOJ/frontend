<script>
import { registerTheme } from "echarts";
import VChart from "vue-echarts";
import { ref } from "vue";
import dark from "@/assets/themes/dark.json";

registerTheme("dark", dark);

export default {
  name: "ScoreGraph",
  components: {
    VChart,
  },
  props: {
    history: {
      type: Array,
      required: true,
    },
    users: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      theme: dark,
      option: ref({
        legend: {},
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          name: "题目",
          axisTick: {
            alignWithLabel: true,
          },
          data: null,
        },
        yAxis: {
          type: "value",
          name: "分数",
        },
        series: [],
      }),
    };
  },
  mounted() {
    this.history.forEach((element, index) => {
      if (index == 0) {
        this.option.xAxis.data = element;
      } else {
        this.option.series.push({
          name: this.users[index - 1],
          type: "line",
          data: element,
        });
      }
    });
  },
};
</script>

<template>
  <v-chart class="chart" :option="option" :theme="theme" />
</template>

<style>
.chart {
  height: 300px;
}
</style>
