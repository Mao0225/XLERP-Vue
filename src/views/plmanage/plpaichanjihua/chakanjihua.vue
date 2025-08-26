<template>
  <div class="production-plan-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-input v-model="queryParams.scheduleCode" placeholder="请输入排产计划号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getPlpaichanjihuaPage" @keyup.enter="getPlpaichanjihuaPage" />
              <el-input v-model="queryParams.ipoNo" placeholder="请输入生产订单号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getPlpaichanjihuaPage" @keyup.enter="getPlpaichanjihuaPage" />
              <el-input v-model="queryParams.woNo" placeholder="请输入生产工单号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getPlpaichanjihuaPage" @keyup.enter="getPlpaichanjihuaPage" />
              <el-input v-model="queryParams.contractNo" placeholder="请输入厂内合同号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getPlpaichanjihuaPage" @keyup.enter="getPlpaichanjihuaPage" />

      <el-button type="primary" @click="getPlpaichanjihuaPage">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>

    </div>
    
    <!-- 表格展示 -->
    <el-table :data="plpaichanjihuaList" border v-loading="loading" style="width: 100%">
  <el-table-column type="index" label="序号" min-width="80" />
  <el-table-column prop="scheduleCode" label="排产计划号" min-width="200" />
  <el-table-column prop="contractNo" label="合同编号" min-width="120" />
    <el-table-column prop="itemName" label="物料名称" min-width="150" />
  <el-table-column prop="itemNo" label="物料编号" min-width="120" />
  <el-table-column prop="spec" label="物料型号" min-width="120" />
  <el-table-column prop="workshopName" label="生产车间" min-width="150" />
  <el-table-column prop="conamount" label="合同订货数" min-width="100" />
  <el-table-column prop="ddamount" label="关联订单货数" min-width="120" />
  <el-table-column prop="gdamount" label="关联工单货数" min-width="120" />

  <el-table-column prop="planStartDate" label="计划开始日期" min-width="180">
    <template #default="{ row }">
      {{ formatDate(row.planStartDate) }}
    </template>
  </el-table-column>
  <el-table-column prop="planFinishDate" label="计划完成日期" min-width="180">
    <template #default="{ row }">
      {{ formatDate(row.planFinishDate) }}
    </template>
  </el-table-column>
  <el-table-column prop="status" label="计划状态" min-width="120">
    <template #default="{ row }">
      {{ getStatusLabel(row.status) }}
    </template>
  </el-table-column>
  <el-table-column prop="writer" label="录入人" min-width="100" />
  <el-table-column prop="writetime" label="录入时间" min-width="120" />
  <el-table-column label="操作" min-width="300" fixed="right">
    <template #default="{ row }">
      <el-button type="primary" size="small" @click="handleWatch(row)">查看排产计划详情</el-button>
      <el-button 
        type="info" 
        size="small" 
        @click="handleViewBeiliaoPlan(row)"
      >查看备料计划</el-button>          
    </template>
  </el-table-column>
</el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next,Jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 表单弹窗 -->
    <ProductionPlanForm
      v-model:visible="dialogVisible"
      :type="dialogType"
      :form-data="formData"
      :dep-no="userStore.depNo"
      @cancel="handleFormCancel"
    />

    <!-- 备料计划弹窗 -->
    <chakanbeiliaodan 
      v-model:visible="viewBeiliaoVisible"
      :contractno="viewBeiliaoContractNo"
      :gdItemId="viewBeiliaoGdItemId"
      @update:visible="viewBeiliaoVisible = $event"
      @cancel="handleViewBeiliaoClose"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getPlpaichanjihuaListByDepNo, getPlpaichanjihuaById } from '@/api/plmanage/plpaichanjihua';
import ProductionPlanForm from './chakanjihuaForm.vue';
import chakanbeiliaodan from './components/chakanbeiliaodan.vue';
import { getBasDepartmentOptions } from '@/api/system/department';
import { useUserStore } from '@/store/user'
const userStore = useUserStore()


// 计划状态选项
const statusOptions = [
  { id: 1, value: '待处理' },
  { id: 2, value: '处理中' },
  { id: 3, value: '已完成' },
  { id: 4, value: '已取消' },
  { id: 5, value: '已过期' }
];

