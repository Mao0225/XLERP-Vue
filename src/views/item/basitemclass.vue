<template>
  <div class="basitemclass-management">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-area" v-if="breadcrumb.length > 0">
      <el-card shadow="never">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <el-button type="text" @click="handleBackToRoot">
              <el-icon><House /></el-icon>
              全部分类
            </el-button>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="item.id">
            <el-button 
              type="text" 
              @click="handleBreadcrumbClick(item, index)"
              :disabled="index === breadcrumb.length - 1">
              {{ item.classname }}
            </el-button>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="current-level-info">
          <el-tag type="info" size="small">
            当前查看: {{ getCurrentLevelText() }}
          </el-tag>
          <el-tag v-if="isSearchMode" type="warning" size="small" style="margin-left: 8px;">
            搜索模式
          </el-tag>
        </div>
      </el-card>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <el-card shadow="never">
        <el-form :model="searchForm" inline>
          <el-form-item label="搜索关键词">
            <el-input 
              v-model="searchForm.keyword" 
              placeholder="请输入分类编码或名称" 
              clearable 
              style="width: 200px"
              @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="分类级别">
            <el-select 
              v-model="searchForm.type" 
              placeholder="全部分类" 
              clearable
              style="width: 120px">
              <el-option label="一级分类" :value="1" />
              <el-option label="二级分类" :value="2" />
              <el-option label="三级分类" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" :loading="searchLoading">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset" :disabled="searchLoading">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
            <el-button v-if="isSearchMode" type="success" @click="handleShowAll">
              <el-icon><View /></el-icon>
              显示全部
            </el-button>
          </el-form-item>
        </el-form>
        
        <!-- 搜索统计 -->
        <div v-if="isSearchMode" class="search-stats">
          <el-text type="info">
            共找到 
            <el-text type="primary">{{ searchResults.length }}</el-text> 
            个相关分类
            <el-text type="info" style="margin-left: 16px;">
              (一级: {{ searchLevelCount[1] || 0 }}, 二级: {{ searchLevelCount[2] || 0 }}, 三级: {{ searchLevelCount[3] || 0 }})
            </el-text>
          </el-text>
        </div>
      </el-card>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-area">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增分类
      </el-button>
      <el-button @click="handleRefresh" :loading="loading">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
      <el-button v-if="selectedLevel1 || selectedLevel2" @click="handleBack">
        <el-icon><Back /></el-icon>
        返回上级
      </el-button>
    </div>

    <!-- 三列瀑布流布局 -->
    <div class="waterfall-layout">
      <!-- 第一列：一级分类 -->
      <div class="category-column">
        <div class="column-header">
          <div class="column-title">一级分类</div>
          <div class="column-count">{{ filteredLevel1.length }} 个分类</div>
        </div>
        <div class="category-list">
          <div 
            v-for="category in filteredLevel1" 
            :key="category.id"
            class="category-card"
            :class="{ 
              active: selectedLevel1 === category.id,
              'search-highlight': isSearchMode && isInSearchResults(category.id)
            }"
            @click="handleLevel1Select(category)"
          >
            <div class="category-main">
              <div class="category-name">
                {{ category.classname }}
                <el-tag v-if="isSearchMode && isInSearchResults(category.id)" type="warning" size="small" effect="plain">
                  匹配
                </el-tag>
              </div>
              <div class="category-code">{{ category.classcode }}</div>
            </div>
            <div class="category-stats">
              
              <div class="category-status">
                <el-tag :type="category.status === '可用' ? 'success' : 'danger'" size="small">
                  {{ category.status }}
                </el-tag>
              </div>
            </div>
            <div class="category-memo" v-if="category.memo">
              {{ category.memo }}
            </div>
            
            <div class="category-actions">
              <el-button 
                size="small" 
                type="primary" 
                text 
                @click.stop="handleView(category)"
              >
                查看
              </el-button>
              <el-button 
                size="small" 
                type="primary" 
                text 
                @click.stop="handleEdit(category)"
              >
                编辑
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                text 
                @click.stop="handleDelete(category)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二列：二级分类 -->
      <div class="category-column" v-if="selectedLevel1 || isSearchMode">
        <div class="column-header">
          <div class="column-title">二级分类</div>
          <div class="column-count">{{ filteredLevel2.length }} 个分类</div>
        </div>
        <div class="category-list">
          <div 
            v-for="category in filteredLevel2" 
            :key="category.id"
            class="category-card"
            :class="{ 
              active: selectedLevel2 === category.id,
              'search-highlight': isSearchMode && isInSearchResults(category.id)
            }"
            @click="handleLevel2Select(category)"
          >
            <div class="category-main">
              <div class="category-name">
                {{ category.classname }}
                <el-tag v-if="isSearchMode && isInSearchResults(category.id)" type="warning" size="small" effect="plain">
                  匹配
                </el-tag>
              </div>
              <div class="category-code">{{ category.classcode }}</div>
            </div>
            <div class="category-stats">
              
              <div class="category-status">
                <el-tag :type="category.status === '可用' ? 'success' : 'danger'" size="small">
                  {{ category.status }}
                </el-tag>
              </div>
            </div>
            <div class="category-memo" v-if="category.memo">
              {{ category.memo }}
            </div>
            <div class="category-actions">
              <el-button 
                size="small" 
                type="primary" 
                text 
                @click.stop="handleView(category)"
              >
                查看
              </el-button>
              <el-button 
                size="small" 
                type="primary" 
                text 
                @click.stop="handleEdit(category)"
              >
                编辑
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                text 
                @click.stop="handleDelete(category)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 第三列：三级分类 -->
      <div class="category-column" v-if="selectedLevel2 || isSearchMode">
        <div class="column-header">
          <div class="column-title">三级分类</div>
          <div class="column-count">{{ filteredLevel3.length }} 个分类</div>
        </div>
        <div class="category-list">
          <div 
            v-for="category in filteredLevel3" 
            :key="category.id"
            class="category-card"
            :class="{ 'search-highlight': isSearchMode && isInSearchResults(category.id) }"
          >
            <div class="category-main">
              <div class="category-name">
                {{ category.classname }}
                <el-tag v-if="isSearchMode && isInSearchResults(category.id)" type="warning" size="small" effect="plain">
                  匹配
                </el-tag>
              </div>
              <div class="category-code">{{ category.classcode }}</div>
            </div>
            <div class="category-stats">
              <div class="category-status">
                <el-tag :type="category.status === '可用' ? 'success' : 'danger'" size="small">
                  {{ category.status }}
                </el-tag>
              </div>
            </div>
            <div class="category-memo" v-if="category.memo">
              {{ category.memo }}
            </div>
            <div class="category-actions">
              <el-button 
                size="small" 
                type="primary" 
                text 
                @click.stop="handleView(category)"
              >
                查看
              </el-button>
              <el-button 
                size="small" 
                type="primary" 
                text 
                @click.stop="handleEdit(category)"
              >
                编辑
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                text 
                @click.stop="handleDelete(category)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态列 -->
      <div class="empty-column" v-if="!selectedLevel1 && !isSearchMode">
        <div class="empty-content">
          <el-empty description="请选择一级分类查看下级分类" />
        </div>
      </div>
      <div class="empty-column" v-if="selectedLevel1 && !selectedLevel2 && !isSearchMode">
        <div class="empty-content">
          <el-empty description="请选择二级分类查看三级分类" />
        </div>
      </div>
      
      <!-- 搜索结果为空 -->
      <div class="empty-full" v-if="isSearchMode && searchResults.length === 0">
        <el-empty description="没有找到相关分类" />
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类编码" prop="classcode">
              <el-input v-model="formData.classcode" placeholder="请输入分类编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类名称" prop="classname">
              <el-input v-model="formData.classname" placeholder="请输入分类名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="上级分类" prop="parentId">
              <el-select
                v-model="formData.parentId"
                placeholder="请选择上级分类"
                clearable
                style="width: 100%"
                @change="handleParentChange">
                <el-option
                  v-for="item in parentOptions"
                  :key="item.id"
                  :label="`${item.classcode} - ${item.classname}`"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类级别" prop="type">
              <el-select 
                v-model="formData.type" 
                placeholder="请选择分类级别" 
                style="width: 100%"
                @change="handleTypeChange">
                <el-option label="一级分类" :value="1" />
                <el-option label="二级分类" :value="2" />
                <el-option label="三级分类" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="使用状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="可用" value="可用" />
                <el-option label="停用" value="停用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="控制策略" prop="controlstrategy">
              <el-input v-model="formData.controlstrategy" placeholder="请输入控制策略" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="创建组织" prop="createorg">
              <el-input v-model="formData.createorg" placeholder="请输入创建组织" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统预设" prop="systempreset">
              <el-input 
                v-model="formData.systempreset" 
                placeholder="请输入系统预设" 
                clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="描述" prop="memo">
          <el-input
            v-model="formData.memo"
            type="textarea"
            :rows="3"
            placeholder="请输入描述信息" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      title="分类详情"
      v-model="viewDialogVisible"
      width="600px"
      :close-on-click-modal="false">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="分类编码">
          {{ viewData.classcode || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="分类名称">
          {{ viewData.classname || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="上级分类">
          {{ viewData.parent_name || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="分类级别">
          <el-tag :type="getLevelType(viewData.type)">
            {{ getLevelText(viewData.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="使用状态">
          <el-tag :type="viewData.status === '可用' ? 'success' : 'danger'">
            {{ viewData.status || '-' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="控制策略">
          {{ viewData.controlstrategy || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建组织">
          {{ viewData.createorg || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="系统预设">
          {{ viewData.systempreset || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">
          {{ viewData.createtime || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">
          {{ viewData.updatetime || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">
          {{ viewData.memo || '无' }}
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  House,
  Back,
  View
} from '@element-plus/icons-vue'
import {
  getBasItemClasses,
  createBasItemClass,
  updateBasItemClass,
  deleteBasItemClass,
  getParentOptions,
  getBasItemClassById,
  getBasItemClassDetail,
  getChildrenList,
  getLevel1Classes,
  searchClasses
} from '@/api/item/basitemclass'

// 响应式数据
const formRef = ref()
const loading = ref(false)
const searchLoading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const viewDialogVisible = ref(false)
const isSearchMode = ref(false)

// 三列布局相关数据
const selectedLevel1 = ref(null)
const selectedLevel2 = ref(null)
const level1Data = ref([])
const level2Data = ref([])
const level3Data = ref([])
const breadcrumb = ref([])
const searchResults = ref([])
const searchLevelCount = ref({})

const viewData = reactive({
  id: null,
  classcode: '',
  classname: '',
  parent_name: '',
  type: null,
  status: '',
  systempreset: '',
  controlstrategy: '',
  createorg: '',
  memo: '',
  createtime: '',
  updatetime: ''
})

// 搜索表单
const searchForm = reactive({
  keyword: '',
  type: null
})

// 父级分类选项
const parentOptions = ref([])

// 表单数据
const formData = reactive({
  id: null,
  classcode: '',
  classname: '',
  parentId: null,
  type: 1,
  status: '可用',
  systempreset: '',
  controlstrategy: '全局共享',
  createorg: '电力金具',
  memo: ''
})

// 表单验证规则
const formRules = {
  classcode: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    { min: 1, max: 20, message: '分类编码长度在 1 到 20 个字符', trigger: 'blur' }
  ],
  classname: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 100, message: '分类名称长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择分类级别', trigger: 'change' }
  ],
  parentId: [
    { 
      validator: (rule, value, callback) => {
        if (formData.type === 1 && value) {
          callback(new Error('一级分类不能有上级分类'))
        } else if (formData.type === 2 && !value) {
          callback(new Error('二级分类必须选择上级分类'))
        } else if (formData.type === 3 && !value) {
          callback(new Error('三级分类必须选择上级分类'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 计算属性
const filteredLevel1 = computed(() => {
  if (isSearchMode.value) {
    return level1Data.value.filter(item => 
      searchResults.value.some(result => result.id === item.id)
    )
  }
  return level1Data.value
})

const filteredLevel2 = computed(() => {
  if (isSearchMode.value) {
    return level2Data.value.filter(item => 
      searchResults.value.some(result => result.id === item.id)
    )
  }
  return level2Data.value.filter(item => 
    !selectedLevel1.value || item.parentId === selectedLevel1.value
  )
})

const filteredLevel3 = computed(() => {
  if (isSearchMode.value) {
    return level3Data.value.filter(item => 
      searchResults.value.some(result => result.id === item.id)
    )
  }
  return level3Data.value.filter(item => 
    !selectedLevel2.value || item.parentId === selectedLevel2.value
  )
})

// 方法定义
const fetchAllData = async () => {
  loading.value = true
  try {
    // 一次性获取所有分类数据，用于搜索和正常显示
    const allClassesResponse = await getBasItemClasses({ 
      pageSize: 10000, 
      pageNumber: 1 
    })
    
    if (allClassesResponse.success && allClassesResponse.data.page?.list) {
      const allClasses = allClassesResponse.data.page.list
      
      // 按级别分类
      level1Data.value = allClasses.filter(item => item.type === 1)
      level2Data.value = allClasses.filter(item => item.type === 2)
      level3Data.value = allClasses.filter(item => item.type === 3)
      
      console.log('加载数据完成:', {
        level1: level1Data.value.length,
        level2: level2Data.value.length,
        level3: level3Data.value.length
      })
    } else {
      ElMessage.error('获取分类数据失败')
    }
  } catch (error) {
    console.error('获取分类数据失败:', error)
    ElMessage.error('获取数据失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const fetchLevel2Data = async (parentId) => {
  try {
    const response = await getChildrenList({ parentId: parseInt(parentId) })
    if (response.success) {
      level2Data.value = response.data.children || []
    } else {
      ElMessage.error(response.message || '获取二级分类失败')
    }
  } catch (error) {
    console.error('获取二级分类失败:', error)
    level2Data.value = []
  }
}

const fetchLevel3Data = async (parentId) => {
  try {
    const response = await getChildrenList({ parentId: parseInt(parentId) })
    if (response.success) {
      level3Data.value = response.data.children || []
    } else {
      ElMessage.error(response.message || '获取三级分类失败')
    }
  } catch (error) {
    console.error('获取三级分类失败:', error)
    level3Data.value = []
  }
}

const handleLevel1Select = async (category) => {
  if (isSearchMode.value) {
    // 搜索模式下，点击分类时退出搜索模式并正常显示
    await handleShowAll()
  }
  
  selectedLevel1.value = category.id
  selectedLevel2.value = null
  level3Data.value = []
  
  // 更新面包屑
  breadcrumb.value = [category]
  
  await fetchLevel2Data(category.id)
}

const handleLevel2Select = async (category) => {
  if (isSearchMode.value) {
    // 搜索模式下，点击分类时退出搜索模式并正常显示
    await handleShowAll()
  }
  
  selectedLevel2.value = category.id
  
  // 更新面包屑
  if (breadcrumb.value.length === 1) {
    breadcrumb.value.push(category)
  } else {
    breadcrumb.value[1] = category
  }
  
  await fetchLevel3Data(category.id)
}

const handleSearch = async () => {
  if (!searchForm.keyword && !searchForm.type) {
    ElMessage.warning('请输入搜索关键词或选择分类级别')
    return
  }

  searchLoading.value = true
  try {
    // 参数处理
    const searchParams = {
      keyword: searchForm.keyword || '',
      type: searchForm.type ? parseInt(searchForm.type) : null
    }
    
    // 清除空值参数
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] === '' || searchParams[key] === null || searchParams[key] === undefined) {
        delete searchParams[key]
      }
    })

    const response = await searchClasses(searchParams)
    if (response.success) {
      searchResults.value = response.data.searchResults || []
      isSearchMode.value = true
      
      // 计算各级别的数量
      calculateSearchLevelCount()
      
      // 在搜索模式下，显示所有相关分类
      selectedLevel1.value = null
      selectedLevel2.value = null
      breadcrumb.value = []
      
      ElMessage.success(`找到 ${searchResults.value.length} 个相关分类`)
    } else {
      ElMessage.error(response.message || '搜索失败')
    }
  } catch (error) {
    console.error('搜索分类失败:', error)
    ElMessage.error('搜索失败: ' + error.message)
  } finally {
    searchLoading.value = false
  }
}

// 计算搜索结果的级别分布
const calculateSearchLevelCount = () => {
  const levelCount = { 1: 0, 2: 0, 3: 0 }
  searchResults.value.forEach(item => {
    if (item.type && levelCount[item.type] !== undefined) {
      levelCount[item.type]++
    }
  })
  searchLevelCount.value = levelCount
}

const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    type: null
  })
  
  if (isSearchMode.value) {
    handleShowAll()
  }
}

const handleShowAll = async () => {
  isSearchMode.value = false
  searchResults.value = []
  searchLevelCount.value = {}
  selectedLevel1.value = null
  selectedLevel2.value = null
  breadcrumb.value = []
  await fetchAllData()
}

const handleRefresh = () => {
  if (isSearchMode.value) {
    handleSearch()
  } else {
    fetchAllData()
  }
}

const handleAdd = async () => {
  dialogTitle.value = '新增分类'
  isEdit.value = false
  dialogVisible.value = true
  await nextTick()
  resetForm()
  
  // 如果当前有选中的分类，自动设置父级和类型
  if (selectedLevel2.value) {
    formData.parentId = selectedLevel2.value
    formData.type = 3
  } else if (selectedLevel1.value) {
    formData.parentId = selectedLevel1.value
    formData.type = 2
  } else {
    formData.type = 1
  }
  
  await fetchParentOptions(null, formData.type)
}

const handleEdit = async (category) => {
  dialogTitle.value = '编辑分类'
  isEdit.value = true
  try {
    const response = await getBasItemClassById({ id: parseInt(category.id) })
    if (response.success) {
      Object.assign(formData, response.data.itemClass)
      await fetchParentOptions(category.id, formData.type)
      dialogVisible.value = true
    } else {
      ElMessage.error(response.message || '获取详情失败')
    }
  } catch (error) {
    console.error('获取分类详情失败:', error)
    ElMessage.error('网络错误，请重试')
  }
}

const handleDelete = (category) => {
  ElMessageBox.confirm(
    `确定要删除分类 "${category.classname}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const response = await deleteBasItemClass({ id: parseInt(category.id) })
      if (response.success) {
        ElMessage.success('删除成功')
        if (isSearchMode.value) {
          handleSearch()
        } else {
          fetchAllData()
        }
        // 如果删除的是当前选中的分类，重置选中状态
        if (selectedLevel1.value === category.id) {
          handleBackToRoot()
        } else if (selectedLevel2.value === category.id) {
          selectedLevel2.value = null
          level3Data.value = []
        }
      } else {
        ElMessage.error(response.message || '删除失败')
      }
    } catch (error) {
      console.error('删除分类失败:', error)
      ElMessage.error('网络错误，请重试')
    }
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        // 创建 FormData 对象
        const formDataObj = new FormData()
        
        // 添加所有参数
        if (isEdit.value && formData.id) {
          formDataObj.append('id', formData.id.toString())
        }
        formDataObj.append('classcode', formData.classcode || '')
        formDataObj.append('classname', formData.classname || '')
        formDataObj.append('type', formData.type ? formData.type.toString() : '1')
        
        // parentId 如果是空字符串或 null，就设置为空
        if (formData.parentId && formData.parentId !== '') {
          formDataObj.append('parentId', formData.parentId.toString())
        } else {
          formDataObj.append('parentId', '')
        }
        
        formDataObj.append('status', formData.status || '可用')
        formDataObj.append('systempreset', formData.systempreset || '')
        formDataObj.append('controlstrategy', formData.controlstrategy || '全局共享')
        formDataObj.append('createorg', formData.createorg || '电力金具')
        formDataObj.append('memo', formData.memo || '')

        console.log('提交参数:')
        for (let [key, value] of formDataObj.entries()) {
          console.log(key + ': ' + value)
        }

        let response
        if (isEdit.value) {
          response = await updateBasItemClass(formDataObj)
        } else {
          response = await createBasItemClass(formDataObj)
        }

        if (response.success) {
          ElMessage.success(response.message || '操作成功')
          dialogVisible.value = false
          if (isSearchMode.value) {
            handleSearch()
          } else {
            fetchAllData()
          }
        } else {
          ElMessage.error(response.message || '操作失败')
        }
      } catch (error) {
        console.error('提交表单失败:', error)
        ElMessage.error('网络错误，请重试')
      } finally {
        submitting.value = false
      }
    }
  })
}

const fetchParentOptions = async (currentId = null, currentType = null) => {
  try {
    const params = {}
    if (currentId) {
      params.currentId = parseInt(currentId)
    }
    if (currentType) {
      params.currentType = parseInt(currentType)
    }
    
    const response = await getParentOptions(params)
    if (response.success) {
      parentOptions.value = response.data.parentOptions || []
    } else {
      ElMessage.error(response.message || '获取父级选项失败')
    }
  } catch (error) {
    console.error('获取父级选项失败:', error)
    ElMessage.error('获取父级选项失败')
  }
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(formData, {
    id: null,
    classcode: '',
    classname: '',
    parentId: null,
    type: 1,
    status: '可用',
    systempreset: '',
    controlstrategy: '全局共享',
    createorg: '电力金具',
    memo: ''
  })
}

const handleParentChange = (parentId) => {
  if (parentId) {
    const parent = parentOptions.value.find(item => item.id === parentId)
    if (parent) {
      // 自动设置分类级别为父级级别+1
      formData.type = parent.type + 1
      // 重新获取父级选项
      fetchParentOptions(formData.id, formData.type)
    }
  } else {
    // 清空父级时，重新获取选项
    fetchParentOptions(formData.id, formData.type)
  }
}

const handleTypeChange = (type) => {
  if (type === 1) {
    // 一级分类不能有父级
    formData.parentId = null
  }
  // 分类级别改变时，重新获取父级选项
  fetchParentOptions(formData.id, type)
}

const getLevelText = (type) => {
  const map = { 1: '一级', 2: '二级', 3: '三级' }
  return map[type] || '-'
}

const getLevelType = (type) => {
  const map = { 1: 'primary', 2: 'success', 3: 'warning' }
  return map[type] || 'info'
}

// 查看详情
const handleView = async (category) => {
  try {
    const response = await getBasItemClassDetail({ id: parseInt(category.id) })
    if (response.success) {
      Object.assign(viewData, response.data.itemClass)
      viewDialogVisible.value = true
    } else {
      ElMessage.error(response.message || '获取详情失败')
    }
  } catch (error) {
    console.error('获取分类详情失败:', error)
    ElMessage.error('网络错误，请重试')
  }
}

// 获取子分类数量
const getSubCategoryCount = (parentId, level) => {
  if (level === 2) {
    return level2Data.value.filter(item => item.parentId === parentId).length
  } else if (level === 3) {
    return level3Data.value.filter(item => item.parentId === parentId).length
  }
  return 0
}

// 检查是否在搜索结果中
const isInSearchResults = (id) => {
  return searchResults.value.some(item => item.id === id)
}

// 返回上级
const handleBack = () => {
  if (selectedLevel2.value) {
    selectedLevel2.value = null
    level3Data.value = []
    breadcrumb.value.pop()
  } else if (selectedLevel1.value) {
    handleBackToRoot()
  }
}

// 返回根目录
const handleBackToRoot = () => {
  selectedLevel1.value = null
  selectedLevel2.value = null
  level2Data.value = []
  level3Data.value = []
  breadcrumb.value = []
}

// 面包屑点击
const handleBreadcrumbClick = (item, index) => {
  if (index === 0) {
    // 点击全部分类
    handleBackToRoot()
  } else if (index === 1) {
    // 点击一级分类
    handleLevel1Select(item)
  }
}

// 获取当前层级文本
const getCurrentLevelText = () => {
  if (selectedLevel2.value) {
    return '三级分类'
  } else if (selectedLevel1.value) {
    return '二级分类'
  } else {
    return '一级分类'
  }
}

// 生命周期
onMounted(() => {
  fetchAllData()
})
</script>


<style scoped>
.basitemclass-management {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 84px);
}

.breadcrumb-area {
  margin-bottom: 16px;
}

.breadcrumb-area :deep(.el-breadcrumb) {
  font-size: 14px;
}

.breadcrumb-area :deep(.el-breadcrumb .el-button) {
  padding: 0;
  height: auto;
}

.current-level-info {
  margin-top: 8px;
  display: flex;
  align-items: center;
}

.search-area {
  margin-bottom: 16px;
}

.search-stats {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
}

.action-area {
  margin-bottom: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 三列瀑布流布局 */
.waterfall-layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  height: calc(100vh - 280px);
}

.category-column {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.column-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
  border-radius: 8px 8px 0 0;
}

.column-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.column-count {
  font-size: 12px;
  color: #909399;
}

.category-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.category-card {
  padding: 16px;
  margin-bottom: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.category-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.category-card.active {
  border-color: #409eff;
  background: #f0f9ff;
}

.category-card.search-highlight {
  border-left: 4px solid #e6a23c;
  background: #fdf6ec;
}

.category-main {
  margin-bottom: 12px;
}

.category-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-code {
  font-size: 12px;
  color: #909399;
}

.category-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.sub-count {
  font-size: 12px;
  color: #909399;
}

.category-status {
  display: flex;
  align-items: center;
}

.category-memo {
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.category-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.empty-column {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-full {
  grid-column: 1 / -1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-content {
  text-align: center;
}

:deep(.el-card) {
  border-radius: 8px;
}

/* 滚动条样式 */
.category-list::-webkit-scrollbar {
  width: 4px;
}

.category-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.category-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.category-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .waterfall-layout {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .basitemclass-management {
    padding: 12px;
  }
  
  .waterfall-layout {
    grid-template-columns: 1fr;
  }
  
  .search-area :deep(.el-form--inline .el-form-item) {
    margin-right: 8px;
    margin-bottom: 8px;
  }
  
  .action-area .el-button {
    margin-bottom: 8px;
  }
}
</style>