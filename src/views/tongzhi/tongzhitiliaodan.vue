<template>
  <div class="tongzhitiliaodan-management">
    <div class="action-bar">
      <el-input v-model="queryParams.noticeid" placeholder="请输入通知ID搜索" style="width: 200px; margin-right: 10px;" clearable
        @clear="getTongZhiTiLiaoDanList()" @keyup.enter="getTongZhiTiLiaoDanList()" />
      <el-input v-model="queryParams.noticename" placeholder="请输入通知名称搜索" style="width: 200px; margin-right: 10px;" clearable
        @clear="getTongZhiTiLiaoDanList()" @keyup.enter="getTongZhiTiLiaoDanList()" />
      <el-button type="primary" @click="getTongZhiTiLiaoDanList()">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>
    </div>

    <el-table :data="tongzhitiliaodanList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="noticeid" label="通知编号" />
      <el-table-column prop="noticename" label="通知名称" />
      <el-table-column prop="noticedeliver" label="通知校验人" />
      <el-table-column prop="noticeshenhe" label="通知审核人" />
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
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleViewTiLiaoDan(row)">查看提料单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-model:current-page="queryParams.pageNumber" v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 查看提料单详情弹窗 -->
    <el-dialog
      v-model="viewTiLiaoDanVisible"
      title="查看提料单详情"
      width="80%"
      top="5vh"
      destroy-on-close
      :before-close="handleViewTiLiaoDanClose"
      append-to-body
      :modal-append-to-body="true"
    >
      <!-- 使用v-if控制组件渲染，确保只有在弹窗显示时才渲染 -->
      <TiLiaoDan 
        v-if="viewTiLiaoDanVisible"
        :noticeid="viewNoticeId"
        :visible="viewTiLiaoDanVisible"
        @close="handleViewTiLiaoDanClose"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getshenhehoutongzhi } from '@/api/tongzhi/querentongzhi.js';
import { useRouter } from 'vue-router';
import { Refresh } from '@element-plus/icons-vue';
import TiLiaoDan from './tiliaodan.vue'; // 引入提料单组件

// 查询参数
const queryParams = reactive({
  noticeid: '',
  noticename: '',
  pageNumber: 1,
  pageSize: 10,
});

// 通知列表数据
const tongzhitiliaodanList = ref([]);
const total = ref(0);
const loading = ref(false);

const router = useRouter();

// 查看提料单相关状态
const viewTiLiaoDanVisible = ref(false);
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

// 获取提料单通知列表
const getTongZhiTiLiaoDanList = async () => {
  loading.value = true;
  try {
    const params = {
      ...queryParams,
    };
    console.log('请求参数:', params);
    const res = await getshenhehoutongzhi(params);
    console.log('后端返回数据:', res);
    if (res.success) {
      tongzhitiliaodanList.value = res.data.page.list;
      total.value = res.data.page.totalRow;
      console.log('通知列表:', tongzhitiliaodanList.value);
      console.log('总记录数:', total.value);
    } else {
      ElMessage.error(res.msg || '获取提料单通知列表失败');
    }
  } catch (error) {
    console.error('获取提料单通知列表失败:', error);
    ElMessage.error('获取提料单通知列表失败');
  } finally {
    loading.value = false;
  }
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size;
  queryParams.pageNumber = 1;
  console.log('分页大小变更:', queryParams.pageSize);
  getTongZhiTiLiaoDanList();
};

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page;
  console.log('当前页变更:', queryParams.pageNumber);
  getTongZhiTiLiaoDanList();
};

// 刷新
const handleRefresh = () => {
  queryParams.noticeid = '';
  queryParams.noticename = '';
  queryParams.pageNumber = 1;
  getTongZhiTiLiaoDanList();
};

// 查看提料单
const handleViewTiLiaoDan = (row) => {
  // 先设置通知ID
  viewNoticeId.value = row.noticeid;
  
  // 使用nextTick确保DOM更新后再显示弹窗
  nextTick(() => {
    viewTiLiaoDanVisible.value = true;
  });
};

// 关闭查看提料单弹窗
const handleViewTiLiaoDanClose = () => {
  viewTiLiaoDanVisible.value = false;
  // 重置通知ID
  viewNoticeId.value = '';
};

// 页面初始化
onMounted(() => {
  getTongZhiTiLiaoDanList();
});
</script>

<style scoped>
.tongzhitiliaodan-management {
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