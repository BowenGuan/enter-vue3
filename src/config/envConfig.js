import {ref} from "vue";
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
    {
        envLabel: 'smart-生产',
        envValue: 'smart-pro',
        loginApi: '/api/authSmart/checkLoginSmart',
        menuApi: [
            {menuName: '首页', menuNewUrl: 'smart-audit/homeIndex'}
        ],
        baseUrl: 'https://auditsmart.chinatowercom.cn:8078/bigscreen',
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

export default config