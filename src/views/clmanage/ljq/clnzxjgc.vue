<template>
  <div class="clnzxjgc-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-input
        v-model="queryParams.mafactory"
        placeholder="原材料制造商"
        readonly
        style="width: 200px; margin-right: 10px; cursor: pointer;"
        @click.stop="searchSupplierDialogVisible = true"
        :suffix-icon="'el-icon-search'"
        clearable
        @clear="clearSearchSupplier"
      >
        <template #append>
          <el-button @click="searchSupplierDialogVisible = true" size="small">选择</el-button>
        </template>
      </el-input>
      <el-input
        v-model="queryParams.matRecheckNo"
        placeholder="来料检验批次号"
        style="width: 180px; margin-right: 10px;"
        clearable
        @clear="getList"
        @input="handleQueryChange"
      />
      <el-input
        v-model="queryParams.woNo"
        placeholder="生产工单号"
        readonly
        style="width: 200px; margin-right: 10px; cursor: pointer;"
        @click.stop="searchWoDialogVisible = true"
        :suffix-icon="'el-icon-search'"
        clearable
        @clear="clearSearchWoNo"
      >
        <template #append>
          <el-button @click="searchWoDialogVisible = true" size="small">选择</el-button>
        </template>
      </el-input>
      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="warning" @click="resetQuery" style="margin-left: 10px;">重置</el-button>
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增耐张线夹钢材</el-button>
    </div>
    
    <!-- 表格展示 -->
    <el-table :data="list" border v-loading="loading" style="width: 100%" height="calc(100vh - 250px)">
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column prop="mafactory" label="原材料制造商" width="150" />
      <el-table-column prop="batch" label="炉批号" width="120" />
      <el-table-column prop="orderno" label="入库单号" width="150" />
      <el-table-column prop="matMaterial" label="牌号" width="100" />
      <el-table-column prop="matSpec" label="规格" width="120" />
      <el-table-column prop="matRecheckNo" label="来料检验批次号" width="150" />
      <el-table-column prop="chemC" label="化学成分C(%)" width="130">
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemC) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemSi" label="化学成分Si(%)" width="130">
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemSi) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemMn" label="化学成分Mn(%)" width="130">
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemMn) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemP" label="化学成分P(%)" width="130">
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemP) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemS" label="化学成分S(%)" width="130">
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemS) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemCr" label="化学成分Cr(%)" width="130">
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemCr) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemNi" label="化学成分Ni(%)" width="130">
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemNi) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemMo" label="化学成分Mo(%)" width="130">
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemMo) }}
        </template>
      </el-table-column>
      <el-table-column prop="leavefactoryDate" label="出厂检测日期" width="120" />
      <el-table-column prop="detectionTime" label="入厂检测日期" width="120" />
      <el-table-column label="质量证明书" width="180">
        <template #default="{ row }">
          <div v-for="(file, index) in parseCertificateForDisplay(row.certificate)" :key="index">
            <span class="file-link" @click="handleCertificateClick(file)">{{ file.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractNo" label="合同编号" width="150" />
      <el-table-column prop="woNo" label="生产工单号" width="150" />
      <el-table-column prop="ipoNo" label="生产订单号" width="150" />
      <el-table-column prop="writer" label="录入人" width="100" />
      <el-table-column prop="writeTime" label="录入时间" width="160" />
     <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
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
    
    <!-- 表单弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="700px" @closed="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="150px">
        <!-- 工单号(选择)、合同号(自动)、订单号(自动) -->
        <el-form-item label="生产工单号" prop="woNo">
          <el-input
            v-model="form.woNo"
            placeholder="请选择生产工单号"
            readonly
            style="width: calc(100% - 80px);"
            @click="openWoSelector"
          >
            <template #append>
              <el-button @click="openWoSelector" size="small">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="form.contractNo" disabled />
        </el-form-item>
        <el-form-item label="生产订单号" prop="ipoNo">
          <el-input v-model="form.ipoNo" disabled />
        </el-form-item>
        
        <!-- 必填字段 -->
        <el-form-item label="原材料制造商" prop="mafactory">
          <el-input
            v-model="form.mafactory"
            placeholder="请选择原材料制造商"
            readonly
            style="cursor: pointer;"
            @click="showSupplierDialog = true"
          >
            <template #append>
              <el-button @click="showSupplierDialog = true" size="small">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="炉批号" prop="batch">
          <el-input v-model="form.batch" maxlength="48" />
        </el-form-item>
        <el-form-item label="入库单号" prop="orderno">
          <el-input v-model="form.orderno" maxlength="48" />
        </el-form-item>
        <el-form-item label="牌号" prop="matMaterial">
          <el-input v-model="form.matMaterial" maxlength="48" />
        </el-form-item>
        <el-form-item label="规格" prop="matSpec">
          <el-input v-model="form.matSpec" maxlength="48" />
        </el-form-item>
        <el-form-item label="来料检验批次号" prop="matRecheckNo">
          <el-input v-model="form.matRecheckNo" maxlength="48" />
        </el-form-item>
        
        <!-- 化学成分分析 -->
        <el-form-item label="化学成分分析-C(%)" prop="chemC">
          <el-input 
            v-model="form.chemC" 
            placeholder="请输入C含量" 
            @blur="formatChemicalInput('chemC')"
            suffix="%"
          >
            <template #append>
              <el-button type="primary" size="small" @click="formatChemicalInput('chemC')">格式化</el-button>
            </template>
          </el-input>
          <div class="el-form-item__tip">保留3位小数</div>
          <div v-if="chemicalError.chemC" class="el-form-item__error">{{ chemicalError.chemC }}</div>
        </el-form-item>
        
        <el-form-item label="化学成分分析-Si(%)" prop="chemSi">
          <el-input 
            v-model="form.chemSi" 
            placeholder="请输入Si含量" 
            @blur="formatChemicalInput('chemSi')"
            suffix="%"
          >
            <template #append>
              <el-button type="primary" size="small" @click="formatChemicalInput('chemSi')">格式化</el-button>
            </template>
          </el-input>
          <div class="el-form-item__tip">保留3位小数</div>
          <div v-if="chemicalError.chemSi" class="el-form-item__error">{{ chemicalError.chemSi }}</div>
        </el-form-item>
        
        <el-form-item label="化学成分分析-Mn(%)" prop="chemMn">
          <el-input 
            v-model="form.chemMn" 
            placeholder="请输入Mn含量" 
            @blur="formatChemicalInput('chemMn')"
            suffix="%"
          >
            <template #append>
              <el-button type="primary" size="small" @click="formatChemicalInput('chemMn')">格式化</el-button>
            </template>
          </el-input>
          <div class="el-form-item__tip">保留3位小数</div>
          <div v-if="chemicalError.chemMn" class="el-form-item__error">{{ chemicalError.chemMn }}</div>
        </el-form-item>
        
        <el-form-item label="化学成分分析-P(%)" prop="chemP">
          <el-input 
            v-model="form.chemP" 
            placeholder="请输入P含量" 
            @blur="formatChemicalInput('chemP')"
            suffix="%"
          >
            <template #append>
              <el-button type="primary" size="small" @click="formatChemicalInput('chemP')">格式化</el-button>
            </template>
          </el-input>
          <div class="el-form-item__tip">保留3位小数</div>
          <div v-if="chemicalError.chemP" class="el-form-item__error">{{ chemicalError.chemP }}</div>
        </el-form-item>
        
        <el-form-item label="化学成分分析-S(%)" prop="chemS">
          <el-input 
            v-model="form.chemS" 
            placeholder="请输入S含量" 
            @blur="formatChemicalInput('chemS')"
            suffix="%"
          >
            <template #append>
              <el-button type="primary" size="small" @click="formatChemicalInput('chemS')">格式化</el-button>
            </template>
          </el-input>
          <div class="el-form-item__tip">保留3位小数</div>
          <div v-if="chemicalError.chemS" class="el-form-item__error">{{ chemicalError.chemS }}</div>
        </el-form-item>
        
        <!-- 非必填化学成分 -->
        <el-form-item label="化学成分分析-Cr(%)" prop="chemCr">
          <el-input 
            v-model="form.chemCr" 
            placeholder="请输入Cr含量" 
            @blur="formatChemicalInput('chemCr')"
            suffix="%"
          >
            <template #append>
              <el-button type="primary" size="small" @click="formatChemicalInput('chemCr')">格式化</el-button>
            </template>
          </el-input>
          <div class="el-form-item__tip">保留3位小数</div>
          <div v-if="chemicalError.chemCr" class="el-form-item__error">{{ chemicalError.chemCr }}</div>
        </el-form-item>
        
        <el-form-item label="化学成分分析-Ni(%)" prop="chemNi">
          <el-input 
            v-model="form.chemNi" 
            placeholder="请输入Ni含量" 
            @blur="formatChemicalInput('chemNi')"
            suffix="%"
          >
            <template #append>
              <el-button type="primary" size="small" @click="formatChemicalInput('chemNi')">格式化</el-button>
            </template>
          </el-input>
          <div class="el-form-item__tip">保留3位小数</div>
          <div v-if="chemicalError.chemNi" class="el-form-item__error">{{ chemicalError.chemNi }}</div>
        </el-form-item>
        
        <el-form-item label="化学成分分析-Mo(%)" prop="chemMo">
          <el-input 
            v-model="form.chemMo" 
            placeholder="请输入Mo含量" 
            @blur="formatChemicalInput('chemMo')"
            suffix="%"
          >
            <template #append>
              <el-button type="primary" size="small" @click="formatChemicalInput('chemMo')">格式化</el-button>
            </template>
          </el-input>
          <div class="el-form-item__tip">保留3位小数</div>
          <div v-if="chemicalError.chemMo" class="el-form-item__error">{{ chemicalError.chemMo }}</div>
        </el-form-item>
        
        <!-- 日期和质量证明书 -->
        <el-form-item label="原材料出厂检测日期" prop="leavefactoryDate">
          <el-date-picker 
            v-model="form.leavefactoryDate" 
            type="date" 
            value-format="YYYY-MM-DD" 
            placeholder="选择日期" 
            style="width: 100%;" 
          />
        </el-form-item>
        <el-form-item label="原材料入厂检测日期" prop="detectionTime">
          <el-date-picker 
            v-model="form.detectionTime" 
            type="date" 
            value-format="YYYY-MM-DD" 
            placeholder="选择日期" 
            style="width: 100%;" 
          />
        </el-form-item>
        <el-form-item label="质量证明书" prop="certificate">
          <el-upload
            ref="certificateUpload"
            :auto-upload="false"
            :on-change="handleCertificateChange"
            :limit="3"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            :file-list="[]"  
            :show-file-list="false"
          >
            <el-button type="primary">上传质量证明书</el-button>
            <div class="el-upload__tip">支持 pdf、doc、docx、xls、xlsx、jpg、jpeg、png 等格式，最多3个质量证明书</div>
          </el-upload>
          <div class="uploaded-files" v-if="form.certificate">
            <div v-for="(file, index) in parseCertificateForDisplay(form.certificate)" :key="index" class="uploaded-file">
              {{ file.name }}
              <el-button type="danger" size="mini" @click="deleteCertificateFile(index)">删除</el-button>
            </div>
          </div>
        </el-form-item>
        
        <!-- 录入信息 -->
        <el-form-item label="录入人" prop="writer">
          <el-input v-model="form.writer" disabled />
        </el-form-item>
        <el-form-item label="录入时间" prop="writeTime">
          <el-input v-model="form.writeTime" disabled />
        </el-form-item>
       </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="saving">保存</el-button>
      </template>
      
      <!-- 组件 -->
      <WoSelectorDialog v-model="woSelectorVisible" @select="handleWoSelect" />
      <SupplierDialog v-model="showSupplierDialog" @select="handleSupplierSelect" />
    </el-dialog>
    
    <!-- 质量证明书预览弹窗 -->
    <el-dialog 
      title="质量证明书预览" 
      v-model="certificatePreviewVisible" 
      width="80%" 
      :close-on-click-modal="false"
      :before-close="handlePreviewClose"
    >
      <!-- 图片预览 -->
      <div v-if="previewFileType === 'image'" class="preview-container">
        <img 
          :src="certificatePreviewUrl" 
          alt="质量证明书" 
          style="max-width: 100%; max-height: 70vh; display: block; margin: 0 auto;"
          @error="handleImageError"
        />
      </div>
      <!-- PDF预览 -->
      <div v-else-if="previewFileType === 'pdf'" class="preview-container">
        <iframe 
          :src="certificatePreviewUrl" 
          width="100%" 
          height="600px" 
          frameborder="0"
          @error="handlePdfError"
        >
          您的浏览器不支持PDF预览，请<a :href="certificatePreviewUrl" target="_blank">点击此处下载</a>
        </iframe>
      </div>
      <!-- 不支持预览的文件类型 -->
      <div v-else class="preview-container">
        <div style="text-align: center; padding: 40px;">
          <el-icon size="64" color="#909399">
            <Document />
          </el-icon>
          <p style="margin: 20px 0; color: #606266;">此文件类型不支持在线预览</p>
          <el-button type="primary" @click="downloadFile(certificatePreviewUrl, previewFileName)">
            下载文件
          </el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="certificatePreviewVisible = false">关闭</el-button>
        <el-button type="primary" @click="downloadFile(certificatePreviewUrl, previewFileName)">
          下载
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 搜索栏的工单选择弹窗 -->
    <WoSelectorDialog v-model="searchWoDialogVisible" @select="handleSearchWoSelect" />
    
    <!-- 搜索栏的供应商选择弹窗 -->
    <SupplierDialog v-model="searchSupplierDialogVisible" @select="handleSearchSupplierSelect" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { 
  getClnzxjgcList, 
  getClnzxjgcById, 
  createClnzxjgc, 
  updateClnzxjgc, 
  deleteClnzxjgc, 
  getGongdanByWoNo 
} from '@/api/clmanage/clnzxjgc'
import { uploadFile } from '@/api/file/file'
import WoSelectorDialog from '@/views/clmanage/ljq/components/WoSelectorDialog.vue'
import SupplierDialog from '@/views/clmanage/ljq/components/SupplierDialog.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
// 用户信息
const userInfo = computed(() => ({
  username: userStore.realName || '未登录'
}))

const BASE_FILE_URL = 'http://127.0.0.1:8099'

const form = ref(createEmptyForm())
const queryParams = reactive({
  mafactory: '', // 原材料制造商名称
  matRecheckNo: '',     // 来料检验批次号
  woNo: '',      // 生产工单号
  pageNumber: 1,
  pageSize: 10
})

const list = ref([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增耐张线夹钢材')
const dialogType = ref('add')
const formRef = ref(null)
const saving = ref(false)
const chemicalError = reactive({}) // 化学分析错误信息

// 弹窗相关
const searchSupplierDialogVisible = ref(false)
const woSelectorVisible = ref(false)
const showSupplierDialog = ref(false)
const searchWoDialogVisible = ref(false)

// 质量证明书相关
const certificateUpload = ref(null)
const certificateFileList = ref([])
const certificatePreviewVisible = ref(false)
const certificatePreviewUrl = ref('')
const previewFileType = ref('') // 'image', 'pdf', 'other'
const previewFileName = ref('')

function parseCertificateForDisplay(certStr) {
  if (!certStr) return [];
  try {
    const parsed = JSON.parse(certStr);
    if (Array.isArray(parsed)) {
      return parsed.map(item => ({
        ...item,
        url: item.url.startsWith('http') ? item.url : BASE_FILE_URL + item.url
      }));
    }
    return [];
  } catch (e) {
    console.warn('Failed to parse certificate JSON for display:', certStr);
    return [];
  }
}

// 格式化化学值显示
function formatChemicalValue(val) {
  if (val === null || val === undefined || val === '') return '-'
  const num = Number(val)
  return isNaN(num) ? val : num.toFixed(3) + '%'
}

// 格式化化学输入值
const formatChemicalInput = (field) => {
  if (!form.value[field]) return
  
  const value = form.value[field].toString().trim()
  
  // 尝试转换为数字
  const numValue = Number(value)
  
  if (isNaN(numValue)) {
    chemicalError[field] = '请输入有效的数字'
    return
  }
  
  // 检查是否在合理范围内 (0-100)
  if (numValue < 0 || numValue > 100) {
    chemicalError[field] = '值必须在0-100之间'
    return
  }
  
  // 格式化保留3位小数
  form.value[field] = numValue.toFixed(3)
  chemicalError[field] = ''
}

// 获取文件类型
const getFileType = (url, fileName = '') => {
  const fileUrl = url || fileName;
  if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileUrl)) {
    return 'image';
  } else if (/\.pdf$/i.test(fileUrl)) {
    return 'pdf';
  } else {
    return 'other';
  }
};

// 处理质量证明书点击事件
const handleCertificateClick = (file) => {
  const fileType = getFileType(file.url, file.name);
  
  if (fileType === 'image' || fileType === 'pdf') {
    // 可预览的文件类型，打开预览弹窗
    previewCertificate(file.url, file.name, fileType);
  } else {
    // 不可预览的文件类型，直接下载
    downloadFile(file.url, file.name);
  }
};

// 预览文件
const previewCertificate = (url, fileName = '', fileType = '') => {
  const fullUrl = url.startsWith('http') ? url : BASE_FILE_URL + url;
  certificatePreviewUrl.value = fullUrl;
  previewFileName.value = fileName;
  previewFileType.value = fileType || getFileType(fullUrl, fileName);
  certificatePreviewVisible.value = true;
};

// 下载文件
const downloadFile = (url, fileName = '') => {
  try {
    const fullUrl = url.startsWith('http') ? url : BASE_FILE_URL + url;
    
    // 创建一个临时的 a 标签进行下载
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = fileName || '质量证明书';
    link.target = '_blank';
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    ElMessage.success('文件下载已开始');
  } catch (error) {
    console.error('下载文件失败:', error);
    ElMessage.error('文件下载失败，请稍后重试');
    
    // 如果下载失败，尝试在新窗口打开
    window.open(url.startsWith('http') ? url : BASE_FILE_URL + url, '_blank');
  }
};

// 处理预览关闭
const handlePreviewClose = () => {
  certificatePreviewVisible.value = false;
  certificatePreviewUrl.value = '';
  previewFileName.value = '';
  previewFileType.value = '';
};

// 处理图片加载错误
const handleImageError = () => {
  ElMessage.error('图片加载失败');
  // 可以选择显示默认错误图片或其他处理
};

// 处理PDF加载错误
const handlePdfError = () => {
  ElMessage.error('PDF预览失败，请尝试下载文件');
};

// 创建空表单
function createEmptyForm() {
  return {
    id: undefined,
    mafactory: '',
    batch: '',
    orderno: '',
    matMaterial: '',
    matSpec: '',
    matRecheckNo: '',
    chemC: '',
    chemSi: '',
    chemMn: '',
    chemP: '',
    chemS: '',
    chemCr: '',
    chemNi: '',
    chemMo: '',
    leavefactoryDate: '',
    detectionTime: '',
    certificate: '[]',
    contractNo: '',
    woNo: '',
    ipoNo: '',
    writer: '',
    writeTime: '',
    flag: '',
    status: '',
    memo: '',
    type: ''
  };
}

// 表单验证规则
const rules = {
  mafactory: [{ required: true, message: '请选择原材料制造商', trigger: 'change' }],
  batch: [{ required: true, message: '请填写炉批号', trigger: 'blur' }],
  orderno: [{ required: true, message: '请填写入库单号', trigger: 'blur' }],
  matMaterial: [{ required: true, message: '请填写牌号', trigger: 'blur' }],
  matSpec: [{ required: true, message: '请填写规格', trigger: 'blur' }],
  matRecheckNo: [{ required: true, message: '请填写来料检验批次号', trigger: 'blur' }],
  chemC: [{ 
    required: true, 
    trigger: 'blur',
    validator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写化学成分C含量'));
      } else if (isNaN(Number(value))) {
        callback(new Error('请输入有效的数字'));
      } else {
        callback();
      }
    }
  }],
  chemSi: [{ 
    required: true, 
    trigger: 'blur',
    validator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写化学成分Si含量'));
      } else if (isNaN(Number(value))) {
        callback(new Error('请输入有效的数字'));
      } else {
        callback();
      }
    }
  }],
  chemMn: [{ 
    required: true, 
    trigger: 'blur',
    validator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写化学成分Mn含量'));
      } else if (isNaN(Number(value))) {
        callback(new Error('请输入有效的数字'));
      } else {
        callback();
      }
    }
  }],
  chemP: [{ 
    required: true, 
    trigger: 'blur',
    validator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写化学成分P含量'));
      } else if (isNaN(Number(value))) {
        callback(new Error('请输入有效的数字'));
      } else {
        callback();
      }
    }
  }],
  chemS: [{ 
    required: true, 
    trigger: 'blur',
    validator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写化学成分S含量'));
      } else if (isNaN(Number(value))) {
        callback(new Error('请输入有效的数字'));
      } else {
        callback();
      }
    }
  }],
  leavefactoryDate: [{ required: true, message: '请选择原材料出厂检测日期', trigger: 'change' }],
  detectionTime: [{ required: true, message: '请选择原材料入厂检测日期', trigger: 'change' }],
  certificate: [{ required: true, message: '请上传质量证明书', trigger: 'change' }],
  woNo: [{ required: true, message: '请选择生产工单号', trigger: 'change' }],
  contractNo: [{ required: true, message: '合同编号不能为空', trigger: 'change' }],
  ipoNo: [{ required: true, message: '生产订单号不能为空', trigger: 'change' }],
  writer: [{ required: true, message: '录入人不能为空', trigger: 'blur' }]
}
const handleQueryChange = () => {
  if (!queryParams.matRecheckNo && !queryParams.matMaterial && !queryParams.orderno) {
    getList();
  }
};
// 获取数据列表
const getList = async () => {
  loading.value = true;
  try {
    const res = await getClnzxjgcList(queryParams);
    list.value = res.data.page.list;
    total.value = res.data.page.totalRow;
  } catch (e) {
    ElMessage.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

// 重置查询
const resetQuery = () => {
  queryParams.mafactory = '';
  queryParams.matRecheckNo = '';
  queryParams.woNo = '';
  queryParams.pageNumber = 1;
  getList();
};

// 分页处理
const handleSizeChange = (size) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page;
  getList();
};

// 新增操作
const handleAdd = () => {
  dialogTitle.value = '新增耐张线夹钢材';
  dialogType.value = 'add';
  form.value = createEmptyForm();
  form.value.writer = userInfo.value.username;
  form.value.writeTime = formatDateTime(new Date());
  certificateFileList.value = [];
  form.value.certificate = '[]';
  
  // 重置化学错误
  Object.keys(chemicalError).forEach(key => {
    chemicalError[key] = '';
  });
  
  dialogVisible.value = true;
};

// 编辑操作
const handleEdit = async (row) => {
  dialogTitle.value = '编辑耐张线夹钢材';
  dialogType.value = 'edit';
  try {
    const res = await getClnzxjgcById({ id: row.id });
    if (res && res.code === 200 && res.data && res.data.clNzxjGc) {
      form.value = {
        ...createEmptyForm(),
        ...res.data.clNzxjGc
      };
    }
    certificateFileList.value = parseCertificateForDisplay(form.value.certificate)
    dialogVisible.value = true;
  } catch (e) {
    console.error('获取详情失败', e);
    ElMessage.error('获取详情失败');
  }
}

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除该条钢材数据吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteClnzxjgc({ id: row.id });
    ElMessage.success('删除成功');
    resetQuery();
  }).catch(() => {});
};

