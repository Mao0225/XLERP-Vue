<template>
  <div class="basitem-management">
    <div class="action-bar">
      <el-input v-model="queryParams.itemNo" placeholder="请输入物料编号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasItemList" @keyup.enter="getBasItemList" />
      <el-input v-model="queryParams.itemName" placeholder="请输入物料名称查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasItemList" @keyup.enter="getBasItemList" />
      <el-select v-model="queryParams.inclass" placeholder="选择物料所属分类" style="width: 200px; margin-right: 10px;">
        <el-option v-for="item in filteredInclassOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="queryParams.type" placeholder="选择物料类型" style="width: 200px; margin-right: 10px;" @change="handleTypeChange">
        <el-option v-for="item in typeLabelOptions" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>

      <el-button type="primary" @click="getBasItemList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增物料</el-button>
      <el-button type="primary" @click="importItem" >导入物料</el-button>
      <el-button type="info" @click="downloadExsl">下载模板</el-button>
    </div>

    <el-table :data="basItemList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="no" label="物料编号" />
      <el-table-column prop="spec" label="规格型号" />
      <el-table-column prop="name" label="物料名称" />
      <el-table-column prop="unit" label="计量单位" />
      <el-table-column prop="planned_price" label="计划价格" />
      <!-- <el-table-column prop="material_attribute" label="物料属性" width="120" />
      <el-table-column prop="grade" label="等级" />
      <el-table-column prop="drawing_standard_no" label="图号/标准号" />
      <el-table-column prop="material_version" label="物料版本" />
      <el-table-column prop="auxiliary_attribute" label="辅助属性" /> -->
      <el-table-column prop="type" label="物料类型" >
        <template #default="{ row }">
          {{ getFlagLabel(row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="inclass" label="所属分类" />
      <!-- <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          {{ row.status === 0 ? '正常' : '停用' }}
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="300">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="handleMaterialManage(row)">材料管理</el-button>
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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物料编号" prop="no">
              <el-input v-model="form.no" placeholder="请输入物料编号" />
            </el-form-item>
            <el-form-item label="物料名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入物料名称" />
            </el-form-item>
            <el-form-item label="计量单位" prop="unit">
              <el-select v-model="form.unit" placeholder="请选择或输入单位" allow-create filterable>
                <el-option v-for="item in unitOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="物料类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择物料类型" @change="handleFormTypeChange">
                <el-option v-for="item in typeLabelOptions" :key="item.id" :label="item.value" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="所属分类" prop="inclass">
              <el-select v-model="form.inclass" placeholder="请选择或输入分类" allow-create filterable :disabled="isInclassDisabled">
                <el-option v-for="item in filteredInclassOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="规格型号" prop="spec">
              <el-input v-model="form.spec" placeholder="请输入规格型号" />
            </el-form-item>
            <el-form-item label="物料描述" prop="description">
              <el-input v-model="form.description" placeholder="请输入物料描述" />
            </el-form-item>
            <el-form-item label="等级" prop="grade">
              <el-input v-model="form.grade" placeholder="请输入等级" />
            </el-form-item>
            <el-form-item label="物料版本" prop="material_version">
              <el-input v-model="form.material_version" placeholder="请输入物料版本" />
            </el-form-item>
            <el-form-item label="辅助属性" prop="auxiliary_attribute">
              <el-input v-model="form.auxiliary_attribute" placeholder="请输入辅助属性" />
            </el-form-item>
            <el-form-item label="图号/标准号" prop="drawing_standard_no">
  <el-input v-model="form.drawing_standard_no" placeholder="请选择图号/标准号" readonly>
    <template #append>
      <el-button type="primary" @click="openDrawingSelectDialog">选择图纸</el-button>
    </template>
  </el-input>
</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颜色" prop="color">
              <el-input v-model="form.color" placeholder="请输入颜色" />
            </el-form-item>
            <el-form-item label="重量" prop="weight">
              <el-input v-model.number="form.weight" placeholder="请输入重量" type="number" />
            </el-form-item>
            <el-form-item label="计划价格" prop="planned_price">
              <el-input v-model.number="form.planned_price" placeholder="请输入计划价格" type="number" />
            </el-form-item>
            <el-form-item label="平均价格" prop="avg_price">
              <el-input v-model.number="form.avg_price" placeholder="请输入平均价格" type="number" />
            </el-form-item>
            <el-form-item label="存放位置" prop="location">
              <el-input v-model="form.location" placeholder="请输入存放位置" />
            </el-form-item>
            <el-form-item label="技术参数" prop="tech_memo">
              <el-input v-model="form.tech_memo" placeholder="请输入技术参数" />
            </el-form-item>
            <el-form-item label="备注信息" prop="memo">
              <el-input v-model="form.memo" placeholder="请输入备注信息" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 在el-dialog后添加材料管理对话框 -->
<el-dialog
  title="物料材料管理"
  v-model="materialDialogVisible"
  width="90%"
  top="5vh"
  @closed="handleMaterialDialogClosed"
>
  <div class="material-management">
    <div class="material-header">
    <h3>当前物料: {{ currentMaterialItem.no }} - {{ currentMaterialItem.name }}</h3>
    <div class="material-actions">
      <el-button :type="activeView === 'list' ? 'primary' : 'default'" @click="activeView = 'list'">列表视图</el-button>
      <el-button :type="activeView === 'tree' ? 'primary' : 'default'" @click="activeView = 'tree'">树状图视图</el-button>
      <el-button type="success" @click="handleAddChildMaterial">添加子物料</el-button>
      <el-button type="warning" @click="refreshMaterialList">
         <el-icon><Refresh /></el-icon> 刷新
      </el-button>
      </div>
    </div>

    <!-- 子物料列表 -->
    <div class="material-list-view">
      <el-table :data="childMaterialList" border v-loading="materialLoading" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="no" label="子项编码" />
        <el-table-column prop="name" label="子项名称" />
        <el-table-column prop="spec" label="规格型号" />
        <el-table-column prop="unit" label="计量单位" />
        <el-table-column prop="relation_quantity" label="数量">
          <template #default="{ row }">
            {{ row.relation_quantity || 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="物料类型" width="120">
          <template #default="{ row }">
            {{ getFlagLabel(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="inclass" label="所属分类" />
        <el-table-column prop="weight" label="重量" />
        <el-table-column prop="planned_price" label="计划价格" />
        <el-table-column prop="avg_price" label="平均价格" />
        <el-table-column prop="memo" label="备注">
          <template #default="{ row }">
            {{ row.memo || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleRemoveChildMaterial(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 树状图视图 -->
    <div class="material-tree-view" v-if="activeView === 'tree'">
  <el-tree
    :data="materialTreeData"
    :props="treeProps"
    show-checkbox
    node-key="id"
    default-expand-all
    v-loading="treeLoading"
  >
    <template #default="{ node, data }">
      <span class="tree-node-content">
        <span>{{ data.no }} - {{ data.name }}</span>
        <span class="node-attributes" v-if="data.quantity">
          数量: {{ data.quantity }} {{ data.unit || '' }}
        </span>
      </span>
    </template>
  </el-tree>
</div>
    <div class="pagination-container" v-if="childMaterialTotal > 0">
      <el-pagination
        v-model:current-page="materialQueryParams.pageNumber"
        v-model:page-size="materialQueryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="childMaterialTotal"
        @size-change="handleMaterialSizeChange"
        @current-change="handleMaterialCurrentChange"
      />
    </div>
  </div>
</el-dialog>

<!-- 选择子物料对话框 -->
<el-dialog
  title="选择子物料"
  v-model="selectChildMaterialDialogVisible"
  width="80%"
  @closed="resetSelectChildMaterialForm"
>
  <div class="search-bar">
    <el-input 
      v-model="selectChildMaterialQueryParams.itemNo" 
      placeholder="按物料编号搜索" 
      style="width: 200px; margin-right: 10px;"
      clearable
      @clear="handleSelectChildMaterialSearch"
      @keyup.enter="handleSelectChildMaterialSearch"
    ></el-input>
    <el-input 
      v-model="selectChildMaterialQueryParams.itemName" 
      placeholder="按物料名称搜索" 
      style="width: 200px; margin-right: 10px;"
      clearable
      @clear="handleSelectChildMaterialSearch"
      @keyup.enter="handleSelectChildMaterialSearch"
    ></el-input>
    <el-button type="primary" @click="handleSelectChildMaterialSearch">搜索</el-button>
    <el-button type="warning" @click="handleSelectChildMaterialRefresh">
      <el-icon><Refresh /></el-icon> 刷新
    </el-button>
  </div>
  
  <el-table :data="allMaterialsList" border v-loading="selectChildMaterialLoading" style="width: 100%" :key="searchKey" >
    <el-table-column prop="no" label="物料编号" />
    <el-table-column prop="name" label="物料名称" />
    <el-table-column prop="spec" label="规格型号" />
    <el-table-column prop="inclass" label="所属分类" />
    <el-table-column prop="type" label="物料类型" width="120">
      <template #default="{ row }">
        {{ getFlagLabel(row.type) }}
      </template>
    </el-table-column>
    <el-table-column prop="unit" label="单位" />
    <el-table-column prop="weight" label="重量" />
    <el-table-column label="操作" width="100">
      <template #default="{ row }">
        <el-button type="primary" size="small" @click="selectChildMaterial(row)">选择</el-button>
      </template>
    </el-table-column>
  </el-table>
  
  <div class="pagination-container">
    <el-pagination
      v-model:current-page="selectChildMaterialQueryParams.pageNumber"
      v-model:page-size="selectChildMaterialQueryParams.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="selectChildMaterialTotal"
      @size-change="handleSelectChildMaterialSizeChange"
      @current-change="handleSelectChildMaterialCurrentChange"
    />
  </div>
</el-dialog>

<!-- 在选择子物料对话框后添加选择图纸对话框 -->
<el-dialog
  title="选择图纸"
  v-model="selectDrawingDialogVisible"
  width="80%"
  @closed="handleDrawingDialogClosed"
>
  <basitemtuzhi @selectTuzhi="handleSelectDrawing" />
  <template #footer>
    <el-button @click="selectDrawingDialogVisible = false">关闭</el-button>
  </template>
</el-dialog>

    <ImportResultDialog 
      v-model="importResultVisible" 
      :import-data="importResultData"
      @confirm="handleImportResultConfirm"
    />

  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed ,watch} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBasItems, getBasItemById, createBasItem, updateBasItem, deleteBasItem,importItemList } from '@/api/item/basitem'
import ImportResultDialog from './components/ImportResultDialog.vue';
import { baseURL } from '@/utils/request';
import { getMaterialTree, getMaterialList } from '@/api/item/basitem'// 获取材料管理相关API
import { getChildMaterials, addMaterialRelation, removeMaterialRelation, getAllMaterialsPage } from '@/api/item/basitem'
import basitemtuzhi from './basitemtuzhi.vue'; // 引入选择图纸组件

//添加选择图纸状态
const selectDrawingDialogVisible = ref(false);

// 打开选择图纸对话框
const openDrawingSelectDialog = () => {
  selectDrawingDialogVisible.value = true;
};

// 处理选择图纸
const handleSelectDrawing = (tuzhi) => {
  form.drawing_standard_no = tuzhi.tuzhibianhao; // 将图纸编号赋值给图号/标准号字段
  selectDrawingDialogVisible.value = false;
  ElMessage.success(`已选择图纸: ${tuzhi.tuzhimingcheng}`);
};

// 关闭选择图纸对话框
const handleDrawingDialogClosed = () => {
  selectDrawingDialogVisible.value = false;
};


// 材料管理相关
const materialDialogVisible = ref(false)
const activeView = ref('list')
const currentMaterialItem = ref({})
const childMaterialList = ref([])
const childMaterialTotal = ref(0)
const materialLoading = ref(false)
const materialTreeData = ref([])
const treeLoading = ref(false)
const treeProps = {
  label: 'name',
  children: 'children'  // 确保与后端返回的子节点字段匹配
}

const searchKey = ref(0) // 用于强制表格重新渲染的key

// 材料管理查询参数
const materialQueryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  itemId: 0
})

// 材料管理
const handleMaterialManage = (row) => {
  currentMaterialItem.value = row;
  materialDialogVisible.value = true;
  // 强制刷新所有视图数据
  refreshMaterialList();
}

// 选择子物料对话框相关
const selectChildMaterialDialogVisible = ref(false)
const selectChildMaterialQueryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  itemNo: '',
  itemName: ''
})
const allMaterialsList = ref([])
const selectChildMaterialTotal = ref(0)
const selectChildMaterialLoading = ref(false)


//添加activeView的监听
watch(
  () => activeView.value, // 监听 activeView 的变化
  (newVal) => {
    // 当视图切换且物料管理对话框可见时，刷新数据
    if (materialDialogVisible.value) {
      refreshMaterialList();
    }
  }
)

// 刷新材料列表 - 修改为同时刷新所有视图
const refreshMaterialList = async (forceRefreshAll = false) => {
  // 如果强制刷新所有视图或者当前是列表视图，刷新列表数据
  if (forceRefreshAll || activeView.value === 'list') {
    materialLoading.value = true
    try {
      const res = await getChildMaterials({ 
        id: currentMaterialItem.value.id,
        pageNumber: materialQueryParams.pageNumber,
        pageSize: materialQueryParams.pageSize
      })
      childMaterialList.value = res.data.page.list || []
      childMaterialTotal.value = res.data.page.totalRow || 0
    } catch (error) {
      console.error('获取子物料列表失败', error)
      ElMessage.error('获取子物料列表失败')
      childMaterialList.value = []
      childMaterialTotal.value = 0
    } finally {
      materialLoading.value = false
    }
  }
  
  // 如果强制刷新所有视图或者当前是树状图视图，刷新树状图数据
  if (forceRefreshAll || activeView.value === 'tree') {
    await loadMaterialTree()
  }
}

//加载树状图数据方法
const loadMaterialTree = async () => {
  treeLoading.value = true;
  try {
    const res = await getMaterialTree({ id: currentMaterialItem.value.id });
    // 确保数据结构始终为数组，避免渲染错误
    materialTreeData.value = res.data.materialTree || [];
    
    console.log('树形结构数据:', materialTreeData.value);
    
    // 无数据时给出友好提示
    if (materialTreeData.value.length === 0) {
      ElMessage.info('当前物料暂无树形结构数据');
    }
  } catch (error) {
    console.error('获取物料树形结构失败', error);
    ElMessage.error('获取物料树形结构失败: ' + (error.message || '网络错误'));
    materialTreeData.value = []; // 出错时也保持数组结构
  } finally {
    treeLoading.value = false;
  }
}

// 材料管理分页处理
const handleMaterialSizeChange = (size) => {
  materialQueryParams.pageSize = size
  refreshMaterialList()
}

const handleMaterialCurrentChange = (page) => {
  materialQueryParams.pageNumber = page
  refreshMaterialList()
}

// 材料管理对话框关闭
const handleMaterialDialogClosed = () => {
  currentMaterialItem.value = {}
  childMaterialList.value = []
  childMaterialTotal.value = 0
  materialTreeData.value = []  // 新增清理树状图数据
  materialQueryParams.pageNumber = 1
  activeView.value = 'list'  // 重置视图为列表
}

// 添加子物料
const handleAddChildMaterial = () => {
  selectChildMaterialDialogVisible.value = true
  // 重置搜索条件
  selectChildMaterialQueryParams.itemNo = ''
  selectChildMaterialQueryParams.itemName = ''
  selectChildMaterialQueryParams.pageNumber = 1
  getAllMaterialsList()
}

// 选择子物料搜索
const handleSelectChildMaterialSearch = () => {
  selectChildMaterialQueryParams.pageNumber = 1
  searchKey.value++ // 每次搜索更新key，触发表格重新渲染
  getAllMaterialsList()
}

// 选择子物料刷新
const handleSelectChildMaterialRefresh = () => {
  selectChildMaterialQueryParams.itemNo = ''
  selectChildMaterialQueryParams.itemName = ''
  selectChildMaterialQueryParams.pageNumber = 1
  getAllMaterialsList()
}

// 获取所有物料列表方法
const getAllMaterialsList = async () => {
  selectChildMaterialLoading.value = true
  try {
    const res = await getAllMaterialsPage(selectChildMaterialQueryParams)
    // 确保数据结构正确解析
    if (res.data && res.data.page) {
      allMaterialsList.value = res.data.page.list || []
      selectChildMaterialTotal.value = res.data.page.totalRow || 0
    } else {
      allMaterialsList.value = []
      selectChildMaterialTotal.value = 0
      ElMessage.warning('未获取到有效数据')
    }
  } catch (error) {
    console.error('获取物料列表失败', error)
    ElMessage.error('获取物料列表失败: ' + (error.message || '网络错误'))
    allMaterialsList.value = []
    selectChildMaterialTotal.value = 0
  } finally {
    selectChildMaterialLoading.value = false
  }
}

// 选择子物料分页处理
const handleSelectChildMaterialSizeChange = (size) => {
  selectChildMaterialQueryParams.pageSize = size
  selectChildMaterialQueryParams.pageNumber = 1
  getAllMaterialsList()
}

const handleSelectChildMaterialCurrentChange = (page) => {
  selectChildMaterialQueryParams.pageNumber = page
  getAllMaterialsList()
}

// 选择子物料
const selectChildMaterial = async (row) => {
  try {
    console.log('选择的子物料行数据:', row)
    console.log('当前父物料数据:', currentMaterialItem.value)
    
    // 更严格的ID检查
    if (!currentMaterialItem.value || !currentMaterialItem.value.id) {
      ElMessage.error('未获取到当前物料信息，请刷新页面重试')
      return
    }
    
    if (!row || !row.id) {
      ElMessage.error('未选择有效的子物料，请重新选择')
      return
    }

    // 检查是否选择自己作为子物料
    if (row.id === currentMaterialItem.value.id) {
      ElMessage.error('不能选择自身作为子物料')
      return
    }

    // 检查是否已经是子物料
    const isAlreadyChild = childMaterialList.value.some(item => item.id === row.id)
    if (isAlreadyChild) {
      ElMessage.error('该物料已经是子物料')
      return
    }

    // 确保ID是数字类型
    const parentId = Number(currentMaterialItem.value.id)
    const childId = Number(row.id)
    
    if (isNaN(parentId) || isNaN(childId)) {
      ElMessage.error('物料ID格式错误，必须是数字')
      console.error('ID格式错误:', {parentId, childId})
      return
    
    // 在selectChildMaterial方法中补充
    if (!relationData.relation_quantity || relationData.relation_quantity <= 0) {
      ElMessage.error('子物料数量必须大于0')
      return
}
    }
    const relationData = {
    parentItemId: parentId,
    childItemId: childId,
    relation_quantity: 1, 
    memo: ''
    }
    console.log('即将发送的子物料数据:', relationData)

    await addMaterialRelation(relationData)
    ElMessage.success('添加子物料成功')
    selectChildMaterialDialogVisible.value = false
    await refreshMaterialList(true)
  } catch (error) {
    console.error('添加子物料失败', error)
    ElMessage.error('添加子物料失败: ' + (error.response?.data?.msg || error.message))
  }
}

// 移除子物料
const handleRemoveChildMaterial = (row) => {
  ElMessageBox.confirm(`确认移除子物料"${row.no}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await removeMaterialRelation({ relationId: row.relation_id })
      ElMessage.success('移除子物料成功')
      
      // 强制刷新所有视图
      await refreshMaterialList(true)
      
    } catch (error) {
      console.error('移除子物料失败', error)
      ElMessage.error('移除子物料失败')
    }
  }).catch(() => {})
}

// 重置选择子物料表单
const resetSelectChildMaterialForm = () => {
  selectChildMaterialQueryParams.pageNumber = 1
  selectChildMaterialQueryParams.itemNo = ''
  selectChildMaterialQueryParams.itemName = ''
}

// 单位选项
const unitOptions = [
  '件', '套', '个', '块', '根', '袋', '箱', '捆', '托', '纸箱'
]

// 物料类型映射
const typeLabelOptions = [
  { id: 10, value: '原材料' },
  { id: 20, value: '成品' },
  { id: 30, value:'半成品'},
  { id: 40, value: '低值易耗品' },
  { id: 50, value: '其他' },
]

// 原材料的分类选项
const rawMaterialInclassOptions = [
  '钢材', '铝锭', '铝型材', '其它有色金属', '导线'
]

// 动态计算 inclass 选项
const filteredInclassOptions = computed(() => {
  const selectedType = typeLabelOptions.find(option => option.id === (dialogVisible.value ? form.type : queryParams.type))
  if (selectedType && selectedType.id === 10) { // 原材料
    return rawMaterialInclassOptions
  }
  return selectedType ? [selectedType.value] : []
})

// inclass 是否禁用
const isInclassDisabled = computed(() => {
  return form.type !== 10 // 非原材料时禁用 inclass
})

// 查询参数
const queryParams = reactive({
  itemNo: '',
  itemName: '',
  type: '',
  inclass: '',
  pageNumber: 1,
  pageSize: 10
})

// 物料列表数据
const basItemList = ref([])
const total = ref(0)
const loading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增物料' : '编辑物料')
const formRef = ref(null)
const form = reactive({
  id: undefined,
  no: '',
  name: '',
  unit: '',
  spec: '',
  description: '',
  color: '',
  memo: '',
  type: 10,
  weight: 0.00,
  keeper_rule: '',
  planned_price: 0.00,
  avg_price: 0.00,
  location: '',
  tech_memo: '',
  status: 0,
  inclass: '',
  isdelete: 0
})

// 表单验证规则
const rules = {
  no: [
    { required: true, message: '请输入物料编号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入物料名称', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  unit: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  spec: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  description: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  color: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  memo: [
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择物料类型', trigger: 'change' },
    { type: 'number', message: '请选择有效的物料类型', trigger: ['blur', 'change'] }
  ],
  weight: [
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change'] }
  ],
  planned_price: [
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change'] }
  ],
  avg_price: [
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change'] }
  ],
  location: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  tech_memo: [
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  inclass: [
    { required: true, message: '请选择或输入分类', trigger: 'change' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ]
}

// 获取物料类型标签
const getFlagLabel = (type) => {
  const item = typeLabelOptions.find(option => option.id === type)
  return item ? item.value : '未知'
}

// 获取物料列表
const getBasItemList = async () => {
  loading.value = true
  try {
    const res = await getBasItems(queryParams)
    basItemList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取物料列表失败', error)
    ElMessage.error('获取物料列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getBasItemList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getBasItemList()
}

// 处理查询表单的物料类型变化
const handleTypeChange = () => {
  const selectedType = typeLabelOptions.find(option => option.id === queryParams.type)
  if (selectedType && selectedType.id !== 10) {
    queryParams.inclass = selectedType.value
  } else {
    queryParams.inclass = ''
  }
}

// 处理弹窗表单的物料类型变化
const handleFormTypeChange = () => {
  const selectedType = typeLabelOptions.find(option => option.id === form.type)
  if (selectedType && selectedType.id !== 10) {
    form.inclass = selectedType.value
  } else {
    form.inclass = ''
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: undefined,
    no: '',
    name: '',
    unit: '',
    spec: '',
    description: '',
    color: '',
    memo: '',
    type: 10,
    weight: 0.00,
    keeper_rule: '',
    planned_price: 0.00,
    avg_price: 0.00,
    location: '',
    tech_memo: '',
    status: 0,
    inclass: '',
    isdelete: 0
  })
}

// 刷新
const handleRefresh = () => {
  queryParams.itemNo = ''
  queryParams.itemName = ''
  queryParams.type = ''
  queryParams.inclass = ''
  queryParams.pageNumber = 1
  getBasItemList()
}

// 新增物料
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

// 编辑物料
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  const res = await getBasItemById({ id: row.id })
  Object.assign(form, res.data.basItem)
  dialogVisible.value = true
}

// 删除物料
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除物料"${row.no}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteBasItem({ id: row.id })
      ElMessage.success('删除成功')
      getBasItemList()
    } catch (error) {
      console.error('删除物料失败', error)
      ElMessage.error('删除物料失败')
    }
  }).catch(() => {})
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await createBasItem(form)
          ElMessage.success('新增成功')
        } else {
          await updateBasItem(form)
          ElMessage.success('修改成功')
        }
        dialogVisible.value = false
        getBasItemList()
      } catch (error) {
        console.error('保存物料失败', error)
        ElMessage.error('保存物料失败')
      }
    }
  })
}



const importResultVisible = ref(false);
const importResultData = ref({});


/**
 * 导入物料数据
 */
const importItem = () => {
  // 创建隐藏的文件输入元素
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xls,.xlsx';
  input.style.display = 'none';

  // 添加 change 事件监听
  input.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) {
      ElMessage.error('未选择文件');
      return;
    }

    // 验证文件类型
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/)) {
      ElMessage.error('请选择 Excel 文件 (.xls 或 .xlsx)');
      return;
    }

    // 准备 FormData
    const formData = new FormData();
    formData.append('itemListFile', file);

    try {
      // 调用导入接口
      const res = await importItemList(formData);

      // 检查响应是否成功
      if (res.code === 200 && res.data) {
        // 显示导入结果弹窗
        showImportResultDialog(res.data);
        
        // 显示简要成功消息
        ElMessage.success(`文件导入完成，总计 ${res.data.totalRows} 条，成功 ${res.data.successCount} 条`);
      } else {
        ElMessage.error('导入失败：' + (res.msg || '未知错误'));
      }
    } catch (error) {
      console.error('导入错误', error);
      ElMessage.error('导入物料失败');
    } finally {
      // 移除临时输入元素
      document.body.removeChild(input);
    }
  });

  // 触发文件选择对话框
  document.body.appendChild(input);
  input.click();
};


/**
 * 显示导入结果弹窗
 * @param {Object} data - 导入结果数据
 */
const showImportResultDialog = (data) => {
  importResultData.value = data;
  importResultVisible.value = true;
};

/**
 * 导入结果确认回调
 */
const handleImportResultConfirm = () => {
  // 刷新合同信息
  getBasItemList();
};


//下载模板。模板地址/xlsxTemplate/基础物料信息导入示例.xlsx
const downloadExsl = () => {
  try {
    const url = `${baseURL}/xlsxTemplates/基础物料信息导入示例.xlsx`;
    window.open(url, '_blank');
  } catch (error) {
    console.error('下载模板失败:', error);
    ElMessage({
      message: '下载模板失败，请检查网络或联系管理员',
      type: 'error',
      duration: 5 * 1000
    });
  }
};


// 页面初始化
onMounted(() => {
  getBasItemList()
})
</script>

<style scoped>
.basitem-management {
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

/* 在style scoped中添加以下样式 */
.material-management {
  max-height: 70vh;
  overflow: auto;
}

.material-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.material-header h3 {
  margin: 0;
  color: #409eff;
}

.material-actions {
  display: flex;
  gap: 10px;
}

.material-list-view {
  margin-top: 20px;
}

.search-bar {
  margin-bottom: 20px;
}
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.search-bar .el-input {
  margin-right: 10px;
}
.material-tree-view {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  max-height: 60vh;
  overflow: auto;
}

.tree-node-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.node-attributes {
  font-size: 12px;
  color: #666;
  margin-left: 10px;
}
</style>