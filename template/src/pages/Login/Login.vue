<template>
  <div class="container">
    <el-col :lg="{span:17}"
            :md="{span:15}"
            :sm="{span:10}"
            :xs="{span:0}">
      <div class="login-bg">
        <img src="@/assets/banner.jpeg"
             alt />
      </div>
    </el-col>
    <el-col :lg="{span:7}"
            :md="{span:9}"
            :sm="{span:14}"
            :xs="{span:24}">
      <div class="login-content">
        <h2>资产管理</h2>
        <img src="@/assets/login-logo.png"
             class="login-logo"
             alt />
        <div class="login-form">
          <div v-if="status!=='register'"
               class="login-mode">
            <span :class="{'active':this.status==='passwordLogin'}"
                  @click="toggleLoginMode('passwordLogin')">用户登录</span>
            <span :class="{'active':this.status==='phoneLogin'}"
                  @click="toggleLoginMode('phoneLogin')">快捷登录</span>
          </div>
          <!-- 密码登录表单 -->
          <el-form :model="loginForm"
                   v-if="status==='passwordLogin'"
                   ref="loginForm"
                   :rules="loginFormRules">
            <el-form-item prop="user_no">
              <input v-model="loginForm.user_no"
                     placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item prop="password"
                          class="password">
              <input v-model="loginForm.password"
                     type="password"
                     placeholder="请输入密码" />
            </el-form-item>
          </el-form>
          <!-- 验证码登录表单 -->
          <el-form :model="phoneLoginForm"
                   v-if="status==='phoneLogin'"
                   ref="phneLoginForm"
                   :rules="phoneLoginFormRules">
            <el-form-item prop="phone">
              <input type="password"
                     style="display:none;" />
              <!--解决自动填充密码问题 -->
              <input v-model="phoneLoginForm.phone"
                     placeholder="请输入手机号"
                     maxlength="11"
                     type="text"
                     autocomplete="new-password"
                     :readonly="phoneReadOnly"
                     @blur="phoneReadOnly=true"
                     @focus="phoneReadOnly=false"
                     @input="onInputLogin" />
            </el-form-item>
            <el-form-item prop="code">
              <input type="password"
                     style="display:none;" />
              <!--解决自动填充密码问题 -->
              <input v-model="phoneLoginForm.code"
                     type="text"
                     placeholder="请输入验证码"
                     autocomplete="new-password"
                     @input="onCodeLogin" />
              <el-button @click="getLoginVerifyCode"
                         class="get-verify-btn"
                         :disabled="verifyCodeDisabled"
                         :class="{'disabled':verifyCodeDisabled}"
                         type="primary">{{verifyCodeBtnText}}</el-button>
            </el-form-item>
          </el-form>
          <!-- 用户注册表单 -->
          <el-form :model="registerForm"
                   v-if="status==='register'"
                   ref="registerForm"
                   :rules="registerLoginFormRules">
            <el-form-item prop="phone">
              <input type="password"
                     style="display:none;" />
              <!--解决自动填充密码问题 -->
              <input v-model="registerForm.phone"
                     type="text"
                     placeholder="请输入手机号"
                     maxlength="11"
                     @input="onInput" />
            </el-form-item>
            <el-form-item prop="code">
              <input type="password"
                     style="display:none;" />
              <!--解决自动填充密码问题 -->
              <input v-model="registerForm.code"
                     type="text"
                     placeholder="请输入验证码"
                     @input="onInputCode" />
              <el-button @click="getRegisterVerifyCode"
                         class="get-verify-btn"
                         :disabled="verifyCodeDisabled"
                         :class="{'disabled':verifyCodeDisabled}"
                         type="primary">{{verifyCodeBtnText}}</el-button>
            </el-form-item>
          </el-form>

          <el-button v-if="status!=='register'"
                     class="login-btn primary-btn"
                     @click="getKey">登录</el-button>
          <!-- <el-button v-if="status!=='register'"
                     type="text"
                     @click="toggleLoginOrRegister('register')"
                     class="text-btn">用户注册</el-button> -->

          <el-button v-if="status==='register'"
                     class="register-btn primary-btn"
                     @click="register('registerForm')">注册</el-button>
          <el-button v-if="status==='register'"
                     type="text"
                     @click="toggleLoginOrRegister('passwordLogin')"
                     class="text-btn">已有账号,立即登录</el-button>
        </div>
      </div>
    </el-col>
  </div>
