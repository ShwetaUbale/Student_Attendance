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
                    sh '''
                        if docker ps -q --filter "name=attendance-con" | grep -q .; then
                            docker stop attendance-con
                            docker rm attendance-con
                        fi
                        docker run -d --name attendance-con -p 3100:3000 attendance:latest
                    '''
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