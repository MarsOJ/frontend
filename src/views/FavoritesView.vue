<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import Pagination from "@/components/Pagination.vue";
import FavoriteService from "@/services/favorites.service";
import ProblemService from "@/services/problem.service";
import { ref } from "vue";
import { Edit, Search, Delete } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-message-box.css";
import { marked } from "marked";
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <el-scrollbar>
        <div ref="mainpage">
          <NaviBar />
          <el-container class="page-main">
            <el-main>
              <div class="app-container">
                <div class="filter-container">
                  <el-select
                    v-model="favoriteId"
                    style="width: 140px"
                    class="filter-item"
                    @change="handleChangeFavorite"
                  >
                    <el-option
                      v-for="item in favoriteList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                  <el-select
                    v-model="listQuery.sort"
                    style="width: 140px"
                    class="filter-item"
                    @change="handleFilter"
                  >
                    <el-option
                      v-for="item in sortOptions"
                      :key="item.key"
                      :label="item.label"
                      :value="item.key"
                    />
                  </el-select>
                  <el-button
                    class="filter-item"
                    type="primary"
                    :icon="Search"
                    size="small"
                    @click="handleFilter"
                  >
                    搜索
                  </el-button>
                  <el-button
                    class="filter-item"
                    style="margin-left: 10px"
                    type="primary"
                    size="small"
                    :icon="Edit"
                    @click="handleAddFavorite"
                  >
                    新建
                  </el-button>
                  <el-button
                    class="filter-item"
                    style="margin-left: 10px"
                    type="danger"
                    size="small"
                    :icon="Delete"
                    @click="handleDeleteFavorite"
                  >
                    删除
                  </el-button>
                </div>

                <el-table
                  :key="tableKey"
                  v-loading="listLoading"
                  :data="list"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%"
                  @sort-change="sortChange"
                >
                  <el-table-column
                    label="序号"
                    prop="id"
                    sortable="custom"
                    align="center"
                    width="80"
                  >
                    <template v-slot="{ $index }">
                      <span>{{ $index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="日期" width="150px" align="center">
                    <template v-slot="{ row }">
                      <span>{{ row.date }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="标题" width="150px">
                    <template v-slot="{ row }">
                      <span class="link-type">{{ row.title }}</span>
                      <el-tag v-if="row.type === 1">单选题</el-tag>
                      <el-tag v-else-if="row.type === 2">一般多选题</el-tag>
                      <el-tag v-else-if="row.type === 3">程序多选题</el-tag>
                      <el-tag v-else>其他题型</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="内容"
                    min-width="150px"
                    align="center"
                  >
                    <template v-slot="{ row }">
                      <span>{{ row.content }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    align="center"
                    width="330"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row, $index }">
                      <el-button type="primary" @click="handleCheck(row)">
                        查看
                      </el-button>
                      <el-button type="success" @click="handleMove(row)">
                        移动
                      </el-button>
                      <el-button
                        type="danger"
                        @click="handleDelete(row, $index)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <pagination
                  v-show="total > 0"
                  :total="total"
                  v-model:page="listQuery.page"
                  v-model:limit="listQuery.limit"
                  @pagination="updateProblemList"
                />

                <el-dialog
                  title="移动问题至"
                  v-model="ProblemDialogVisible"
                  :append-to-body="true"
                >
                  <el-form
                    ref="dataForm"
                    :model="moveFavoriteModel"
                    label-position="left"
                    label-width="70px"
                    style="width: 400px; margin-left: 50px"
                  >
                    <el-form-item label="命名" prop="name">
                      <el-select
                        v-model="moveFavoriteModel.name"
                        style="width: 140px"
                        class="filter-item"
                      >
                        <el-option
                          v-for="item in favoriteList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="是否复制" prop="shouldDelete">
                      <el-select
                        v-model="moveFavoriteModel.shouldDelete"
                        style="width: 140px"
                        class="filter-item"
                      >
                        <el-option :label="'是'" :value="true" />
                        <el-option :label="'否'" :value="false" />
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div class="dialog-footer">
                    <el-button
                      @click="ProblemDialogVisible = false"
                      size="small"
                    >
                      取消
                    </el-button>
                    <el-button type="primary" @click="MoveProblem" size="small">
                      确定
                    </el-button>
                  </div>
                </el-dialog>

                <el-dialog
                  title="创建新收藏夹"
                  v-model="FavoriteDialogVisible"
                  :append-to-body="true"
                >
                  <el-form
                    ref="dataForm"
                    :rules="rules"
                    :model="temp"
                    label-position="left"
                    label-width="70px"
                    style="width: 400px; margin-left: 50px"
                  >
                    <el-form-item label="名称" prop="name">
                      <el-input v-model="temp.name" />
                    </el-form-item>
                  </el-form>
                  <div class="dialog-footer">
                    <el-button
                      @click="FavoriteDialogVisible = false"
                      size="small"
                    >
                      取消
                    </el-button>
                    <el-button type="primary" @click="addFavorite" size="small">
                      确定
                    </el-button>
                  </div>
                </el-dialog>
                <el-dialog
                  title="题目"
                  v-model="ProblemVisible"
                  :append-to-body="true"
                >
                  <el-scrollbar>
                    <div class="block-content">
                      <hr v-if="problem.classification >= 0" />
                      <div v-if="problem.classification === -1">题目不存在</div>
                      <div v-else-if="problem.classification <= 1">
                        <span class="problem-text">{{ problem.content }}</span>
                        <div v-html="codeHtml"></div>
                        <div v-for="(sp, index) in problem.subproblem">
                          <span class="problem-text">{{ sp.content }}</span>
                          <div class="answer" v-if="sp.choice.length === 4">
                            <ol type="A">
                              <li
                                v-for="(c, i) in sp.choice"
                                :class="{
                                  correct:
                                    String.fromCharCode(65 + i) ===
                                      problem.answer[index] && ShowAnswer,
                                }"
                              >
                                &nbsp;&nbsp;{{ c }}
                              </li>
                            </ol>
                          </div>
                          <div class="answer" v-else>
                            <el-radio-group v-model="sp.radio" size="large">
                              <el-radio label="A">正确</el-radio>
                              <el-radio label="B">错误</el-radio>
                            </el-radio-group>
                          </div>
                        </div>
                      </div>
                      <el-switch
                        v-model="ShowAnswer"
                        active-text="查看答案解析"
                      ></el-switch>
                      <div class="problem-text" v-if="ShowAnswer">
                        {{ problem.explanation }}
                      </div>
                    </div>
                  </el-scrollbar>
                </el-dialog>
              </div>
            </el-main>
          </el-container>
          <Footer />
        </div>
      </el-scrollbar>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableKey: 0,
      list: [
        // {
        //   title: "test", //string
        //   id: 1, //string
        //   content: "This is a test problem", //20-30 characters
        //   type: 1, //
        //   date: "2022-09-19",
        // },
      ],
      listLoading: false,
      favoriteList: [
        // {
        //   name: "默认收藏夹",
        //   id: "0",
        // },
      ],
      favoriteId: "0",
      total: 1,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        type: undefined,
        sort: "+id",
      },
      sortOptions: [
        { label: "升序", key: "+id" },
        { label: "降序", key: "-id" },
      ],
      temp: {
        name: "",
      },
      moveFavoriteModel: {
        name: "0",
        shouldDelete: true,
      },
      rules: {
        name: [
          { required: true, message: "请输入收藏夹名字", trigger: "change" },
        ],
      },
      ProblemDialogVisible: ref(false),
      ProblemVisible: ref(false),
      FavoriteDialogVisible: ref(false),
      ShowAnswer: ref(false),
    };
  },
  computed: {
    codeHtml() {
      if (this.problem.code) {
        return marked.parse(this.problem.code);
      } else {
        return "";
      }
    },
  },
  created() {
    this.updateFavoriteList();
    this.updateProblemList();
  },
  methods: {
    updateFavoriteList() {
      FavoriteService.getFavoriteList().then((list) => {
        console.log(list);
        if (list == null) {
          ElMessage({
            message: "更新收藏夹列表发生错误",
            type: "error",
          });
        } else {
          this.favoriteList = list;
        }
        console.log("updateFavoriteList()", this.favoriteList);
      });
    },
    updateProblemList() {
      this.listLoading = true;
      FavoriteService.getProblemScratch(
        this.listQuery.page,
        this.listQuery.limit,
        this.favoriteId
      ).then((list) => {
        if (list != null) {
          this.list = list;
        } else {
          ElMessageBox.alert("加载题目列表失败！", "错误", {
            confirmButtonText: "OK",
          });
        }
        this.listLoading = false;
      });
    },
    handleChangeFavorite() {
      this.updateProblemList();
      for (const fav of this.favoriteList) {
        if (fav.id == this.favoriteId) {
          this.total = fav.problemNum;
          break;
        }
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.updateProblemList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    handleAddFavorite() {
      this.FavoriteDialogVisible = ref(true);
    },
    addFavorite() {
      console.log("name", this.temp.name);
      FavoriteService.addFavorite(this.temp.name).then((code) => {
        if (code == 200) {
          ElMessage({
            message: "创建成功！",
            type: "success",
          });
          this.updateFavoriteList();
        } else {
          ElMessage({
            message: "创建收藏夹失败！",
            type: "error",
          });
        }
      });
      this.FavoriteDialogVisible = ref(false);
    },
    handleDeleteFavorite() {
      ElMessageBox.alert("您确定要删除当前收藏夹吗？该操作不可恢复！", "警告", {
        cancelButtonText: "Cancel",
        confirmButtonText: "OK",
        callback: () => {
          FavoriteService.deleteFavorite(this.favoriteId).then((code) => {
            if (code == 200) {
              this.updateFavoriteList();
              this.updateProblemList();
            } else {
              ElMessage({
                type: "error",
                message: "删除收藏夹时出错",
              });
            }
          });
        },
      });
    },
    handleCheck(row) {
      ProblemService.getProblemDetail(row.id).then(
        (problem) => {
          this.problem = problem;
          console.log(problem);
          for (var sp of this.problem.subproblem) {
            sp.radio = ref("A");
          }
          this.ProblemVisible = ref(true);
        },
        (error) => {
          ElMessage({
            type: "error",
            message: "获取题目详情时时出错",
          });
          console.log(error);
        }
      );
    },
    handleMove(row) {
      this.problemId = row.id;
      this.ProblemDialogVisible = ref(true);
      console.log(this.problemId);
    },
    MoveProblem() {
      FavoriteService.moveProblem(
        this.favoriteId,
        this.moveFavoriteModel.name,
        this.problemId,
        this.moveFavoriteModel.shouldDelete
      ).then((code) => {
        if (code == 200) {
          ElMessage({
            message: "移动问题成功！",
            type: "success",
          });
          this.updateProblemList();
        } else {
          ElMessage({
            message: "移动问题失败！",
            type: "error",
          });
        }
      });
      this.ProblemDialogVisible = ref(false);
    },
    handleDelete(row) {
      FavoriteService.deleteProblem(this.favoriteId, row.id).then((code) => {
        if (code === 200) {
          ElMessage({
            message: "删除成功！",
            type: "success",
          });
        } else {
          ElMessage({
            message: "删除失败！",
            type: "error",
          });
        }
      });
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";

li.correct {
  color: #00a8b1;
  font-weight: bold;
}
</style>
