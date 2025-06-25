import router from './index'

// 布局组件映射
const layoutComponents = {
  'default': () => import('@/components/layout/DefaultLayout.vue'),
  'simple': () => import('@/components/layout/SimpleLayout.vue'),
  'none': null
}

// 定义一个组件映射对象，将路径映射到实际的导入函数
// 这样我们可以避免使用变量动态导入
const viewComponents = {
  // 仪表盘
  'dashboard/index': () => import('@/views/dashboard/index.vue'),
  
  // 系统管理
  'system/user': () => import('@/views/system/user.vue'),
  'system/menu': () => import('@/views/system/menu.vue'),
  'system/department': () => import('@/views/system/department.vue'),
  'system/basorg': () => import('@/views/system/basorg.vue'),


  //物料管理
  'item/basitem': () => import('@/views/item/basitem.vue'),
  //合同管理
  'contract/list': () => import('@/views/contract/bascontract/contractList.vue'),
  'contract/baspurchase': () => import('@/views/contract/baspurchaseorder/index.vue'),
  //图纸管理
  'tuzhi/tuzhi': () => import('@/views/tuzhi/tuzhi.vue'),
  //人员管理
  'hruser/hruserlist': () => import('@/views/hruser/hruserlist.vue'),
<<<<<<< Updated upstream
  
  'plmanage/plentityid': () => import('@/views/plmanage/plentityid/plentityid.vue'),

  'plmanage/plinoutstore': () => import('@/views/plmanage/plinoutstore/plinoutstore.vue'),

=======
  //通知管理
  'tongzhi/tongzhilist': () => import('@/views/tongzhi/tongzhilist.vue'),
>>>>>>> Stashed changes
  // 可以根据需要添加更多组件映射
}

// 动态导入组件函数 - 使用预定义的映射
const importComponent = (componentPath) => {
  if (!componentPath) {
    // console.warn('未提供组件路径')
    return null
  }
  
  // 检查映射中是否存在该组件
  if (viewComponents[componentPath]) {
    // console.log(`导入预定义组件: ${componentPath}`)
    return viewComponents[componentPath]
  } else {
    console.warn(`组件路径 ${componentPath} 未在映射表中定义，无法导入`)
    return null
  }
}

// 将菜单树转换为路由配置
const generateRoutesFromMenu = (menuTree) => {
  // console.log('开始转换菜单树为路由配置', menuTree)
  const routes = []

  const createRouteWithLayout = (menuItem, parentLayout = null) => {
    // console.log(`为 ${menuItem.title} 创建路由 (路径: ${menuItem.path}, 组件: ${menuItem.component})`)
    
    // 只使用component字段导入组件
    if (!menuItem.component) {
      // console.warn(`警告: 菜单项 ${menuItem.title} 没有提供 component 字段`)
      return null
    }
    
    const pageComponent = importComponent(menuItem.component)
    
    // 检查组件是否存在
    if (!pageComponent) {
      // console.warn(`警告: 无法导入组件 ${menuItem.component}，请确保已在 viewComponents 映射中定义`)
      return null
    }
    
    // 使用菜单项中的layout，如果没有则使用父菜单的layout或默认值
    const layoutType = menuItem.layout || parentLayout || 'default'
    const layoutComponent = layoutComponents[layoutType]
    
    let route
    
    // 如果需要布局，创建带布局的路由结构
    if (layoutComponent) {
      route = {
        path: menuItem.path,
        name: menuItem.title.replace(/\s/g, ''),
        component: layoutComponent,
        meta: {
          title: menuItem.title,
          requiresAuth: true,
          layout: layoutType,
          icon: menuItem.icon
        },
        children: [
          {
            path: '',
            name: `${menuItem.title.replace(/\s/g, '')}Page`,
            component: pageComponent,
            meta: {
              title: menuItem.title,
              requiresAuth: true,
              icon: menuItem.icon
            }
          }
        ]
      }
    } else {
      // 不需要布局的路由
      route = {
        path: menuItem.path,
        name: menuItem.title.replace(/\s/g, ''),
        component: pageComponent,
        meta: {
          title: menuItem.title,
          requiresAuth: true,
          layout: 'none',
          icon: menuItem.icon
        }
      }
    }
    
    return route
  }

  const processMenuItem = (menuItem, parentLayout = null) => {
    // 获取当前菜单项的layout，如果没有则使用父菜单的layout
    const currentLayout = menuItem.layout || parentLayout
    
    // 如果菜单项有子菜单，处理子菜单并传递当前layout
    if (menuItem.children && menuItem.children.length > 0) {
      // console.log(`处理父菜单 ${menuItem.title}，有 ${menuItem.children.length} 个子菜单`)
      
      // 如果父菜单也有自己的组件，需要添加到路由
      if (menuItem.component) {
        const parentRoute = createRouteWithLayout(menuItem, parentLayout)
        if (parentRoute) {
          routes.push(parentRoute)
        }
      }
      
      // 处理所有子菜单
      menuItem.children.forEach(child => {
        const childRoute = createRouteWithLayout(child, currentLayout)
        if (childRoute) {
          routes.push(childRoute)
        }
      })
    } else {
      // 如果没有子菜单，直接处理当前菜单项
      const route = createRouteWithLayout(menuItem, parentLayout)
      if (route) {
        routes.push(route)
      }
    }
  }

  menuTree.forEach(menuItem => {
    processMenuItem(menuItem)
  })

  // console.log('最终生成的路由配置:', routes)
  return routes
}

// 初始化动态路由（提供给 store 调用的主函数）
export const initDynamicRoutes = async (menuTree) => {
  // console.log('开始初始化动态路由', menuTree)
  // 
  try {
    const dynamicRoutes = generateRoutesFromMenu(menuTree)
    
    // 添加路由到路由表
    dynamicRoutes.forEach(route => {
      // console.log(`添加路由: ${route.path}`)
      router.addRoute(route)
    })
    
    // console.log('动态路由添加完成，当前路由表:', router.getRoutes())
    return true
  } catch (error) {
    // console.error('初始化动态路由失败:', error)
    throw error
  }
}

// 清除动态路由（可用于退出登录时）
export const clearDynamicRoutes = () => {
  // Vue Router 4 没有直接的 removeRoute，需要手动管理
  const routes = router.getRoutes()
  
  // 查找所有动态添加的路由
  routes.forEach(route => {
    // 这里可以加入逻辑来判断哪些是动态添加的路由
    // 例如：检查meta或路径特征
    if (route.meta?.requiresAuth) {
      router.removeRoute(route.name)
      // console.log(`移除路由: ${route.path}`)
    }
  })
  
  // console.log('动态路由已清除')
}