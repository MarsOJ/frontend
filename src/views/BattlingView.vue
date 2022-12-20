<script setup>
import AuthService from "@/services/auth.service";
import CountdownTimer from "@/components/CountdownTimer.vue";
import RealTimeScoreboard from "@/components/RealTimeScoreboard.vue";
import ScoreGraph from "@/components/ScoreGraph.vue";
import UserInfo from "@/components/UserInfo.vue";
import { ref } from "vue";
</script>

<template>
  <div class="common-layout">
    <UserInfo
      :username="checkUser"
      v-if="showCheckUser"
      @close="this.showCheckUser = false"
    />
    <CountdownTimer v-if="waiting" @end="endOfCountdown" />
    <div
      class="sidebar-bg fade-in"
      @click="toggleSidebar()"
      v-if="showRanking"
    ></div>
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
                  <div
                    class="answer"
                    v-if="problem.subproblem[0].choice.length === 4"
                  >
                    <el-radio-group
                      v-model="problem.subproblem[0].radio"
                      size="large"
                    >
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
                    <el-radio-group
                      v-model="problem.subproblem[0].radio"
                      size="large"
                    >
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
            <div
              id="new-msg"
              class="prompt hidden fade-in"
              :class="{ enabled: showPrompt }"
              v-if="answer[2]"
            >
              <div class="icon">&#9872;</div>
              新的习题！
            </div>
            <div
              id="timeout-msg"
              class="prompt hidden fade-in"
              :class="{ enabled: showPrompt }"
              v-else-if="answer[1]"
            >
              <div class="icon">&times;</div>
              回答超时！
            </div>
            <div
              id="correct-msg"
              class="prompt hidden fade-in"
              :class="{ enabled: showPrompt }"
              v-else-if="answer[0]"
            >
              <div class="icon">
                <div id="tick"></div>
              </div>
              回答正确！
            </div>
            <div
              id="wrong-msg"
              class="prompt hidden fade-in"
              :class="{ enabled: showPrompt }"
              v-else
            >
              <div class="icon">&times;</div>
              回答错误！
            </div>
          </el-main>
        </el-container>
      </div>
      <div class="top left button enabled" @click="onExit">
        <span>退出</span>
      </div>
      <div
        class="top right button disabled-button"
        :class="{
          enabled: !submitted,
        }"
      >
        <span :class="`${progressBarStatus}`">
          <div class="pie" :style="{ '--percentage': `${progress}%` }"></div>
          <div>
            {{ new Date(seconds * 1000).toISOString().substring(14, 19) }}
          </div>
        </span>
      </div>
      <div
        class="top right button disabled-button"
        :class="{
          enabled: getAnswer,
        }"
      >
        <span>
          <div class="result-btn">
            <div v-if="answer[0]">回答正确！</div>
            <div v-else>回答错误！</div>
            <small>等待其他玩家结束</small>
          </div>
        </span>
      </div>
      <div
        class="bottom right button"
        :class="{
          enabled: !submitted,
        }"
        @click="onSubmit"
      >
        <span>提交</span>
      </div>
      <div id="ranking" class="sidebar" :class="{ enabled: showRanking }">
        <el-scrollbar>
          <div class="sidebar-content">
            <h2>实时排行</h2>
            <RealTimeScoreboard
              :players="players"
              :enabled="showRanking"
              @checkUser="checkUserInfo"
            />
            <h2>分数走势</h2>
            <div style="width: 100%; height: 300px">
              <ScoreGraph
                v-if="players.length"
                :history="scoreHistory"
                :users="users"
              />
            </div>
          </div>
        </el-scrollbar>
        <div v-if="!waiting" id="toggle-btn" @click="toggleSidebar()">
          当前第{{ players[userIndex].rank + 1 }}名
        </div>
      </div>
      <div
        v-if="!waiting"
        id="rank-up-msg"
        class="info-message pos"
        :class="{ enabled: showRankDiff[0] }"
      >
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
      <div
        v-if="!waiting"
        id="rank-down-msg"
        class="info-message neg"
        :class="{ enabled: showRankDiff[1] }"
      >
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
      checkUser: "",
      showCheckUser: false,
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
    checkUserInfo(username) {
      this.checkUser = username;
      this.showCheckUser = true;
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
      // player.avatar =
      //   "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
      player.avatar =
        "data:image/png;base64,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";
      player.scoreBar = 0;
      player.score = 0;
      player.rank = 0;
      player.isUser = false;
      AuthService.userProfile(player.username).then(
        (content) => {
          if (content != "") {
            player.avatar = content;
          }
        },
        (error) => {
          var content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          console.log(content);
        }
      );
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

.content .block-content {
  font-size: 18px;
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

.button span div.result-btn {
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  background-image: conic-gradient(
    transparent var(--percentage),
    white var(--percentage)
  );
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
