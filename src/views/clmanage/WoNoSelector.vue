<template>
  <el-dialog
    title="选择生产工单号"
    v-model="visible"
    width="60%"
    @closed="handleClose"
  >
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchForm.woNo"
            placeholder="请输入生产工单号"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="woNoList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
    >
      <el-table-column prop="woNo" label="生产工单号" width="120" />


<el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="selectWoNo(row)">
            选择
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getPlshengchangongdanList } from '@/api/plmanage/plshengchangongdan';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

// 监听弹窗显示状态的变化，通知父组件更新 modelValue
watch(() => props.modelValue, (val) => {
  visible.value = val;
});

// 搜索表单数据，包含合同号
const searchForm = reactive({
  woNo: '',
  

});

// 查询参数，包含分页信息和搜索条件
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  woNo: ''
});

// 合同号列表数据（响应式），用于表格显示
const woNoList = ref([]);
// 总记录数（响应式），用于分页组件
const total = ref(0);
// 加载状态（响应式），控制表格的加载动画
const loading = ref(false);
// 弹窗显示状态
const visible = ref(false);

// 获取合同号列表
const getWoNoList = async () => {
  loading.value = true; // 开始加载，显示加载动画
  try {
    // 同步搜索表单的 Plshengchangongdan 到查询参数
    queryParams.woNo = searchForm.woNo;
    // 调用后端 API 获取分页数据
    const res = await getPlshengchangongdanList(queryParams);
    if (res.data && res.data.page && res.data.page.list) {
      // 设置表格数据为后端返回的分页列表
      woNoList.value = res.data.page.list;
      // 设置总记录数为后端返回的总条数
      total.value = res.data.page.totalRow;
    } else {
      ElMessage.error('返回的数据格式不正确');
    }
  } catch (error) {
    // 显示错误提示
    ElMessage.error('获取合同号列表失败: ' + error.message);
  } finally {
    // 结束加载，关闭加载动画
    loading.value = false;
  }
};

// 处理搜索操作
const handleSearch = () => {
  queryParams.pageNumber = 1; // 重置到第一页
  WoNoList(); // 触发数据获取
};

// 重置搜索条件
const resetSearch = () => {
  searchForm.woNo = ''; // 清空合同号搜索条件
  searchForm.woNo = '';
  queryParams.pageNumber = 1; // 重置到第一页
  WoNoList(); // 触发数据获取
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size; // 更新每页条数
  queryParams.pageNumber = 1; // 重置到第一页
  WoNoList(); // 触发数据获取
};

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page; // 更新当前页码
  WoNoList(); // 触发数据获取
};

// 处理表格行点击事件
const handleRowClick = (row) => {
  selectWoNo(row);
};

// 选择合同号
const selectWoNo = (woNo) => {
  // 通知父组件选中了合同号
  emit('select', woNo.woNo);
  // 关闭弹窗
  visible.value = false;
};

// 处理弹窗关闭事件
const handleClose = () => {
  searchForm.woNo = ''; // 清空合同号搜索条件
  queryParams.pageNumber = 1; // 重置到第一页
  emit('update:modelValue', false);
};

onMounted(() => {
  getWoNoList();
});
</script>

<style scoped>
/* 搜索栏样式 */
.search-bar {
  margin-bottom: 20px;
}

/* 分页容器样式 */
.pagination-container {
  margin-top: 20px;
  text-align: right;
}

/* 表格行鼠标悬停样式 */
:deep(.el-table__row) {
  cursor: pointer;
}

/* 表格行悬停背景色 */
:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>