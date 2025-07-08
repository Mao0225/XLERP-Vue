<template>
  <div class="shenhetongzhi-management">
    <div class="action-bar">
      <el-input v-model="queryParams.noticeid" placeholder="请输入通知ID搜索" style="width: 200px; margin-right: 10px;" clearable
        @clear="getShenHeTongZhiList()" @keyup.enter="getShenHeTongZhiList()" />
      <el-input v-model="queryParams.noticename" placeholder="请输入通知名称搜索" style="width: 200px; margin-right: 10px;" clearable
        @clear="getShenHeTongZhiList()" @keyup.enter="getShenHeTongZhiList()" />
      <el-button type="primary" @click="getShenHeTongZhiList()">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>
    </div>

    <el-table :data="shenhetongzhiList" border v-loading="loading" style="width: 100%">
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
      <el-table-column label="操作" width="420">
        <template #default="{ row }">
          <el-button 
            type="success" 
            size="small" 
            @click="handleApproveNotice(row)"
            :disabled="row.noticestatus !== '30'"
          >审核通知</el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="handleUnapproveNotice(row)"
            :disabled="row.noticestatus !== '40'"
          >反审核通知</el-button>
          <el-button type="primary" size="small" @click="handleViewNotice(row)">查看通知</el-button>
          <el-button 
            type="info" 
            size="small" 
            @click="handleViewBeiliaoPlan(row)"
            
          >查看备料计划</el-button>
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
      <ChakanShenHeTongZhi 
        v-if="viewNoticeVisible"
        :noticeid="viewNoticeId"
        :visible="viewNoticeVisible"
        @close="handleViewNoticeClose"
      />
    </el-dialog>

    <!-- 查看备料计划弹窗 -->
    <el-dialog
      v-model="viewBeiliaoVisible"
      title="查看备料计划"
      width="90%"
      top="5vh"
      destroy-on-close
      :before-close="handleViewBeiliaoClose"
      append-to-body
      :modal-append-to-body="true"
    >
      <ChakanBeiliaoDan 
        v-if="viewBeiliaoVisible"
        :noticeid="viewBeiliaoNoticeId"
        :noticedrawno="viewBeiliaoNoticeDrawno"
        :contractno="viewBeiliaoContractNo"
        :contractname="viewBeiliaoContractName"
        :visible="viewBeiliaoVisible"
        @close="handleViewBeiliaoClose"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getShenHeTongZhi, shenhenNotice, fanshenheyanmNotice } from '@/api/tongzhi/querentongzhi.js';
import { useRouter } from 'vue-router';
import { Refresh } from '@element-plus/icons-vue';
import ChakanShenHeTongZhi from './chakanshenhetongzhi.vue'; // 引入查看审核通知组件
import ChakanBeiliaoDan from './chakanbeiliaodan.vue'; // 引入查看备料单组件

// 查询参数
const queryParams = reactive({
  noticeid: '',
  noticename: '',
  pageNumber: 1,
  pageSize: 10,
});

// 通知列表数据
const shenhetongzhiList = ref([]);
const total = ref(0);
const loading = ref(false);

const router = useRouter();

// 查看通知相关状态
const viewNoticeVisible = ref(false);
const viewNoticeId = ref('');

// 查看备料计划相关状态
const viewBeiliaoVisible = ref(false);
const viewBeiliaoNoticeId = ref('');
const viewBeiliaoNoticeDrawno = ref('');
const viewBeiliaoContractNo = ref('');
const viewBeiliaoContractName = ref('');

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

// 获取审核通知列表
const getShenHeTongZhiList = async () => {
  loading.value = true;
  try {
    const params = {
      ...queryParams,
    };
    console.log('请求参数:', params);
    const res = await getShenHeTongZhi(params);
    console.log('后端返回数据:', res);
    if (res.success) {
      shenhetongzhiList.value = res.data.page.list;
      total.value = res.data.page.totalRow;
      console.log('通知列表:', shenhetongzhiList.value);
      console.log('总记录数:', total.value);
    } else {
      ElMessage.error(res.msg || '获取审核通知列表失败');
    }
  } catch (error) {
    console.error('获取审核通知列表失败:', error);
    ElMessage.error('获取审核通知列表失败');
  } finally {
    loading.value = false;
  }
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size;
  queryParams.pageNumber = 1;
  console.log('分页大小变更:', queryParams.pageSize);
  getShenHeTongZhiList();
};

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page;
  console.log('当前页变更:', queryParams.pageNumber);
  getShenHeTongZhiList();
};