// 工单选择器
const openWoSelector = () => {
  woSelectorVisible.value = true;
};

// 搜索栏供应商选择
const handleSearchSupplierSelect = (descr) => {
  queryParams.mafactory = descr;
  searchSupplierDialogVisible.value = false;
};

// 搜索栏工单选择
const handleSearchWoSelect = (row) => {
  queryParams.woNo = row.woNo;
  searchWoDialogVisible.value = false;
};

// 清空搜索供应商
const clearSearchSupplier = () => {
  queryParams.mafactory = '';
};

// 清空搜索工单
const clearSearchWoNo = () => {
  queryParams.woNo = '';
};

// 表单供应商选择
const handleSupplierSelect = (descr) => {
  form.value.mafactory = descr;
  showSupplierDialog.value = false;
};

// 表单工单选择
const handleWoSelect = async (row) => {
  form.value.woNo = row.woNo;
  try {
    const { data } = await getGongdanByWoNo({ woNo: row.woNo });
    form.value.contractNo = data?.contractNo || '';
    form.value.ipoNo = data?.ipoNo || '';
    
    if (!form.value.contractNo || !form.value.ipoNo) {
      ElMessage.warning('未能从工单获取合同编号或订单号');
    }
  } catch (e) {
    form.value.contractNo = '';
    form.value.ipoNo = '';
    ElMessage.error('获取工单详情失败');
  }
  woSelectorVisible.value = false;
};

