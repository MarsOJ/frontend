<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import LeaderSideBar from "@/components/LeaderSideBar.vue";
import LoadingBlock from "@/components/LoadingBlock.vue";
import RecordService from "@/services/record.service";
</script>

<template>
  <div class="common-layout">
    <!-- TODO: check whether there's an ongoing match (socketConnected) -->
    <LoadingBlock v-if="pairing" :cond="[!socketConnected && !paired, socketConnected && !paired, paired]"
      :msg="['连接服务器中……', '配对中……', '加载中……']">
      <el-button v-if="!paired" id="cancel-button" @click="cancelPairing()">
        取消匹配
      </el-button>
    </LoadingBlock>
    <el-container direction="vertical">
      <el-scrollbar>
        <div ref="mainpage">
          <NaviBar />
          <el-container class="page-main">
            <el-main class="fade-down">
              <div class="main">
                <div class="title">Skills speak louder than words</div>
                <div class="description">
                  We help companies develop the strongest tech teams around. We
                  help candidates sharpen their tech skills and pursue job
                  opportunities.
                </div>
                <el-button id="pk-button" @click="startPairing()">
                  开始匹配
                </el-button>
                <div class="info" v-if="score">
                  当前积 {{ score }} 分&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位于总榜第
                  {{ userRank }} 名
                  <!-- 当前等级：Level 5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;钱：没有 -->
                </div>
              </div>
            </el-main>
            <div class="leaderboard-wrapper" v-loading="loading">
              <LeaderSideBar :data="leaderData" :columns="[
                { prop: 'name', label: '用户名', width: '150' },
                { prop: 'signature', label: '签名', width: '350' },
                { prop: 'points', label: '积分', width: '100' },
              ]" class="fade-down">实时排行榜</LeaderSideBar>
            </div>
          </el-container>
          <Footer />
        </div>
      </el-scrollbar>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "BattleView",
  computed: {
    socketConnected() {
      return this.$store.state.competition.connected;
    },
  },
  data() {
    return {
      leaderData: [],
      loading: true,
      userRank: 5,
      socket: null,
      pairing: false,
      paired: false,
      score: null,
    };
  },
  methods: {
    startPairing() {
      this.pairing = true;
      this.$store.dispatch("competition/connectSocket").then(
        () => {
          if (this.pairing) {
            this.$store.dispatch("competition/setHandlerOnce", {
              type: "prepare",
              func: (data) => {
                this.paired = true;
                console.log("[vue] (prepare)", data);
                this.$store
                  .dispatch("competition/setUsers", {
                    users: data,
                    username: this.$store.state.auth.user,
                  })
                  .then(() => {
                    this.$router.push("/battle/battling");
                  });
              },
            });
            this.$store.dispatch("competition/send", { type: "pair" });
          } else {
            this.$store.dispatch("competition/closeSocket");
          }
        },
        (err) => {
          console.log("[vue] (connect)", err);
        }
      );
    },
    cancelPairing() {
      this.pairing = false;
      if (this.socketConnected) {
        this.$store.dispatch("competition/removeHandler", { type: "prepare" });
        this.$store.dispatch("competition/send", { type: "cancel" });
      }
      this.$store.dispatch("competition/closeSocket");
    },
  },
  mounted() {
    RecordService.getRankings().then(
      (content) => {
        content.forEach((element, index) => {
          element.name = element.username;
          element.points = element.score;
          element.isUser = element.name === this.$store.state.auth.user;
          if (element.isUser) {
            this.score = element.points;
            this.userRank = index + 1;
          }
        });
        this.leaderData = content;
        this.loading = false;
      },
      (error) => {
        var content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(content);
      }
    );
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
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(to bottom left,
      #d2eedb,
      transparent,
      transparent,
      #d2eedb),
    linear-gradient(to bottom right, #d3d3fc, transparent, transparent, #d3d3fc);
}

.main {
  /* height: 100%; */
  height: 84vh;
  min-height: 400px;
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main .title {
  font-size: 54px;
  font-weight: 900;
  color: #1f1f20;
}

.main .description {
  font-size: 18px;
  font-weight: 300;
  color: #1f1f20;
  width: 70%;
  margin: 2em;
}

.main #pk-button {
  width: 30%;
  min-width: 180px;
  height: 48px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background-color: #00a8b1;
}

.main .info {
  margin: 2em;
}

.leaderboard-wrapper {
  /* width: 85vw; */
  width: 900px;
  display: flex;
  justify-content: center;
  /* min-width: 900px; */
  /* max-width: 480px; */
}

#cancel-button {
  width: 180px;
  height: 50px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background-color: #a10b0b;
  border-color: #8a0a0a;
}

/* @media (max-width: 800px) {
  .page-main {
    flex-direction: column;
  }
} */
</style>
