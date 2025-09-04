<template>
  <div class="nzxjLc-management">
        <div class="action-bar">
      <el-input v-model="queryParams.mafactory" placeholder="请输入原材料制造商查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getNzxjLcList" @keyup.enter="getNzxjLcList" />
      <el-input v-model="queryParams.matMaterial" placeholder="请输入牌号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getNzxjLcList" @keyup.enter="getNzxjLcList" />
        <el-input v-model="queryParams.orderno" placeholder="请输入入库单号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getNzxjLcList" @keyup.enter="getNzxjLcList" />
    <el-input v-model="queryParams.matRecheckNo" placeholder="请输入来料检验批次号" style="width: 200px; margin-right: 10px;"
        clearable @clear="getNzxjLcList" @keyup.enter="getNzxjLcList" />
       


      <el-button type="primary" @click="getNzxjLcList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增</el-button>
    </div>
    
    <el-table :data="nzxjLcList" border v-loading="loading" style="width: 100%">
      <!-- 序号 -->
       <el-table-column type="index" label="序号" width="80" />
       <!-- <el-table-column prop="id" label="ID" width="80" /> -->
        <el-table-column prop="basno" label="单据号" />
<el-table-column prop="contractNo" label="合同编号" />
<el-table-column prop="woNo" label="生产工单号" />
<el-table-column prop="ipoNo" label="生产订单号" />
<el-table-column prop="writer" label="录入人" />
<el-table-column prop="writeTime" label="录入时间" />

      <el-table-column prop="mafactory" label="原材料制造商" />
      <el-table-column prop="maQuality" label="材质" />
            <el-table-column prop="matMaterial" label="牌号" />
            <el-table-column prop="orderno" label="入库单号" />
      <el-table-column prop="matRecheckNo" label="来料检验批次号" />
      <el-table-column prop="chemAl" label="化学成分分析-Al" />
      <el-table-column prop="chemSi" label="化学成分分析-Si" />
      <el-table-column prop="chemFe" label="化学成分分析-Fe" />
      <el-table-column prop="chemCu" label="化学成分分析-Cu" />
      <el-table-column prop="chemMn" label="化学成分分析-Mn" />
      <el-table-column prop="chemMg" label="化学成分分析-Mg" />
      <el-table-column prop="chemZn" label="化学成分分析-Zn" />
      <el-table-column prop="chemTi" label="化学成分分析-Ti" />
      <el-table-column prop="chemCr" label="化学成分分析-Cr" />

      <el-table-column prop="sampleNumber" label="样品编号" />
      <el-table-column prop="tensileStrength" label="机械性能-抗拉强度" />
      <el-table-column prop="elongation" label="机械性能-断后伸长率" />
      <el-table-column prop="hardness" label="机械性能-硬度" />
     
      <el-table-column prop="leavefactoryDate" label="原材料出厂检测日期" width="120" />
      <el-table-column prop="detectionTime" label="原材料入厂检测日期" width="120"/>
      <el-table-column prop="certificate" label="质量证明书">
        <template #default="{ row }">
          <div v-for="(file, index) in JSON.parse(row.certificate || '[]')" :key="index">
            <!-- 新增el-tooltip显示原文件名，文本固定为"打开文件" -->
      <el-tooltip :content="file.name" placement="top">
        <span class="file-link" @click="openFileInNewWindow(file.url, file.name)">
          打开文件
        </span>
      </el-tooltip>
          </div>
        </template>
      </el-table-column>


      

      <el-table-column label="操作" width="200">
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

    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="800px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">

        
            <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="form.contractNo" placeholder="选择合同编号" readonly @click="selectContractNo">
            <template #append>
              <el-button @click="selectContractNo" size="small">选择</el-button>
            </template>
          </el-input>
        </el-form-item>

            <el-form-item label="生产工单号" prop="woNo">
              <el-input v-model="form.woNo" placeholder="选择生产工单号" readonly @click="selectWoNo">
                <template #append>
                  <el-button @click="selectWoNo" size="small">选择</el-button>
                </template>
              </el-input>
            </el-form-item>

             <el-form-item label="生产订单号" prop="ipoNo">
          <el-input v-model="form.ipoNo" placeholder="选择生产订单号" readonly @click="selectIpoNo">
            <template #append>
              <el-button @click="selectIpoNo" size="small">选择</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="录入人" prop="writer">
            <el-input v-model="form.writer" placeholder="录入人" readonly />
        </el-form-item>


        <el-form-item label="单据号" prop="basno">
  <el-input 
    v-model="form.basno" 
    placeholder="自动生成" 
    readonly  
  />
