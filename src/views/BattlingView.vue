<script setup>
import CountdownTimer from "@/components/CountdownTimer.vue";
import RealTimeScoreboard from "@/components/RealTimeScoreboard.vue";
import ScoreGraph from "@/components/ScoreGraph.vue";
import { ref } from "vue";
</script>

<template>
  <div class="common-layout">
    <CountdownTimer v-if="waiting" @end="endOfCountdown" />
    <div class="sidebar-bg fade-in" @click="toggleSidebar()" v-if="showRanking"></div>
    <el-container direction="vertical" class="page">
      <img id="logo" src="@/assets/main-logo.png" />
      <div class="main">
        <el-container>
          <el-aside class="block aside">
            <h2>对局信息</h2>
            <el-scrollbar ref="logScrollbar">
              <div class="block-content" ref="logContent">
                <div v-for="log in logs">
                  <div :class="`log-${log.type}`">
                    <small>[{{ log.time }}]</small> {{ log.content }}
                  </div>
                </div>
                <div>&nbsp;</div>
                <!-- <div>&nbsp;</div> -->
              </div>
            </el-scrollbar>
          </el-aside>
          <el-main class="block content">
            <h2 v-if="problem.type == 0">
              {{ problem.problemID + 1 }}. 单项选择题
            </h2>
            <h2 v-if="problem.type == 1">
              {{ problem.problemID + 1 }}. 阅读程序题
            </h2>
            <h2 v-if="problem.type == 2">
              {{ problem.problemID + 1 }}. 完善程序题
            </h2>
            <el-scrollbar>
              <div class="block-content">
                <div v-if="problem.type === 0">
                  <span class="problem-text">{{ problem.content }}</span>
                  <div class="answer" v-if="problem.subproblem[0].choice.length === 4">
                    <el-radio-group v-model="problem.subproblem[0].radio" size="large">
                      <el-radio label="A">{{
                          problem.subproblem[0].choice[0]
                      }}</el-radio>
                      <el-radio label="B">{{
                          problem.subproblem[0].choice[1]
                      }}</el-radio>
                      <el-radio label="C">{{
                          problem.subproblem[0].choice[2]
                      }}</el-radio>
                      <el-radio label="D">{{
                          problem.subproblem[0].choice[3]
                      }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="answer" v-else>
                    <el-radio-group v-model="problem.subproblem[0].radio" size="large">
                      <el-radio label="A">正确</el-radio>
                      <el-radio label="B">错误</el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div v-else-if="problem.type === 1">
                  <span class="problem-text">{{ problem.content }}</span>
                  <div v-for="sp in problem.subproblem">
                    <span class="problem-text">{{ sp.content }}</span>
                    <div class="answer" v-if="sp.choice.length === 4">
                      <el-radio-group v-model="sp.radio" size="large">
                        <el-radio label="A">{{ sp.choice[0] }}</el-radio>
                        <el-radio label="B">{{ sp.choice[1] }}</el-radio>
                        <el-radio label="C">{{ sp.choice[2] }}</el-radio>
                        <el-radio label="D">{{ sp.choice[3] }}</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="answer" v-else>
                      <el-radio-group v-model="sp.radio" size="large">
                        <el-radio label="A">正确</el-radio>
                        <el-radio label="B">错误</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
                <div v-else></div>
              </div>
            </el-scrollbar>
            <div id="new-msg" class="prompt hidden fade-in" :class="{ enabled: showPrompt }" v-if="answer[2]">
              <div class="icon">&#9872;</div>
              新的习题！
            </div>
            <div id="timeout-msg" class="prompt hidden fade-in" :class="{ enabled: showPrompt }" v-else-if="answer[1]">
              <div class="icon">&times;</div>
              回答超时！
            </div>
            <div id="correct-msg" class="prompt hidden fade-in" :class="{ enabled: showPrompt }" v-else-if="answer[0]">
              <div class="icon">
                <div id="tick"></div>
              </div>
              回答正确！
            </div>
            <div id="wrong-msg" class="prompt hidden fade-in" :class="{ enabled: showPrompt }" v-else>
              <div class="icon">&times;</div>
              回答错误！
            </div>
          </el-main>
        </el-container>
      </div>
      <div class="top left button enabled" @click="onExit">
        <span>退出</span>
      </div>
      <div class="top right button disabled-button" :class="{
        enabled: !submitted,
      }">
        <span :class="`${progressBarStatus}`">
          <div class="pie" :style="{ '--percentage': `${progress}%` }"></div>
          <div>
            {{ new Date(seconds * 1000).toISOString().substring(14, 19) }}
          </div>
        </span>
      </div>
      <div class="top right button disabled-button" :class="{
        enabled: getAnswer,
      }">
        <span v-if="answer[0]">回答正确！</span>
        <span v-else>回答错误！</span>
      </div>
      <div class="bottom right button" :class="{
        enabled: !submitted,
      }" @click="onSubmit">
        <span>提交</span>
      </div>
      <div id="ranking" class="sidebar" :class="{ enabled: showRanking }">
        <el-scrollbar>
          <div class="sidebar-content">
            <h2>实时排行</h2>
            <RealTimeScoreboard :players="players" :enabled="showRanking" />
            <h2>分数走势</h2>
            <ScoreGraph v-if="players.length" :history="scoreHistory" :users="users" />
          </div>
        </el-scrollbar>
        <div v-if="!waiting" id="toggle-btn" @click="toggleSidebar()">
          当前第{{ players[userIndex].rank + 1 }}名
        </div>
      </div>
      <div v-if="!waiting" id="rank-up-msg" class="info-message pos" :class="{ enabled: showRankDiff[0] }">
        <div class="inner-box">
          <div class="arrow-animation">
            <div class="arrow-sliding">
              <div class="arrow"></div>
            </div>
            <div class="arrow-sliding delay">
              <div class="arrow"></div>
            </div>
          </div>
          排名上升至第{{ players[userIndex].rank + 1 }}位，继续保持！
        </div>
      </div>
      <div v-if="!waiting" id="rank-down-msg" class="info-message neg" :class="{ enabled: showRankDiff[1] }">
        <div class="inner-box">
          <div class="arrow-animation neg">
            <div class="arrow-sliding">
              <div class="arrow"></div>
            </div>
            <div class="arrow-sliding delay">
              <div class="arrow"></div>
            </div>
          </div>
          排名下降至第{{ players[userIndex].rank + 1 }}位，继续加油！
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
const fullScore = 100;
export default {
  name: "BattlingView",
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
      waiting: true,
      showRanking: false,
      showRankDiff: [false, false],
      progress: 0,
      seconds: 30,
      progressBarStatus: "",
      players: [],
      problem: {},
      getAnswer: false,
      answer: [true, false, false], // correct, timeout, new problem
      submitted: false,
      showPrompt: false,
      logs: [],
      scoreHistory: [[0]],
      exiting: false,
    };
  },
  methods: {
    endOfCountdown() {
      setTimeout(() => {
        this.logs.push({
          time: new Date().toLocaleTimeString(),
          type: "ready",
          content: "您已准备就绪。",
        });
        this.$store.dispatch("competition/send", { type: "start" });
      }, 1000);
    },
    toggleSidebar() {
      this.showRanking = !this.showRanking;
    },
    setClock() {
      if (this.seconds > 0) {
        this.seconds -= 1;
        this.progress = 100 - (this.seconds * 100) / this.problem.time;
        if (this.seconds < 10) {
          this.progressBarStatus = "warning";
        }
      } else {
        this.progressBarStatus = "exception";
      }
    },
    onSubmit() {
      var ans = [];
      this.problem.subproblem.forEach(function (sp) {
        // console.log(sp);
        ans.push(sp.radio);
      });
      this.$store.dispatch("competition/send", {
        type: "finish",
        params: [this.problem.problemID, ans],
      });
      console.log("[vue] (finish)", [this.problem.problemID, ans]);
      //停止计时
      clearInterval(this.clock);
      this.submitted = true;
      this.answer[1] = false;
    },
    computeScore(score) {
      // var ret = this.scoreBarHeight * (1 - score / fullScore);
      // return ret + "px";
      return Math.min(score / fullScore, 1);
    },
    updateRank(initial) {
      var lastRank = this.players[this.userIndex].rank;
      var indices = [...Array(this.players.length).keys()];
      indices.sort((a, b) => {
        return this.players[a].score < this.players[b].score
          ? 1
          : this.players[b].score < this.players[a].score
            ? -1
            : (a === this.userIndex) < (b === this.userIndex)
              ? 1
              : (a === this.userIndex) > (b === this.userIndex)
                ? -1
                : 0;
      });
      indices.forEach((id, i) => {
        this.players[id].rank = i;
      });

      if (!initial) {
        // show prompt for 3 seconds if rank has changed
        if (this.players[this.userIndex].rank > lastRank) {
          this.showRankDiff[0] = false;
          this.showRankDiff[1] = true;
          setTimeout(() => {
            this.showRankDiff[1] = false;
          }, 3000);
        } else if (this.players[this.userIndex].rank < lastRank) {
          this.showRankDiff[1] = false;
          this.showRankDiff[0] = true;
          setTimeout(() => {
            this.showRankDiff[0] = false;
          }, 3000);
        }
      }
    },
    onExit() {
      ElMessageBox.confirm("您确定要退出本场对局吗？中途退出会被视为一次失败。")
        .then(() => {
          this.exiting = false;
          this.$store.dispatch("competition/removeHandler", { type: "answer" });
          this.$store.dispatch("competition/removeHandler", {
            type: "problem",
          });
          this.$store.dispatch("competition/removeHandler", { type: "next" });
          this.$store.dispatch("competition/closeSocket");
          this.$router.push("/battle");
        })
        .catch(() => {
          this.exiting = false;
        });
    },
  },
  mounted() {
    // this.clock = setInterval(this.setClock, 1000);
    // load players' infomation
    for (const user of this.users) {
      // var player = user;
      var player = { username: user };
      // console.log(user);
      player.avatar =
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
      player.scoreBar = 0;
      player.score = 0;
      player.rank = 0;
      player.isUser = false;
      this.players.push(player);
      this.scoreHistory.push([0]);
    }
    this.players[this.userIndex].isUser = true;
    this.myUsername = this.users[this.userIndex];
    this.updateRank(true);

    this.logs.push({
      time: new Date().toLocaleTimeString(),
      type: "ready",
      content: "所有玩家准备就绪：" + this.users.join("，") + "。游戏开始！",
    });

    // listen on "answer" message
    this.finished = false;
    this.$store.dispatch("competition/setHandler", {
      type: "answer",
      func: (data) => {
        console.log("[vue] (answer)", data);

        for (var player of this.players) {
          if (player.username === data.username) {
            player.score = data.score;
            player.scoreBar = this.computeScore(player.score);
          }
        }
        if (data.username === this.myUsername) {
          this.progress = 100;
          this.seconds = 0;
          this.getAnswer = true;
          if (data.correct.every(Boolean)) {
            // this.progressBarStatus = "success";
            this.answer[0] = true;
          } else {
            // this.progressBarStatus = "exception";
            this.answer[0] = false;
          }

          // show prompt for 1.5 seconds
          this.showPrompt = true;
          setTimeout(() => {
            this.showPrompt = false;
          }, 1500);

          if (this.answer[0]) {
            this.logs.push({
              time: new Date().toLocaleTimeString(),
              type: "answer",
              content: "您的回答正确，当前" + data.score + "分！",
            });
          } else {
            this.logs.push({
              time: new Date().toLocaleTimeString(),
              type: "answer",
              content: "您的回答错误，当前" + data.score + "分！",
            });
          }
        } else {
          if (data.correct.every(Boolean)) {
            this.logs.push({
              time: new Date().toLocaleTimeString(),
              type: "answer",
              content: data.username + "的回答正确，当前" + data.score + "分！",
            });
          } else {
            this.logs.push({
              time: new Date().toLocaleTimeString(),
              type: "answer",
              content: data.username + "的回答错误，当前" + data.score + "分！",
            });
          }
        }

        this.$refs.logScrollbar.scrollTo(0, this.$refs.logContent.offsetHeight);
        this.updateRank(false);
      },
    });

    // listen on "problem" message
    this.$store.dispatch("competition/setHandler", {
      type: "problem",
      func: (data) => {
        console.log("[vue] (problem)", data);
        this.logs.push({
          time: new Date().toLocaleTimeString(),
          type: "problem",
          content: "习题" + (data.problemID + 1) + "开始作答！",
        });
        this.$refs.logScrollbar.scrollTo(0, this.$refs.logContent.offsetHeight);

        this.waiting = false;
        this.getAnswer = false;
        this.submitted = false;
        this.problem = data;
        for (var sp of this.problem.subproblem) {
          sp.radio = ref("A");
        }
        this.progress = 0;
        this.progressBarStatus = "";
        this.answer[1] = false;
        this.seconds = this.problem.time;
        clearInterval(this.clock);
        this.clock = setInterval(this.setClock, 1000);

        // show prompt for 1.5 seconds
        this.answer[2] = true;
        this.showPrompt = true;
        setTimeout(() => {
          this.answer[2] = false;
          this.showPrompt = false;
        }, 1500);
      },
    });

    // post-problem confirmation: show the answer
    this.$store.dispatch("competition/setHandler", {
      type: "next",
      func: (data) => {
        console.log("[vue] (next)", data);
        this.logs.push({
          time: new Date().toLocaleTimeString(),
          type: "next",
          content:
            "习题" +
            (this.problem.problemID + 1) +
            "作答结束，正确答案为" +
            data.answer.join(",") +
            "。",
        });
        this.$refs.logScrollbar.scrollTo(0, this.$refs.logContent.offsetHeight);

        if (!this.submitted && !this.answer[1]) {
          // show prompt for 1.5 seconds
          this.showPrompt = true;
          this.answer[1] = true;
          // this.submitted = true;
          setTimeout(() => {
            this.showPrompt = false;
          }, 1500);
        }

        // update score history
        this.scoreHistory[0].push(this.problem.problemID + 1);
        this.players.forEach((player, index) => {
          this.scoreHistory[index + 1].push(player.score);
        });

        // check end
        if (data.lastQuestion) {
          this.finished = true;
          this.$store.dispatch("competition/removeHandler", { type: "answer" });
          this.$store.dispatch("competition/removeHandler", {
            type: "problem",
          });
          this.$store.dispatch("competition/removeHandler", { type: "next" });
          setTimeout(() => {
            this.$router.push("/battle/stats");
          }, 3000);
        } else {
          var answer = data.answer;
          for (let i = 0; i < answer.length; i++) {
            this.problem.subproblem[i].radio = ref(answer[i]);
          }
        }
      },
    });
  },
};
</script>

