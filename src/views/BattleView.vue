<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
</script>

<template>
  <div class="common-layout">
    <el-container>
      <NaviBar />
      <el-container class="page-main">
        <el-main class="main">
          当前在线人数：8888<br />
          <el-button id="pk-button" @click="$router.push('/battle/stats/68')">
            Level 5 <br /> 开始匹配
          </el-button>
        </el-main>
        <el-aside class="aside">
          <div id="leaderboard">
            <div class="title">排行榜</div>
            <div class="podium">
              <img class="podium-pic" src="../assets/podium.png" />
              <div class="user-info" id="first-user">
                <img class="user-pic" src="../assets/user.png" />
                <div>{{ podium[0].name }}</div>
              </div>
              <div class="user-info" id="second-user">
                <img class="user-pic" src="../assets/user.png" />
                <div>{{ podium[1].name }}</div>
              </div>
              <div class="user-info" id="third-user">
                <img class="user-pic" src="../assets/user.png" />
                <div>{{ podium[2].name }}</div>
              </div>
            </div>
            <el-table id="leader-table" :data="leaderData" table-layout="auto">
              <el-table-column prop="rank" label="名次" align="center" />
              <el-table-column prop="name" label="用户名" align="center" />
              <el-table-column prop="points" label="积分" align="center" />
            </el-table>
          </div>
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
        { rank: 1, name: 'user1', points: 45 },
        { rank: 2, name: 'user2', points: 42 },
        { rank: 3, name: 'user3', points: 41 },
        { rank: 4, name: 'user4', points: 40 },
        { rank: 5, name: 'user5', points: 40 },
        { rank: 6, name: 'user6', points: 40 },
        { rank: 7, name: 'user7', points: 40 },
        { rank: 8, name: 'user8', points: 40 },
        { rank: 9, name: 'user9', points: 40 },
        { rank: 10, name: 'user10', points: 40 },
      ],
      podium: [
        { rank: 1, name: 'user1', points: 45 },
        { rank: 2, name: 'user2', points: 42 },
        { rank: 3, name: 'user3', points: 41 },
      ]
    }
  }
}
</script>

<style scoped>
.page-main {
  align-items: center;
  text-align: center;
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

.title {
  font-weight: bolder;
  font-size: larger;
}

#leaderboard {
  margin: 2em;
  padding: 2em;
  border: gray 3px solid;
  border-radius: 10px;
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.podium {
  height: 150px;
  width: 200px;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
}

.podium-pic {
  width: 100%;
}

.user-info {
  position: absolute;
  text-align: center;
  font-size: small;
}

#first-user {
  left: 76px;
  bottom: 70px;
}

#second-user {
  left: 5px;
  bottom: 50px;
}

#third-user {
  left: 145px;
  bottom: 40px;
}

.user-pic {
  width: 50px;
  border: gray 4px solid;
  border-radius: 29px;
  margin: -5px;
}

#first-user .user-pic {
  border-color: goldenrod;
}

#second-user .user-pic {
  border-color: silver;
}

#third-user .user-pic {
  border-color: maroon;
}

#leader-table {
  text-align: center;
}

.main {
  height: 100%;
}
</style>