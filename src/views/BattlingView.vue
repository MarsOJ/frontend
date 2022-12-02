<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import ScoreBar from "@/components/ScoreBar.vue";
import NumPlus from "@/components/NumPlus.vue";
import { ref } from "vue";
// import { marked } from "marked";
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <NaviBar />
      <el-main class="main">
        <el-container>
          <el-aside v-for="player in players" width="4vw">
            <div class="avatar">
              <el-avatar :src="player.avatar" :size="80" />
            </div>
            <NumPlus :value="player.score" :time="4"></NumPlus>
            <ScoreBar
              :height="scoreBarHeight"
              :width="scoreBarWidth"
              :score="player.scoreBar"
            />
          </el-aside>
          <el-main class="middle">
            <el-progress
              class="progress"
              type="circle"
              :percentage="progress"
              :format="countdown"
              :status="progressBarStatus"
              :width="110"
            />
            <el-divider />
            <div class="problem">
              <div class="problem-content">
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
              <div class="answer-submit">
                <el-button
                  type="primary"
                  round
                  size="large"
                  @click="onSubmit"
                  :disabled="submitted"
                  >提交答案</el-button
                >
              </div>
            </div>
          </el-main>
        </el-container>
      </el-main>
      <el-footer>
        <Footer />
      </el-footer>
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
      progress: 0,
      seconds: 30,
      progressBarStatus: "",
      players: [],
      problem: {},
      scoreBarHeight: 500,
      scoreBarWidth: 30,
      submitted: false,
    };
  },
  methods: {
    countdown() {
      return this.seconds + "s";
    },
    setClock() {
      if (this.seconds > 0) {
        this.seconds -= 1;
        this.progress = 100 - (this.seconds * 100) / 30;
        if (this.seconds < 5) {
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
    },
    computeScore(score) {
      var ret = this.scoreBarHeight * (1 - score / fullScore);
      return ret + "px";
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
      player.scoreBar = "0px";
      player.score = 0;
      this.players.push(player);
    }
    this.myUsername = this.users[this.userIndex];

    //TODO:倒计时动画
    // emit "start" message
    this.$store.dispatch("competition/send", { type: "start" });

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
          if (data.correct.every(Boolean)) {
            this.progressBarStatus = "success";
          } else {
            this.progressBarStatus = "exception";
          }
        }
      },
    });
    // while (!this.finished) {
    // listen on "problem" message
    this.$store.dispatch("competition/setHandler", {
      type: "problem",
      func: (data) => {
        this.submitted = false;
        console.log("[vue] (problem)", data);
        this.problem = data;
        for (var sp of this.problem.subproblem) {
          sp.radio = ref("A");
        }
        this.seconds = 30;
        this.clock = setInterval(this.setClock, 1000);
      },
    });

    // post-problem confirmation: show the answer
    this.$store.dispatch("competition/setHandler", {
      type: "next",
      func: (data) => {
        console.log("[vue] (next)", data);
        if (data.lastQuestion) {
          this.finished = true;
          // TODO: wait for a period of time
          this.$router.dispatch("competition/removeHandler", {
            type: "answer",
          });
          this.$router.dispatch("competition/removeHandler", {
            type: "problem",
          });
          this.$router.dispatch("competition/removeHandler", { type: "next" });
          this.$router.push("/battle/stats");
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
.main {
  text-align: center;
  padding-top: 3vh;
  padding-left: 3vw;
  padding-right: 3vw;
  width: 100vw;
  background-color: rgba(240, 245, 240, 0.549);
}

.common-layout {
  height: 100vh;
}

.progress {
  padding: auto;
}

.middle {
  width: 100%;
  padding: 0;
}

.problem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 75%;
}

.problem-content {
  width: 90%;
  flex: 6;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.2);
  padding: 20px;
  font-size: 24px;
  text-align: left;
}

.problem-text {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  margin: 20px;
}

.answer {
  margin-left: 20px;
}

.answer-submit {
  flex: 1;
}
</style>
