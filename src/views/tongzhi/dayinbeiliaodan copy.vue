<template>
  <div class="beiliaodan-container">
    <div class="toolbar">
      <el-button type="primary" @click="handlePrint">打印备料单</el-button>
    </div>
    
    <el-form :model="queryParams" size="small" label-width="80px" class="search-form">
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="通知编号">
            <el-input v-model="queryParams.noticeid" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="图纸编号">
            <el-input v-model="queryParams.noticedrawno" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同编号">
            <el-input v-model="queryParams.contractno" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工程名称">
            <el-input v-model="queryParams.contractname" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="制定日期">
            <el-input v-model="queryParams.zhidingriqi" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="提料时间">
            <el-input v-model="queryParams.tiliaoshijian" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="交货时间">
            <el-input v-model="queryParams.jiaohuoshijian" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="编制人">
            <el-input v-model="queryParams.bianzhiren" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="校验人">
            <el-input v-model="queryParams.jiaoyanren" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="审核人">
            <el-input v-model="queryParams.shenheren" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="制定部门">
            <el-input v-model="queryParams.zhidingbumen" readonly />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


    <el-table
      :data="mergedBeiliaoList"
      border
      size="small"
      style="width: 100%"
    >
      <el-table-column label="序号" width="60">
        <template #default="scope">
          {{ (queryParams.pageNumber - 1) * queryParams.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="sxclitemno" label="所需子材料编码" />
      <el-table-column prop="sxclname" label="所需子材料名称" />
      <el-table-column prop="unit" label="单位" />
      <el-table-column prop="sxcltihuoshuliang" label="计划子材料数量" />
      <el-table-column prop="sxclshijishuliang" label="实际备货数量" />
      <el-table-column prop="sxclcaizhi" label="材质" />
    </el-table>


    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="queryParams.pageNumber"
      :page-size="queryParams.pageSize"
      layout="total, prev, pager, next"
      :total="total"
    ></el-pagination>


    <!-- 打印区域 -->
    <div id="print-area" class="print-area">
      <!-- 循环生成每一页的内容 -->
      <div v-for="page in totalPages" :key="page" class="print-page">
        <div class="print-header">
          <h1 class="print-title">备料单</h1>
          <div class="print-info mt-4">
            <div class="print-info-block">
              <div class="print-info-row">
                <span class="print-label">通知编号：</span>
                <span class="print-value">{{ queryParams.noticeid }}</span>
                <span class="print-label">图纸编号：</span>
                <span class="print-value">{{ queryParams.noticedrawno }}</span>
              </div>
              <div class="print-info-row">
                <span class="print-label">合同编号：</span>
                <span class="print-value">{{ queryParams.contractno }}</span>
                <span class="print-label">工程名称：</span>
                <span class="print-value">{{ queryParams.contractname }}</span>
              </div>
              <div class="print-info-row">
                <span class="print-label">制定日期：</span>
                <span class="print-value">{{ queryParams.zhidingriqi }}</span>
                <span class="print-label">提料时间：</span>
                <span class="print-value">{{ queryParams.tiliaoshijian }}</span>
              </div>
              <div class="print-info-row">
                <span class="print-label">交货时间：</span>
                <span class="print-value">{{ queryParams.jiaohuoshijian }}</span>
                <span class="print-label">编制人：</span>
                <span class="print-value">{{ queryParams.bianzhiren }}</span>
              </div>
              <div class="print-info-row">
                <span class="print-label">校验人：</span>
                <span class="print-value">{{ queryParams.jiaoyanren }}</span>
                <span class="print-label">审核人：</span>
                <span class="print-value">{{ queryParams.shenheren }}</span>
              </div>
              <div class="print-info-row">
                <span class="print-label">制定部门：</span>
                <span class="print-value">{{ queryParams.zhidingbumen || (beiliaoList.length > 0 ? beiliaoList[0].zhidingbumen : '') }}</span>
                <span class="print-label">页码：</span>
                <span class="print-value">{{ page }} / {{ totalPages }}</span>
              </div>
            </div>
          </div>
        </div>


        <div class="print-table-wrapper">
          <table class="print-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>所需子材料编码</th>
                <th>所需子材料名称</th>
                <th>单位</th>
                <th>计划子材料数量</th>
                <th>实际备货数量</th>
                <th>材质</th>
              </tr>
            </thead>
            <tbody>
              <!-- 只显示当前页的数据 -->
              <tr v-for="(row, index) in getPageData(page)" :key="index">
                <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
                <td>{{ row.sxclitemno }}</td>
                <td>{{ row.sxclname }}</td>
                <td>{{ row.unit }}</td>
                <td>{{ row.sxcltihuoshuliang }}</td>
                <td>{{ row.sxclshijishuliang }}</td>
                <td>{{ row.sxclcaizhi }}</td>
              </tr>
            </tbody>
          </table>
        </div>


        <!-- 页脚只在最后一页显示 -->
        <div class="print-footer" v-if="page === totalPages">
          <div class="print-date">打印日期：{{ currentDate }}</div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { getbeiliaojihuabynoticepage, saveBeiliaojihua } from '@/api/tongzhi/beiliaodan.js';


const props = defineProps({
  noticeid: {
    type: String,
    required: true
  },
  noticedrawno: {
    type: String,
    required: true
  },
  contractno: {
    type: String,
    required: true
  },
  contractname: {
    type: String,
    required: true
  }
});


const emit = defineEmits(['close']);


// 查询参数
const queryParams = reactive({
  noticeid: props.noticeid,
  noticedrawno: props.noticedrawno,
  contractno: props.contractno,
  contractname: props.contractname,
  pageNumber: 1,
  pageSize: 10000, // 加载全部数据用于打印
  zhidingriqi: '',
  tiliaoshijian: '',
  jiaohuoshijian: '',
  bianzhiren: '',
  jiaoyanren: '',
  shenheren: '',
  zhidingbumen: ''
});


// 数据列表
const beiliaoList = ref([]);
const total = ref(0);


// 每页打印的项目数量
const itemsPerPage = 25;


// 合并后的材料列表
const mergedBeiliaoList = computed(() => {
  const mergedMap = new Map();
  
  beiliaoList.value.forEach(item => {
    const key = `${item.sxclitemno}-${item.sxclname}-${item.unit}-${item.sxclshuliang}-${item.sxclcaizhi}`;
    
    if (mergedMap.has(key)) {
      const mergedItem = mergedMap.get(key);
      mergedItem.sxcltihuoshuliang += parseFloat(item.sxcltihuoshuliang) || 0;
      mergedItem.sxclshijishuliang += parseFloat(item.sxclshijishuliang) || 0;
    } else {
      mergedMap.set(key, {
        ...item,
        sxcltihuoshuliang: parseFloat(item.sxcltihuoshuliang) || 0,
        sxclshijishuliang: parseFloat(item.sxclshijishuliang) || 0
      });
    }
  });
  
  return Array.from(mergedMap.values());
});


// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(mergedBeiliaoList.value.length / itemsPerPage);
});


