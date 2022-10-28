pipeline {
  agent any
  stages  {
    stage("Checkout") {
      steps {
        checkout(
          [$class: 'GitSCM',
          branches: [[name: GIT_BUILD_REF]],
          userRemoteConfigs: [[
            url: GIT_REPO_URL,
              credentialsId: CREDENTIALS_ID
            ]]]
        )
      }
    }
        
    // 下述演示的过程依赖于模板示例代码内容，您可以根据自己的实际情况调整构建过程

    stage('Install node_modules') {
      steps {
        sh "npm install"
      }
    }
    
    stage('Run linter') {
      // 测试框架需要构建环境中预装 Chromium 无头浏览器，在该阶段采用仓库内 Dockerfile 指定的镜像作为测试环境
      
      steps {
        sh "npm run lint"
      }
    }
  }
}