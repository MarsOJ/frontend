<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
</script>

<template>
  <div class="common-layout">
    <el-container class="main-container">
      <NaviBar />
      <el-main class="main">
        <div class="block">
          对局编号： {{ pkId }}
          <!-- 需要判断是否是自己，确定是否获胜。否则无法查看 -->
          <div class="result">
            <span class="title score score-left">
              {{ stats.users[0].points }}
            </span>
            <div class="title user">
              <img class="user-pic" src="../assets/user.png" />
              <div :class="{ win: stats.users[0].win }"></div>
              <div>{{ stats.users[0].name }}</div>
            </div>
            <span class="title result-msg" v-if="userWin">你赢了！</span>
            <span class="title result-msg" v-else>你输了！</span>
            <div class="title user">
              <img class="user-pic" src="../assets/user.png" />
              <div :class="{ win: stats.users[1].win }"></div>
              <div>{{ stats.users[1].name }}</div>
            </div>
            <span class="title score score-right">
              {{ stats.users[1].points }}
            </span>
          </div>
          <div class="problems">
            <div v-for="problem in stats.problems" class="problem">
              <span class="score score-left" :class="{ correct: problem.points[0] > 0, wrong: problem.points[0] <= 0 }">
                {{ problem.points[0] }}
              </span>
              <div class="problem-title">
                <el-collapse>
                  <el-collapse-item :title="problem.num + '.' + problem.title" name="1">
                    题目内容会在打开后再单独加载！
                  </el-collapse-item>
                </el-collapse>
              </div>
              <span class="score score-right"
                :class="{ correct: problem.points[1] > 0, wrong: problem.points[1] <= 0 }">
                {{ problem.points[1] }}
              </span>
            </div>
          </div>
        </div>
      </el-main>
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
      pkId: null,
      userWin: true,
      stats: {
        users: [
          { name: "user1", points: 58, win: true },
          { name: "user2", points: 40, win: false },
        ],
        problems: [
          {
            num: 1,
            id: 12345,
            title: "这是一道题目",
            points: [10, 5],
          },
          {
            num: 2,
            id: 12346,
            title: "这是一道题目",
            points: [7, 10],
          },
          {
            num: 3,
            id: 12348,
            title: "这是一道题目",
            points: [0, 10],
          },
        ]
      }
    }
  },
  mounted() {
    this.pkId = this.$route.params.id;
  }
}
</script>

<style scoped>
.main {
  display: flex;
  justify-content: center;
}

.block {
  width: 800px;
}

.result {
  height: 128px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: large;
  font-weight: bolder;
}

.score {
  width: 120px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.score-left {
  text-align: right;
}

.score-right {
  text-align: left;
}

.user {
  width: 200px;
  text-align: center;
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
  left: 80px;
}

.result-msg {
  text-align: center;
  flex-grow: 1;
}

.score-left.correct {
  background: url();
}

.score-left.correct {}

.score-right.wrong {}

.score-right.wrong {}



.problem {
  display: flex;
}

.problem-title {
  flex-grow: 1;
  margin: 0px 20px 0px 20px;
}
</style>