// 获取指定页的数据
const getPageData = (page) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return mergedBeiliaoList.value.slice(startIndex, endIndex);
};


// 加载备料计划数据
const loadBeiliaoData = async () => {
  let loading = null;
  try {
    loading = ElLoading.service({
      lock: true,
      text: '加载数据中...',
      background: 'rgba(0, 0, 0, 0.7)'
    });


    const res = await getbeiliaojihuabynoticepage(queryParams);
    if (res.success) {
      beiliaoList.value = res.data.page.list || [];
      total.value = res.data.page.totalRow || 0;
      
      if (beiliaoList.value.length > 0) {
        const firstItem = beiliaoList.value[0];
        queryParams.zhidingriqi = firstItem.zhidingriqi || '';
        queryParams.tiliaoshijian = firstItem.tiliaoshijian || '';
        queryParams.jiaohuoshijian = firstItem.jiaohuoshijian || '';
        queryParams.bianzhiren = firstItem.bianzhiren || '';
        queryParams.jiaoyanren = firstItem.jiaoyanren || '';
        queryParams.shenheren = firstItem.shenheren || '';
        queryParams.zhidingbumen = firstItem.zhidingbumen || '';
      }
    } else {
      ElMessage.error(res.msg || '获取备料计划失败');
    }
  } catch (error) {
    ElMessage.error('获取备料计划失败: ' + error.message);
    console.error('获取备料计划失败', error);
  } finally {
    loading?.close();
  }
};


