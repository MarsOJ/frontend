<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import LeaderSideBar from "@/components/LeaderSideBar.vue";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
</script>

<template>
  <div class="common-layout">
    <div v-if="pairing" id="pairing">
      <div>加载中……</div>
      <el-button id="pk-button" @click="this.cancelPairing()">
        取消匹配
      </el-button>
    </div>
    <el-container>
      <NaviBar />
      <el-container class="page-main">
        <el-main class="main">
          当前在线人数：8888<br />
          <el-button id="pk-button" @click="this.startPairing()">
            Level 5 <br /> 开始匹配
          </el-button>
        </el-main>
        <el-aside class="aside">
          <LeaderSideBar :data=leaderData :userRank=userRank />
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
    }
  },
  methods: {
    startPairing() {
      this.pairing = true;

      // WebSocket connection
      const socket = io();
      this.socket = socket;
      // socket.emit("connect");
      // socket.on("prepare", () => {
      this.$router.push("/battle/stats/68");
      // });
    },
    cancelPairing() {
      this.pairing = false;
      this.socket.emit("cancel");
      this.socket.off("prepare");
    }
  },
}
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