</el-form-item>
           

            <el-form-item label="原材料制造商" prop="mafactory">
              <el-input v-model="form.mafactory" placeholder="选择原材料制造商" readonly @click="selectManufacturer">
                <template #append>
                  <el-button @click="selectManufacturer" size="small">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="材质" prop="maQuality">
              <el-input v-model="form.maQuality" placeholder="请输入材质" />
            </el-form-item>
            <el-form-item label="牌号" prop="matMaterial">
              <el-input v-model="form.matMaterial" placeholder="请输入牌号" />
            </el-form-item>
            <el-form-item label="入库单号" prop="orderno">
              <el-input v-model="form.orderno" placeholder="请输入入库单号" />
            </el-form-item>
            <el-form-item label="来料检验批次号" prop="matRecheckNo">
              <el-input v-model="form.matRecheckNo" placeholder="请输入来料检验批次号" />
            </el-form-item>
            <el-form-item label="样品编号" prop="sampleNumber">
              <el-input v-model="form.sampleNumber" placeholder="请输入样品编号" />
            </el-form-item>
            <el-form-item label="机械性能-抗拉强度" prop="tensileStrength">
              <el-input v-model.number="form.tensileStrength" placeholder="请输入机械性能-抗拉强度" type="number" />
            </el-form-item>
            <el-form-item label="机械性能-断后伸长率" prop="elongation">
              <el-input v-model.number="form.elongation" placeholder="请输入机械性能-断后伸长率" type="number" />
            </el-form-item>
            <el-form-item label="机械性能-硬度" prop="hardness">
              <el-input v-model.number="form.hardness" placeholder="请输入机械性能-硬度" type="number" />
            </el-form-item>
            
            

          </el-col>
          <el-col :span="12">
            <el-form-item label="化学成分分析-Al" prop="chemAl">
              <el-input v-model.number="form.chemAl" placeholder="请输入化学成分分析-Al" type="number" />
            </el-form-item>
            <el-form-item label="化学成分分析-Si" prop="chemSi">
              <el-input v-model.number="form.chemSi" placeholder="请输入化学成分分析-Si" type="number" />
            </el-form-item>
            <el-form-item label="化学成分分析-Fe" prop="chemFe">
              <el-input v-model.number="form.chemFe" placeholder="请输入化学成分分析-Fe" type="number" />
            </el-form-item>
            <el-form-item label="化学成分分析-Cu" prop="chemCu">
              <el-input v-model.number="form.chemCu" placeholder="请输入化学成分分析-Cu" type="number" />
            </el-form-item>
            <el-form-item label="化学成分分析-Mg" prop="chemMg">
              <el-input v-model.number="form.chemMg" placeholder="请输入化学成分分析-Mg" type="number" />
            </el-form-item>
            <el-form-item label="化学成分分析-Zn" prop="chemZn">
              <el-input v-model.number="form.chemZn" placeholder="请输入化学成分分析-Zn" type="number" />
            </el-form-item>
            <el-form-item label="化学成分分析-Mn" prop="chemMn">
              <el-input v-model.number="form.chemMn" placeholder="请输入化学成分分析-Mn" type="number" />
            </el-form-item>
            <el-form-item label="化学成分分析-Ti" prop="chemTi">
              <el-input v-model.number="form.chemTi" placeholder="请输入化学成分分析-Ti" type="number" />
            </el-form-item>
            <el-form-item label="化学成分分析-Cr" prop="chemCr">
              <el-input v-model.number="form.chemCr" placeholder="请输入化学成分分析-Cr" type="number" />
            </el-form-item>
            <el-form-item label="原材料出厂检测日期" prop="leavefactoryDate">             
              <el-date-picker
                v-model="form.leavefactoryDate"
                type="date"
                placeholder="请选择原材料出厂检测日期"
                value-format="YYYY-MM-DD"
              style="width: 100%" />  
            </el-form-item>
            <el-form-item label="原材料入厂检测日期" prop="detectionTime">             
              <el-date-picker
                v-model="form.detectionTime"
                type="date"
                placeholder="请选择原材料入厂检测日期"
                value-format="YYYY-MM-DD"
              style="width: 100%"/>
            </el-form-item>

            <el-form-item label="质量证明书" prop="certificate">
                <el-upload
            ref="certificateUpload"
            :auto-upload="false"
            :on-change="handleCertificateChange"
            :limit="10"
            accept=".pdf,.jpg,.jpeg,.png"
            :file-list="[]"  
            :show-file-list="false"
          >
            <el-button type="primary">上传文件</el-button>
          </el-upload>
          <div class="uploaded-files" v-if="form.certificate">
            <div v-for="(file, index) in JSON.parse(form.certificate)" :key="index" class="uploaded-file">
              
              <!-- 新增el-tooltip显示原文件名，文本固定为"打开文件" -->
    <el-tooltip :content="file.name" placement="top">
      <span class="file-link" @click="openFileInNewWindow(file.url, file.name)">
        {{ file.name }}
      </span>
    </el-tooltip>
              <el-button type="danger" size="mini" @click="deleteCertificateFile(index)">删除</el-button>
            </div>
          </div>
            </el-form-item>
            
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>


    <!-- 生产工单号选择弹窗 -->
     <WoNoSelector v-model="woNoSelectorVisible" @select="handleWoNoSelectorSelect" 
     :woNoList="woNoList" 
      :totalWoNo="totalWoNo" 
      :loadingWoNo="loadingWoNo" 
      @search="searchWoNo" 
      />

      <!-- 新增：原材料制造商选择弹窗 -->
    <el-dialog
      title="选择原材料制造商"
      v-model="manufacturerVisible"
      width="600px"
    >
      <el-input 
        v-model="manufacturerQuery.descr" 
        placeholder="请输入供应商名称查询" 
        style="margin-bottom: 10px;"
        clearable @clear="getManufacturerList" @keyup.enter="getManufacturerList" 
      />
      <el-table 
        :data="manufacturerList" 
        border 
        v-loading="loadingManufacturer" 
        style="width: 100%"
        @row-click="handleManufacturerRowClick"
      >
        <el-table-column prop="no" label="供应商编号" />
        <el-table-column prop="descr" label="供应商名称" />
        <el-table-column prop="contactname" label="联系人" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleSelectManufacturer(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="manufacturerQuery.pageNumber"
          v-model:page-size="manufacturerQuery.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalManufacturer"
          @size-change="handleManufacturerSizeChange"
          @current-change="handleManufacturerCurrentChange"
        />
      </div>
    </el-dialog>
    
 </div> 
</template> 






<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox,ElTooltip } from 'element-plus'
import { getNzxjLc, getNzxjLcById, createNzxjLc, updateNzxjLc, deleteNzxjLc , getWoNoList , getBasNo } from '@/api/clmanage/nzxjlc'
import { useUserStore } from '@/store/user'
import { Refresh } from '@element-plus/icons-vue'
import { uploadFile } from '@/api/file/file'
import { baseURL } from '@/utils/request'

