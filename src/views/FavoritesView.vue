<script setup>
import { Edit, Search } from "@element-plus/icons-vue";
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import Pagination from "@/components/Pagination.vue";
import FavoriteService from "@/services/favorites.service";
import { ref } from "vue";
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
                  <el-input
                    v-model="listQuery.title"
                    placeholder="标题"
                    style="width: 200px"
                    class="filter-item"
                  />
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
                </div>

                <el-table
                  :key="tableKey"
                  v-loading="problemLoading"
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
                />

                <el-dialog
                  title="移动问题至"
                  v-model="dialogSelectVisible"
                  :append-to-body="true"
                >
                  <div class="dialog-footer">
                    <el-button
                      @click="dialogSelectVisible = false"
                      size="small"
                    >
                      取消
                    </el-button>
                    <el-button type="primary" @click="MoveProblem" size="small">
                      确定
                    </el-button>
                  </div>
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
        {
          title: "test", //string
          id: 1, //string
          content: "This is a test problem", //20-30 characters
          type: 1, //
          date: "2022-09-19",
        },
      ],
      favoriteId: 0,
      total: 1,
      problemLoading: false,
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
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" },
        ],
      },
      dialogSelectVisible: ref(false),
    };
  },
  created() {
    //FavoriteService.getFavoriteList().then(() => {});
    this.updateProblemList();
  },
  methods: {
    updateProblemList() {},
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success",
      });
      row.status = status;
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
    handleAddFavorite() {},
    handleCheck(row) {
      console.log(row);
    },
    handleMove(row) {
      this.problemId = row.id;
      this.dialogSelectVisible = ref(true);
      console.log(this.problemId);
    },
    MoveProblem() {
      FavoriteService.moveProblem(
        this.srcId,
        this.dstId,
        this.problemId,
        true
      ).then((response) => {
        if (response.status === "success") {
          ElMessage({
            message: "移动问题成功！",
            type: "success",
          });
          this.updateProblemList();
        } else {
          ElMessage({
            message: "移动问题失败！",
            type: "success",
          });
        }
      });
    },
    handleDelete(row) {
      FavoriteService.deleteProblem(this.favoriteId, row.id).then(
        (response) => {
          if (response.status === "success") {
            ElMessage({
              message: "删除成功！",
              type: "success",
            });
          } else {
            ElMessage({
              message: "删除失败！",
              type: "success",
            });
          }
        }
      );
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
</style>
