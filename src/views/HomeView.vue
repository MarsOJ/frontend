<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import InfoService from "@/services/info.service";
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <NaviBar />
      <el-main class="main">
        <el-container>
          <el-aside width="25vw">
            <el-container direction="vertical">
              <div class="time block">
                <div class="date">
                  <div class="mouth vertical-text">{{ month }}</div>
                  <div class="day" style="font-size: 40px">{{ day }}</div>
                  <div class="week vertical-text">星期{{ week }}</div>
                </div>
                <div class="count-down">
                  <p>
                    据
                    <span style="color: grey; font-size: 16px">{{
                        incomingCompetition
                    }}</span>
                    还剩 {{ leavingDay }} 天
                  </p>
                </div>
              </div>
              <div class="link block">
                <p style="font-size: 24px">讨论节点</p>
                <p style="font-size: 18px">赛事</p>
                <a v-for="item in competitions" :href="item.url">
                  {{ item.name }}
                </a>
                <p style="font-size: 18px">在线题库</p>
                <a v-for="item in OJ" :href="item.url">
                  {{ item.name }}
                </a>
                <span></span>
              </div>
            </el-container>
          </el-aside>
          <el-main @scroll="scrollEvent($event)">
            <el-container direction="vertical">
              <div class="announcement block">
                <p style="font-size: 28px">公告</p>
                <p style="font-size: 18px">
                  MarsOJ致力于每一位同学的进步与成长，欢迎加入MarsOJ的大家庭~
                </p>
                <p style="font-size: 18px">
                  本网站仅供交流学习使用，一切不文明的行为将被封号甚至封IP。如有疑问请致信官方email:
                  MarsOJ@xxx.com
                </p>
                <span class="announcement-text">{{ announcement }}</span>
              </div>
              <div class="info block">
                <p style="font-size: 28px">资讯</p>
                <!-- <el-scrollbar> -->
                <div v-for="item in info">
                  <div class="info-block" @click="showDetail(item.id)">
                    <div class="info-date"></div>
                    <div class="info-detail">
                      <div class="info-title">{{ item.title }}</div>
                      <div class="info-src">来源：{{ item.source }}</div>
                      <div class="info-date">时间：{{ item.date }}</div>
                    </div>
                  </div>
                </div>
                <!-- </el-scrollbar> -->
              </div>
            </el-container>
          </el-main>
        </el-container>
      </el-main>
      <!-- <el-footer> -->
      <Footer />
      <!-- </el-footer> -->
    </el-container>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      month: "十月",
      day: 31,
      week: "一",
      leavingDay: "6",
      numberMap: [
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
      ],
      incomingCompetition: "CSP-J/S 2022",
      competitions: [
        {
          name: "NOIP 信息学奥赛",
          url: "https://www.noi.cn",
        },
        {
          name: "CSP-J/S 2022",
          url: "https://www.noi.cn/xw/2022-06-16/764461.shtml",
        },
      ],
      OJ: [
        {
          name: "CodeForces",
          url: "https://codeforces.com",
        },
        {
          name: "POJ",
          url: "http://poj.org",
        },
        {
          name: "BZOJ",
          url: "http://bzoj.noip.space",
        },
        {
          name: "UOJ",
          url: "https://uoj.ac",
        },
        {
          name: "LibreOJ",
          url: "https://loj.ac",
        },
        {
          name: "洛谷",
          url: "https://www.luogu.com.cn",
        },
        {
          name: "TopCoder",
          url: "https://www.topcoder.com",
        },
        {
          name: "LeetCode",
          url: "https://leetcode-cn.com",
        },
        {
          name: "AtCoder",
          url: "https://atcoder.jp",
        },
      ],
      announcement: "欢迎！",
      info: [],
      timer: null,
      lastNewsId: "",
    };
  },
  methods: {
    showDetail(newsId) {
      this.$router.push('/home/news/' + newsId);
    },
    scrollEvent(e) {
      if (e.target.scrollTop + e.target.offsetHeight + 1 >= e.target.scrollHeight) {
        // 防抖节流
        clearInterval(this.timer);
        this.timer = setTimeout(() => {
          this.lastNewsId = this.info[this.info.length - 1]["id"];
          InfoService.getLastestNews(this.lastNewsId).then(
            (content) => {
              this.info = this.info.concat(content);
            },
            (error) => {
              var content = (error.response && error.response.data) ||
                error.message || error.toString();
              console.log(content);
            }
          );
        }, 500);
      }
    },
  },
  mounted() {
    InfoService.getLastestNews("").then(
      (content) => {
        this.info = content;
      },
      (error) => {
        var content = (error.response && error.response.data) ||
          error.message || error.toString();
        console.log(content);
      }
    );
    var d = new Date();
    this.day = d.getDate();
    this.month = this.numberMap[d.getMonth()] + "月";
    var week = d.getDay();
    if (week == 7) {
      this.week = "天";
    } else {
      this.week = this.numberMap[week - 1];
    }
  },
};
</script>

<style scoped>
.main {
  text-align: center;
  padding-top: 5vh;
  padding-left: 3vw;
  padding-right: 3vw;
  width: 100vw;
  background-color: rgba(240, 245, 240, 0.549);
}

div p {
  white-space: pre-wrap;
  width: 150px;
}

.common-layout {
  height: 100vh;
}

.block {
  display: inline-block;
  height: fit-content;
  margin: 20px;
  padding: 20px;
  background-color: white;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.2);
  /* box-shadow: 3px 3px 3px 1px rgba(0, 0, 0, 0.2); */
}

.announcement {
  padding-left: 50px;
  display: inline-block;
}

.announcement h1 {
  line-height: 3em;
}

.link {
  display: inline-block;
  height: 100%;
}

.link p {
  text-align: left;
  font-family: sans-serif;
  color: grey;
  font-weight: light;
}

.link a {
  display: inline-block;
  align-items: left;
  margin: 10px;
  color: var(--el-color-primary);
  font-size: 18px;
  text-align: left;
  text-decoration: none;
}

.link a:hover {
  text-decoration: underline;
}

.time {
  padding: 20px;
}

.date div {
  display: inline;
  padding: 20px;
  color: rgb(85, 138, 5);
  font-weight: bold;
  vertical-align: middle;
}

.date .vertical-text {
  writing-mode: vertical-lr;
  letter-spacing: 10px;
  font-size: 28px;
  margin: 0 auto;
  word-break: break-all;
}

.time .count-down p {
  width: 100%;
  text-align: center;
}

.announcement p {
  width: 100%;
  display: text;
  text-align: left;
  font-family: sans-serif;
  font-weight: light;
}

.info {
  padding-left: 50px;
  display: inline-block;
}

.info p {
  width: 100%;
  display: text;
  text-align: left;
  font-family: sans-serif;
  font-weight: light;
}

.info-block {
  align-items: left;
  justify-content: left;
  margin: 20px;
  padding: 20px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  cursor: pointer;
  transition: all .2s ease-in-out;
}

.info-block:hover {
  transform: scale(1.03);
}

.info-title {
  text-align: left;
  font-family: sans-serif;
  font-weight: 550;
  font-size: 20px;
}

.info-src {
  text-align: left;
  font-family: sans-serif;
  font-weight: normal;
  font-size: 16px;
  color: grey;
}

.info-date {
  text-align: left;
  font-family: sans-serif;
  font-weight: normal;
  font-size: 16px;
  color: grey;
}
</style>
