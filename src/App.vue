<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import axios from "axios";
import { ElMessage } from 'element-plus'

const active = ref(1)
const loading = ref(false)

const envName = ref('') // from el-radio default idc
const userName = ref('') // from el-input
const sysToken = ref('') // sysToken from /login/checkLogin
const menuOptions = ref([]) // menu options from /menu
const filteredOptions = ref([]) // menu options filter by handler
const menuValue = ref('') // from el-select

const finalUrl = computed(() => { //server
  const url = new URL(currentConfig.value.baseUrl)
  url.pathname = menuValue.value
  const params = new URLSearchParams(currentConfig.value.loginParams)
  return `${url.toString()}?${params.toString()}`;
})


async function submitFirstStepHandle() {
  if (!userName.value) return;
  loading.value = true
  try {
    await fetchToken();
    await fetchMenu();
    loading.value = false
    active.value++;
  } catch (err) {
    ElMessage({
      message: err.message,
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

function submitSecondStepHandle() {
  if (!menuValue.value) return;
  active.value++;
}


function filterHandle(val) {
  if (!val) filteredOptions.value = menuOptions.value
  filteredOptions.value = menuOptions.value.filter(item => item.menuName.includes(val))
}


const config = ref([
  {
    envLabel: 'audit-idc', // 展示名称
    envValue: 'audit-idc', // 代理名称 需要到 vite.config.js 进行配置
    loginApi: '/api/login/checkLogin',
    menuApi: '/api/menu/getMenu',
    baseUrl: 'http://10.180.40.91:18068', //拼接最终访问 url 时用
    loginKeys: [
      {
        key: 'empId', // 登录需要拼在 URL 后的参数
      },
      {
        key: 'pwdaToken',
        alias: 'sysToken'// 登录请求中需要解析的 key 名
      }
    ],
    loginParams: {},
  },
  {
    envLabel: 'audit-生产',
    envValue: 'audit-pro',
    loginApi: '/api/login/checkLogin',
    menuApi: '/api/menu/getMenu',
    baseUrl: 'http://auditxc.chinatowercom.cn:8068',
    loginKeys: [
      {
        key: 'empId',
      },
      {
        key: 'pwdaToken',
        alias: 'sysToken'
      }
    ],
    loginParams: {},
  },
  {
    envLabel: 'smart-idc',
    envValue: 'smart-idc',
    loginApi: '/api/authSmart/checkLoginSmart',
    menuApi: [
      {menuName: '首页', menuNewUrl: 'smart-audit/homeIndex'}
    ],
    baseUrl: 'http://10.180.40.91:18068',
    loginKeys: [
      {
        key: 'acctId',
      },
      {
        key: 'pwdaToken',
        alias: 'sysToken'
      }
    ],
    loginParams: {},
  },
])


const currentConfig = computed(() => {
  if (!envName.value) return null
  return config.value.find(item => item.envValue === envName.value);
})

async function fetchToken() {
  const {
    data: {
      code,
      message,
      data
    }
  } = await axios.post(`${currentConfig.value.envValue}${currentConfig.value.loginApi}`, {
    "userId": userName.value,
    "passwd": ""
  })
  if (code !== 200) throw new Error(message)
  currentConfig.value.loginKeys.forEach(({key, alias = ''}) => {
    currentConfig.value.loginParams[key] = data[alias ? alias : key]
  })
}

async function fetchMenu() {
  let result = []
  console.log(Array.isArray(currentConfig.value.menuApi))
  if (Array.isArray(currentConfig.value.menuApi)) {
    result = currentConfig.value.menuApi
  } else {
    const {data: {data}} = await axios.post(`${currentConfig.value.envValue}${currentConfig.value.menuApi}`, currentConfig.value.loginParams)
    result = data;
  }
  menuOptions.value = result;
  filteredOptions.value = result;
}


</script>

<template>
  {{ currentConfig }}
  <div v-loading="loading" style="width: 800px; display: flex;align-items: center;flex-direction: column">
    <el-space direction="vertical" :size="20">
      <el-steps :active="active" align-center style="min-width: 600px">
        <el-step title="Step 1" :description="sysToken ?`${envName}-${userName}`: 'Input User Account'"/>
        <el-step title="Step 2" :description="menuValue ? `${menuValue}` : 'Choose Menu'"/>
        <el-step title="Step 3" description="Final Url"/>
      </el-steps>
      <!-- step1 -->
      <template v-if="active === 1">
        <el-radio-group v-model="envName">
          <el-radio v-for="(item, index) in config" :value="item.envValue" :key="index">{{ item.envLabel }}</el-radio>
        </el-radio-group>
        <el-input v-model="userName" placeholder="User Account:"></el-input>
        <el-button type="primary" @click="submitFirstStepHandle">Next</el-button>
      </template>
      <!-- step2 -->
      <template v-if="active === 2">
        <el-select
            v-model="menuValue"
            filterable
            placeholder="choose menu"
            style="width: 240px"
            :filter-method="filterHandle"
        >
          <el-option
              v-for="(item, index) in filteredOptions"
              :key="index"
              :label="item.menuName"
              :value="item.menuNewUrl"

          />
        </el-select>
        <el-button type="primary" @click="submitSecondStepHandle">Next</el-button>
      </template>
      <!-- step3 -->
      <template v-if="active ===3">
        <el-link :href="finalUrl" target="_self" type="success">✅Go</el-link>
      </template>
    </el-space>

  </div>
</template>

<style scoped>

</style>