import WoNoSelector from '@/views/clmanage/tqy/WoNoSelector.vue'
import { getBasOrgs } from '@/api/system/basorg'

const baseUrl = baseURL

const userStore = useUserStore()

// 新增标题计算方法
const getDialogTitle = () => {
  switch(selectType.value) {
    case 'contractNo':
      return '选择合同编号'
    case 'woNo':
      return '选择生产工单号'
    case 'ipoNo':
      return '选择生产订单号'
    default:
      return '选择生产工单号'
  }
}

const getWriterName = () =>{
  console.log("获取登录用户名称",userStore.descr)
  return userStore.descr
}

// 查询参数
const queryParams = reactive({
  mafactory: '',
  matMaterial: '',
  orderno: '',
  matRecheckNo: '',
  pageNumber: 1,
  pageSize: 10
})

// 数据列表数据
const nzxjLcList = ref([])
const total = ref(0)
const loading = ref(false)

// 生产工单号选择弹窗显示状态
const woNoSelectorVisible = ref(false)
// 生产工单号列表
const woNoList = ref([])
// 生产工单号总数
const totalWoNo = ref(0)
// 生产工单号列表加载状态
const loadingWoNo = ref(false)


// 新增：原材料制造商选择相关数据
const manufacturerVisible = ref(false)
const manufacturerList = ref([])
const totalManufacturer = ref(0)
const loadingManufacturer = ref(false)
const manufacturerQuery = reactive({
  descr: '',
  type: 1,  // 只查询供应商类型
  pageNumber: 1,
  pageSize: 10
})


// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增数据' : '编辑数据')
const formRef = ref(null)
const certificateUpload = ref(null)
const certificateFileList = ref([])
const form = reactive({
  id: undefined,
  contractNo: '',
  woNo: '',
  ipoNo: '',
  mafactory: '',
  maQuality: '',
  matMaterial: '',
  orderno: '',
  matRecheckNo: '',
  chemAl: 0.00,
  chemSi: 0.00,
  chemFe: 0.00,
  chemCu: 0.00,
  chemMn: 0.00,
  chemMg: 0.00,
  chemZn: 0.00,
  chemTi: 0.00,
  chemCr: 0.00,
  sampleNumber: '',
  tensileStrength: 0.00,
  elongation: 0.00,
  hardness: 0.00,
  leavefactoryDate: '',
  detectionTime: '',
  certificate: '[]',
  writeTime: '',
  writer: getWriterName(),
  status: 0,
  isdelete: 0,
  basno: ''  // 新增单据号字段
})

// 表单验证规则
const rules = {
  mafactory: [
    { required: true, message: '请选择原材料制造商', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  maQuality: [
    { required: true, message: '请输入材质', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  matMaterial: [
    { required: true, message: '请输入牌号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  orderno: [
    { required: true, message: '请输入入库单号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  matRecheckNo: [
    { required: true, message: '请输入来料检测批测号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  chemAl: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change']}
  ],
  chemSi: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change']}
  ],
  chemFe: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change']}
  ],
 chemCu: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change']}
  ],
  chemMn: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change']}
  ],
  chemMg: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change']}
  ],
  chemZn: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change']}
  ],
  chemTi: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change']}
  ],
  chemCr: [
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change']}
  ],
  sampleNumber: [
    { required: true, message: '请输入样品编号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  tensileStrength: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change']}
  ],
  elongation: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change']}
  ],
  hardness: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change']}
  ],
  leavefactoryDate: [
    { required: true, message: '请输入出厂日期', trigger: 'change' }
  ],
  detectionTime: [
    { required: true, message: '请输入入厂日期', trigger: 'change' }
  ],
  
  contractNo: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  woNo: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  ipoNo: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  basno: [
    { max: 50, message: '请获取单据号', trigger: 'blur' }
  ]

}


// 新增：打开制造商选择弹窗
const selectManufacturer = () => {
  manufacturerVisible.value = true
  getManufacturerList()
}

// 新增：获取制造商列表（供应商）
const getManufacturerList = async () => {
  loadingManufacturer.value = true
  try {
    const res = await getBasOrgs(manufacturerQuery)
    manufacturerList.value = res.data.page.list
    totalManufacturer.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取供应商列表失败', error)
    ElMessage.error('获取供应商列表失败')
  } finally {
    loadingManufacturer.value = false
  }
}

// 新增：处理制造商分页大小变化
const handleManufacturerSizeChange = (size) => {
  manufacturerQuery.pageSize = size
  getManufacturerList()
}

