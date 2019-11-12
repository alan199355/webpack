#!/bin/bash

#服务器属性定义
REMOTE_SERVER="root@$1"
##环境
ENV=$2

##后端地址标志
API_ENV=$3


#系统属性定义
PROJECT_NAME="balance-front"
PROJECT_PATH="/home/gitlab-runner/front/$ENV/$PROJECT_NAME"

#远程路径定义
REMOTE_DEPLOY="/home/front/$PROJECT_NAME"

 
###初始化结束

echo "start deploy ..."

cd ${PROJECT_PATH}

echo "  $PROJECT_NAME publish!"
#建立远程目录


echo " start build files ...!"
cnpm install
if [ "$?" = "0" ]; then
 echo 'npm install sucess!'
else
 echo 'npm install fail!'
 exit 1
fi
cnpm  run $API_ENV
if [ "$?" = "0" ]; then
 echo 'npm run  sucess!'
else
 echo 'npm run  fail!'
 exit 1
fi

echo "build files finished!"

echo " start  transfer files ...!"


ssh $REMOTE_SERVER "[ -d ${REMOTE_DEPLOY} ] && echo ok || mkdir -p ${REMOTE_DEPLOY}"

#传输files到远程服务器
scp -r ${PROJECT_PATH}/dist/* $REMOTE_SERVER:$REMOTE_DEPLOY/

if [ "$?" = "0" ]; then
 echo 'publish files  sucess!'
else
 echo 'publish files   fail!'
 exit 1
fi

echo " transfer $files over!"



echo " deploy finished!"
