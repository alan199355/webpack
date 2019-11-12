var inquirer = require('inquirer');
let chalk = require('chalk');
var path = require('path');
var fs = require('fs');
let cwd = process.cwd();
let options = {}
var questions = [
  {
    type: 'list',
    name: 'type',
    message: '生成类型',
    choices: ['table', 'form']
  },
  {
    type: 'input',
    name: 'fileName',
    message: "页面名称"
  },
  {
    type: 'input',
    name: 'dirName',
    message: "所属模块",

  },

];
let tableQuestion = [
  {
    type: 'input',
    name: 'tableHead',
    message: '请输入表头名称'
  },
  {
    type: 'input',
    name: 'tableParam',
    message: '请输入表格参数名'
  },
  {
    type: 'input',
    name: 'tableData',
    message: '请输入表格对象名'
  }
]

let formQuestion = [
  {
    type: 'input',
    name: 'formName',
    message: '请输入表单名称',
  },
  {
    type: 'input',
    name: 'formParam',
    message: '请输入表单参数名'
  },
  {
    type: 'input',
    name: 'formData',
    message: '请输入表单对象名'
  }
]

inquirer.prompt(questions).then(answers => {

  options = Object.assign(options, answers)
  if (answers.type === 'table') {
    createTable()
  } else {
    createForm()
  }
  // checkDir(answers)
});

let createTable = () => {
  inquirer.prompt(tableQuestion).then(answers => {
    options = Object.assign(options, answers)
    checkDir()
    console.log(options)
  })
}

let createForm = () => {
  inquirer.prompt(formQuestion).then(answers => {
    options = Object.assign(options, answers)
    checkDir()
    console.log(options)
  })
}


let checkDir = () => {
  let dirPath = cwd + `/src/pages/${options.dirName}`
  fs.mkdir(dirPath, (err) => {
    // if (err) {
    //   throw err;
    // }
    checkFile()
  })
}


let checkFile = () => {
  let filePath = cwd + `/src/pages/${options.dirName}/${options.fileName}.vue`;

  fs.open(filePath, 'w+', (err, fd) => {
    if (err) {
      console.error(err);
      if (err.code === 'EEXIST') {
        console.error(chalk.red('文件已存在'));
        return;
      }
      if (err.code === 'ENOENT') {
        fs.mkdirSync(cwd + `/src/pages/${options.dirName}`, (err) => {
          if (err) {
            throw err;
          }
          writeFile();
        })

      }

      throw err;
    }

    console.log(fd, '12');
    writeFile(filePath);
  });
  let writeFile = () => {
    let data =
      `<template>
  <div class='${options.fileName.toLowerCase()}-container'>
  `+ renderTemplate() + `
 
  </div>
</template>
<script>
export default {
  data () {
    return {
      requestParam: {
        page: 1,
        page_size: 10
      },
     `+ renderDataTemplate() + `
    }
  },
  methods: {
    handlePageChange (page) {

    }
  },
  created () {

  },
  mouted () {

  }
}
</script>
<style scoped lang='scss'>
.${options.fileName.toLowerCase()}-container{
}
</style>
`
    fs.writeFile(filePath, data, err => {
      if (err) {
        console.error(chalk.red(err));
        throw err;
      }
      console.info(chalk.blue('生成成功'))
    });
  };
}

let renderDataTemplate = () => {
  if (options.type === 'table') {
    return `
      ${options.tableData}: {
        list: [],
        total_page: 0,
        total_count: 0
      }
    `
  } else if (options.type === 'form') {
    return `
      ${options.formData}: {
        `+ renderFormData() + `
        }
    `
  } else {
    return ``
  }
}
let renderFormData = () => {
  let paramList = options.formParam.split(',')
  let template = ``
  for (let i = 0; i < paramList.length; i++) {
    template += `     ${paramList[i]}: '',
    `
  }
  return template
}
let renderTemplate = () => {
  if (options.type === 'table') {
    return writeTable()
  } else if (options.type === 'form') {
    return writeForm()
  } else {
    return ``
  }
}

let writeForm = () => {
  let formTemplate = ``
  if (options.formName) {
    formTemplate = `
    <el-form :model='${options.formData}'
             label-width="100px">
      `+ renderForm() + `
    </el-form>
    `
    return formTemplate
  } else {
    return ``
  }
}

let renderForm = () => {
  let nameList = options.formName.split(',')
  let paramList = options.formParam.split(',')
  let template = ``
  for (let i = 0; i < nameList.length; i++) {
    template +=
      `
      <el-row>
        <el-col :span='12'>
          <el-form-item label='${nameList[i]}'
                        prop='${paramList[i]}'
                        required>
            <el-input v-model='${options.formData}.${paramList[i]}'>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    `
  }
  return template
}

let writeTable = () => {
  let tableTemplate = ``
  if (options.tableHead) {
    tableTemplate = `
    <el-table :highlight-current-row='true'
              :data='${options.tableData}.list'
              border>
      `+ renderTable() + `
    </el-table>
    <el-pagination @current-change='handlePageChange'
                  :current-page='requestParam.page'
                  :page-size='requestParam.page_size'
                  layout='total,sizes,prev, pager, next, jumper'
                  background
                  :total='${options.tableData}.total_count'
                  align='center'>
    </el-pagination>`
    return tableTemplate
  } else {
    return ``
  }
}
let renderTable = () => {
  let headList = options.tableHead.split(',')
  let paramList = options.tableParam.split(',')
  let template = ``
  for (let i = 0; i < headList.length; i++) {
    template +=
      `
      <el-table-column prop='${paramList[i]}'
                       label='${headList[i]}'
                       align='center'
                       show-overflow-tooltip>
      </el-table-column>`
  }
  return template
}
// Console.log(path.dirname(cwd + 'packages'));
