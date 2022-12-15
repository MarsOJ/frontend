<script setup>
import NumPlus from "./NumPlus.vue";
import ProgressBar from "./ProgressBar.vue";
</script>

<template>
  <div id="leaderboard" :style="{ '--num': `${players.length}` }">
    <ul id="players">
      <li class="header">
        <div class="cell rank">排名</div>
        <div class="cell name">用户</div>
        <div class="cell score">得分</div>
      </li>
      <span v-for="player in players">
        <li class="player" :class="{ user: player.isUser }" :style="{ '--rank': `${player.rank}` }"
          @click="$emit('checkUser', player.username);">
          <div class="cell rank">{{ player.rank + 1 }}</div>
          <div class="cell name">
            <el-avatar :src="player.avatar" />
            {{ player.username }}
          </div>
          <div class="cell score">
            <ProgressBar :percentage="player.scoreBar" :enabled="enabled" />
            <NumPlus :value="player.score" :time="4"></NumPlus>
          </div>
        </li>
      </span>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    players: Array,
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["checkUser"],
};
</script>

<style lang="scss" scoped>
$line-height: 60px;
$line-width: 560px;

#leaderboard {
  width: $line-width;
  position: relative;
  height: calc((var(--num) + 1) * $line-height);
}

#leaderboard ul {
  margin: 0;
  padding: 0;
}

#leaderboard li {
  font-size: 18px;
  line-height: 35px;
  margin: auto;
}

#leaderboard #players li {
  display: flex;
  position: absolute;
  width: $line-width;
  height: $line-height;
  transition-duration: 0.5s;
}

#leaderboard #players li.header {
  font-weight: bold;
  border-bottom: white 3px solid;
  position: relative;
  top: -10px;
}

#leaderboard #players .cell {
  overflow: hidden;
  padding: 10px 4px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

#leaderboard #players li.player {
  top: calc((var(--rank) + 1) * $line-height);
}

#leaderboard #players li.player:hover {
  background-color: #33323f;
  cursor: pointer;
}

#leaderboard #players li.player.user {
  background-color: #33323f;
  font-weight: bold;
  // cursor: initial;
}

#leaderboard .rank {
  width: 50px;
}

#leaderboard .name {
  width: 150px;
}

#leaderboard .name .el-avatar {
  size: 30px;
  vertical-align: middle;
}

#leaderboard .score {
  min-width: 100px;
  flex-grow: 1;
}
</style>
