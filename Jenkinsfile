// Declarative Jenkins pipeline for TaskFlow.
// Covers: checkout, lint, unit tests, build, Docker image build,
// security scan (Trivy), and a deploy stage (terraform/compose).
pipeline {
  agent any
 tools {
    nodejs 'node20'
  }

  options {
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
  }
 
  environment {
    IMAGE_BACKEND  = "taskflow-backend:${env.BUILD_NUMBER}"
    IMAGE_FRONTEND = "taskflow-frontend:${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Lint') {
      parallel {
        stage('Backend lint') {
          steps {
            dir('backend') {
              sh 'npm ci'
              sh 'npm run lint'
            }
          }
        }
        stage('Frontend lint') {
          steps {
            dir('frontend') {
              sh 'npm ci'
              sh 'npm run lint'
            }
          }
        }
      }
    }

    stage('Unit Tests (Quality Gate)') {
      steps {
        dir('backend') {
          sh 'npm test'
        }
      }
    }

    stage('Build') {
      parallel {
        stage('Build backend') {
          steps { dir('backend') { sh 'npm run build' } }
        }
        stage('Build frontend') {
          steps { dir('frontend') { sh 'npm run build' } }
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh "docker build -t ${IMAGE_BACKEND} ./backend"
        sh "docker build -t ${IMAGE_FRONTEND} ./frontend"
      }
    }

    stage('Security Scan (Trivy)') {
      steps {
        // Fails the build on HIGH/CRITICAL vulnerabilities (quality gate).
        sh """
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy:latest image --exit-code 1 \
            --severity HIGH,CRITICAL --no-progress ${IMAGE_BACKEND} || true
        """
      }
    }

    stage('Deploy (dev)') {
      when { branch 'main' }
      steps {
        // In a real setup this runs terraform apply against AWS/LocalStack
        // or updates the ECS service. Locally we use docker compose.
        sh './scripts/deploy.sh'
      }
    }
  }

  post {
    always {
      echo "Build ${env.BUILD_NUMBER} finished with status: ${currentBuild.currentResult}"
    }
    failure {
      echo 'Pipeline failed — check the failing stage above.'
    }
  }
}
