<template>
    <div class="rubber-inspection-management">
      <div class="action-bar">
        <el-input
          v-model="queryParams.mafactoryname"
          placeholder="请输入供应商名称查询"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getRubberInspectionList"
          @keyup.enter="getRubberInspectionList"
        />
        <el-input
          v-model="queryParams.inNo"
          placeholder="请输入检验单号查询"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getRubberInspectionList"
          @keyup.enter="getRubberInspectionList"
        />
        <el-input
          v-model="queryParams.matname"
          placeholder="请输入材料名称查询"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getRubberInspectionList"
          @keyup.enter="getRubberInspectionList"
        />
        <el-input
          v-model="queryParams.matRecheckNo"
          placeholder="请输入来料检验批次号"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getRubberInspectionList"
          @keyup.enter="getRubberInspectionList"
        />
        <el-button type="primary" @click="getRubberInspectionList">搜索</el-button>
        <el-button type="warning" @click="handleRefresh">
          <el-icon>
            <Refresh />
          </el-icon> 刷新
        </el-button>
        <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增</el-button>
      </div>
  
      <!-- 添加滚动容器以处理过多列 -->
      <div class="table-container">
        <el-table :data="rubberInspectionList" border v-loading="loading" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="basno" label="单据号" width="140">
            <template #default="{ row }">
              <el-tooltip :content="row.basno" placement="top">
                <span class="truncate">{{ row.basno }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="inNo" label="检验单号" width="140">
            <template #default="{ row }">
              <el-tooltip :content="row.inNo" placement="top">
                <span class="truncate">{{ row.inNo }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="mafactoryname" label="供应商名称" width="160">
            <template #default="{ row }">
              <el-tooltip :content="row.mafactoryname" placement="top">
                <span class="truncate">{{ row.mafactoryname }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="matname" label="材料名称" width="120">
            <template #default="{ row }">
              <el-tooltip :content="row.matname" placement="top">
                <span class="truncate">{{ row.matname }}</span>
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
          <el-table-column prop="mattype" label="规格" width="100">
            <template #default="{ row }">
              <el-tooltip :content="row.mattype" placement="top">
                <span class="truncate">{{ row.mattype }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="来料数量" width="100">
            <template #default="{ row }">
              <el-tooltip :content="row.quantity" placement="top">
                <span class="truncate">{{ row.quantity }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="sampleQuantity" label="抽检数量" width="100">
            <template #default="{ row }">
              <el-tooltip :content="row.sampleQuantity" placement="top">
                <span class="truncate">{{ row.sampleQuantity }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="matdepartment" label="使用单位" width="120">
            <template #default="{ row }">
              <el-tooltip :content="row.matdepartment" placement="top">
                <span class="truncate">{{ row.matdepartment }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="standard" label="执行标准" width="120">
            <template #default="{ row }">
              <el-tooltip :content="row.standard" placement="top">
                <span class="truncate">{{ row.standard }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="leavefactoryDate" label="出厂日期" width="120">
            <template #default="{ row }">
              <el-tooltip :content="row.leavefactoryDate" placement="top">
                <span class="truncate">{{ row.leavefactoryDate }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="detectionTime" label="检验日期" width="120">
            <template #default="{ row }">
              <el-tooltip :content="row.detectionTime" placement="top">
                <span class="truncate">{{ row.detectionTime }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="appearanceResult" label="外形检测结果" width="120">
            <template #default="{ row }">
              <el-tag :type="row.appearanceResult === '合格' ? 'success' : 'danger'" size="small">
                {{ row.appearanceResult }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="matjixiexingnengresult" label="硬度检测结果" width="120">
            <template #default="{ row }">
              <el-tooltip :content="row.matjixiexingnengresult" placement="top">
                <span class="truncate">{{ row.matjixiexingnengresult }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="certificate" label="质量证明" width="100">
            <template #default="{ row }">
              <div v-for="(file, index) in JSON.parse(row.certificate || '[]')" :key="index">
                <el-tooltip :content="file.name" placement="top">
                  <span class="file-link" @click="openFileInNewWindow(file.url)">{{ file.name }}</span>
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
      </div>
  
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
  // 脚本部分保持不变
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Refresh } from '@element-plus/icons-vue'
  import { getXjPage, deleteXj, getXjById } from '@/api/clmanage/cl-xj'
  import { useRouter } from 'vue-router'
  import addForm from './add.vue'
  import editForm from './edit.vue'
  import { baseURL } from '@/utils/request'
  import { getNewNoNyName } from '@/api/system/basno'
  
  const newCode = ref('')
  const router = useRouter()
  
  // 生成新的单据号编码
  const generateNewCode = async () => {
    try {
      const res = await getNewNoNyName('cl-xj')
      
      if (res?.code === 200) {
        console.log("获取编码成功", res.data.fullNoNyName)
        return res.data.fullNoNyName
      }
      
      ElMessage.error(res?.msg || '获取编码失败')
      return ''
      
    } catch (error) {
      console.error('生成编码出错:', error)
      ElMessage.error('请求编码服务时发生错误')
      return ''
    }
  }
  
  const addDialogVisible = ref(false)
  const editDialogVisible = ref(false)
  const formData = ref({})
  
  const handleAdd = async () => {
    newCode.value = await generateNewCode()
    console.log("newCode.value", newCode.value)
    addDialogVisible.value = true
  }
  
  const handleEdit = async (id) => {
    const res = await getXjById(id)
    formData.value = res.data.record
    editDialogVisible.value = true
  }
  
  const handleSuccessAdd = () => {
    addDialogVisible.value = false
    ElMessage.success('橡胶检验记录新增成功')
    getRubberInspectionList()
  }
  
  const handleSuccessEdit = () => {
    editDialogVisible.value = false
    ElMessage.success('橡胶检验记录修改成功')
    getRubberInspectionList()
  }
  
  const queryParams = reactive({
    mafactoryname: '',
    inNo: '',
    matname: '',
    matRecheckNo: '',
    pageNumber: 1,
    pageSize: 10
  })
  
  const rubberInspectionList = ref([])
  const total = ref(0)
  const loading = ref(false)
  
  const getRubberInspectionList = async () => {
    loading.value = true
    try {
      const res = await getXjPage(queryParams)
      rubberInspectionList.value = res.data.page.list
      total.value = res.data.page.totalRow
    } catch (error) {
      console.error('获取橡胶检验列表失败', error)
      ElMessage.error('获取橡胶检验列表失败')
    } finally {
      loading.value = false
    }
  }
  
  const handleSizeChange = (size) => {
    queryParams.pageSize = size
    getRubberInspectionList()
  }
  
  const handleCurrentChange = (page) => {
    queryParams.pageNumber = page
    getRubberInspectionList()
  }
  
  const handleRefresh = () => {
    queryParams.mafactoryname = ''
    queryParams.inNo = ''
    queryParams.matname = ''
    queryParams.matRecheckNo = ''
    queryParams.pageNumber = 1
    getRubberInspectionList()
  }
  
  const handleDelete = (row) => {
    ElMessageBox.confirm(`确认删除橡胶检验记录"${row.basno}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        await deleteXj(row.id)
        ElMessage.success('橡胶检验记录删除成功')
        getRubberInspectionList()
      } catch (error) {
        console.error('删除橡胶检验记录失败', error)
        ElMessage.error('删除橡胶检验记录失败')
      }
    }).catch(() => {})
  }
  
  const openFileInNewWindow = (url) => {
    window.open(baseURL + url, '_blank')
  }
  
  onMounted(() => {
    getRubberInspectionList()
  })
  </script>
  
  <style scoped>
  .rubber-inspection-management {
    padding: 20px;
  }
  .action-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap; /* 允许搜索栏在小屏幕换行 */
    gap: 10px;
  }
  .table-container {
    overflow-x: auto; /* 允许表格水平滚动 */
    margin-bottom: 16px;
  }
  .pagination-container {
    margin-top: 16px;
    text-align: right;
  }
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    width: 100%;
  }
  .file-link {
    color: #409eff;
    cursor: pointer;
    text-decoration: underline;
  }
  </style>