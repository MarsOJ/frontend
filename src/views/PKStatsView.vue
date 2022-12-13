<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import LeaderSideBar from "@/components/LeaderSideBar.vue";
import FavoriteService from "@/services/favorites.service";
import { ElMessage } from "element-plus";
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <el-scrollbar>
        <div ref="mainpage">
          <NaviBar />
          <el-container class="page-main">
            <el-main class="main">
              <el-scrollbar>
                <div class="block" v-loading="loading">
                  <div class="title-result" v-if="stats">
                    <span class="title" v-if="userRank == 1"
                      >恭喜，你在比赛中取得胜利！</span
                    >
                    <span class="title" v-else
                      >很遗憾，您获得了第{{ userRank }}名。</span
                    >
                    <span class="user">
                      <img class="user-pic" src="../assets/user.png" />
                      <div class="win" v-if="userRank == 1"></div>
                      <div>{{ stats.points[userRank - 1].name }}</div>
                    </span>
                  </div>
                  <!-- <div class="detail-result" v-if="stats">
                  本次比赛奖励：经验+5
                </div> -->
                  <!-- <h2 v-if="stats">答题详情</h2> -->
                  <div class="problems" v-if="stats">
                    <div class="problem">
                      <span class="score">分数</span>
                      <div class="problem-title">题目</div>
                    </div>
                    <div v-for="problem in stats.problems" class="problem">
                      <span
                        class="score"
                        :class="{
                          correct: problem.correct,
                          wrong: !problem.correct,
                        }"
                      >
                        {{ problem.userPoints }}
                      </span>
                      <div class="problem-title">
                        <el-collapse>
                          <el-collapse-item
                            :title="problem.title"
                            :name="problem.num"
                          >
                            <div class="problem-content">
                              <div class="question-box">题干在这里</div>
                              <div class="option-box">选项在这里</div>
                              <div class="button-box">
                                <el-button
                                  type="primary"
                                  @click="this.addToFavorite(problem.id)"
                                  >收藏习题</el-button
                                >
                              </div>
                            </div>
                          </el-collapse-item>
                        </el-collapse>
                      </div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </el-main>
            <el-aside class="aside">
              <LeaderSideBar :data="stats.points" v-if="stats" />
            </el-aside>
          </el-container>
          <Footer />
        </div>
      </el-scrollbar>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "PKStatsView",
  computed: {
    users() {
      return this.$store.state.competition.users;
    },
    userIndex() {
      return this.$store.state.competition.index;
    },
  },
  data() {
    return {
      loading: true,
      userRank: 1,
      stats: null,
      types: ["单项选择题", "阅读程序题", "完善程序题"],
    };
  },
  methods: {
    addToFavorite(id) {
      FavoriteService.addProblem("0", id).then((code) => {
        if (code == 200) {
          ElMessage({
            message: "收藏成功！",
            type: "success",
          });
        } else {
          ElMessage({
            message: "收藏失败！",
            type: "error",
          });
        }
      });
    },
  },
  mounted() {
    this.$store.dispatch("competition/send", { type: "result" });
    this.$store.dispatch("competition/setHandlerOnce", {
      type: "result",
      func: (data) => {
        console.log("[vue] (result)", data);
        data.points.forEach((user, i) => {
          user.isUser = this.userIndex === i;
        });
        data.points.sort((a, b) => {
          return a.points < b.points
            ? 1
            : b.points < a.points
            ? -1
            : a.isUser < b.isUser
            ? 1
            : a.isUser > b.isUser
            ? -1
            : 0;
        });
        data.points.forEach((user, i) => {
          if (user.isUser) {
            this.userRank = i + 1;
          }
        });
        data.problems.forEach((problem) => {
          problem.userPoints = problem.points[this.userIndex].reduce(
            (a, x) => a + x
          );
          problem.correct = problem.points[this.userIndex].reduce(
            (a, x) => a && x > 0
          );
          problem.sum = problem.points
            .reduce((a, x) => a.concat(x))
            .reduce((a, x) => a + x);
          problem.correctSum = problem.points
            .map((x) => x.reduce((a, x) => a && x > 0, true))
            .reduce((a, x) => a + x);
          problem.title =
            problem.num +
            1 +
            ". [" +
            this.types[problem.type] +
            "] 正确率：" +
            Math.round((problem.correctSum / problem.points.length) * 100) +
            "% 平均分：" +
            (problem.sum / problem.points.length).toFixed(2);
        });
        this.stats = data;
        this.loading = false;
        this.$store.dispatch("competition/closeSocket");
      },
    });
  },
};
</script>

<style scoped>
.common-layout {
  position: relative;
  height: 100vh;
}

.page-main {
  padding-left: 2em;
  padding-right: 2em;
}

.main {
  display: flex;
  justify-content: center;
  width: 100%;
}

.aside {
  width: 30vw;
  min-width: 356px;
  max-width: 480px;
}

.block {
  width: 50vw;
  /* width: 800px; */
}

.title {
  font-size: 28px;
  font-weight: bolder;
}

.title-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3em;
  margin-bottom: 3em;
}

.user {
  width: 100px;
  text-align: center;
  display: inline-block;
  position: relative;
}

.user-pic {
  width: 50px;
  border: gray 4px solid;
  border-radius: 29px;
  margin: -5px;
}

.win {
  width: 40px;
  height: 30px;
  background: url(../assets/crown.png) no-repeat center center;
  background-size: 100% 100%;
  position: absolute;
  top: -26px;
  left: 30px;
}

.detail-result {
  margin: 3em;
}

.score {
  width: 50px;
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: right;
}

.score.correct {
  background: url(../assets/correct.png) no-repeat center left;
  background-size: contain;
}

.score.wrong {
  background: url(../assets/wrong.png) no-repeat center left;
  background-size: contain;
}

.problem {
  display: flex;
  align-items: center;
}

.problem-title {
  flex-grow: 1;
  margin: 0px 20px 0px 20px;
}

.problem-content {
  padding: 1em 1em 0 1em;
}

.question-box {
  font-weight: bold;
}

.button-box {
  display: flex;
  flex-direction: row-reverse;
}

@media (max-width: 1000px) {
  .page-main {
    flex-direction: column;
    align-items: center;
  }

  .block {
    width: 80vw;
  }
}

@media (max-width: 640px) {
  .page-main {
    padding-left: 1em;
    padding-right: 1em;
  }

  .title {
    font-size: 24px;
  }
}

@media (max-width: 550px) {
  .page-main {
    padding-left: 0;
    padding-right: 0;
  }

  .main {
    width: 90vw;
  }

  .title-result {
    display: flex;
    flex-direction: column-reverse;
  }

  .title {
    font-size: 20px;
  }
}
</style>

<style>
.el-collapse-item__header {
  padding-left: 1em;
  font-size: 16px;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .el-collapse-item__header {
    font-size: 12px;
  }
}

@media (max-width: 550px) {
  .el-collapse-item__header {
    font-size: 10px;
  }
}
</style>
