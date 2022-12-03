<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import LeaderSideBar from "@/components/LeaderSideBar.vue";
import LoadingBlock from "@/components/LoadingBlock.vue";
</script>

<template>
  <div class="common-layout">
    <!-- TODO: check whether there's an ongoing match (socketConnected) -->
    <LoadingBlock v-if="pairing" :cond="[!socketConnected && !paired, socketConnected && !paired, paired]"
      :msg="['连接服务器中……', '配对中……', '加载中……']">
      <el-button v-if="!paired" id="cancel-button" @click="this.cancelPairing()">
        取消匹配
      </el-button>
    </LoadingBlock>
    <el-container direction="vertical">
      <el-scrollbar>
        <div ref="mainpage">
          <NaviBar />
          <el-container class="page-main">
            <el-main class="main fade-down">
              <div class="main">
                <div class="title">Skills speak louder than words</div>
                <div class="description">
                  We help companies develop the strongest tech teams around. We
                  help candidates sharpen their tech skills and pursue job
                  opportunities.
                </div>
                <el-button id="pk-button" @click="this.startPairing()">
                  开始匹配
                </el-button>
                <div class="info">
                  当前等级：Level 5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;钱：没有
                </div>
              </div>
            </el-main>
            <el-aside class="aside">
              <LeaderSideBar :data="leaderData" :userRank="userRank" class="fade-down" />
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
  name: "BattleView",
  computed: {
    socketConnected() {
      return this.$store.state.competition.connected;
    },
  },
  data() {
    return {
      leaderData: [
        { name: "user1", points: 45, isUser: false },
        { name: "user2", points: 42, isUser: false },
        { name: "user3", points: 41, isUser: true },
        { name: "user4", points: 40, isUser: false },
        { name: "user5", points: 40, isUser: false },
        { name: "user6", points: 40, isUser: false },
        { name: "user7", points: 40, isUser: false },
        { name: "user8", points: 40, isUser: false },
        { name: "user9", points: 40, isUser: false },
        { name: "user10", points: 40, isUser: false },
      ],
      userRank: 5,
      socket: null,
      pairing: false,
      paired: false,
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
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.aside {
  width: 30vw;
  min-width: 356px;
  max-width: 480px;
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

@media (max-width: 800px) {
  .page-main {
    flex-direction: column;
  }
}
</style>