// 新增：处理制造商当前页变化
const handleManufacturerCurrentChange = (page) => {
  manufacturerQuery.pageNumber = page
  getManufacturerList()
}

// 新增：选择制造商
const handleSelectManufacturer = (row) => {
  form.mafactory = row.descr  // 将供应商名称赋值给制造商字段
  form.mafactoryId = row.id   // 可选：保存供应商ID用于后续处理
  manufacturerVisible.value = false
}

// 新增：点击行选择制造商
const handleManufacturerRowClick = (row) => {
  handleSelectManufacturer(row)
}


// 新增选择类型变量，用于区分当前选择的是哪个字段
const selectType = ref('')
// 生产工单号选择方法
const selectWoNo = () => {
  selectType.value = 'woNo'
  woNoSelectorVisible.value = true
  searchWoNo()
}

// 合同编号选择方法
const selectContractNo = () => {
  selectType.value = 'contractNo'
  woNoSelectorVisible.value = true
  searchWoNo()
}

// 生产订单号选择方法
const selectIpoNo = () => {
  selectType.value = 'ipoNo'
  woNoSelectorVisible.value = true
  searchWoNo()
}


// 修改选择处理逻辑，根据选择类型赋值
const handleWoNoSelectorSelect = (woNoInfo) => {
  // 根据当前选择类型进行赋值
  switch(selectType.value) {
    case 'contractNo':
      form.contractNo = woNoInfo.contractNo || ''
      break
    case 'woNo':
      form.woNo = woNoInfo.woNo || ''
      break
    case 'ipoNo':
      form.ipoNo = woNoInfo.ipoNo || ''
      break
  }
  
  // 关闭选择器
  woNoSelectorVisible.value = false
}

// 获取生产工单号列表
const searchWoNo = async (woNo = '') => {
  loadingWoNo.value = true
  try {
    const res = await getWoNoList({
      pageNumber: 1,
      pageSize: 10,
      woNo
    })
    woNoList.value = res.data.page.list
    totalWoNo.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取合同号列表失败', error)
    ElMessage.error('获取合同号列表失败')
  } finally {
    loadingWoNo.value = false
  }
}

// 获取数据列表
const getNzxjLcList = async () => {
  loading.value = true
  try {
    const res = await getNzxjLc(queryParams)
    nzxjLcList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取数据列表失败', error)
    ElMessage.error('获取数据列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getNzxjLcList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getNzxjLcList()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  if (certificateUpload.value) {
    certificateUpload.value.clearFiles()
  }
  certificateFileList.value = []
  Object.assign(form, {
    id: undefined,
    contractNo: '',
    woNo: '',
   ipoNo: '',
  mafactory: '',
  mafactoryId: '',  // 可选

  maQuality: '',
  matMaterial: '',
  orderno: '',
  matRecheckNo: '',
  chemAl: 0.00,
  chemSi: 0.00,
  chemFe: 0.00,
  chemCu: 0.00,
  chemMn: 0.00,
  chemMg: 0.00,
  chemZn: 0.00,
  chemTi: 0.00,
  chemCr: 0.00,
  sampleNumber: '',
  tensileStrength: 0.00,
  elongation: 0.00,
  hardness: 0.00,
  leavefactoryDate: '',
  detectionTime: '',
  certificate: '[]',
  writeTime: '',
  writer:getWriterName(),
  status: 0,
  isdelete: 0,
  basno: ''  // 新增单据号字段
  })
}

//刷新
const handleRefresh = () => {
  queryParams.contractNo = ''
  queryParams.woNo = ''
  queryParams.ipoNo = ''
  queryParams.mafactory = ''
  queryParams.matMaterial = ''
  queryParams.orderno = ''
  queryParams.matRecheckNo = ''
  queryParams.pageNumber = 1
  getNzxjLcList()
}

// 新增数据
const handleAdd = async() => {
  dialogType.value = 'add'
  
  resetForm()
  // 确保新增时使用当前用户信息
  form.writer = userStore.descr || '未知用户'

  // 获取单据号
  try {
    // 优先使用已预存的单据号，没有则获取
    if (nextBasNo.value) {
      form.basno = nextBasNo.value
      nextBasNo.value = ''
    } else {
      const res = await getBasNo('nzxjlc') // 注意：这里的参数可能需要根据实际业务调整
      if (res.code === 200) {
        form.basno = res.data.fullNoNyName
      } else {
        ElMessage.warning('获取单据号失败，可手动填写')
      }
    }
  } catch (e) {
    console.error('获取单据号异常', e)
    ElMessage.error('获取单据号失败')
  }

  dialogVisible.value = true
}

// 编辑数据
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  const res = await getNzxjLcById({ id: row.id })
  Object.assign(form, res.data.nzxjLc)
   if (!form.writer) {
    form.writer = userStore.descr || '未知用户'
  }
  try {
    JSON.parse(form.certificate)
  } catch (e) {
    if (form.certificate) {
      const urls = form.certificate.split('-')
      form.certificate = JSON.stringify(urls.map(url => ({ name: url.split('/').pop(), url: `/api/upload/${url}` })))
    } else {
      form.certificate = '[]'
    }
  }
  certificateFileList.value = JSON.parse(form.certificate)
  dialogVisible.value = true
}

