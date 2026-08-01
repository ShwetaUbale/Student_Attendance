pipeline {
    agent any

    environment {
        APP_NAME = 'student-attendance'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t attendance:latest .'
                }
            }
        }

        stage('Run Application Container') {
            steps {
                script {
                    // Stop and remove existing container if running
                    sh 'docker stop attendance-con || true'
                    sh 'docker rm attendance-con || true'
                    // Run new container on port 3000
                    sh 'docker run -d --name attendance-con -p 3000:3000 attendance:latest'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check logs.'
        }
    }
}