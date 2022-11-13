<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import ScoreBar from "@/components/ScoreBar.vue";
import { ref } from "vue";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { marked } from "marked";
//import { ElMessage, ElMessageBox } from "@element-plus";
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <NaviBar />
      <el-main class="main">
        <el-container>
          <el-aside width="20vw">
            <div class="avatar">
              <el-avatar :src="myAvatarSrc" :size="80" />
            </div>
            <ScoreBar
              :height="scoreBarHeight"
              :width="scoreBarWidth"
              :score="myScore"
            />
          </el-aside>
          <el-main class="middle">
            <el-progress
              class="progress"
              type="circle"
              :percentage="progress"
              :format="countdown"
              :status="progressBarStatus"
              width="110"
            />
            <el-divider />
            <div class="problem">
              <div class="problem-text" v-html="problem"></div>
              <div class="answer" v-if="problemType === 1">
                <el-radio-group v-model="radio" size="large">
                  <el-radio-button label="A" />
                  <el-radio-button label="B" />
                  <el-radio-button label="C" />
                  <el-radio-button label="D" />
                </el-radio-group>
              </div>
              <div class="answer" v-else-if="problemType === 2">
                <el-input v-model="input" placeholder="请输入答案" clearable />
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
          <el-aside width="20vw">
            <div class="avatar">
              <el-avatar :src="yourAvatarSrc" :size="80" />
            </div>
            <ScoreBar
              :height="scoreBarHeight"
              :width="scoreBarWidth"
              :score="yourScore"
            />
          </el-aside>
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
  data() {
    return {
      progress: 0,
      seconds: 30,
      progressBarStatus: "",
      myAvatarSrc:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      yourAvatarSrc:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      problemType: 1,
      radio: ref("A"),
      input: "",
      scoreBarHeight: 500,
      scoreBarWidth: 40,
      myScore: "400px",
      yourScore: "100px",
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
      //var ans;
      //根据题目类型得到相应的答案对象
      if (this.problemType === 1) {
        //ans = this.radio.value;
      } else if (this.problemType === 2) {
        //ans = this.input;
      }
      //this.socket.emit("finish", JSON.jsonify({ answer: ans }));
      //停止计时
      clearInterval(this.clock);
      this.submitted = true;
      this.progress = 100;
      this.progressBarStatus = "success";
    },
    computeScore(score) {
      var ret = this.scoreBarHeight * (1 - score / fullScore);
      return ret + "px";
    },
  },
  mounted() {
    this.clock = setInterval(this.setClock, 1000);
    //WebSocket connection
    const socket = io();
    this.socket = socket;
    socket.on("prepare", () => {
      //收到prepare消息3s后发送start消息。
      setTimeout(() => {
        socket.emit("start");
      }, 3000);
    });

    socket.on("problem", (msg) => {
      const data = JSON.parse(msg);
      const problem = data.question.content;
      this.problemType = problem.classification;
      if (problem.render_mod == 1) {
        this.problem = marked(problem.content);
      } else if (problem.render_mod == 2) {
        this.problem = problem.content;
      } else {
        //普通文本
      }
      //浏览器中显示题目
      //开始计时
      this.seconds = 30;
      this.clock = setInterval(this.setClock, 1000);
    });

    socket.on("answer", (msg) => {
      const answer = JSON.parse(msg);
      if (answer.type == 1) {
        //更新自己作答情况与分数
      } else {
        //更新对方作答情况与分数
      }
    });

    socket.on("result", (msg) => {
      const result = JSON.parse(msg);
      console.log(result);
      //应该要跳转页面,实现方式？
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

.problem-text {
  width: 90%;
  flex: 6;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.2);
  padding: 20px;
  font-size: 24px;
  text-align: left;
}

.answer {
  flex: 1;
}

.answer-submit {
  flex: 1;
}
</style>