<style scoped>
.common-layout {
  height: 100vh;
}

.page {
  background: url(@/assets/bg_battle.png) center center;
  background-size: cover;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

#logo {
  height: 48px;
  position: absolute;
  top: 3%;
}

.main {
  width: 70%;
  height: 80%;
  padding: 20px;
  box-sizing: border-box;
  background-color: rgb(245, 245, 245, 0.4);
  border-radius: 30px;
  position: relative;
  top: 3%;
}

.el-aside,
.el-main {
  padding: 0px;
  margin: 10px;
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.el-aside {
  width: 30%;
  min-width: 256px;
}

@media (max-width: 1000px) {
  .el-aside {
    display: none;
  }
}

.block {
  position: relative;
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

.block .block-content {
  margin: 20px;
}

.log-ready {
  color: blue;
}

.log-problem {
  color: green;
  font-weight: bold;
}

.log-next {
  color: purple;
  font-weight: bold;
}

.prompt {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  animation: fade-in-out 1.5s;
}

.prompt .icon {
  width: 70px;
  height: 80px;
  text-align: center;
  font-size: 60px;
  font-weight: bolder;
  animation: twinkle 1.5s infinite;
}

#tick {
  position: absolute;
  border: white solid;
  border-width: 0px 0px 10px 10px;
  width: 50px;
  height: 25px;
  transform: rotate(-45deg);
}

.hidden {
  display: none;
}

.hidden.enabled {
  display: flex;
}

#correct-msg {
  background-color: green;
}