// 分页相关方法
const handleCurrentChange = (newPage) => {
  queryParams.pageNumber = newPage;
  loadBeiliaoData();
};


// 监听props变化
watch(
  () => [props.noticeid, props.noticedrawno],
  (newVal) => {
    queryParams.noticeid = newVal[0];
    queryParams.noticedrawno = newVal[1];
    loadBeiliaoData();
  },
  { immediate: true }
);


onMounted(() => {
  loadBeiliaoData();
});


// 打印相关
const currentDate = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
});


const handlePrint = () => {
  // 保存当前的显示状态
  const originalDisplay = {};
  const elementsToHide = document.querySelectorAll('.el-pagination, .toolbar, .search-form, .el-table');
  
  elementsToHide.forEach(el => {
    originalDisplay[el.id] = el.style.display;
    el.style.display = 'none';
  });


  // 保存滚动位置
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  
  // 强制重新渲染打印区域确保最新数据
  const printArea = document.getElementById('print-area');
  const clone = printArea.cloneNode(true);
  printArea.parentNode.replaceChild(clone, printArea);
  
  // 打印
  window.print();
  
  // 恢复显示状态和滚动位置
  elementsToHide.forEach(el => {
    el.style.display = originalDisplay[el.id] || '';
  });
  window.scrollTo(0, scrollTop);
};
</script>


<style scoped>
.beiliaodan-container {
  padding: 12px;
}


.search-form {
  margin-bottom: 12px;
}


.dialog-footer {
  display: flex;
  justify-content: flex-end;
}


.toolbar {
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-end;
}


.print-area {
  display: none;
}


.print-row-group {
  background-color: #f9f9f9;
}


/* 新增的工具类 */
.mt-4 {
  margin-top: 1rem; /* 约16px */
}


/* 打印页面容器样式 */
.print-page {
  page-break-after: always; /* 每页后添加分页符 */
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100vh;
  padding: 20px;
}


/* 最后一页不添加分页符 */
.print-page:last-child {
  page-break-after: avoid;
}


/* 打印样式 */
@media print {
  @page {
    size: A4 portrait; /* 设置默认打印方向为纵向 */
    margin: 1.5cm; /* 统一设置页面边距 */
  }


  body * {
    visibility: hidden;
  }
  
  .print-area, .print-area * {
    visibility: visible;
  }
  
  .print-area {
    display: block !important;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0;
    box-sizing: border-box;
  }
  
  .el-table, .el-pagination, .toolbar, .search-form, .el-dialog {
    display: none !important;
  }
  
  .print-header {
    text-align: center;
    margin-bottom: 20px;
    page-break-after: avoid; /* 避免页眉被分页 */
  }
  
  .print-title {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .print-info {
    text-align: left;
    font-size: 14px;
  }
  
  .print-info-block {
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #000;
    display: flex;
    flex-wrap: wrap;
    line-height: 1.8;
  }
  
  .print-info-row {
    width: 100%;
    display: flex;
    margin-bottom: 5px;
  }
  
  .print-label {
    display: inline-block;
    width: 80px;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .print-value {
    margin-right: 20px;
    flex: 1;
    min-width: 120px;
  }
  
  .print-table-wrapper {
    margin-bottom: 20px;
    page-break-inside: auto; /* 允许表格容器内部分页 */
  }
  
  .print-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    table-layout: fixed; /* 固定表格布局，避免列宽不一致 */
  }
  
  .print-table, .print-table th, .print-table td {
    border: 1px solid #000;
  }
  
  .print-table th, .print-table td {
    padding: 6px 4px;
    text-align: center;
    word-wrap: break-word; /* 长文本自动换行 */
    word-break: break-all;
  }
  
  .print-table th {
    background-color: #f2f2f2;
  }
  
  /* 确保表头在每一页都显示 */
  .print-table thead {
    display: table-header-group;
  }
  
  /* 表格行分页处理 */
  .print-table tbody tr {
    page-break-inside: avoid; /* 避免表格行被分页 */
  }
  
  .print-footer {
    margin-top: 30px;
    font-size: 12px;
    position: relative;
    page-break-before: avoid; /* 避免页脚单独在一页 */
  }
  
  .print-date {
    text-align: right;
  }
}
</style>