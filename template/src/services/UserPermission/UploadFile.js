import { openBuildService } from '../../helper/service'

// 值类型为String或Object,String为url(method),Object同axios(config)参数支持相同,data和params只能为对象类型
const settings = {
  // 上传文件
  uploadFile: {
    url: '/api/v1/base/file/upload_file',
    method: 'post'
  }

}

export default openBuildService(settings)