#wrong-msg,
#timeout-msg {
  background-color: crimson;
}

#new-msg {
  background-color: #00a8b1;
}

.button {
  width: 196px;
  min-width: 150px;
  height: 64px;
  font-size: x-large;
  font-weight: bold;
  position: absolute;
  background: #00a8b1;
  color: white;
  border-bottom: white 5px solid;
  border-radius: 10px/8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
  transition: 0.3s ease-out;
}

.button.disabled-button {
  cursor: auto;
}

.button span {
  display: flex;
}

.button span.warning {
  animation: color-change 1s infinite;
}

@keyframes color-change {
  0% {
    color: orange;
  }

  50% {
    color: red;
  }

  100% {
    color: orange;
  }
}

.button span.exception {
  color: red;
}

.top {
  top: 5%;
}

.bottom {
  bottom: 5%;
}

.left {
  left: -216px;
}

.right {
  right: -216px;
}

.left.enabled {
  left: -25px;
}

.right.enabled {
  right: -25px;
}

.top.left,
.bottom.right,
.top.right span,
.bottom.left span {
  transform: skew(-25deg);
}

.top.right,
.bottom.left,
.top.left span,
.bottom.right span {
  transform: skew(25deg);
}

div.pie {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  border-radius: 50%;
  background-image: conic-gradient(transparent var(--percentage),
      white var(--percentage));
  background-color: #21202e;
  border: 2px solid #21202e;
  transition: background-image 1s ease-in-out;
}

