<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import LeaderSideBar from "@/components/LeaderSideBar.vue";
import ScoreGraph from "@/components/ScoreGraph.vue";
import FavoriteService from "@/services/favorites.service";
import ProblemService from "@/services/problem.service";
import { marked } from "marked";
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical" class="page">
      <el-scrollbar>
        <div ref="mainpage">
          <NaviBar />
          <el-container class="page-main">
            <el-main class="main" v-if="stats">
              <div class="title-result">
                <span class="title" v-if="userRank == 1">恭喜，你在比赛中取得胜利！</span>
                <span class="title" v-else>很遗憾，您获得了第{{ userRank }}名。</span>
                <span class="user">
                  <img class="user-pic" src="../assets/user.png" />
                  <div class="win" v-if="userRank == 1"></div>
                  <div>{{ stats.points[userRank - 1].name }}</div>
                </span>
              </div>
              <div class="stats">
                <h2>比赛统计</h2>
                <div class="content">
                  <div class="graph-wrapper">
                    <ScoreGraph :history="scoreHistory" :users="usernames" />
                  </div>
                  <div class="leader-wrapper">
                    <LeaderSideBar :data="stats.points" :columns="[
                      { prop: 'name', label: '用户名', width: '120' },
                      { prop: 'points', label: '积分', width: '80' },
                    ]" v-if="stats">PK积分榜</LeaderSideBar>
                  </div>
                </div>
              </div>
              <div class="problems">
                <h2>题目详情</h2>
                <div class="content">
                  <div class="block selector">
                    <el-scrollbar>
                      <div>
                        <div v-for="problem in stats.problems" class="problem-no" :class="{
                          selected: problemNum == problem.num,
                          correct: problem.correct,
                          wrong: !problem.correct,
                        }" @click="loadProblem(problem.num);">
                          <span class="number">
                            {{ problem.num + 1 }}. {{ types[problem.type] }}&nbsp;&nbsp;
                          </span>
                          <span class="comment">
                            正确率 {{ problem.correctRate }}%
                          </span>
                        </div>
                      </div>
                    </el-scrollbar>
                  </div>
                  <div class="block problem" v-loading="loading">
                    <el-scrollbar>
                      <div v-if="currProblem.content">
                        <div class="problem-title" v-if="currProblem.content.classification >= 0">
                          <span>{{ currProblem.num + 1 }}. {{ types[currProblem.type] }}</span>
                          <!-- <el-button type="primary" @click="addToFavorite(problemNum);">收藏本题</el-button> -->
                          <el-dropdown>
                            <span class="el-dropdown-link">
                              <small>
                                收藏本题
                                <el-icon class="el-icon--right"><arrow-down /></el-icon>
                              </small>
                            </span>
                            <template #dropdown>
                              <el-dropdown-menu>
                                <el-dropdown-item v-for="fav in favLists" @click="addToFavorite(fav.id, problemNum)">{{
                                    fav.name
                                }}</el-dropdown-item>
                              </el-dropdown-menu>
                            </template>
                          </el-dropdown>
                        </div>
                        <div class="problem-stats" v-if="currProblem.content.classification >= 0">
                          <small>你的得分 {{ currProblem.userPoints }}</small>
                          &nbsp;&nbsp;
                          <small>平均得分 {{ currProblem.average }}</small>
                        </div>
                        <hr v-if="currProblem.content.classification >= 0" />
                        <div v-if="currProblem.content.classification === -1">
                          题目不存在
                        </div>
                        <div v-else-if="currProblem.content.classification <= 1">
                          <span class="problem-text">{{ currProblem.content.content }}</span>
                          <div v-html="codeHtml"></div>
                          <div v-for="(sp, index) in currProblem.content.subproblem">
                            <span class="problem-text">{{ sp.content }}</span>
                            <div class="answer" v-if="sp.choice.length === 4">
                              <ol type="A">
                                <li v-for="(c, i) in sp.choice"
                                  :class="{ correct: String.fromCharCode(65 + i) === currProblem.content.answer[index] }">
                                  &nbsp;&nbsp;{{ c }}
                                </li>
                              </ol>
                            </div>
                            <div class="answer" v-else>
                              <el-radio-group v-model="sp.radio" size="large">
                                <el-radio label="A">正确</el-radio>
                                <el-radio label="B">错误</el-radio>
                              </el-radio-group>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-scrollbar>
                  </div>
                </div>
              </div>
            </el-main>
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
  components: { ScoreGraph, LeaderSideBar, NaviBar, Footer },
  computed: {
    users() {
      return this.$store.state.competition.users;
    },
    userIndex() {
      return this.$store.state.competition.index;
    },
    codeHtml() {
      if (this.currProblem.content.code) {
        return marked.parse(this.currProblem.content.code);
      }
      else {
        return "";
      }
    },
  },
  data() {
    return {
      loading: true,
      userRank: 1,
      stats: null,
      types: ["单项选择题", "阅读程序题", "完善程序题"],
      scoreHistory: [],
      usernames: [],
      problemNum: 0,
      currProblem: null,
      favLists: [],
    };
  },
  methods: {
    addToFavorite(favId, id) {
      FavoriteService.addProblem(favId, this.stats.problems[id].id).then((data) => {
        if (data[0]) {
          ElMessage({
            message: "收藏成功！",
            type: "success",
          });
        }
        else if (data[1]) {
          ElMessage({
            message: "已经收藏过该题目！",
            type: "info",
          });
        }
        else {
          ElMessage("收藏习题失败！", "收藏失败", {
            confirmButtonText: "确认",
          });
        }
      }, (error) => {
        var msg =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        ElMessageBox.alert(msg, "收藏失败", {
          confirmButtonText: "确认",
        });
      });
    },
    loadProblem(id) {
      this.problemNum = id;
      this.currProblem = this.stats.problems[id]
      if (!this.currProblem.content) {
        this.loading = true;
        this.fetchProblem(id);
      }
    },
    fetchProblem(id) {
      ProblemService.getProblemDetail(this.stats.problems[id].id).then((content) => {
        this.stats.problems[id].content = content;
        this.loading = false;
      }, (error) => {
        this.stats.problems[id].content = {
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
          classification: -1,
        };
        console.log(this.stats.problems[id].content);
        this.loading = false;
      });
    },
  },
  mounted() {
    this.$store.dispatch("competition/send", { type: "result" });
    this.$store.dispatch("competition/setHandlerOnce", {
      type: "result",
      func: (data) => {
        // var data = { "points": [{ "name": "tester2", "points": 78, "isUser": false }, { "name": "tester", "points": 75, "isUser": true }], "problems": [{ "num": 0, "id": "637b53da7acf78b360bf9979", "type": 0, "points": [[0], [0]], "userPoints": 0, "correct": 0, "sum": 0, "correctSum": 0, "title": "1. [单项选择题] 正确率：0% 平均分：0.00", "content": { "title": "", "classification": 0, "submit_date": "2022-11-21", "last_modified_date": "2022-11-21", "content": "香港的顶级域名是：", "subproblem": [{ "choice": [".cn", ".hk", ".us", ".com"], "content": "" }], "answer": ["B"], "explanation": "us", "source": "CSP-J", "owner": "panda", "nSubmit": 0, "nAccept": 0, "correct_rate": 0, "tag": ["常识"], "difficultyInt": 1, "hidden_mod": -1, "id": "637b53da7acf78b360bf9979" }, "subproblem": [] }, { "num": 1, "id": "637b53c93151282f5587bee4", "type": 0, "points": [[0], [0]], "userPoints": 0, "correct": 0, "sum": 0, "correctSum": 0, "title": "2. [单项选择题] 正确率：0% 平均分：0.00", "content": { "title": "", "classification": 0, "submit_date": "2022-11-21", "last_modified_date": "2022-11-21", "content": "美国的国家顶级域名是：", "subproblem": [{ "choice": [".cn", ".hk", ".us", ".com"], "content": "" }], "answer": ["C"], "explanation": "us", "source": "CSP-J", "owner": "panda", "nSubmit": 0, "nAccept": 0, "correct_rate": 0, "tag": ["常识"], "difficultyInt": 1, "hidden_mod": -1, "id": "637b53c93151282f5587bee4" }, "subproblem": [] }, { "num": 2, "id": "637b53979677ac4804cae6ce", "type": 0, "points": [[39], [38]], "userPoints": 38, "correct": 38, "sum": 77, "correctSum": 2, "title": "3. [单项选择题] 正确率：100% 平均分：38.50", "content": { "title": "", "classification": 0, "submit_date": "2022-11-21", "last_modified_date": "2022-11-21", "content": "中国的国家顶级域名是：", "subproblem": [{ "choice": [".cn", ".hk", ".us", ".com"], "content": "" }], "answer": ["A"], "explanation": "china", "source": "CSP-J", "owner": "panda", "nSubmit": 0, "nAccept": 0, "correct_rate": 0, "tag": ["常识"], "difficultyInt": 1, "hidden_mod": -1, "id": "637b53979677ac4804cae6ce" }, "subproblem": [] }, { "num": 3, "id": "6386fced3338f90d0c6e4c02", "type": 1, "points": [[0, 0, 39], [0, 0, 37]], "userPoints": 37, "correct": 0, "sum": 76, "correctSum": 0, "title": "4. [阅读程序题] 正确率：0% 平均分：38.00", "content": { "title": "", "classification": 1, "submit_date": "2022-11-30", "last_modified_date": "2022-11-30", "content": "判断以下命题", "subproblem": [{ "choice": [".cn", ".hk", ".us", ".com"], "content": "香港的顶级域名是：" }, { "choice": [".cn", ".hk", ".us", ".com"], "content": "美国的顶级域名是：" }, { "choice": [".cn", ".hk", ".us", ".com"], "content": "中国的顶级域名是：" }], "answer": ["B", "C", "A"], "explanation": "hk for .hk, us for .us, cn for .cn", "source": "CSP-J", "owner": "panda", "nSubmit": 0, "nAccept": 0, "correct_rate": 0, "tag": ["常识"], "difficultyInt": 1, "hidden_mod": -1, "id": "6386fced3338f90d0c6e4c02" }, "subproblem": [] }] };
        console.log("[vue] (result)", data);

        // Sort all players
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

        // Calculate correct rates
        data.problems.forEach((problem) => {
          problem.userPoints = problem.points[this.userIndex].reduce((a, x) => a + x);
          problem.correct = problem.points[this.userIndex].reduce((a, x) => a && x > 0);
          problem.sum = problem.points
            .reduce((a, x) => a.concat(x))
            .reduce((a, x) => a + x);
          problem.correctSum = problem.points
            .map((x) => x.reduce((a, x) => a && x > 0, true))
            .reduce((a, x) => a + x);
          problem.correctRate = Math.round((problem.correctSum / problem.points.length) * 100);
          problem.average = Math.round(problem.sum / problem.points.length);
          problem.content = null;
        });

        // Calculate score history
        this.scoreHistory.push([...Array(data.problems.length + 1).keys()]);
        data.points.forEach((_element, index) => {
          var history = [0];
          var lastScore = 0;
          data.problems.forEach(problem => {
            lastScore += problem.points[index].reduce((a, x) => a + x);
            history.push(lastScore);
          })
          this.scoreHistory.push(history);
        });

        // Username lists
        this.usernames = [];
        data.points.forEach(element => {
          this.usernames.push(element.name);
        })

        // Get favorite lists
        FavoriteService.getFavoriteList().then((data) => {
          this.favLists = data;
        }, (error) => {
          var msg =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          ElMessageBox.alert(msg, "获取收藏夹列表失败", {
            confirmButtonText: "确认",
          });
        });

        this.stats = data;
        this.loadProblem(0);
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

.page {
  background: url(@/assets/bg_battle.png) center center;
  background-size: cover;
}

.page-main {
  padding-left: 2em;
  padding-right: 2em;
}

.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;
}

.title-result {
  width: 30vw;
  min-width: 550px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3em;
  margin-bottom: 1em;
  color: white;
}

.title {
  font-size: 28px;
  font-weight: bolder;
}

.user {
  width: 100px;
  text-align: center;
  display: inline-block;
  position: relative;
}

.user .user-pic {
  width: 50px;
  border: gray 4px solid;
  border-radius: 29px;
  margin: -5px;
  background-color: white;
}

.user .win {
  width: 40px;
  height: 30px;
  background: url(../assets/crown.png) no-repeat center center;
  background-size: 100% 100%;
  position: absolute;
  top: -26px;
  left: 30px;
}

.stats,
.problems {
  width: 75vw;
  margin: 2em 0;
  display: flex;
  border-radius: 16px;
  filter: dropshadow(0px 0px 0px 3px #00a8b1);
  box-shadow: 0px 0px 0px 3px #00a8b1;
  /* border: #00a8b1 3px solid; */
  background-color: #121212ca;
  overflow: hidden;
}

.stats h2,
.problems h2 {
  text-align: center;
  color: #fafafa;
  background-origin: border-box;
  background-color: #00a8b1;
  writing-mode: vertical-rl;
  letter-spacing: 2px;
  text-orientation: upright;
  padding: 0 16px;
  margin: 0;
  /* margin: 0 0 0 16px; */
  border-right: #00a8b1 3px solid;
}

.stats .content,
.problems .content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stats .content {
  padding: 1em;
}

.graph-wrapper {
  width: 600px;
  height: 450px;
}

.leader-wrapper {
  width: 350px;
  display: flex;
  justify-content: center;
}

.problems {
  height: 500px;
}

.problems .content .block {
  height: 100%;
  box-sizing: border-box;
}

.problems .content .block.selector {
  flex-basis: 0;
  flex-grow: 1;
  color: #dadada;
  padding: 12px 0 12px 12px;
}

.problems .content .block.selector .problem-no {
  padding: 12px 0 12px 32px;
  border-top: #333333 1px solid;
  border-bottom: #333333 1px solid;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.problems .content .block.selector .problem-no:hover {
  background-color: #7472725a;
}

.problems .content .block.selector .problem-no.selected {
  border-right: whitesmoke 12px solid;
  background-color: #504e4e5a;
}

.problem-no.correct {
  background: url(../assets/correct.png) no-repeat center left;
  background-size: 24px;
}

.problem-no.wrong {
  background: url(../assets/wrong.png) no-repeat center left;
  background-size: 24px;
}

.problem-no span {
  display: inline-block;
}

.problems .content .block.problem {
  flex-basis: 0;
  flex-grow: 3;
  background-color: whitesmoke;
  padding: 28px;
  font-size: 18px;
}

li.correct {
  color: #00a8b1;
  font-weight: bold;
}

.problem-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.problem-title span {
  line-height: 48px;
  font-size: 24px;
  font-weight: bold;
  color: #21202e;
}

.problem-title .el-button {
  background-color: #00a8b1;
}

.problem-title .el-dropdown-link {
  color: #00a8b1;
}

.problem-stats {
  color: #6e6e6e;
}

.block.problem hr {
  border: none;
  border-top: #21202e 1px solid;
  margin: 24px 0;
}
</style>
