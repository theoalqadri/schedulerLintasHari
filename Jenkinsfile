pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building the project...'
                // Example: Run a build command like below
                // sh 'npm install' or 'make build'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Example: Run tests
                // sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying the project...'
                // Example: Run deploy script
                // sh './deploy.sh'
                //testing
            }
        }
    }
}