// 刷新
const handleRefresh = () => {
  queryParams.noticeid = '';
  queryParams.noticename = '';
  queryParams.pageNumber = 1;
  getShenHeTongZhiList();
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

// 审核通知
const handleApproveNotice = async (row) => {
  // 打印 row 对象，用于调试
  console.log('审核通知时的 row 对象:', row);

  // 检查 noticeid 是否存在
  if (!row.noticeid) {
    ElMessage.error('通知ID不能为空，请刷新页面重试');
    return;
  }

  // 检查状态是否为30（通过校验）
  if (row.noticestatus !== '30') {
    ElMessage.warning('只有状态为"通过校验"的通知才能进行审核操作');
    return;
  }

  // 显示确认对话框
  ElMessageBox.confirm(
    `你确定要审核通知吗？通知ID：${row.noticeid}`,
    '审核通知',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  .then(async () => {
    // 用户点击确定后执行的代码
    const noticeshenhe = localStorage.getItem('realName');

    // 构造请求参数并打印
    const params = {
      noticeid: row.noticeid,
      noticeshenhe: noticeshenhe
    };

    console.log('审核通知请求参数:', params);

    try {
      // 打印请求URL，用于调试
      console.log('审核通知请求URL:', '/tongzhi/shenhetongzhi');
      console.log('审核通知请求参数:', params);
      const res = await shenhenNotice(params);

      if (res.success) {
        ElMessage.success(res.msg);
        getShenHeTongZhiList(); // 刷新界面
      } else {
        ElMessage.error(res.msg);
      }
    } catch (error) {
      console.error('审核通知失败:', error);
      ElMessage.error('审核通知失败');
    }
  })
  .catch(() => {
    // 用户点击取消后执行的代码
    ElMessage.info('已取消操作');
  });
};

// 反审核通知
const handleUnapproveNotice = async (row) => {
  // 检查 noticeid 是否存在
  if (!row.noticeid) {
    ElMessage.error('通知ID不能为空，请刷新页面重试');
    return;
  }

  // 检查状态是否为40（通过审核）
  if (row.noticestatus !== '40') {
    ElMessage.warning('只有状态为"通过审核"的通知才能进行反审核操作');
    return;
  }

  // 显示确认对话框
  ElMessageBox.confirm(
    `你确定要反审核通知吗？通知ID：${row.noticeid}`,
    '反审核通知',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  .then(async () => {
    try {
      // 调用反审核通知接口
      const res = await fanshenheyanmNotice({ noticeid: row.noticeid });
      
      if (res.success) {
        ElMessage.success(res.msg);
        getShenHeTongZhiList(); // 刷新界面
      } else {
        ElMessage.error(res.msg);
      }
    } catch (error) {
      console.error('反审核通知失败:', error);
      ElMessage.error('反审核通知失败');
    }
  })
  .catch(() => {
    ElMessage.info('已取消操作');
  });
};

// 查看备料计划
const handleViewBeiliaoPlan = (row) => {
  // 检查状态是否为30（通过校验）或40（通过审核）
  //if (row.noticestatus !== '30' && row.noticestatus !== '40') {
  //  ElMessage.warning('只有状态为"通过校验"或"通过审核"的通知才能查看备料计划');
  //  return;
  //}
  
  // 设置备料计划弹窗所需参数
  viewBeiliaoNoticeId.value = row.noticeid;
  viewBeiliaoNoticeDrawno.value = row.noticedrawno || '';
  viewBeiliaoContractNo.value = row.contractno;
  viewBeiliaoContractName.value = row.contractname;
  
  nextTick(() => {
    viewBeiliaoVisible.value = true;
  });
};

// 关闭查看备料计划弹窗
const handleViewBeiliaoClose = () => {
  viewBeiliaoVisible.value = false;
  viewBeiliaoNoticeId.value = '';
  viewBeiliaoNoticeDrawno.value = '';
  viewBeiliaoContractNo.value = '';
  viewBeiliaoContractName.value = '';
};

// 页面初始化
onMounted(() => {
  getShenHeTongZhiList();
});
</script>

<style scoped>
.shenhetongzhi-management {
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
  