// 获取状态标签
const getStatusLabel = (status) => {
  const item = statusOptions.find(option => option.id === status);
  return item ? item.value : '未知状态';
};

// 格式化日期
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};

// 查询参数
const queryParams = reactive({
  contractNo:'',
  woNo: '',
  ipoNo: '',
  scheduleCode: '',
  pageNumber: 1,
  pageSize: 10,
  depNo: userStore.depNo
});

// 排产计划列表数据
const plpaichanjihuaList = ref([]);
const total = ref(0);
const loading = ref(false);

// 弹窗表单相关
const dialogVisible = ref(false);
const dialogType = ref('add');
const formData = ref({});

// 备料计划相关
const viewBeiliaoVisible = ref(false);
const viewBeiliaoGdItemId = ref(''); // 修正为字符串类型
const viewBeiliaoContractNo = ref('');

// 关闭查看备料计划弹窗
const handleViewBeiliaoClose = () => {
  console.log('关闭备料计划弹窗');
  viewBeiliaoVisible.value = false;
  viewBeiliaoContractNo.value = '';
  viewBeiliaoGdItemId.value = '';
};

// 查看备料计划
const handleViewBeiliaoPlan = (row) => {
  console.log('查看备料计划，row:', row);
  viewBeiliaoContractNo.value = row.contractNo;
  viewBeiliaoGdItemId.value = row.gdItemId || ''; // 确保有值
  viewBeiliaoVisible.value = true;
};



// 生产车间列表对应编号
const workshopOptions = ref([])

// 获取车间数据
const loadWorkshopData = async () => {
  try {
    const res = await getBasDepartmentOptions();
    if (!res.success) {
      console.error(res.msg);
      return;
    }
    workshopOptions.value = res.data.options || [];
  } catch (error) {
    console.error('加载车间数据失败');
  }
}

// 处理编号对应的名称显示
const getWorkshopName = (codes) => {
  if (!codes) {
    return '';
  }
  
  if (workshopOptions.value.length === 0) {
    return codes; 
  }
  
  const codeArray = codes.split(',');
  
  const names = codeArray.map(code => {
    const trimmedCode = code.trim();
    const workshop = workshopOptions.value.find(option => option.code === trimmedCode);
    return workshop ? workshop.name : code;
  });
  
  return names.join(',');
}

// 获取排产计划列表
const getPlpaichanjihuaPage = async () => {
  loading.value = true;
  try {
    const res = await getPlpaichanjihuaListByDepNo(queryParams);
    console.log('获取排产计划列表响应:', res);
    
    // 处理每条记录的workshopName字段
    plpaichanjihuaList.value = res.data.page.list.map(item => ({
      ...item,
      workshopName: getWorkshopName(item.workshopName)
    }));
    
    total.value = res.data.page.totalRow;
  } catch (error) {
    console.error('获取排产计划列表失败:', error);
    ElMessage.error('获取排产计划列表失败');
  } finally {
    loading.value = false;
  }
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size;
  getPlpaichanjihuaPage();
};

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page;
  getPlpaichanjihuaPage(); // 修正函数名
};

// 刷新
const handleRefresh = () => {
  queryParams.contractNo = '';
  queryParams.woNo = '';
  queryParams.ipoNo = '';
  queryParams.scheduleCode = '';
  queryParams.pageNumber = 1;
  getPlpaichanjihuaPage();
};

// 新增排产计划
const handleAdd = () => {
  dialogType.value = 'add';
  formData.value = {};
  dialogVisible.value = true;
};

// 编辑排产计划
const handleWatch = async (row) => {
  const res = await getPlpaichanjihuaById({ id: row.id });
  formData.value = res.data.plpaichanjihua;
  dialogVisible.value = true;
};



// 处理表单取消
const handleFormCancel = () => {
  console.log('表单取消');
  dialogVisible.value = false;
};

// 监听弹窗关闭
watch(dialogVisible, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    getPlpaichanjihuaPage();
  }
});

// 页面初始化
onMounted(() => {
  console.log('页面初始化，加载排产计划列表');
  loadWorkshopData();
  getPlpaichanjihuaPage();
});
</script>

<style scoped>
.production-plan-management {
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
.el-table .cell {
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 溢出时显示省略号 */
}
</style>