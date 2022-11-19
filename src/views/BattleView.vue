<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import LeaderSideBar from "@/components/LeaderSideBar.vue";
import battleService from "@/services/battle.service";
</script>

<template>
  <div class="common-layout">
    <div v-if="pairing" id="pairing">
      <div>加载中……</div>
      <el-button v-if="!paired" id="pk-button" @click="this.cancelPairing()">
        取消匹配
      </el-button>
    </div>
    <el-container>
      <NaviBar />
      <el-container class="page-main">
        <el-main class="main">
          当前在线人数：8888<br />
          <el-button id="pk-button" @click="this.startPairing()">
            Level 5 <br />
            开始匹配
          </el-button>
        </el-main>
        <el-aside class="aside">
          <LeaderSideBar :data="leaderData" :userRank="userRank" />
        </el-aside>
      </el-container>
      <el-footer class="page-footer">
        <Footer />
      </el-footer>
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
        { name: "user1", points: 45 },
        { name: "user2", points: 42 },
        { name: "user3", points: 41 },
        { name: "user4", points: 40 },
        { name: "user5", points: 40 },
        { name: "user6", points: 40 },
        { name: "user7", points: 40 },
        { name: "user8", points: 40 },
        { name: "user9", points: 40 },
        { name: "user10", points: 40 },
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
                console.log("[vue]", data);
                this.paired = true;
                this.$router.push("/battle/battling");
              },
            });
            this.$store.dispatch("competition/send", { type: "pair" });
          }
          else {
            this.$store.dispatch("competition/closeSocket");
          }
        },
        (err) => {
          console.log("[vue]", err);
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
}

.page-main {
  align-items: center;
  text-align: center;
}

.main {
  height: 100%;
}

#pk-button {
  width: 30%;
  min-width: 300px;
  height: 100px;
  font-size: xx-large;
}

.aside {
  width: 30vw;
  min-width: 350px;
}

#pairing {
  position: absolute;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: xx-large;
  color: white;
}
</style>
