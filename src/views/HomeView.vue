<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import InfoService from "@/services/info.service";
import ScrollUpButton from "@/components/ScrollUpButton.vue";
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <el-scrollbar ref="scrollbar" @scroll="scrollEvent">
        <div ref="mainpage">
          <NaviBar />
          <section class="page-title">
            <div class="home-logo">
              <img class="home-logo-bg" src="../assets/home.png" />
              <img class="home-logo-main" src="../assets/logo.png" />
            </div>
            <div class="announcement">
              <!-- <p style="font-size: 28px">公告</p> -->
              <p style="font-size: 18px">
                MarsOJ致力于每一位同学的进步与成长，欢迎加入MarsOJ的大家庭~
              </p>
              <p style="font-size: 18px">
                本网站仅供交流学习使用，一切不文明的行为将被封号甚至封IP。如有疑问请致信官方email:
                MarsOJ@xxx.com
              </p>
              <p class="announcement-text" v-if="announcement">
                {{ announcement }}
              </p>
            </div>
          </section>
          <div class="page-title-shadow"></div>
          <el-container class="main">
            <el-main>
              <div class="info">
                <div v-for="item in info">
                  <div
                    class="info-block fade-down"
                    @click="showDetail(item.id)"
                  >
                    <div class="info-date">
                      <span>{{ item.date }}</span>
                    </div>
                    <div class="info-detail">
                      <div class="info-title">{{ item.title }}</div>
                      <div class="info-src">
                        来源：<strong>{{ item.source }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="loading info-block fade-down"
                  v-loading="loading"
                  v-if="!end"
                >
                  下拉加载更多
                </div>
                <div class="loading info-block fade-down" v-else>
                  没有更多了
                </div>
                <!-- <div class="loading info-block" v-loading="loading"></div> -->
              </div>
            </el-main>
            <!-- <el-affix> -->
            <el-aside width="360px">
              <div class="time block fade-down">
                <div class="date">
                  <div class="mouth vertical-text">{{ month }}</div>
                  <div class="day" style="font-size: 40px">{{ day }}</div>
                  <div class="week vertical-text">星期{{ week }}</div>
                </div>
                <div class="count-down">
                  距
                  <span style="color: grey; font-size: 16px">{{
                    incomingCompetition
                  }}</span>
                  还剩 {{ leavingDay }} 天
                </div>
              </div>
              <div class="link block fade-down">
                <!-- <p style="font-size: 24px">讨论节点</p> -->
                <h2>赛事</h2>
                <div>
                  <a v-for="item in competitions" :href="item.url">
                    {{ item.name }}
                  </a>
                </div>
              </div>
              <div class="link block fade-down">
                <h2>在线题库</h2>
                <div>
                  <a v-for="item in OJ" :href="item.url">
                    {{ item.name }}
                  </a>
                </div>
              </div>
            </el-aside>
            <!-- </el-affix> -->
          </el-container>
          <Footer />
        </div>
      </el-scrollbar>
    </el-container>
    <ScrollUpButton :display="!top" @scrollup="scrollUpMsg" />
  </div>
</template>

<script>
export default {
  name: "HomeView",
  components: {
    ScrollUpButton,
  },
  data() {
    return {
      end: false,
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
      // announcement: "欢迎！",
      announcement: "",
      info: [],
      timer: null,
      lastNewsId: "",
      loading: true,
      top: true,
    };
  },
  methods: {
    showDetail(newsId) {
      this.$router.push("/home/news/" + newsId);
    },
    scrollEvent(scrollTop) {
      this.top = scrollTop.scrollTop < 256;
      if (
        scrollTop.scrollTop + document.body.offsetHeight + 3 >=
        this.$refs.mainpage.clientHeight
      ) {
        // 防抖节流
        clearInterval(this.timer);
        this.timer = setTimeout(() => {
          this.lastNewsId = this.info[this.info.length - 1]["id"];
          this.loading = true;
          InfoService.getLastestNews(this.lastNewsId).then(
            (content) => {
              if (content.length == 0) {
                this.end = true;
              } else {
                this.info = this.info.concat(content);
              }
              this.loading = false;
            },
            (error) => {
              var content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              console.log(content);
              this.loading = false;
            }
          );
        }, 200);
      }
    },
    scrollUpMsg() {
      document.getElementsByClassName("el-scrollbar__wrap")[0].scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      // this.$refs.scrollbar.setScrollTop(0);
    },
  },
  mounted() {
    InfoService.getLastestNews("").then(
      (content) => {
        if (content.length == 0) {
          this.end = true;
        } else {
          this.info = content;
        }
        this.loading = false;
      },
      (error) => {
        var content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(content);
        this.loading = false;
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
  padding-left: 15vw;
  padding-right: 15vw;
  width: 100vw;
  justify-content: space-evenly;
  position: relative;
  top: -60px;
}

.common-layout {
  height: 100vh;
}

.page-title {
  background-color: #21202e;
  color: white;
  position: relative;
  top: -60px;
}

.page-title .home-logo-bg {
  position: relative;
  width: 100%;
  z-index: 0;
}

.page-title .home-logo-main {
  position: absolute;
  top: 25%;
  left: 35%;
  width: 30%;
  z-index: 1;
}

@media (max-width: 800px) {
  .page-title .home-logo {
    display: none;
  }
}

.page-title .announcement {
  padding: 24px;
  text-align: center;
}

.page-title-shadow {
  background: url(../assets/page-shadow.png) no-repeat center top;
  background-size: 100% auto;
  padding-bottom: 70px;
  margin: 0px;
  position: relative;
  top: -60px;
}

.block {
  /* display: inline-block; */
  height: fit-content;
  margin: 3em 1em;
  border: 1px solid #e9e9e9;
  color: #64646d;
  background-color: white;
  /* box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.2); */
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

.block div {
  padding: 1em;
}

.link p {
  text-align: left;
  color: grey;
  font-weight: light;
}

.link a {
  display: inline-block;
  align-items: left;
  margin: 10px;
  /* color: var(--el-color-primary); */
  color: #00a8b1;
  font-size: 18px;
  text-align: left;
  text-decoration: none;
}

.link a:hover {
  text-decoration: underline;
}

.block div.date {
  padding-bottom: 0px;
}

.block div.count-down {
  padding-top: 0px;
  padding-bottom: 2em;
}

.date div {
  display: inline;
  padding: 20px;
  /* color: rgb(85, 138, 5); */
  color: #00a8b1;
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

.el-main {
  min-width: 550px;
  max-width: 700px;
}

.info p {
  width: 100%;
  display: text;
  text-align: left;
  font-weight: light;
}

.info-block {
  background: url(../assets/right-arrow.png) 95% center no-repeat;
  background-size: 3%;
  background-color: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 0;
  margin-bottom: 30px;
  padding: 2em;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.info-block:hover {
  transform: scale(1.02);
}

.info-block.loading {
  padding: 1em;
  background-image: none;
  background-color: #ffffff;
  color: gray;
  font-weight: bold;
  font-style: italic;
}

.info-date {
  font-size: 0.875rem;
  text-align: left;
}

.info-date span {
  padding: 2px 10px;
  color: white;
  background-color: #003235;
  font-weight: bold;
  font-size: small;
}

.info-detail {
  margin-top: 1em;
}

.info-title {
  text-align: left;
  font-weight: bold;
  font-size: 24px;
  margin: 16px 0px;
}

.info-src {
  text-align: left;
  font-weight: normal;
  font-size: 14px;
  color: #b9b9b9;
}

.info-src strong {
  color: #9f9f9f;
}
</style>
