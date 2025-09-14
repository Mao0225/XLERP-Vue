<template>
  <div class="roundsteel-ingot-management">
    <div class="action-bar">
      <el-input
        v-model="queryParams.mafactory"
        placeholder="请输入原材料制造商查询"
        style="width: 200px; margin-right: 10px;"
        clearable
        @clear="getRoundsteelIngotList"
        @keyup.enter="getRoundsteelIngotList"
      />
      <el-input
        v-model="queryParams.inNo"
        placeholder="请输入入库单号查询"
        style="width: 200px; margin-right: 10px;"
        clearable
        @clear="getRoundsteelIngotList"
        @keyup.enter="getRoundsteelIngotList"
      />
      <el-input
        v-model="queryParams.matMaterial"
        placeholder="请输入圆钢牌号查询"
        style="width: 200px; margin-right: 10px;"
        clearable
        @clear="getRoundsteelIngotList"
        @keyup.enter="getRoundsteelIngotList"
      />
      <el-input
        v-model="queryParams.matRecheckNo"
        placeholder="请输入来料检验批次号"
        style="width: 200px; margin-right: 10px;"
        clearable
        @clear="getRoundsteelIngotList"
        @keyup.enter="getRoundsteelIngotList"
      />
      <el-button type="primary" @click="getRoundsteelIngotList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增</el-button>
    </div>

    <el-table :data="roundsteelIngotList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="basno" label="单据号" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.basno" placement="top">
            <span class="truncate">{{ row.basno }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="matRecheckNo" label="检验批次号" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.matRecheckNo" placement="top">
            <span class="truncate">{{ row.matRecheckNo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="batchNo" label="炉批号" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.batchNo" placement="top">
            <span class="truncate">{{ row.batchNo }}</span>
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
      <el-table-column prop="matMaterial" label="圆钢牌号" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.matMaterial" placement="top">
            <span class="truncate">{{ row.matMaterial }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="material" label="材料" width="100">
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
      <el-table-column prop="appearanceSize" label="外观尺寸" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.appearanceSize" placement="top">
            <span class="truncate">{{ row.appearanceSize }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" width="90">
        <template #default="{ row }">
          <el-tooltip :content="row.quantity" placement="top">
            <span class="truncate">{{ row.quantity }} t</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="sampleQuantity" label="样品数量" width="90">
        <template #default="{ row }">
          <el-tooltip :content="row.sampleQuantity" placement="top">
            <span class="truncate">{{ row.sampleQuantity }} t</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="specs" label="规格(mm)" width="90">
        <template #default="{ row }">
          <el-tooltip :content="row.specs" placement="top">
            <span class="truncate">{{ row.specs }} t</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="length" label="长度(mm)" width="90">
        <template #default="{ row }">
          <el-tooltip :content="row.length" placement="top">
            <span class="truncate">{{ row.length }} t</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="inNo" label="入库单号" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.inNo" placement="top">
            <span class="truncate">{{ row.inNo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="checker" label="检验人" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.checker" placement="top">
            <span class="truncate">{{ row.checker }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="auditor" label="审核人" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.auditor" placement="top">
            <span class="truncate">{{ row.auditor }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="chemC" label="C(%)" width="90" />
      <el-table-column prop="chemSi" label="Si(%)" width="90" />
      <el-table-column prop="chemMn" label="Mn(%)" width="90" />
      <el-table-column prop="chemP" label="P(%)" width="90" />
      <el-table-column prop="chemS" label="S(%)" width="90" />

      <el-table-column prop="tensileStrength" label="tensileStrength(%)" width="90" />
      <el-table-column prop="yieldStrength" label="yieldStrength(%)" width="90" />
      <el-table-column prop="elongation" label="elongation(%)" width="90" />

      <el-table-column prop="bending" label="弯曲性能" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.bending" placement="top">
            <span class="truncate">{{ row.bending }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="impactexp" label="冲击实验" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.impactexp" placement="top">
            <span class="truncate">{{ row.impactexp }}</span>
          </el-tooltip>
        </template>
      </el-table-column>


      <el-table-column prop="memo" label="备注" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.memo" placement="top">
            <span class="truncate">{{ row.memo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="writer" label="录入人" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.writer" placement="top">
            <span class="truncate">{{ row.writer }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="writeTime" label="录入时间" width="140" >
        <template #default="{ row }">
          <el-tooltip :content="row.writeTime" placement="top">
            <span class="truncate">{{ row.writeTime }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="leavefactoryDate" label="出厂日期" width="120" >
        <template #default="{ row }">
          <el-tooltip :content="row.leavefactoryDate" placement="top">
            <span class="truncate">{{ row.leavefactoryDate }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="detectionTime" label="入厂检测日期" width="130" >
        <template #default="{ row }">
          <el-tooltip :content="row.detectionTime" placement="top">
            <span class="truncate">{{ row.detectionTime }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="status" label="状态" width="90">
        <template #default="{ row }">
          {{ row.status === '1' ? '已审核' : '未审核' }}
        </template>
      </el-table-column> -->
      <el-table-column prop="certificate" label="质量证明" width="100">
        <template #default="{ row }">
          <div v-for="(file, index) in JSON.parse(row.certificate || '[]')" :key="index">
            <el-tooltip :content="file.name" placement="top">
              <span class="file-link" @click="openFileInNewWindow(file.url, file.name)">{{ file.name }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row.id)">编辑</el-button>
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

    <addForm
      :newCode="newCode"
      :visible="addDialogVisible"
      @update:visible="addDialogVisible = $event"
      @success="handleSuccessAdd"
    />
    <editForm
      :visible="editDialogVisible"
      :initial-data="formData"
      @update:visible="editDialogVisible = $event"
      @success="handleSuccessEdit"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getYgPage, deleteYg, getYgById } from '@/api/clmanage/cl-yg'
import { useRouter } from 'vue-router'
import addForm from './add.vue'
import editForm from './edit.vue'
import { baseURL } from '@/utils/request'
import { getNewNoNyName } from '@/api/system/basno'


const newCode = ref('');
// 生成新的单据号编码
const generateNewCode = async () => {
  try {
    const res = await getNewNoNyName('cl-yg');
    
    if (res?.code === 200) {
      console.log("获取编码成功", res.data.fullNoNyName);
      return res.data.fullNoNyName;
    }
    
    ElMessage.error(res?.msg || '获取编码失败');
    return '';
    
  } catch (error) {
    console.error('生成编码出错:', error);
    ElMessage.error('请求编码服务时发生错误');
    return '';
  }
};


const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const formData = ref({})

const handleAdd = async () => {
  newCode.value = await generateNewCode();
  addDialogVisible.value = true
}//这个修改为异步的在点击添加的时候获取单据号


const handleEdit = async (id) => {
  const res = await getYgById({ id: id })
  formData.value = res.data.record
  editDialogVisible.value = true
}

const handleSuccessAdd = () => {
  addDialogVisible.value = false
  ElMessage.success('圆钢记录新增成功')
  getRoundsteelIngotList()
}

const handleSuccessEdit = () => {
  editDialogVisible.value = false
  ElMessage.success('圆钢记录修改成功')
  getRoundsteelIngotList()
}

const router = useRouter()

const queryParams = reactive({
  mafactory: '',
  inNo: '',
  matMaterial: '',
  matRecheckNo: '',
  pageNumber: 1,
  pageSize: 10
})

const roundsteelIngotList = ref([])
const total = ref(0)
const loading = ref(false)

const getRoundsteelIngotList = async () => {
  loading.value = true
  try {
    const res = await getYgPage(queryParams)
    roundsteelIngotList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取圆钢列表失败', error)
    ElMessage.error('获取圆钢列表失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getRoundsteelIngotList()
}

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getRoundsteelIngotList()
}

const handleRefresh = () => {
  queryParams.mafactory = ''
  queryParams.inNo = ''
  queryParams.matMaterial = ''
  queryParams.matRecheckNo = ''
  queryParams.pageNumber = 1
  getRoundsteelIngotList()
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除圆钢记录"${row.basno}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteYg({ id: row.id })
      ElMessage.success('圆钢记录删除成功')
      getRoundsteelIngotList()
    } catch (error) {
      console.error('删除圆钢记录失败', error)
      ElMessage.error('删除圆钢记录失败')
    }
  }).catch(() => {})
}

const openFileInNewWindow = (url) => {
  window.open(baseURL+url, '_blank')
}

onMounted(() => {
  getRoundsteelIngotList()
})
</script>

<style scoped>
.roundsteel-ingot-management {
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

/* 防止表头换行 */
::v-deep(.el-table .cell) {
  white-space: nowrap;
}

/* 针对表头单元格 */
::v-deep(.el-table th .cell) {
  white-space: nowrap;
}
</style>