// 处理文件上传
const handleCertificateChange = async (file) => {
  if (certificateFileList.value.length >= 3) {
    ElMessage.warning('最多只能上传3个质量证明书');
    certificateUpload.value.clearFiles();
    return;
  }
  
  const formData = new FormData();
  formData.append('file', file.raw);
  
  try {
    const res = await uploadFile(formData);
    if (res.success && res.data && res.data.url) {
      const newUrl = BASE_FILE_URL + res.data.url;
      const fileList = JSON.parse(form.value.certificate || '[]');
      fileList.push({ name: file.name, url: newUrl });
      
      form.value.certificate = JSON.stringify(fileList);
      certificateFileList.value.push({ name: file.name, url: newUrl });
      ElMessage.success(`${file.name} 上传成功`);
    } else {
      throw new Error(res.msg || '文件上传失败');
    }
  } catch (e) {
    console.error('文件上传失败', e);
    ElMessage.error(`${file.name} 上传失败`);
    certificateUpload.value.clearFiles();
  }
};

// 删除文件
const deleteCertificateFile = (index) => {
  const fileList = JSON.parse(form.value.certificate || '[]');
  fileList.splice(index, 1);
  form.value.certificate = JSON.stringify(fileList);
  certificateFileList.value.splice(index, 1);
};