.sidebar {
  position: absolute;
  height: 100%;
  width: 600px;
  left: -600px;
  top: 0;
  z-index: 10;
  color: white;
  background-color: #21202e;
  transition: 0.5s;
  box-sizing: border-box;
  border-right: 4px solid #00a8b1;
  border-left: 4px solid #00a8b1;
  margin: 0;
  z-index: 50;
}

.sidebar .content {
  overflow: auto;
}

.sidebar.enabled {
  left: 0px;
}

.sidebar #toggle-btn {
  position: absolute;
  box-sizing: border-box;
  text-align: center;
  padding: 24px 14px;
  font-size: 20px;
  font-weight: bold;
  writing-mode: vertical-rl;
  letter-spacing: 2px;
  text-orientation: upright;
  left: 100%;
  top: 50%;
  transform: translate(0%, -50%);
  color: white;
  background-color: #00a8b1;
  border-radius: 0px 12px 12px 0px;
  cursor: pointer;
}

.sidebar-bg {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.sidebar .sidebar-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.info-message {
  position: absolute;
  z-index: 60;
  width: 450px;
  padding: 4px;
  top: -96px;
  color: white;
  text-align: center;
  font-size: 24px;
  border: white 4px solid;
  border-radius: 10px;
  transition: 0.3s;
}

.info-message.enabled {
  top: 16px;
}

.info-message.pos {
  background-color: green;
}

.info-message.neg {
  background-color: crimson;
}

.info-message .inner-box {
  padding: 8px;
  border: white 3px solid;
  border-radius: 6px;
  display: flex;
  justify-content: center;
}

.arrow-animation {
  position: relative;
  width: 50px;
  display: flex;
  justify-content: center;
}

.arrow-animation.neg {
  transform: rotate(180deg);
}

.arrow-sliding {
  position: absolute;
  margin: auto;
  -webkit-animation: arrow-slide 2s linear infinite;
  animation: arrow-slide 2s linear infinite;
}

.delay {
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}

.arrow {
  width: 12px;
  height: 12px;
  border: 6px solid;
  border-color: white transparent transparent white;
  transform: rotate(45deg);
  position: relative;
  top: 12px;
}

@-webkit-keyframes arrow-slide {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  25% {
    opacity: 1;
    transform: translateY(8px);
  }

  75% {
    opacity: 1;
    transform: translateY(-8px);
  }

  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}

@keyframes arrow-slide {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  25% {
    opacity: 1;
    transform: translateY(8px);
  }

  75% {
    opacity: 1;
    transform: translateY(-8px);
  }

  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
