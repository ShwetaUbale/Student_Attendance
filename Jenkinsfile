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
            sh '''
                # Stop container if it is currently running
                docker stop attendance-con || true

                # Remove container if it exists (running or stopped)
                docker rm attendance-con || true

                # Start the fresh container
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