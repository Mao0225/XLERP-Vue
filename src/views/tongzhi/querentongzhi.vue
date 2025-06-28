<template>
  <div class="querentongzhi-management">
    <div class="action-bar">
      <el-input v-model="queryParams.noticeid" placeholder="请输入通知ID搜索" style="width: 200px; margin-right: 10px;" clearable
        @clear="getQuerenTongzhiList()" @keyup.enter="getQuerenTongzhiList()" />
      <el-input v-model="queryParams.noticename" placeholder="请输入通知名称搜索" style="width: 200px; margin-right: 10px;" clearable
        @clear="getQuerenTongzhiList()" @keyup.enter="getQuerenTongzhiList()" />
      <el-button type="primary" @click="getQuerenTongzhiList()">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>
    </div>

    <el-table :data="querentongzhiList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="noticeid" label="通知编号" />
      <el-table-column prop="noticename" label="通知名称" />
      <el-table-column prop="noticedeliver" label="通知校验人" />
      <el-table-column prop="noticeauther" label="通知作者" />
      <el-table-column
        prop="noticestatus"
        label="通知状态"
        :formatter="formatNoticeStatus"
      />
      <el-table-column prop="contractno" label="合同编号" />
      <el-table-column prop="contractname" label="合同名称" />
      <el-table-column
        prop="noticebuilddate"
        label="通知创建日期"
        :formatter="formatDate"
      />
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="handleConfirmNotice(row)">确认通知</el-button>
          <el-button type="primary" size="small" @click="handleViewNotice(row)">查看通知</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-model:current-page="queryParams.pageNumber" v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 查看通知详情弹窗 -->
    <el-dialog
      v-model="viewNoticeVisible"
      title="查看通知详情"
      width="80%"
      top="5vh"
      destroy-on-close
      :before-close="handleViewNoticeClose"
      append-to-body
      :modal-append-to-body="true"
    >
      <!-- 使用v-if控制组件渲染，确保只有在弹窗显示时才渲染 -->
      <ChakanTongZhi 
        v-if="viewNoticeVisible"
        :noticeid="viewNoticeId"
        :visible="viewNoticeVisible"
        @close="handleViewNoticeClose"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getQuerenTongzhi, confirmNotice } from '@/api/tongzhi/querentongzhi.js';
import { useRouter } from 'vue-router';
import { Refresh } from '@element-plus/icons-vue';
import ChakanTongZhi from './chakantongzhi.vue'; // 引入查看通知组件

// 查询参数
const queryParams = reactive({
  noticeid: '',
  noticename: '',
  pageNumber: 1,
  pageSize: 10,
});

// 通知列表数据
const querentongzhiList = ref([]);
const total = ref(0);
const loading = ref(false);

const router = useRouter();

// 查看通知相关状态
const viewNoticeVisible = ref(false);
const viewNoticeId = ref('');

// 格式化通知状态
const formatNoticeStatus = (row, column, cellValue) => {
  const statusMap = {
    10: '录入',
    20: '确认',
    30: '通过校验',
    40: '通过审核'
  };
  return statusMap[cellValue] || cellValue;
};

// 格式化日期
const formatDate = (row, column, cellValue) => {
  if (!cellValue) return '';

  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// 获取通知列表
const getQuerenTongzhiList = async () => {
  loading.value = true;
  try {
    const params = {
      ...queryParams,
    };
    console.log('请求参数:', params);
    const res = await getQuerenTongzhi(params);
    console.log('后端返回数据:', res);
    if (res.success) {
      querentongzhiList.value = res.data.page.list;
      total.value = res.data.page.totalRow;
      console.log('通知列表:', querentongzhiList.value);
      console.log('总记录数:', total.value);
    } else {
      ElMessage.error(res.msg || '获取通知列表失败');
    }
  } catch (error) {
    console.error('获取通知列表失败:', error);
    ElMessage.error('获取通知列表失败');
  } finally {
    loading.value = false;
  }
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size;
  queryParams.pageNumber = 1;
  console.log('分页大小变更:', queryParams.pageSize);
  getQuerenTongzhiList();
};

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page;
  console.log('当前页变更:', queryParams.pageNumber);
  getQuerenTongzhiList();
};

// 刷新
const handleRefresh = () => {
  queryParams.noticeid = '';
  queryParams.noticename = '';
  queryParams.pageNumber = 1;
  getQuerenTongzhiList();
};

// 查看通知
const handleViewNotice = (row) => {
  // 先设置通知ID
  viewNoticeId.value = row.noticeid;
  
  // 使用nextTick确保DOM更新后再显示弹窗
  nextTick(() => {
    viewNoticeVisible.value = true;
  });
};

// 关闭查看通知弹窗
const handleViewNoticeClose = () => {
  viewNoticeVisible.value = false;
  // 重置通知ID
  viewNoticeId.value = '';
};

// 确认通知
const handleConfirmNotice = async (row) => {
  // 打印 row 对象，用于调试
  console.log('确认通知时的 row 对象:', row);

  // 检查 noticeid 是否存在
  if (!row.noticeid) {
    ElMessage.error('通知ID不能为空，请刷新页面重试');
    return;
  }

  // 显示确认对话框
  ElMessageBox.confirm(
    `你确定要确认通知吗？通知ID：${row.noticeid}`,
    '确认通知',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  .then(async () => {
    // 用户点击确定后执行的代码
    const noticedeliver = localStorage.getItem('realName');

    // 构造请求参数并打印
    const queryParams = {
      noticeid: row.noticeid
    };

    console.log('确认通知请求参数:', queryParams);

    try {
      // 打印请求URL，用于调试
      console.log('确认通知请求URL:', '/tongzhi/querentongzhi');
      console.log('确认通知请求参数:', queryParams);
      const res = await confirmNotice(queryParams);

      if (res.success) {
        ElMessage.success(res.msg);
        getQuerenTongzhiList(); // 刷新界面
      } else {
        ElMessage.error(res.msg);
      }
    } catch (error) {
      console.error('确认通知失败:', error);
      ElMessage.error('确认通知失败');
    }
  })
  .catch(() => {
    // 用户点击取消后执行的代码
    ElMessage.info('已取消操作');
  });
};

// 页面初始化
onMounted(() => {
  getQuerenTongzhiList();
});
</script>

<style scoped>
.querentongzhi-management {
  padding: 20px;
}

.action-bar {
  display: flex;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>