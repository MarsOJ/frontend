<script setup>
import RecordService from "@/services/record.service";
</script>

<template>
  <el-main>
    <div class="history">
      <div v-for="item in history">
        <div class="history-block fade-down">
          <div class="history-date">
            <span>{{ item.date }}</span>
          </div>
          <div class="history-detail">
            <div class="history-title">{{ item.rank }}</div>
            <!-- <div class="history-src">
              排名：<strong>{{ item.rank }}</strong>
            </div> -->
          </div>
        </div>
      </div>
      <div
        class="loading history-block fade-down"
        v-loading="loading"
        v-if="!end"
      >
        下拉加载更多
      </div>
      <div class="loading history-block fade-down" v-else>没有更多了</div>
    </div>
  </el-main>
  <el-aside width="360px">
    <div class="block fade-down">
      <h2>答题数据</h2>
      <div>
        <table class="stats-table">
          <tr>
            <td class="label">参与PK场次</td>
            <td class="value">{{ user.totalCompetitionsNum }}</td>
          </tr>
          <tr>
            <td class="label">PK胜场数</td>
            <td class="value">{{ user.totalCompetitionsNum }}</td>
          </tr>
          <tr>
            <td class="label">PK胜率</td>
            <td class="value">{{ user.vicRate }}</td>
          </tr>
        </table>
        <hr class="stats-hr" />
        <table class="stats-table">
          <tr>
            <td class="label">总答题数</td>
            <td class="value">{{ user.totalAnswersNum }}</td>
          </tr>
          <tr>
            <td class="label">正确题数</td>
            <td class="value">{{ user.correctAnswersNum }}</td>
          </tr>
          <tr>
            <td class="label">正确率</td>
            <td class="value">{{ user.correctRate }}</td>
          </tr>
        </table>
      </div>
    </div>
  </el-aside>
</template>

<script>
export default {
  name: "PKHistoryView",
  props: {
    user: Object,
    update: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    update(newVal) {
      if (newVal) {
        this.load();
      }
    },
  },
  data() {
    return {
      end: false,
      loading: true,
      history: [],
      lastHistoryId: "",
    };
  },
  methods: {
    load() {
      if (this.history.length >= 1) {
        this.lastHistoryId = this.history[this.history.length - 1]["id"];
        this.loading = true;
        RecordService.getPersonalRecords(this.lastHistoryId).then(
          (content) => {
            if (content.length == 0) {
              this.end = true;
            } else {
              this.history = this.history.concat(content);
            }
            this.loading = false;
          },
          (error) => {
            var content =
              (error.response && error.response.data) ||
              error.message ||
              error.toString();
            console.log(content);
            this.loading = false;
          }
        );
      }
    },
  },
  mounted() {
    RecordService.getPersonalRecords("").then(
      (content) => {
        if (content.length == 0) {
          this.end = true;
        } else {
          this.history = content;
        }
        this.loading = false;
      },
      (error) => {
        var content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(content);
        this.loading = false;
      }
    );
  },
};
</script>

<style scoped>
.history-block {
  background-color: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 0;
  margin-bottom: 30px;
  padding: 2em;
  transition: all 0.2s ease-in-out;
}

.history-block:hover {
  transform: scale(1.02);
}

.history-block.loading {
  padding: 1em;
  background-image: none;
  background-color: #ffffff;
  color: gray;
  font-weight: bold;
  font-style: italic;
  text-align: center;
}

.history-date {
  font-size: 0.875rem;
  text-align: left;
}

.history-date span {
  padding: 2px 10px;
  color: white;
  background-color: #003235;
  font-weight: bold;
  font-size: small;
}

.history-detail {
  margin-top: 1em;
}

.history-title {
  text-align: left;
  font-weight: bold;
  font-size: 24px;
  margin: 16px 0px;
}

.history-src {
  text-align: left;
  font-weight: normal;
  font-size: 14px;
  color: #b9b9b9;
}

.history-src strong {
  color: #9f9f9f;
}

.block {
  /* display: inline-block; */
  height: fit-content;
  /* margin: 3em 1em; */
  border: 1px solid #e9e9e9;
  color: #64646d;
  background-color: white;
  /* box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.2); */
}

.block h2 {
  display: block;
  text-align: left;
  font-weight: 600;
  word-wrap: break-word;
  margin: 0;
  padding: 16px 20px;
  border-left: 5px solid #00a8b1;
  color: white;
  background-color: #21202e;
}

.block div {
  padding: 1em;
}

.block div.date {
  padding-bottom: 0px;
}

.block div.count-down {
  padding-top: 0px;
  padding-bottom: 2em;
}

.el-main {
  padding-left: 0;
  padding-top: 2em;
}

.el-aside {
  padding-right: 0;
  padding-top: 2em;
  margin-bottom: 2em;
}

.stats-table {
  margin: 12px auto;
  /* margin: auto; */
  width: 70%;
}

.stats-table .label {
  width: 60%;
}

.stats-table .value {
  text-align: right;
}

.stats-hr {
  border: none;
  border-top: 1px dashed #64646d;
  height: 0;
  width: 80%;
}
</style>
