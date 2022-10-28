pipeline {
  agent {
        docker {
            image 'node:14' 
        }
    }
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
        
    stage('Install node_modules') {
      steps {
        sh "yarn install"
      }
    }
    stage('Install dependencies') {
      steps {
        sh "yarn"
      }
    }
    stage('Run linter') {
      steps {
        sh "yarn run lint"
      }
    }
  }
}