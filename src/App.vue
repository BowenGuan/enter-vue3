<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import axios from "axios";
import { ElMessage } from 'element-plus'

const active = ref(1)
const loading = ref(false)
const envName = ref('idc') // from el-radio default idc
const userName = ref('') // from el-input
const sysToken = ref('') // sysToken from /login/checkLogin
const empId = ref('') // empId from /login/checkLogin
const menuOptions = ref([]) // menu options from /menu
const filteredOptions = ref([]) // menu options filter by handler
const menuValue = ref('') // from el-select
const currentPrefix = computed(() => { //server
  switch (envName.value) {
    case 'idc':
      return '/idc-api'
    case 'product':
      return '/pro-api'
    default:
      return null;
  }
})
const finalUrl = computed(() => { //server
  let url = ''
  switch (envName.value) {
    case 'idc':
      url += 'http://10.180.40.91:18068'
      break;
    case 'product':
      url += 'http://auditxc.chinatowercom.cn:8068'
      break;
    default:
      break;
  }
  url += `${menuValue.value}`
  url += `?pwdaToken=${sysToken.value}`
  url += `&empid=${empId.value}`
  return url;
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

async function fetchToken() {
  const {data: {code, message, data}} = await axios.post(`${currentPrefix.value}/api/login/checkLogin`, {
    "userId": userName.value,
    "passwd": ""
  })
  if (code !== 200) throw new Error(message)
  sysToken.value = data.sysToken;
  empId.value = data.empId
}

async function fetchMenu() {
  if (!sysToken) return;
  const {data: {data}} = await axios.post(`${currentPrefix.value}/api/menu/getMenu`, {
    sysToken: sysToken.value
  })
  menuOptions.value = data;
  filteredOptions.value = data;
}

function filterHandle(val) {
  if (!val) filteredOptions.value = menuOptions.value
  filteredOptions.value = menuOptions.value.filter(item => item.menuName.includes(val))
}

</script>

<template>
  <div v-loading="loading" style="width: 800px; display: flex;align-items: center;flex-direction: column">
    <el-space direction="vertical" :size="20">

      <el-steps :active="active" align-center  style="min-width: 600px" >
        <el-step title="Step 1" :description="sysToken ?`${envName}-${userName}`: 'Input User Account'"/>
        <el-step title="Step 2" :description="menuValue ? `${menuValue}` : 'Choose Menu'"/>
        <el-step title="Step 3" description="Final Url"/>
      </el-steps>
      <!-- step1 -->
      <template v-if="active === 1">

        <el-radio-group v-model="envName">
          <el-radio value="idc">idc</el-radio>
          <el-radio value="product">生产</el-radio>
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
