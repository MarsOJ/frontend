<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import LeaderSideBar from "@/components/LeaderSideBar.vue";
</script>

<template>
  <div class="common-layout">
    <el-container class="main-container">
      <NaviBar />
      <el-container class="page-main">
        <el-main class="main" v-if="!loading">
          <div class="block">
            <!-- 对局编号： {{ pkId }} -->
            <div class="title-result">
              <span class="title" v-if="userRank == 1"
                >恭喜，你在比赛中取得胜利！</span
              >
              <span class="title" v-else
                >很遗憾，您在比赛中获得了第{{ userRank }}名。</span
              >
              <span class="user">
                <img class="user-pic" src="../assets/user.png" />
                <div class="win"></div>
                <div>{{ stats.points[userRank - 1].name }}</div>
              </span>
            </div>
            <div class="detail-result">本次比赛奖励：经验+5</div>

            <h2>答题详情</h2>
            <div class="problems">
              <div class="problem">
                <span class="score">分数</span>
                <div class="problem-title">题目</div>
              </div>
              <div v-for="problem in stats.problems" class="problem">
                <span
                  class="score"
                  :class="{
                    correct: problem.points[userRank - 1] > 0,
                    wrong: problem.points[userRank - 1] <= 0,
                  }"
                >
                  {{ problem.points[userRank - 1] }}
                </span>
                <div class="problem-title">
                  <el-collapse>
                    <el-collapse-item
                      :title="problem.num + '.' + problem.title"
                      name="1"
                    >
                      <div class="problem-content">
                        <div class="question-box">题干在这里</div>
                        <div class="option-box">选项在这里</div>
                        <div class="button-box">
                          <el-button type="primary">收藏习题</el-button>
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
            </div>
          </div>
          <el-aside class="aside">
            <LeaderSideBar :data="stats.points" :userRank="userRank" />
          </el-aside>
        </el-main>
      </el-container>
      <el-footer class="page-footer">
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "PKStatsView",
  data() {
    return {
      // pkId: null,
      loading: true,
      userRank: 1,
      stats: null,
    };
  },
  mounted() {
    // this.pkId = this.$route.params.id;
    this.$store.dispatch("competition/send", {
      type: "over",
      content: {},
    });
    this.$store.dispatch("competition/setHandlerOnce", {
      type: "result",
      func: (data) => {
        console.log("[vue]", data);
        this.stats = data;
        this.loading = false;
        this.$store.dispatch("competition/closeSocket");
      },
    });
  },
};
</script>

<style scoped>
.main {
  display: flex;
  justify-content: center;
}

.aside {
  width: 30vw;
  min-width: 420px;
}

.block {
  width: 800px;
}

.title {
  font-size: xx-large;
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
  padding: 1em;
}

.question-box {
  font-weight: bold;
}

.button-box {
  display: flex;
  flex-direction: row-reverse;
}
</style>