</template>
<script>
import { userPermissionApi } from '@/services/UserPermission'
export default {
  data () {
    return {
      registrfa: false,
      hrefUrl: '',
      user_type: '',
      // 密码登录表单对象
      loginForm: {
        login_type: 1
      },
      loginFormRules: {
        user_no: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }]
      },
      // 验证码登录表单对象
      phoneLoginForm: {
        login_type: 2,
        phone: ''
      },
      // 验证码登录表单readonly属性，用于解决浏览器自动填充
      codeReadOnly: true,
      phoneReadOnly: true,
      phoneLoginFormRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          {
            pattern: /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/,
            message: '请您输入有效的手机号'
          }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'change' }]
      },

      // 注册表单对象
      registerForm: {
        phone: '',
        code: ''
      },
      // 用户注册
      registerLoginFormRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          {
            pattern: /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/,
            message: '请您输入有效的手机号'
          }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'change' }]
      },
      registerFormRules: {
        phone: [{ required: true, message: '请输入手机号', trigger: 'change' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'change' }]
      },
      // 是否处于请求接口过程中
      pending: false,
      // 单位信息
      companyInfo: {},
      // 当前处于登录还是注册状态
      status: 'passwordLogin',
      // 获取验证码按钮是否禁用
      verifyCodeDisabled: false,
      // 验证码禁用倒计时时间
      verifyCodeTimeout: 60,
      // 验证码按钮文字
      verifyCodeBtnText: '获取验证码',
      // 验证码倒计时定时器id
      verifyCodeTimeoutId: 0
    }
  },
  methods: {
    // 快捷登录
    onInputLogin () {
      this.$refs.phneLoginForm.validateField('phone', phoneError => {
        console.log(`${phoneError}***************************`)

        if (!phoneError) {
        }
      })
    },
    onCodeLogin () {
      this.phoneReadOnly = false
      this.$refs.phneLoginForm.validateField('code', codeError => {
        console.log(`${codeError}***************************`)

        if (!codeError) {
        }
      })
    },
    // 用户注册
    onInput () {
      this.$refs.registerForm.validateField('phone', phoneError => {
        console.log(`${phoneError}***************************`)

        if (!phoneError) {
        }
      })
    },
    onInputCode () {
      this.$refs.registerForm.validateField('code', codeError => {
        console.log(`${codeError}***************************`)

        if (!codeError) {
        }
      })
    },
    // 登录方法
    login () {
      // 密码登录
      if (this.status === 'passwordLogin') {
        this.$refs['loginForm'].validate(valid => {
          if (valid) {
            if (!this.pending) {
              this.pending = true
              userPermissionApi
                .login({
                  data: this.loginForm
                })
                .then(
                  res => {
                    this.pending = false
                    if (res.data.access_token) {
                      // window.localStorage.clear()
                      // this.pending = false
                      this.clearStorage(res.data)
                    }
                  },
                  err => {
                    this.pending = false
                    console.log(err)
                  }
                )
            }
          }
        })
        // 验证码登录
      } else if (this.status === 'phoneLogin') {
        this.$refs['phneLoginForm'].validate(valid => {
          if (valid) {
            if (!this.pending) {
              this.pending = true
              userPermissionApi
                .login({
                  data: {
                    phone: this.phoneLoginForm.phone,
                    code: this.phoneLoginForm.code,
                    login_type: 2
                  }
                })
                .then(
                  res => {
                    this.pending = false
                    if (res.data.access_token) {
                      // window.localStorage.clear()
                      // this.pending = false
                      this.clearStorage(res.data)
                    }
                  },
                  err => {
                    this.pending = false
                    console.log(err)
                  }
                )
            }
          }
        })
      }
    },

    // 登录成功后清除旧数据，写入新数据
    async clearStorage (data) {
      window.localStorage.clear()

      window.sessionStorage.setItem('access_token', data.access_token)

      window.localStorage.setItem('user_id', data.user_id)
      window.localStorage.setItem('phone', data.phone)
      window.localStorage.setItem('comp_id', data.comp_id)
      window.sessionStorage.setItem('access_token', data.access_token)
      window.localStorage.setItem('userInfo', JSON.stringify(data))
      await this.getUserInfoList(data)
      this.getUserAuth(data.user_id)
      this.$message({
        type: 'success',
        message: '登录成功',
        offset: 60
      })
    },
    // 注册方法
    register (data) {
      this.$refs[data].validate(valid => {
        if (valid) {
          // if (!this.registrfa) {
          //   this.registrfa = true
          userPermissionApi
            .onRegister({
              data: {
                phone: this.registerForm.phone,
                code: this.registerForm.code,
                usage_code: 2,
                system_no: 'asset',
                user_type: this.user_type
              }
            })
            .then(
              res => {
                // this.registrfa = false
                // if (res.data.access_token) {
                if (res.code === 0) {
                  this.$message.success('注册成功')
                  this.status = 'passwordLogin'
                  this.registerForm.phone = ''
                  this.registerForm.code = ''
                }

                // }
              },
              err => {
                // this.pending = false
                console.log(err)
              }
            )
          // }
        }
      })
    },

    // 根据系统编号和授权码获取key
    getKey () {
      let authCode = process.env.AUTH_CODE
      userPermissionApi
        .getKey({
          data: {
            system_no: 'asset',
            auth_code: authCode
          }
        })
        .then(
          res => {
            console.log(res, 'get key')
            let data = res.data
            if (data.key) {
              window.sessionStorage.setItem('platformKey', data.key)
            }
            this.login()
          },
          err => {
            console.log(err)
          }
        )
    },
    // 根据域名获取单位信息
    getCompanyByDomain () {
      // let domain = location.host
      let domain = 'dev_platform_api.ihibuilding.cn'
      userPermissionApi
        .getCompanyByDomain({
          data: {
            domain_name: domain
          }
        })
        .then(
          res => {
            console.log(res, 'get company domain')
            window.localStorage.setItem(
              'companyInfo',
              JSON.stringify(res.data)
            )
            this.companyInfo = res.data
          },
          err => {
            console.log(err)
          }
        )
    },
    // token没失效执行的事件
    loginCreated () {
      userPermissionApi
        .login({
          data: this.loginForm
        })
        .then(res => {
          if (res.data.access_token) {
            window.localStorage.clear()
            this.$store.dispatch('resetActiveTabsList', [])
            window.localStorage.setItem('token', res.data.access_token)
            window.localStorage.setItem('user_id', res.data.user_id)
            this.$store.dispatch('setUserInfo', res.data)
            window.localStorage.setItem('userInfo', JSON.stringify(res.data))
            this.getUserInfoList(res.data)
            this.$router.push({ path: '/home' })
          }
        })
    },
    // 获取用户权限
    getUserAuth (userId) {
      userPermissionApi
        .getUserAuth({
          data: {
            user_id: userId
          }
        })
        .then(
          res => {
            console.log(res, 'get user auth')
            let userAuthList = res.data.list
            if (userAuthList) {
              this.$store.dispatch('setUserAuth', res.data.list)
            }

            this.$router.push({ path: '/home' })
          },
          err => {
            console.log(err)
          }
        )
    },
    // 切换登录方式
    toggleLoginMode (mode) {
      this.status = mode
      // console.log('status=', this.status)
      // this.$message('快捷登录=',  this.status);
    },
    // 切换登录或注册状态
    toggleLoginOrRegister (mode) {
      this.verifyCodeTimeout = 60
      this.verifyCodeDisabled = false
      this.verifyCodeBtnText = '获取验证码'
      clearInterval(this.verifyCodeTimeoutId)
      this.status = mode
    },
    // 获取登录验证码
    getLoginVerifyCode () {
      // 判断是否为手机号是否为空
      if (this.phoneLoginForm.phone === '') {
        this.$message('手机号不能为空')
      } else {
        if (
          this.phoneLoginForm.phone &&
          this.phoneLoginForm.phone.trim() !== ''
        ) {
          if (this.phoneLoginForm.phone.length !== 11) {
            this.$message('手机号长度不符合要求（11位）')
          } else {
            userPermissionApi
              .sendCode({
                data: {
                  phone: this.phoneLoginForm.phone,
                  usage_code: 1,
                  template_no: 'industry-0001',
                  system_no: 'asset',
                  user_type: this.user_type // 注册用户类型（3：单位管理员，4：普通用户）
                }
              })
              .then(
                res => {
                  if (res.code === 0) {
                    this.verifyCodeDisabled = true
                    this.verifyCodeInterval()
                  }
                  console.log(res, 'send login code')
                },
                err => {
                  console.log(err)
                }
              )
          }
        } else {
          this.$message.error('请输入有效手机号')
        }
      }
    },
    // 获取注册验证码
    getRegisterVerifyCode () {
      if (this.registerForm.phone === '') {
        this.$message('手机号不能为空')
      } else {
        if (this.registerForm.phone && this.registerForm.phone.trim() !== '') {
          if (this.registerForm.phone.length !== 11) {
            this.$message('手机号长度不符合要求（11位）')
          } else {
            userPermissionApi
              .sendCode({
                data: {
                  phone: this.registerForm.phone,
                  usage_code: 2,
                  template_no: 'industry-0001',
                  system_no: 'asset',
                  user_type: this.user_type // 注册用户类型（3：单位管理员，4：普通用户）
                }
              })
              .then(
                res => {
                  if (res.code === 0) {
                    this.verifyCodeDisabled = true
                    this.verifyCodeInterval()
                  }
                  console.log(res, 'send login code')
                },
                err => {
                  console.log(err)
                }
              )
          }
        } else {
          this.$message.error('请输入有效手机号')
        }
      }
    },
    // 开始倒计时
    verifyCodeInterval () {
      let timeout = setInterval(() => {
        if (this.verifyCodeTimeout === 1) {
          this.verifyCodeTimeout = 60
          this.verifyCodeDisabled = false
          this.verifyCodeBtnText = '获取验证码'
          clearInterval(this.verifyCodeTimeoutId)
        } else {
          this.verifyCodeTimeout--
          this.verifyCodeBtnText = '重新发送 ' + this.verifyCodeTimeout
        }
      }, 1000)
      this.verifyCodeTimeoutId = timeout
    },
    getUserInfoList (data) {
      userPermissionApi
        .getUserInfo({
          data: {
            user_id: data.user_id,
            dept_no: data.dept_no,
            org_no: data.org_no
          }
        })
        .then(
          res => {
            if (res.code === 0) {
              window.localStorage.setItem('userDetails', JSON.stringify(res.data))
            }
          },
          err => {
            console.log(err)
          }
        )
    }
  },
  async created () {
    // 获取二级域名
    this.hrefUrl = window.location.href
    var s = this.hrefUrl
    var h = s.split('.')[0]
    var a = h.split('//')[1]
    if (a === 'www' || a === 'WWW') {
      this.user_type = 3 // 管理
    } else {
      this.user_type = 4 // 普通
    }
    // await this.getCompanyByDomain()

    console.log('二级域名的类型=', this.user_type)

    // 判断token不为null的状态下直接进入页面
    if (window.localStorage.getItem('token') != null) {
      // this.$router.push({ path: '/home' })
      // this.loginCreated()
    } else {
      this.$router.push({ path: '/login' })
    }
  },
  mouted () { }
}
</script>
<style scoped lang='scss'>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-bg {
    width: 100%;
    height: 100vh;
    background: radial-gradient(
      circle,
      rgba(71, 117, 233, 1),
      rgba(20, 65, 179, 1)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .login-content {
    width: 100%;
    height: 420px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 80px;
    text-align: center;
    h2 {
      font-size: 28px;
      color: #1441b3;
      margin-bottom: 40px;
    }
    .login-logo {
      width: 54px;
      height: 76px;
      margin-bottom: 100px;
    }
    .login-form {
      width: 100%;
      .password {
        margin-bottom: 40px;
      }
      .login-mode {
        display: flex;
        justify-content: flex-start;
        span {
          font-size: 20px;
          color: #999;
          cursor: pointer;
          margin-right: 20px;
          &.active {
            color: #015293;
          }
        }
      }
      .el-form {
        height: 150px;
      }
      input {
        width: 100%;
        height: 34px;
        line-height: 34px;
        background-color: transparent !important;
        border: 0;
        border-bottom: 1px solid #999;
        color: #999;
        &:-internal-autofill-selected {
          background-color: #fff !important;
        }
        &:-webkit-autofill {
          // 覆盖浏览器自动填充默认样式
          -webkit-box-shadow: 0 0 0px 1000px white inset;
          -webkit-text-fill-color: #999;
        }
        &::-webkit-input-placeholder {
          color: #999;
        }
        &:focus {
          outline: 0;
          background-color: #fff !important;
        }
      }
    }
    .get-verify-btn {
      width: 120px;
      background-color: transparent;
      color: #1890ff;
      border: 0;
      border-radius: 0;
      font-size: 14px;
      position: absolute;
      top: 0;
      right: 0;
    }
    .primary-btn {
      width: 100%;
      height: 48px;
      background-color: #1890ff;
      font-size: 16px;
      color: #fff;
      border: 0;
    }
    .text-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      border: 0;
      margin: 0;
    }
  }
}
</style>
