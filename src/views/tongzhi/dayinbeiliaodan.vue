<template>
  <div class="beiliaodan-container">
    <div class="toolbar">
      <el-button type="primary" @click="exportToWord">
        <el-icon><Document /></el-icon>
        导出为Word打印
      </el-button>
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


    <!-- Word导出模板容器 (不显示) -->
    <div id="word-template" style="display: none;"></div>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { ElMessage, ElLoading, ElIcon } from 'element-plus';
import { Document } from '@element-plus/icons-vue';
import { getbeiliaojihuabynoticepage } from '@/api/tongzhi/beiliaodan.js';


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
  pageSize: 10000, // 加载全部数据
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


// 当前日期
const currentDate = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
});


// 生成Word文件名：当前日期 + 通知编号
const getWordFileName = () => {
  const dateStr = currentDate.value.replace(/-/g, '');
  return `${dateStr}_${queryParams.noticeid}.doc`;
};


// 生成Word文档内容（包含样式）
const generateWordContent = () => {
  // 样式部分 - 通过字符串定义
  const styleContent = `
    <style type="text/css">
      @page {
        size: 21cm 29.7cm; /* A4尺寸 */
        margin: 2cm;
      }
      body {
        font-family: SimSun, "宋体", serif; /* 确保中文显示正常 */
        font-size: 12pt;
      }
      .title {
        text-align: center;
        font-size: 16pt;
        font-weight: bold;
        margin: 20pt 0;
      }
      .info-block {
        border: 1px solid #000;
        padding: 10pt;
        margin-bottom: 15pt;
      }
      .info-row {
        margin-bottom: 8pt;
        line-height: 1.5;
      }
      .info-label {
        display: inline-block;
        width: 80pt;
        font-weight: bold;
      }
      .info-value {
        margin-right: 20pt;
      }
      .data-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15pt 0;
      }
      .data-table th, .data-table td {
        border: 1px solid #000;
        padding: 5pt;
        text-align: center;
      }
      .data-table th {
        background-color: #f0f0f0;
      }
      .footer {
        margin-top: 20pt;
        text-align: right;
      }
    </style>
  `;

  // 数据表格部分
  let tableRows = '';
  mergedBeiliaoList.value.forEach((row, index) => {
    tableRows += `
      <tr>
        <td>${index + 1}</td>
        <td>${row.sxclitemno || ''}</td>
        <td>${row.sxclname || ''}</td>
        <td>${row.unit || ''}</td>
        <td>${row.sxcltihuoshuliang || 0}</td>
        <td>${row.sxclshijishuliang || 0}</td>
        <td>${row.sxclcaizhi || ''}</td>
      </tr>
    `;
  });

  // 制定部门值处理
  const zhidingbumen = queryParams.zhidingbumen || (beiliaoList.value.length > 0 ? beiliaoList.value[0].zhidingbumen : '');

  // 完整HTML内容
  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      ${styleContent}
    </head>
    <body>
      <div class="title">备料单</div>
      
      <div class="info-block">
        <div class="info-row">
          <span class="info-label">通知编号：</span>
          <span class="info-value">${queryParams.noticeid}</span>
          <span class="info-label">图纸编号：</span>
          <span class="info-value">${queryParams.noticedrawno}</span>
        </div>
        <div class="info-row">
          <span class="info-label">合同编号：</span>
          <span class="info-value">${queryParams.contractno}</span>
          <span class="info-label">工程名称：</span>
          <span class="info-value">${queryParams.contractname}</span>
        </div>
        <div class="info-row">
          <span class="info-label">制定日期：</span>
          <span class="info-value">${queryParams.zhidingriqi}</span>
          <span class="info-label">提料时间：</span>
          <span class="info-value">${queryParams.tiliaoshijian}</span>
        </div>
        <div class="info-row">
          <span class="info-label">交货时间：</span>
          <span class="info-value">${queryParams.jiaohuoshijian}</span>
          <span class="info-label">编制人：</span>
          <span class="info-value">${queryParams.bianzhiren}</span>
        </div>
        <div class="info-row">
          <span class="info-label">校验人：</span>
          <span class="info-value">${queryParams.jiaoyanren}</span>
          <span class="info-label">审核人：</span>
          <span class="info-value">${queryParams.shenheren}</span>
        </div>
        <div class="info-row">
          <span class="info-label">制定部门：</span>
          <span class="info-value">${zhidingbumen}</span>
        </div>
      </div>
      
      <table class="data-table">
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
          ${tableRows}
        </tbody>
      </table>
      
      <div class="footer">
        打印日期：${currentDate.value}
      </div>
    </body>
    </html>
  `;
};


// 导出为Word文档
const exportToWord = () => {
  if (mergedBeiliaoList.value.length === 0) {
    ElMessage.warning('没有可导出的数据');
    return;
  }

  const loading = ElLoading.service({
    lock: true,
    text: '正在生成Word文档...',
    background: 'rgba(0, 0, 0, 0.7)'
  });

  try {
    // 生成Word内容
    const wordContent = generateWordContent();
    
    // 创建Blob对象（Word可识别的HTML格式）
    const blob = new Blob(['\ufeff', wordContent], {
      type: 'application/msword;charset=utf-8'
    });

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getWordFileName();
    document.body.appendChild(a);
    a.click();

    // 清理资源
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      loading.close();
      ElMessage.success('Word文档导出成功');
    }, 100);
  } catch (error) {
    ElMessage.error('导出失败: ' + error.message);
    console.error('Word导出错误', error);
    loading.close();
  }
};
</script>


<style scoped>
.beiliaodan-container {
  padding: 12px;
}


.search-form {
  margin-bottom: 12px;
}


.toolbar {
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-end;
}


/* 表格和分页样式保持不变 */
.el-table {
  margin-bottom: 12px;
}
</style>