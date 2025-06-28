<template>
  <div class="chakantongzhi">
    <el-table :data="tongzhiDetails" border style="width: 100%">
      <el-table-column prop="no" label="合同编号" />
      <el-table-column prop="spec" label="规格" />
      <el-table-column prop="itemnum" label="数量" />
      <el-table-column prop="unit" label="单位" />
      <el-table-column prop="noticeid" label="通知编号" />
      <el-table-column prop="noticename" label="通知名称" />
      <el-table-column prop="noticedeliver" label="通知校验人" />
      <el-table-column prop="noticeauther" label="通知作者" />
      <el-table-column prop="noticeinstead" label="通知替代型号" />
      <el-table-column prop="noticedrawno" label="通知图纸编号" />
      <el-table-column prop="noticeshenhe" label="通知审核者" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="noticebuilddate" label="通知创建日期" :formatter="formatDate" />
      <el-table-column prop="id" label="ID" />
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps } from 'vue';
import { ElMessage } from 'element-plus';
import { getTongzhiById } from '@/api/tongzhi/querentongzhi.js';

// 获取父组件传递的 noticeid
const props = defineProps({
  noticeid: {
    type: String,
    required: true
  }
});

// 查询参数
const queryParams = reactive({
  noticeid: props.noticeid,
  pageNumber: 1,
  pageSize: 10
});

// 通知详情数据
const tongzhiDetails = ref([]);
const total = ref(0);

// 格式化日期
const formatDate = (row, column, cellValue) => {
  if (!cellValue) return '';

  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// 获取通知详情
const getTongzhiDetails = async () => {
  try {
    const res = await getTongzhiById(queryParams);
    if (res.success) {
      tongzhiDetails.value = res.data.page.list;
      total.value = res.data.page.totalRow;
    } else {
      ElMessage.error(res.msg || '获取通知详情失败');
    }
  } catch (error) {
    console.error('获取通知详情失败:', error);
    ElMessage.error('获取通知详情失败');
  }
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size;
  queryParams.pageNumber = 1;
  getTongzhiDetails();
};

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page;
  getTongzhiDetails();
};

// 页面初始化
onMounted(() => {
  getTongzhiDetails();
});
</script>

<style scoped>
.chakantongzhi {
  padding: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>