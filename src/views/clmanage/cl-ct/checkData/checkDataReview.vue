<template>
  <div class="aluminum-ingot-management">
    <div class="action-bar">

      <div class="search-inputs">
                        <el-input v-model="queryParams.contractNo" placeholder="请输入合同编号查询" style="width: 200px; margin-right: 10px;"
          clearable @clear="getAluminumIngotList" @keyup.enter="getAluminumIngotList" />
        <el-input v-model="queryParams.contractName" placeholder="请输入合同名称查询" style="width: 200px; margin-right: 10px;"
          clearable @clear="getAluminumIngotList" @keyup.enter="getAluminumIngotList" />
        <el-input
          v-model="queryParams.mafactory"
          placeholder="请输入原材料制造商查询"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getAluminumIngotList"
          @keyup.enter="getAluminumIngotList"
        />
        <el-input
          v-model="queryParams.matRecheckNo"
          placeholder="请输入复检单号"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getAluminumIngotList"
          @keyup.enter="getAluminumIngotList"
        />
        <el-button type="primary" @click="getAluminumIngotList">搜索</el-button>
        <el-button type="warning" @click="handleRefresh">
          <el-icon>
            <Refresh />
          </el-icon> 刷新
        </el-button>
     </div>
    </div>

      
       <el-table :data="aluminumIngotList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      
      <!-- 状态列使用 Tag 显示 -->
      <el-table-column prop="status" label="状态" width="140">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)" size="small">
            <el-icon><component :is="getStatusIcon(row.status)" /></el-icon>
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="basNo" label="单据号" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.basNo" placement="top">
            <span class="truncate">{{ row.basNo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="matRecheckNo" label="复检单号" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.matRecheckNo" placement="top">
            <span class="truncate">{{ row.matRecheckNo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column prop="mafactory" label="制造商" width="160">
        <template #default="{ row }">
          <el-tooltip :content="row.mafactory" placement="top">
            <span class="truncate">{{ row.mafactory }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
       <el-table-column prop="contractNo" label="合同编号" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.contractNo" placement="top">
            <span class="truncate">{{ row.contractNo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
            <el-table-column prop="contractName" label="合同名称" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.contractName" placement="top">
            <span class="truncate">{{ row.contractName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="matMaterial" label="牌号" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.matMaterial" placement="top">
            <span class="truncate">{{ row.matMaterial }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="material" label="材质" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.material" placement="top">
            <span class="truncate">{{ row.material }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="standard" label="检验标准" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.standard" placement="top">
            <span class="truncate">{{ row.standard }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="型号" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.type" placement="top">
            <span class="truncate">{{ row.type }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column prop="sampleQuantity" label="样品数量" width="90">
        <template #default="{ row }">
          <el-tooltip :content="row.sampleQuantity" placement="top">
            <span class="truncate">{{ row.sampleQuantity }} 件</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="checkWriter" label="检验人" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.checkWriter" placement="top">
            <span class="truncate">{{ row.checkWriter }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="checkAuditor" label="审核人" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.checkAuditor" placement="top">
            <span class="truncate">{{ row.checkAuditor }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      

<!-- 尺寸信息 -->
<el-table-column prop="kong1" label="实测值1" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kong1" placement="top">
      <span class="truncate">{{ row.kong1}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="kong2" label="实测值2" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kong2" placement="top">
      <span class="truncate">{{ row.kong2}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="kong3" label="实测值3" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kong3" placement="top">
      <span class="truncate">{{ row.kong3}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="kong4" label="实测值4" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kong4" placement="top">
      <span class="truncate">{{ row.kong4}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="kong5" label="实测值5" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kong5" placement="top">
      <span class="truncate">{{ row.kong5}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="kongRequired" label="孔标准尺寸" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kongRequired" placement="top">
      <span class="truncate">{{ row.kongRequired}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="kongJudgmentResult" label="判断结果" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kongJudgmentResult" placement="top">
      <span class="truncate">{{ row.kongJudgmentResult}}</span>
    </el-tooltip>
  </template>
</el-table-column>

<el-table-column prop="zongChang1" label="实测值1" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.zongChang1" placement="top">
      <span class="truncate">{{ row.zongChang1}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="zongChang2" label="实测值2" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.zongChang2" placement="top">
      <span class="truncate">{{ row.zongChang2}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="zongChang3" label="实测值3" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.zongChang3" placement="top">
      <span class="truncate">{{ row.zongChang3}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="zongChang4" label="实测值4" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.zongChang4" placement="top">
      <span class="truncate">{{ row.zongChang4}}</span>
    </el-tooltip>
  </template>
</el-table-column>

<el-table-column prop="zongChang5" label="实测值5" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.zongChang5" placement="top">
      <span class="truncate">{{ row.zongChang5}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="zongChangRequired" label="总长标准尺寸" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.zongChangRequired" placement="top">
      <span class="truncate">{{ row.zongChangRequired}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="zongChangJudgmentResult" label="判断结果" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.zongChangJudgmentResult" placement="top">
      <span class="truncate">{{ row.zongChangJudgmentResult}}</span>
    </el-tooltip>
  </template>
</el-table-column>


<el-table-column prop="kuan1" label="实测值1" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kuan1" placement="top">
      <span class="truncate">{{ row.kuan1}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="kuan2" label="实测值2" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kuan2" placement="top">
      <span class="truncate">{{ row.kuan2}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="kuan3" label="实测值3" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kuan3" placement="top">
      <span class="truncate">{{ row.kuan3}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="kuan4" label="实测值4" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kuan4" placement="top">
      <span class="truncate">{{ row.kuan4}}</span>
    </el-tooltip>
  </template>
</el-table-column>

<el-table-column prop="kuan5" label="实测值5" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kuan5" placement="top">
      <span class="truncate">{{ row.kuan5}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="kuanRequired" label="宽标准尺寸" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kuanRequired" placement="top">
      <span class="truncate">{{ row.kuanRequired}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="kuanJudgmentResult" label="判断结果" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.kuanJudgmentResult" placement="top">
      <span class="truncate">{{ row.kuanJudgmentResult}}</span>
    </el-tooltip>
  </template>
</el-table-column>

<el-table-column prop="touKuan1" label="实测值1" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.touKuan1" placement="top">
      <span class="truncate">{{ row.touKuan1}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="touKuan2" label="实测值2" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.touKuan2" placement="top">
      <span class="truncate">{{ row.touKuan2}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="touKuan3" label="实测值3" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.touKuan3" placement="top">
      <span class="truncate">{{ row.touKuan3}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="touKuan4" label="实测值4" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.touKuan4" placement="top">
      <span class="truncate">{{ row.touKuan4}}</span>
    </el-tooltip>
  </template>
</el-table-column>

<el-table-column prop="touKuan5" label="实测值5" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.touKuan5" placement="top">
      <span class="truncate">{{ row.touKuan5}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="touKuanRequired" label="头宽标准尺寸" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.touKuanRequired" placement="top">
      <span class="truncate">{{ row.touKuanRequired}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="touKuanJudgmentResult" label="判断结果" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.touKuanJudgmentResult" placement="top">
      <span class="truncate">{{ row.touKuanJudgmentResult}}</span>
    </el-tooltip>
  </template>
</el-table-column>

<!-- 外形信息 -->
<el-table-column prop="appearance" label="外形" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.appearance" placement="top">
      <span class="truncate">{{ row.appearance}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="appearanceRequired" label="外形标准" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.appearanceRequired" placement="top">
      <span class="truncate">{{ row.appearanceRequired}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="appearanceJudgmentResult" label="判断结果" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.appearanceJudgmentResult" placement="top">
      <span class="truncate">{{ row.appearanceJudgmentResult}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<!-- 机械性能 -->
<el-table-column prop="zhongLiang1" label="实测值1" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.zhongLiang1" placement="top">
      <span class="truncate">{{ row.zhongLiang1}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="zhongLiang2" label="实测值2" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.zhongLiang2" placement="top">
      <span class="truncate">{{ row.zhongLiang2}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="zhongLiang3" label="实测值3" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.zhongLiang3" placement="top">
      <span class="truncate">{{ row.zhongLiang3}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="zhongLiang4" label="实测值4" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.zhongLiang4" placement="top">
      <span class="truncate">{{ row.zhongLiang4}}</span>
    </el-tooltip>
  </template>
</el-table-column>

<el-table-column prop="zhongLiang5" label="实测值5" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.zhongLiang5" placement="top">
      <span class="truncate">{{ row.zhongLiang5}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="zhongLiangRequired" label="重量标准" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.zhongLiangRequired" placement="top">
      <span class="truncate">{{ row.zhongLiangRequired}}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="machineryJudgmentResult" label="判断结果" width="120">
  <template #default="{ row }">
    <el-tooltip :content="row.machineryJudgmentResult" placement="top">
      <span class="truncate">{{ row.machineryJudgmentResult}}</span>
    </el-tooltip>
  </template>
</el-table-column>

     <el-table-column prop="memo" label="请检单备注" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.memo" placement="top">
            <span class="truncate">{{ row.memo}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="checkMemo" label="复检备注" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.checkMemo" placement="top">
            <span class="truncate">{{ row.checkMemo}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="detectionTime" label="入厂检测日期" width="130" >
        <template #default="{ row }">
          <el-tooltip :content="row.detectionTime" placement="top">
            <span class="truncate">{{ row.detectionTime}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="certificate" label="质量证明" width="100">
        <template #default="{ row }">
          <div v-for="(file, index) in JSON.parse(row.certificate || '[]')" :key="index">
            <el-tooltip :content="file.name" placement="top">
              <span class="file-link" @click="openFileInNewWindow(file.url, file.name)">{{ file.name }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      
      <!-- 操作列使用动态按钮 -->
      <el-table-column label="操作" width="300" fixed="right">
        <template #default="{ row }">
          <el-button
            v-for="action in getStatusActions(row.status)"
            :key="action.action"
            :size="'small'"
            :type="action.type"
            @click="handleActionClick(action, row)"
          >
            <el-icon><component :is="action.icon" /></el-icon>
            {{ action.text }}
          </el-button>
          <span v-if="getStatusActions(row.status).length === 0" class="no-operations">-</span>
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

       <checkDataPreview
      :visible="previewDialogVisible"
      :initial-data="formData"
      @update:visible="previewDialogVisible = $event"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Clock, CircleCheck, Check, Box, Delete, Edit, CircleCloseFilled } from '@element-plus/icons-vue'
import { getCtPage, getCtById, updateStatus } from '@/api/clmanage/cl-ct'
import { baseURL } from '@/utils/request'
import checkDataPreview from './checkDataPreview.vue'


import { useUserStore } from '@/store/user'
const userStore = useUserStore()


const previewDialogVisible = ref(false)
const handlePreview = async (id) => {
  const res = await getCtById({ id: id })
  formData.value = res.data.record
  previewDialogVisible.value = true
}
// =============== 状态常量定义 ===============
// 状态值-名称映射表
const STATUS_LABEL_MAP = {
  "40": "待审核",
  "50": "检验完成", 
  DEFAULT: "未知"
}

// 状态值-图标映射表
const STATUS_ICON_MAP = {
  "40": "Edit", // 编辑图标
  "50": "CircleCheck", // 对勾圆图标
  DEFAULT: "Clock"
}

// 状态值-Tag类型映射表
const STATUS_TAG_TYPE_MAP = {
  "40": "warning", // 深蓝色
  "50": "success", // 橙色
  DEFAULT: "info"
}

// 状态值-Radio按钮自定义类映射表
const STATUS_CLASS_MAP = {
  "40": "status-data-entry",
  "50": "status-data-confirmed",
  DEFAULT: ""
}


// 状态操作权限映射（当前状态→可执行操作）
const STATUS_ACTION_MAP = {

  "40": [ // 检验数据录入状态可执行操作
    { action: "auditPass", text: "审核通过", icon: "Check", type: "success", targetStatus: "50" },
    { action: "backToDataEntry", text: "退回录入", icon: "CircleCloseFilled", type: "info", targetStatus: "30" },
    { action: "preview", text: "查看信息", icon: "Document", type: "primary" }
  ],
  "50": [ // 检验数据录入确认状态可执行操作
    // { action: "backToDataEntry", text: "返回录入", icon: "CircleCloseFilled", type: "info", targetStatus: "40" }
        { action: "preview", text: "查看信息", icon: "Document", type: "primary" }

  ],
}

// =============== 状态工具函数 ===============
// 获取状态名称
const getStatusLabel = (statusValue) => {
  return STATUS_LABEL_MAP[statusValue] ?? STATUS_LABEL_MAP.DEFAULT
}

// 获取状态对应图标
const getStatusIcon = (statusValue) => {
  return STATUS_ICON_MAP[statusValue] ?? STATUS_ICON_MAP.DEFAULT
}

// 获取状态Tag组件类型
const getStatusTagType = (statusValue) => {
  return STATUS_TAG_TYPE_MAP[statusValue] ?? STATUS_TAG_TYPE_MAP.DEFAULT
}



// 获取当前状态可执行操作列表
const getStatusActions = (statusValue) => {
  return STATUS_ACTION_MAP[statusValue] ?? []
}

// 根据目标状态获取操作文本
const getStatusActionText = (targetStatus) => {
  switch (targetStatus) {
    case "40": return "退回录入"
    case "50": return "确认审核通过"
    default: return "更新状态"
  }
}

const formData = ref({})


const queryParams = reactive({
  contractNo: '',
  contractName: '',
  mafactory: '',
  matRecheckNo: '',
  status: 40,//默认待审核数据从状态40开始
  pageNumber: 1,
  pageSize: 10
})

const aluminumIngotList = ref([])
const total = ref(0)
const loading = ref(false)

// =============== 业务方法 ===============

// 统一处理操作按钮点击
const handleActionClick = (action, row) => {
  switch (action.action) {
    case "preview":
      handlePreview(row.id)
      break
    case "startDataEntry":
    case "confirmDataEntry":
    case "auditPass":
    case "completeStorage":
    case "backToPending":
    case "backToDataEntry":
      // 状态更新类操作，调用通用状态更新方法
      handleStatusUpdate(row.id, action.targetStatus)
      break
    default:
      console.log("未知操作：", action.action)
  }
}

// 执行状态更新（通用方法）
const handleStatusUpdate = async (orderId, targetStatus) => {
  try {
    await ElMessageBox.confirm(
      `确定要${getStatusActionText(targetStatus)}这条记录吗？`,
      "提示",
      { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
    )
    
    // 调用接口更新状态
    const response = await updateStatus({ id: orderId, status: targetStatus,updatePerson:userStore.realName })
    
    // 处理结果
    if (response?.code === 200) {
      ElMessage.success(`${getStatusActionText(targetStatus)}成功`)
      getAluminumIngotList() // 重新加载表格数据
    } else {
      ElMessage.error(response?.msg || "状态更新失败")
    }
  } catch (error) {
    if (error !== "cancel") { // 排除用户取消操作
      ElMessage.error("操作失败，请重试")
    }
  }
}

const getAluminumIngotList = async () => {
  loading.value = true
  try {
    
    const res = await getCtPage(queryParams)
    aluminumIngotList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取锤头列表失败', error)
    ElMessage.error('获取锤头列表失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getAluminumIngotList()
}

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getAluminumIngotList()
}

const handleRefresh = () => {
  queryParams.contractNo = ''
  queryParams.contractName = ''
  queryParams.mafactory = ''
  queryParams.matRecheckNo = ''
  queryParams.pageNumber = 1
  getAluminumIngotList()
}


const openFileInNewWindow = (url) => {
  window.open(baseURL + url, '_blank')
}

onMounted(() => {
  getAluminumIngotList()
})
</script>

<style scoped>
.aluminum-ingot-management {
  padding: 20px;
}

.action-bar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.status-filter {
  align-self: flex-start;
}

.search-inputs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.file-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
}

.file-link:hover {
  text-decoration: underline;
}

.truncate {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-operations {
  color: #909399;
  font-style: italic;
}

/* 状态Radio按钮基础样式 */
:deep(.el-radio-button__inner) {
  border-radius: 4px;
  padding: 6px 16px;
}

/* 选中状态Radio按钮样式 */
:deep(.el-radio-button.is-checked .el-radio-button__inner) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}


/* 防止表头换行 */
:deep(.el-table .cell) {
  white-space: nowrap;
}

/* 针对表头单元格 */
:deep(.el-table th .cell) {
  white-space: nowrap;
}
</style>