// 删除数据
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除数据"${row.no}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteNzxjLc({ id: row.id })
      ElMessage.success('删除成功')
      getNzxjLcList()
    } catch (error) {
      console.error('删除数据失败', error)
      ElMessage.error('删除数据失败')
    }
  }).catch(() => {})
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {

        // 提交前检查basno是否存在
        if (!form.basno) {
          ElMessage.error('单据号未生成，请刷新重试')
          return
        }


        // 自动生成当前时间
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        form.writeTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        if (dialogType.value === 'add') {
          await createNzxjLc(form);
          ElMessage.success('新增成功');

           // 保存成功后获取新的单据号（用于下次新增）
          try {
            const res = await getBasNo('nzxjlc') // 注意：这里的参数可能需要根据实际业务调整
            if (res.code === 200) {
              nextBasNo.value = res.data.fullNoNyName
            }
          } catch (e) {
            console.error('获取新单据号异常', e)
          }

        } else {
          await updateNzxjLc(form);
          ElMessage.success('修改成功');
        }
        dialogVisible.value = false;
        getNzxjLcList();
      } catch (error) {
        console.error('保存数据失败', error);
        ElMessage.error('保存数据失败');
      }
    }
  })
}

// 添加存储下次要用的单据号的ref
const nextBasNo = ref('')

// 处理质量证明书上传
const handleCertificateChange = async (file) => {
  const formData = new FormData()
  formData.append('file', file.raw)
  

  try {
    const res = await uploadFile(formData)
    if (res.success && res.data && res.data.url) {
      const newUrl = baseUrl + res.data.url
      const fileList = JSON.parse(form.certificate)
      fileList.push({ name: file.name, url: newUrl })
      form.certificate = JSON.stringify(fileList)
      certificateFileList.value.push({ name: file.name, url: newUrl })
      ElMessage.success(`${file.name} 上传成功`)
    } else {
      throw new Error(res.msg || '文件上传失败')
    }
  } catch (error) {
    console.error('文件上传失败', error)
    ElMessage.error(`${file.name} 上传失败`)
    certificateUpload.value.clearFiles()
  }
}

// 删除已上传的质量证明书文件
const deleteCertificateFile = (index) => {
  const fileList = JSON.parse(form.certificate)
  fileList.splice(index, 1)
  form.certificate = JSON.stringify(fileList)
  certificateFileList.value.splice(index, 1)
}

// 下载文件
const openFileInNewWindow = (url) => {
  window.open(url, '_blank');
}

// 页面初始化
onMounted(() => {
  getNzxjLcList()
})
</script>

<style scoped>
.nzxjLc-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.uploaded-files {
  margin-top: 10px;
}
.uploaded-file {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.uploaded-file .el-button {
  margin-left: 10px;
}
.file-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
}
.file-link:hover {
  text-decoration: underline;
}
</style>