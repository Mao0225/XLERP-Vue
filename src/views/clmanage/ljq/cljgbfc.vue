<template>
  <div class="cljgbfc-management">
    <div class="action-bar">
      <el-select
        v-model="queryParams.maQuality"
        placeholder="辅材类型"
        style="width: 140px; margin-right: 10px;"
        clearable
        @change="getList"
      >
        <el-option v-for="item in qualityOptions" :key="item" :label="item" :value="item" />
      </el-select>
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
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增间隔棒辅材</el-button>
    </div>
    <el-table :data="list" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column prop="maQuality" label="辅材类型" />
      <el-table-column prop="matRecheckNo" label="来料检验批次号" />
      <el-table-column prop="orderno" label="入库单号" />
      <el-table-column prop="mafactory" label="原材料制造商" />
      <el-table-column prop="sampleNumber" label="样品编号" />
      <el-table-column prop="testResult" label="检测结果" />
      <el-table-column prop="leavefactoryDate" label="原材料出厂检测日期" width="130" />
      <el-table-column prop="detectionTime" label="原材料入厂检测日期" width="130" />
      <el-table-column label="质量证明书">
        <template #default="{ row }">
          <div v-for="(file, index) in parseCertificateForDisplay(row.certificate)" :key="index">
            <span class="file-link" @click="handleCertificateClick(file)">{{ file.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractNo" label="合同编号" />
      <el-table-column prop="woNo" label="生产工单号" />
      <el-table-column prop="ipoNo" label="生产订单号" />
      <el-table-column prop="writer" label="录入人" />
      <el-table-column prop="writeTime" label="录入时间" width="150" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="700px" @closed="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
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
        <el-form-item label="辅材类型" prop="maQuality">
          <el-select v-model="form.maQuality" placeholder="请选择辅材类型" style="width:100%" @change="handleQualityChange">
            <el-option label="紧固件" value="紧固件" />
            <el-option label="橡胶" value="橡胶" />
          </el-select>
        </el-form-item>
        <el-form-item label="来料检验批次号" prop="matRecheckNo">
          <el-input v-model="form.matRecheckNo" maxlength="48" />
        </el-form-item>
        <el-form-item label="入库单号" prop="orderno">
          <el-input v-model="form.orderno" maxlength="48" />
        </el-form-item>
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
        <el-form-item label="样品编号" prop="sampleNumber">
          <el-input v-model="form.sampleNumber" maxlength="48" />
        </el-form-item>
        <el-form-item label="检测结果" prop="testResult">
          <template #default>
            <el-input
              v-model="form.testResult"
              maxlength="100"
              type="textarea"
              :rows="2"
              placeholder="请输入检测结果"
              @blur="handleTestResultBlur"
            />
            <div class="el-form-item__tip">提示：数值部分将自动四舍五入为整数</div>
            <div v-if="decimalWarning" class="el-form-item__error">检测结果中的数值应保留0位小数，已自动四舍五入</div>
          </template>
        </el-form-item>
        <el-form-item label="原材料出厂检测日期" prop="leavefactoryDate">
          <el-date-picker v-model="form.leavefactoryDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="原材料入厂检测日期" prop="detectionTime">
          <el-date-picker v-model="form.detectionTime" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%;" />
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
            <div v-for="(file, index) in JSON.parse(form.certificate)" :key="index" class="uploaded-file">
              {{ file.name }}
              <el-button type="danger" size="mini" @click="deleteCertificateFile(index)">删除</el-button>
            </div>
          </div>
        </el-form-item>
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
    
    <WoSelectorDialog v-model="searchWoDialogVisible" @select="handleSearchWoSelect" />
    <SupplierDialog v-model="searchSupplierDialogVisible" @select="handleSearchSupplierSelect" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { getCljgbfcList, getCljgbfcById, createCljgbfc, updateCljgbfc, deleteCljgbfc, getGongdanByWoNo } from '@/api/clmanage/cljgbfc'
import { uploadFile } from '@/api/file/file'
import WoSelectorDialog from '@/views/clmanage/ljq/components/WoSelectorDialog.vue'
import SupplierDialog from '@/views/clmanage/ljq/components/SupplierDialog.vue'
import { useUserStore } from '@/store/user'
import { baseURL } from '@/utils/request'

const userStore = useUserStore()
// 用户信息
const userInfo = computed(() => ({
  username: userStore.realName || '未登录'
}))

const BASE_FILE_URL = baseURL

const qualityOptions = ['紧固件', '橡胶']
const defaultResultMap = {
  '紧固件': '锌层厚度（镀锌类紧固件适用）：μm',
  '橡胶': '邵氏硬度：邵尔A'
}

const form = ref(createEmptyForm())
const queryParams = reactive({
  maQuality: '',
  mafactory: '', // 原材料制造商名称
  woNo: '',      // 生产工单号
  pageNumber: 1,
  pageSize: 10
})
const list = ref([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增间隔棒辅材')
const dialogType = ref('add')
const formRef = ref(null)
const saving = ref(false)
const decimalWarning = ref(false) // 小数位警告
const searchSupplierDialogVisible = ref(false)
const woSelectorVisible = ref(false)             // 表单弹窗的工单选择
const showSupplierDialog = ref(false)            // 表单弹窗的供应商选择
const searchWoDialogVisible = ref(false)         // 搜索栏的工单选择
const certificateUpload = ref(null)              // 质量证明书上传组件引用

// 质量证明书文件上传
const certificateFileList = ref([]) // el-upload文件列表 (确保 url 是完整路径)

// 预览相关状态
const certificatePreviewVisible = ref(false)
const certificatePreviewUrl = ref('')
const previewFileType = ref('') // 'image', 'pdf', 'other'
const previewFileName = ref('')

function parseCertificateForDisplay(certStr) {
  if (!certStr) return [];
  try {
    const parsed = JSON.parse(certStr);
    if (Array.isArray(parsed)) {
        // 确保显示时 URL 是完整的
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
      fileList.push({ name: file.name, url: newUrl }); // 存储完整 URL
      // 更新表单数据
      form.value.certificate = JSON.stringify(fileList);
      // 同步更新 el-upload 的 fileList (使用完整 URL)
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
  certificateFileList.value.splice(index, 1); // 同步删除
};

// 检测结果格式化
function formatFcResult(val) {
  if (!val) return '';
  // 提取数值部分并四舍五入为整数
  const match = val.match(/(-?\d+(\.\d+)?)/);
  if (match) {
    const intVal = Math.round(Number(match[1]));
    // 替换原有数值为整数
    return val.replace(/(-?\d+(\.\d+)?)/, intVal);
  }
  return val;
}

// 检测结果失焦处理 - 格式化结果
const handleTestResultBlur = () => {
  if (form.value.testResult) {
    const originalValue = form.value.testResult;
    const formattedValue = formatFcResult(originalValue);
    // 检查是否有小数位被四舍五入
    const originalMatch = originalValue.match(/(-?\d+(\.\d+)?)/);
    const formattedMatch = formattedValue.match(/(-?\d+)/);
    if (originalMatch && formattedMatch &&
        originalMatch[0] !== formattedMatch[0] &&
        originalMatch[2]) {
      decimalWarning.value = true;
    } else {
      decimalWarning.value = false;
    }
    form.value.testResult = formattedValue;
  }
};

function createEmptyForm() {
  return {
    id: undefined,
    maQuality: '',
    matRecheckNo: '',
    orderno: '',
    mafactory: '',
    sampleNumber: '',
    testResult: '',
    leavefactoryDate: '',
    detectionTime: '',
    certificate: '[]', // 默认空数组
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

const rules = {
  maQuality: [{ required: true, message: '请选择辅材类型', trigger: 'change' }],
  matRecheckNo: [{ required: true, message: '请填写来料检验批次号', trigger: 'blur' }],
  orderno: [{ required: true, message: '请填写入库单号', trigger: 'blur' }],
  mafactory: [{ required: true, message: '请选择原材料制造商', trigger: 'change' }],
  sampleNumber: [{ required: true, message: '请填写样品编号', trigger: 'blur' }],
  testResult: [{ required: true, message: '请填写检测结果', trigger: 'blur' }],
  leavefactoryDate: [{ required: true, message: '请选择原材料出厂检测日期', trigger: 'change' }],
  detectionTime: [{ required: true, message: '请选择原材料入厂检测日期', trigger: 'change' }],
  certificate: [{ required: true, message: '请上传质量证明书', trigger: 'change' }], // 触发条件可能需要调整
  woNo: [{ required: true, message: '请选择生产工单号', trigger: 'change' }],
  contractNo: [{ required: true, message: '合同编号不能为空', trigger: 'change' }],
  ipoNo: [{ required: true, message: '生产订单号不能为空', trigger: 'change' }],
  writer: [{ required: true, message: '录入人不能为空', trigger: 'blur' }]
};

const getList = async () => {
  loading.value = true;
  try {
    const res = await getCljgbfcList(queryParams);
    list.value = res.data.page.list;
    total.value = res.data.page.totalRow;
  } catch (e) {
    ElMessage.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

const resetQuery = () => {
  queryParams.maQuality = '';
  queryParams.mafactory = '';
  queryParams.woNo = '';
  queryParams.pageNumber = 1;
  getList();
};

const handleSizeChange = (size) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page;
  getList();
};

const handleAdd = () => {
  dialogTitle.value = '新增间隔棒辅材';
  dialogType.value = 'add';
  form.value = createEmptyForm();
  form.value.writer = userInfo.value.username;
  form.value.writeTime = formatDateTime(new Date());
  // 重置文件列表
  certificateFileList.value = [];
  form.value.certificate = '[]';
  dialogVisible.value = true;
};

const handleEdit = async (row) => {
  dialogTitle.value = '编辑间隔棒辅材';
  dialogType.value = 'edit';
  try {
    const res = await getCljgbfcById({ id: row.id });
    if (res && res.code === 200 && res.data && res.data.clJgbFc) {
      form.value = {
        ...createEmptyForm(),
        ...res.data.clJgbFc
      };
    }
    certificateFileList.value = parseCertificateForDisplay(form.value.certificate)
    dialogVisible.value = true;
  } catch (e) {
    console.error('获取详情失败', e);
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除该条辅材数据吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteCljgbfc({ id: row.id });
    ElMessage.success('删除成功');
    resetQuery();
  }).catch(() => {});
};

const handleQualityChange = (val) => {
  // 只有在新增状态下才自动填充检测结果
  if (dialogType.value === 'add'||dialogType.value === 'edit') {
    form.value.testResult = defaultResultMap[val] || '';
  }
};

const openWoSelector = () => {
  woSelectorVisible.value = true;
};

// 搜索栏
const handleSearchSupplierSelect = (descr) => {
  queryParams.mafactory = descr;
  searchSupplierDialogVisible.value = false;
};

const handleSearchWoSelect = (row) => {
  queryParams.woNo = row.woNo;
  searchWoDialogVisible.value = false;
};

const clearSearchSupplier = () => {
  queryParams.mafactory = '';
};

const clearSearchWoNo = () => {
  queryParams.woNo = '';
};

// 表单弹窗
const handleSupplierSelect = (descr) => {
  form.value.mafactory = descr;
  showSupplierDialog.value = false;
};

const handleWoSelect = async (row) => {
  form.value.woNo = row.woNo;
  // 工单号自动填充合同编号和订单号，失败时给提示
  try {
    const { data } = await getGongdanByWoNo({ woNo: row.woNo });
    form.value.contractNo = data?.contractNo || '';
    form.value.ipoNo = data?.ipoNo || '';
    // 兼容如果接口没返回
    if (!form.value.contractNo || !form.value.ipoNo) {
      ElMessage.warning('未能从工单获取合同编号或订单号，请确认工单数据');
    }
  } catch (e) {
    form.value.contractNo = '';
    form.value.ipoNo = '';
    ElMessage.error('获取工单详情失败，请联系管理员或检查接口');
  }
  woSelectorVisible.value = false;
};

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    saving.value = true;
    try {
      form.value.certificate = JSON.stringify(certificateFileList.value);

      if (dialogType.value === 'add') {
        form.value.writer = userInfo.value.username;
        form.value.writeTime = formatDateTime(new Date());
        await createCljgbfc(form.value);
        ElMessage.success('新增成功');
        resetQuery();
      } else {
        await updateCljgbfc(form.value);
        ElMessage.success('修改成功');
        resetQuery();
      }
      dialogVisible.value = false;
    } catch (e) {
       console.error('保存失败:', e); // 添加详细错误日志
      ElMessage.error('保存失败: ' + (e.message || e));
    } finally {
      saving.value = false;
    }
  });
};

function formatDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// 重置表单
const resetForm = () => {
  form.value = createEmptyForm();
  certificateFileList.value = [];
 // 重置预览相关状态
  handlePreviewClose();
  if (formRef.value) {
    formRef.value.resetFields(); // 重置表单验证状态
  }
};

onMounted(getList);
</script>

<style scoped>
.cljgbfc-management {
  padding: 20px;
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
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
  transition: color 0.3s;
}

.file-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.preview-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* 预览弹窗样式调整 */
.el-dialog__body {
  padding: 10px 20px;
}

@media (max-width: 768px) {
  .el-dialog {
    width: 95% !important;
    margin: 0 auto;
  }
  
  .preview-container img {
    max-height: 50vh !important;
  }
  
  .preview-container iframe {
    height: 400px !important;
  }
}
</style>