// 格式化日期时间
function formatDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    
    // 检查化学分析字段格式
    const chemicalFields = ['chemC', 'chemSi', 'chemMn', 'chemP', 'chemS', 'chemCr', 'chemNi', 'chemMo'];
    let hasChemicalError = false;
    
    chemicalFields.forEach(field => {
      if (form.value[field] && form.value[field].toString().trim() !== '') {
        const value = form.value[field].toString().trim();
        const numValue = Number(value);
        
        if (isNaN(numValue)) {
          chemicalError[field] = '请输入有效的数字';
          hasChemicalError = true;
        } else if (numValue < 0 || numValue > 100) {
          chemicalError[field] = '值必须在0-100之间';
          hasChemicalError = true;
        }
      }
    });
    
    if (hasChemicalError) {
      ElMessage.warning('请检查化学分析字段输入是否正确');
      return;
    }
    
    saving.value = true;
    try {
      // 确保证书文件列表是最新的
      form.value.certificate = JSON.stringify(certificateFileList.value);

      if (dialogType.value === 'add') {
        form.value.writer = userInfo.value.username;
        form.value.writeTime = formatDateTime(new Date());
        await createClnzxjgc(form.value);
        ElMessage.success('新增成功');
        resetQuery();
      } else {
        await updateClnzxjgc(form.value);
        ElMessage.success('修改成功');
        resetQuery();
      }
      
      dialogVisible.value = false;
      getList();
    } catch (e) {
      console.error('保存失败:', e);
      ElMessage.error('保存失败: ' + (e.message || '请检查数据格式'));
    } finally {
      saving.value = false;
    }
  });
};

// 重置表单
const resetForm = () => {
  form.value = createEmptyForm();
  certificateFileList.value = [];
  // 重置预览相关状态
  handlePreviewClose();
  if (formRef.value) {
    formRef.value.resetFields(); // 重置表单验证状态
  }
  
  // 重置化学错误
  Object.keys(chemicalError).forEach(key => {
    chemicalError[key] = '';
  });
};

onMounted(() => {
  getList();
});
</script>

<style scoped>
.clnzxjgc-management {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
  flex-wrap: wrap;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.certificate-uploader {
  width: 100%;
}

.uploaded-files {
  margin-top: 10px;
}

.uploaded-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.file-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
  display: inline-block;
}

.file-link:hover {
  text-decoration: underline;
}

.el-form-item__tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 4px;
}

.el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}

.chemical-input-group {
  display: flex;
  align-items: center;
}

.chemical-input-group .el-input {
  flex: 1;
  margin-right: 10px;
}

.chemical-input-group .el-button {
  flex-shrink: 0;
}

.preview-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>