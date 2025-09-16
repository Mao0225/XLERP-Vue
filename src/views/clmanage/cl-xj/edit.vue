<template>
    <el-dialog title="编辑橡胶检验记录" :model-value="visible" width="1300px" :center="true" :close-on-click-modal="false"
      @update:model-value="$emit('update:visible', $event)" @closed="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="custom-form">
        <el-row :gutter="20">
          <!-- 基础信息 -->
          <el-col :span="12">
            <el-form-item label="单据号" prop="basno">
              <el-input v-model="form.basno" placeholder="单据号" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验单号" prop="inNo">
              <el-input v-model="form.inNo" placeholder="请输入检验单号" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录入人" prop="writer">
              <el-input v-model="form.writer" placeholder="录入人" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试验编号" prop="testno">
              <el-input v-model="form.testno" placeholder="请输入试验编号" clearable size="small" />
            </el-form-item>
          </el-col>
  
          <!-- 供应商信息 -->
          <el-col :span="12">
            <el-form-item label="供应商编号" prop="mafactoryno">
              <el-input v-model="form.mafactoryno" placeholder="供应商编号" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="mafactoryname">
              <el-input
                v-model="form.mafactoryname"
                placeholder="选择供应商"
                readonly
                clearable
                @click="selectManufacturer"
                size="small"
              >
                <template #append>
                  <el-button @click="selectManufacturer" size="small">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
  
          <!-- 材料信息 -->
          <el-col :span="12">
            <el-form-item label="材料名称" prop="matname">
              <el-input v-model="form.matname" placeholder="请输入材料名称" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材质" prop="material">
              <el-input v-model="form.material" placeholder="请输入材质" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格" prop="mattype">
              <el-input v-model="form.mattype" placeholder="请输入规格" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用单位" prop="matdepartment">
              <el-input v-model="form.matdepartment" placeholder="请输入使用单位" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来料检验批次号" prop="matRecheckNo">
              <el-input v-model="form.matRecheckNo" placeholder="请输入来料检验批次号" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行标准" prop="standard">
              <el-input v-model="form.standard" placeholder="请输入执行标准" clearable size="small" />
            </el-form-item>
          </el-col>
  
          <!-- 数量信息 -->
          <el-col :span="12">
            <el-form-item label="来料数量" prop="quantity">
              <el-input v-model.number="form.quantity" placeholder="请输入来料数量" type="number" clearable size="small" step="0.01" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="抽检数量" prop="sampleQuantity">
              <el-input v-model="form.sampleQuantity" placeholder="请输入抽检数量" clearable size="small" />
            </el-form-item>
          </el-col>
  
          <!-- 日期信息 -->
          <el-col :span="12">
            <el-form-item label="原材料出厂检测日期" prop="leavefactoryDate">
              <el-date-picker v-model="form.leavefactoryDate" type="date" placeholder="选择出厂日期" value-format="YYYY-MM-DD"
                size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验日期" prop="detectionTime">
              <el-date-picker v-model="form.detectionTime" type="date" placeholder="选择检验日期" value-format="YYYY-MM-DD"
                size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
  
          <!-- 外形检测 -->
          <el-col :span="24">
            <el-divider content-position="left">外形检测</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外形检测说明" prop="appearanceSize">
              <el-input v-model="form.appearanceSize" placeholder="请输入外形检测说明" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外形检测结果" prop="appearanceResult">
              <el-select v-model="form.appearanceResult" placeholder="请选择检测结果" clearable size="small" style="width: 100%">
                <el-option label="合格" value="合格" />
                <el-option label="不合格" value="不合格" />
              </el-select>
            </el-form-item>
          </el-col>
  
         <!-- 尺寸检测 -->
         <el-col :span="24">
            <el-divider content-position="left">尺寸检测</el-divider>
          </el-col>
  
          <!-- 长度测量 -->
          <el-col :span="24">
            <el-form-item label="长度测量值">
              <el-row :gutter="10">
                <span style="margin-right: 4px;">标准值：</span>
              <el-col :span="2"> <!-- 宽度调整为原来的1/3 --> 
                <el-input v-model.number="form.matlongsizebiaozhun" placeholder="标准值" type="number" clearable size="small" @change="calculateLongAverage" />
              </el-col>
                <el-col :span="2"> <!-- 宽度调整为原来的1/3 -->
                  <el-input v-model.number="form.matlongsize1" placeholder="测量值1" type="number" clearable size="small" @change="calculateLongAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matlongsize2" placeholder="测量值2" type="number" clearable size="small" @change="calculateLongAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matlongsize3" placeholder="测量值3" type="number" clearable size="small" @change="calculateLongAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matlongsize4" placeholder="测量值4" type="number" clearable size="small" @change="calculateLongAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matlongsize5" placeholder="测量值5" type="number" clearable size="small" @change="calculateLongAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matlongAverage" placeholder="平均值" type="number" readonly size="small" />
                </el-col>
                <el-col :span="6"> <!-- 增加检测结果宽度 -->
                  <span style="margin-right: 4px;">检测结果</span>
                  <el-select v-model="form.matlongresult" placeholder="结果" clearable size="small" style="width: auto; min-width: 100px;">
                    <el-option label="合格" value="合格" />
                    <el-option label="不合格" value="不合格" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
  
          <!-- 宽度测量 -->
          <el-col :span="24">
            <el-form-item label="宽度测量值">
              <el-row :gutter="10">
                <span style="margin-right: 4px;">标准值：</span>
              <el-col :span="2"> <!-- 宽度调整为原来的1/3 --> 
                <el-input v-model.number="form.matlenghsizebiaozhun" placeholder="标准值" type="number" clearable size="small" @change="calculateLongAverage" />
              </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matlenghsize1" placeholder="测量值1" type="number" clearable size="small" @change="calculateLengthAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matlenghsize2" placeholder="测量值2" type="number" clearable size="small" @change="calculateLengthAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matlenghsize3" placeholder="测量值3" type="number" clearable size="small" @change="calculateLengthAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matlenghsize4" placeholder="测量值4" type="number" clearable size="small" @change="calculateLengthAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matlenghsize5" placeholder="测量值5" type="number" clearable size="small" @change="calculateLengthAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matlenghAverage" placeholder="平均值" type="number" readonly size="small" />
                </el-col>
                <el-col :span="6">
                  <span style="margin-right: 4px;">检测结果</span>
                  <el-select v-model="form.matlenghresult" placeholder="结果" clearable size="small" style="width: auto; min-width: 100px;">
                    <el-option label="合格" value="合格" />
                    <el-option label="不合格" value="不合格" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
  
          <!-- 线径测量 -->
          <el-col :span="24">
            <el-form-item label="线径测量值">
              <el-row :gutter="10">
              <span style="margin-right: 4px;">标准值：</span>
              <el-col :span="2"> <!-- 宽度调整为原来的1/3 --> 
                <el-input v-model.number="form.matxianjingsizebiaozhun" placeholder="标准值" type="number" clearable size="small" @change="calculateLongAverage" />
              </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matxianjing1" placeholder="测量值1" type="number" clearable size="small" @change="calculateXianjingAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matxianjing2" placeholder="测量值2" type="number" clearable size="small" @change="calculateXianjingAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matxianjing3" placeholder="测量值3" type="number" clearable size="small" @change="calculateXianjingAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matxianjing4" placeholder="测量值4" type="number" clearable size="small" @change="calculateXianjingAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matxianjing5" placeholder="测量值5" type="number" clearable size="small" @change="calculateXianjingAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matxianjingAverage" placeholder="平均值" type="number" readonly size="small" />
                </el-col>
                <el-col :span="6">
                  <span style="margin-right: 4px;">检测结果</span>
                  <el-select v-model="form.matxianjingresult" placeholder="结果" clearable size="small" style="width: auto; min-width: 100px;">
                    <el-option label="合格" value="合格" />
                    <el-option label="不合格" value="不合格" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
  
          <!-- 厚度测量 -->
          <el-col :span="24">
            <el-form-item label="厚度测量值">
              <el-row :gutter="10">
                <span style="margin-right: 4px;">标准值：</span>
              <el-col :span="2"> <!-- 宽度调整为原来的1/3 --> 
                <el-input v-model.number="form.matheightsizebiaozhun" placeholder="标准值" type="number" clearable size="small" @change="calculateLongAverage" />
              </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matheightsize1" placeholder="测量值1" type="number" clearable size="small" @change="calculateHeightAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matheightsize2" placeholder="测量值2" type="number" clearable size="small" @change="calculateHeightAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matheightsize3" placeholder="测量值3" type="number" clearable size="small" @change="calculateHeightAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matheightsize4" placeholder="测量值4" type="number" clearable size="small" @change="calculateHeightAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matheightsize5" placeholder="测量值5" type="number" clearable size="small" @change="calculateHeightAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matheightAverage" placeholder="平均值" type="number" readonly size="small" />
                </el-col>
                <el-col :span="6">
                  <span style="margin-right: 4px;">检测结果</span>
                  <el-select v-model="form.matheightsizeresult" placeholder="结果" clearable size="small" style="width: auto; min-width: 100px;">
                    <el-option label="合格" value="合格" />
                    <el-option label="不合格" value="不合格" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
  
          <!-- 柱径测量 -->
          <el-col :span="24">
            <el-form-item label="柱径测量值">
              <el-row :gutter="10">
                <span style="margin-right: 4px;">标准值：</span>
              <el-col :span="2"> <!-- 宽度调整为原来的1/3 --> 
                <el-input v-model.number="form.matzhujingsizebiaozhun" placeholder="标准值" type="number" clearable size="small" @change="calculateLongAverage" />
              </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matzhujingsize1" placeholder="测量值1" type="number" clearable size="small" @change="calculateZhujingAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matzhujingsize2" placeholder="测量值2" type="number" clearable size="small" @change="calculateZhujingAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matzhujingsize3" placeholder="测量值3" type="number" clearable size="small" @change="calculateZhujingAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matzhujingsize4" placeholder="测量值4" type="number" clearable size="small" @change="calculateZhujingAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matzhujingsize5" placeholder="测量值5" type="number" clearable size="small" @change="calculateZhujingAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matzhujingAverage" placeholder="平均值" type="number" readonly size="small" />
                </el-col>
                <el-col :span="6">
                  <span style="margin-right: 4px;">检测结果</span>
                  <el-select v-model="form.matzhujingsizeresult" placeholder="结果" clearable size="small" style="width: auto; min-width: 100px;">
                    <el-option label="合格" value="合格" />
                    <el-option label="不合格" value="不合格" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
  
          <!-- 柱高测量 -->
          <el-col :span="24">
            <el-form-item label="柱高测量值">
              <el-row :gutter="10">
                <span style="margin-right: 4px;">标准值：</span>
              <el-col :span="2"> <!-- 宽度调整为原来的1/3 --> 
                <el-input v-model.number="form.matzhugaosizebiaozhun" placeholder="标准值" type="number" clearable size="small" @change="calculateLongAverage" />
              </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matzhugaosize1" placeholder="测量值1" type="number" clearable size="small" @change="calculateZhugaoAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matzhugaosize2" placeholder="测量值2" type="number" clearable size="small" @change="calculateZhugaoAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matzhugaosize3" placeholder="测量值3" type="number" clearable size="small" @change="calculateZhugaoAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matzhugaosize4" placeholder="测量值4" type="number" clearable size="small" @change="calculateZhugaoAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matzhugaosize5" placeholder="测量值5" type="number" clearable size="small" @change="calculateZhugaoAverage" />
                </el-col>
                <el-col :span="2">
                  <el-input v-model.number="form.matzhugaoAverage" placeholder="平均值" type="number" readonly size="small" />
                </el-col>
                <el-col :span="6">
                  <span style="margin-right: 4px;">检测结果</span>
                  <el-select v-model="form.matzhugaosizeresult" placeholder="结果" clearable size="small" style="width: auto; min-width: 100px;">
                    <el-option label="合格" value="合格" />
                    <el-option label="不合格" value="不合格" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
  
          <!-- 机械性能 -->
          <el-col :span="24">
            <el-divider content-position="left">机械性能</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="硬度值" prop="matjixiexingnengvalue">
              <el-input v-model.number="form.matjixiexingnengvalue" placeholder="硬度（邵儿）67-73" type="number" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="硬度检测结果" prop="matjixiexingnengresult">
              <el-select v-model="form.matjixiexingnengresult" placeholder="请选择检测结果" clearable size="small" style="width: 100%">
                <el-option label="合格" value="合格" />
                <el-option label="不合格" value="不合格" />
              </el-select>
            </el-form-item>
          </el-col>
  
          <!-- 其他信息 -->
          <el-col :span="24">
            <el-form-item label="质量证明书" prop="certificate">
              <el-upload
                ref="certificateUpload"
                :auto-upload="false"
                :on-change="handleCertificateChange"
                :limit="10"
                accept=".pdf,.jpg,.jpeg,.png"
                :file-list="certificateFileList"
                :show-file-list="false"
              >
                <el-button type="primary" size="small">上传文件</el-button>
              </el-upload>
              <div v-if="certificateFileList.length > 0" class="file-list">
                <div v-for="(file, index) in certificateFileList" :key="index" class="file-item">
                  {{ file.name }}
                  <el-icon class="delete-icon" @click="handleDeleteFile(index)">
                    <Delete />
                  </el-icon>
                </div>
              </div>
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="检验人" prop="checker">
              <el-input v-model="form.checker" placeholder="请输入检验人" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核人" prop="auditor">
              <el-input v-model="form.auditor" placeholder="请输入审核人" clearable size="small" />
            </el-form-item>
          </el-col>
  
          <el-col :span="24">
            <el-form-item label="备注" prop="memo">
              <el-input v-model="form.memo" placeholder="请输入备注信息" clearable size="small" type="textarea" rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
    
  
        
      </el-form>
      <template #footer>
          <span class="dialog-footer">
            <el-button @click="$emit('update:visible', false)" size="small">取消</el-button>
            <el-button type="primary" @click="submitForm" :loading="submitting" size="small">确定</el-button>
          </span>
        </template>
      <!-- 供应商选择弹窗 -->
      <SupplierSelector v-model:visible="supplierSelectorVisible" @select="handleSelect" />
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import { updateXj } from '@/api/clmanage/cl-xj'
  import { uploadFile } from '@/api/file/file'
  import { baseURL } from '@/utils/request'
  import { useUserStore } from '@/store/user'
  import SupplierSelector from '../components/SupplierSelector.vue'
  import { Delete } from '@element-plus/icons-vue'
  
  const props = defineProps({
    visible: {
      type: Boolean,
      required: true
    },
    initialData: {
      type: Object,
      default: () => ({})
    }
  })
  
  const supplierSelectorVisible = ref(false)
  const emit = defineEmits(['update:visible', 'success'])
  const userStore = useUserStore()
  const baseUrl = baseURL
  const formRef = ref(null)
  const certificateUpload = ref(null)
  const certificateFileList = ref([])
  const submitting = ref(false)
  
  // 选择供应商
  const selectManufacturer = () => {
    supplierSelectorVisible.value = true
  }
  
  // 处理选择的供应商
  const handleSelect = (supplier) => {
    console.log("选中的供应商是:", supplier)
    form.mafactoryno = supplier.no
    form.mafactoryname = supplier.descr
  }
  
  // 表单数据
  const form = reactive({
    id: undefined,
    inNo: '',
    mafactoryno: '',
    mafactoryname: '',
    detectionTime: '',
    matname: '',
    material: '',
    mattype: '',
    testno: '',
    quantity: null,
    sampleQuantity: '',
    matdepartment: '',
    matRecheckNo: '',
    standard: '',
    matlongsizebiaozhun: null,
    matlenghsizebiaozhun: null,
    matxianjingbiaozhun: null,
    matheightsizebiaozhun: null,
    matzhujingsizebiaozhun: null,
    matzhugaosizebiaozhun: null,
    leavefactoryDate: '',
    appearanceSize: '',
    appearanceResult: '',
    certificate: '[]',
    // 长度测量值
    matlongsize1: null,
    matlongsize2: null,
    matlongsize3: null,
    matlongsize4: null,
    matlongsize5: null,
    matlongAverage: null,
    matlongresult: '',
    // 宽度测量值
    matlenghsize1: null,
    matlenghsize2: null,
    matlenghsize3: null,
    matlenghsize4: null,
    matlenghsize5: null,
    matlenghAverage: null,
    matlenghresult: '',
    // 线径测量值
    matxianjing1: null,
    matxianjing2: null,
    matxianjing3: null,
    matxianjing4: null,
    matxianjing5: null,
    matxianjingAverage: null,
    matxianjingresult: '',
    // 厚度测量值
    matheightsize1: null,
    matheightsize2: null,
    matheightsize3: null,
    matheightsize4: null,
    matheightsize5: null,
    matheightAverage: null,
    matheightsizeresult: '',
    // 柱径测量值
    matzhujingsize1: null,
    matzhujingsize2: null,
    matzhujingsize3: null,
    matzhujingsize4: null,
    matzhujingsize5: null,
    matzhujingAverage: null,
    matzhujingsizeresult: '',
    // 柱高测量值
    matzhugaosize1: null,
    matzhugaosize2: null,
    matzhugaosize3: null,
    matzhugaosize4: null,
    matzhugaosize5: null,
    matzhugaoAverage: null,
    matzhugaosizeresult: '',
    // 机械性能
    matjixiexingnengvalue: null,
    matjixiexingnengresult: '',
    // 其他信息
    writeTime: '',
    writer: userStore.descr || '未知用户',
    status: '0',
    memo: '',
    basno: '',
    checker: '',
    auditor: ''
  })
  
  // 计算平均值的方法
  const calculateAverage = (values) => {
    const validValues = values.filter(v => v !== null && v !== undefined && !isNaN(v))
    if (validValues.length === 0) return null
    return (validValues.reduce((sum, val) => sum + val, 0) / validValues.length).toFixed(2)
  }
  
  // 计算长度平均值
  const calculateLongAverage = () => {
    form.matlongAverage = calculateAverage([
      form.matlongsize1,
      form.matlongsize2,
      form.matlongsize3,
      form.matlongsize4,
      form.matlongsize5
    ])
  }
  
  // 计算宽度平均值
  const calculateLengthAverage = () => {
    form.matlenghAverage = calculateAverage([
      form.matlenghsize1,
      form.matlenghsize2,
      form.matlenghsize3,
      form.matlenghsize4,
      form.matlenghsize5
    ])
  }
  
  // 计算线径平均值
  const calculateXianjingAverage = () => {
    form.matxianjingAverage = calculateAverage([
      form.matxianjing1,
      form.matxianjing2,
      form.matxianjing3,
      form.matxianjing4,
      form.matxianjing5
    ])
  }
  
  // 计算厚度平均值
  const calculateHeightAverage = () => {
    form.matheightAverage = calculateAverage([
      form.matheightsize1,
      form.matheightsize2,
      form.matheightsize3,
      form.matheightsize4,
      form.matheightsize5
    ])
  }
  
  // 计算柱径平均值
  const calculateZhujingAverage = () => {
    form.matzhujingAverage = calculateAverage([
      form.matzhujingsize1,
      form.matzhujingsize2,
      form.matzhujingsize3,
      form.matzhujingsize4,
      form.matzhujingsize5
    ])
  }
  
  // 计算柱高平均值
  const calculateZhugaoAverage = () => {
    form.matzhugaoAverage = calculateAverage([
      form.matzhugaosize1,
      form.matzhugaosize2,
      form.matzhugaosize3,
      form.matzhugaosize4,
      form.matzhugaosize5
    ])
  }
  
  // 表单验证规则
  const rules = reactive({
    basno: [
      { required: true, message: '单据号不能为空', trigger: 'blur' }
    ],
    inNo: [
      { required: true, message: '请输入检验单号', trigger: 'blur' },
      { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
    ],
    mafactoryno: [
      { required: true, message: '请选择供应商', trigger: 'blur' }
    ],
    mafactoryname: [
      { required: true, message: '请选择供应商', trigger: 'blur' }
    ],
    matname: [
      { required: true, message: '请输入材料名称', trigger: 'blur' },
      { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
    ],
    material: [
      { required: true, message: '请输入材质', trigger: 'blur' },
      { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
    ],
    detectionTime: [
      { required: true, message: '请选择检验日期', trigger: 'change' }
    ],
    appearanceResult: [
      { required: true, message: '请选择外形检测结果', trigger: 'change' }
    ],
    checker: [
      { required: true, message: '请输入检验人', trigger: 'blur' },
      { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
    ],
    certificate: [
      { required: true, message: '请上传质量证明书', trigger: 'change' }
    ]
  })
  
  // 处理文件上传
  const handleCertificateChange = async (file) => {
    const formData = new FormData()
    formData.append('file', file.raw)
    try {
      const res = await uploadFile(formData)
      if (res.code === 200) {
        certificateFileList.value.push({
          name: file.name,
          url: res.data.url
        })
        form.certificate = JSON.stringify(certificateFileList.value)
      } else {
        ElMessage.error('文件上传失败: ' + res.msg)
      }
    } catch (error) {
      console.error('文件上传失败', error)
      ElMessage.error('文件上传失败')
    }
  }
  
  // 删除上传的文件
  const handleDeleteFile = (index) => {
    certificateFileList.value.splice(index, 1)
    form.certificate = JSON.stringify(certificateFileList.value)
  }
  
  // 提交表单
  const submitForm = async () => {
    if (!formRef.value) return
    try {
      await formRef.value.validate()
      submitting.value = true
      
      const res = await updateXj(form)
      if (res.code === 200) {
        ElMessage.success('橡胶检验记录更新成功')
        emit('success')
        emit('update:visible', false)
      } else {
        ElMessage.error(res.msg || '更新失败')
      }
    } catch (error) {
      console.error('更新橡胶检验记录失败', error)
      if (error.name !== 'Error') {
        ElMessage.error('表单验证失败，请检查输入')
      } else {
        ElMessage.error('更新橡胶检验记录失败')
      }
    } finally {
      submitting.value = false
    }
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
      inNo: '',
      mafactoryno: '',
      mafactoryname: '',
      detectionTime: '',
      matname: '',
      material: '',
      mattype: '',
      testno: '',
      quantity: null,
      sampleQuantity: '',
      matdepartment: '',
      matRecheckNo: '',
      standard: '',
      leavefactoryDate: '',
      appearanceSize: '',
      appearanceResult: '',
      certificate: '[]',
      matlongsizebiaozhun: null,
      matlenghsizebiaozhun: null,
      matxianjingbiaozhun: null,
      matheightsizebiaozhun: null,
      matzhujingsizebiaozhun: null,
      matzhugaosizebiaozhun: null,
      // 重置所有测量值和平均值
      matlongsize1: null,
      matlongsize2: null,
      matlongsize3: null,
      matlongsize4: null,
      matlongsize5: null,
      matlongAverage: null,
      matlongresult: '',
      matlenghsize1: null,
      matlenghsize2: null,
      matlenghsize3: null,
      matlenghsize4: null,
      matlenghsize5: null,
      matlenghAverage: null,
      matlenghresult: '',
      matxianjing1: null,
      matxianjing2: null,
      matxianjing3: null,
      matxianjing4: null,
      matxianjing5: null,
      matxianjingAverage: null,
      matxianjingresult: '',
      matheightsize1: null,
      matheightsize2: null,
      matheightsize3: null,
      matheightsize4: null,
      matheightsize5: null,
      matheightAverage: null,
      matheightsizeresult: '',
      matzhujingsize1: null,
      matzhujingsize2: null,
      matzhujingsize3: null,
      matzhujingsize4: null,
      matzhujingsize5: null,
      matzhujingAverage: null,
      matzhujingsizeresult: '',
      matzhugaosize1: null,
      matzhugaosize2: null,
      matzhugaosize3: null,
      matzhugaosize4: null,
      matzhugaosize5: null,
      matzhugaoAverage: null,
      matzhugaosizeresult: '',
      matjixiexingnengvalue: null,
      matjixiexingnengresult: '',
      writeTime: '',
      writer: userStore.descr || '未知用户',
      status: '0',
      memo: '',
      basno: '',
      checker: '',
      auditor: ''
    })
  }
  
  // 监听初始数据变化，更新表单
  watch(() => props.initialData, (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      Object.assign(form, newData)
      // 解析证书文件列表
      certificateFileList.value = JSON.parse(newData.certificate || '[]')
      // 计算各平均值
      calculateLongAverage()
      calculateLengthAverage()
      calculateXianjingAverage()
      calculateHeightAverage()
      calculateZhujingAverage()
      calculateZhugaoAverage()
    }
  }, { immediate: true })
  
  onMounted(() => {
    // 初始化表单数据
    if (props.initialData && Object.keys(props.initialData).length > 0) {
      Object.assign(form, props.initialData)
      certificateFileList.value = JSON.parse(props.initialData.certificate || '[]')
      // 计算各平均值
      calculateLongAverage()
      calculateLengthAverage()
      calculateXianjingAverage()
      calculateHeightAverage()
      calculateZhujingAverage()
      calculateZhugaoAverage()
    }
  })
  </script>
  
  <style scoped>
  .custom-form {
    margin-top: 10px;
  }
  .file-list {
    margin-top: 10px;
    border-top: 1px dashed #ccc;
    padding-top: 10px;
  }
  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    padding: 5px;
    background-color: #f5f5f5;
    border-radius: 4px;
  }
  .delete-icon {
    color: #ff4d4f;
    cursor: pointer;
  }
  .dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 16px;
}
  </style>