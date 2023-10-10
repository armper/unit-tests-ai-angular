pipeline {
    agent any

    environment {
        OPENAI_API_KEY = credentials('openai-api-key') // Securely handle the OpenAI API key
    }

    stages {
        stage('Clean Workspace and Checkout') {
            steps {
                // Clean the Jenkins workspace
                deleteDir()
                echo 'Cleaned the Jenkins workspace.'

                // Checkout your code from the feature branch
                checkout scm
                echo 'Checked out the code.'
            }
        }

        stage('Analyze Changed Files') {
            steps {
                script {
                    // Get the list of changed files
                    sh 'git fetch'
                    sh 'git diff --name-only $GIT_PREVIOUS_COMMIT $GIT_COMMIT > changed_files.txt'
                    echo 'List of changed files:'
                    sh 'cat changed_files.txt'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install project dependencies
                sh 'npm install'
                echo 'Installed project dependencies.'
            }
        }

        stage('Generate Unit Test') {
            steps {
                script {
                    // Call a Python script to generate unit tests through OpenAI
                    sh 'python3 generate_tests.py'
                    echo 'Generated unit tests.'
                }
            }
        }

        stage('Run Generated Unit Tests') {
            steps {
                    // Run the Angular unit tests
                    sh 'ng test --watch=false'
                    echo 'Ran the generated unit tests.'
            }
        }

        stage('Build Project') {
            steps {
                // Build the Angular project
                sh 'ng build --configuration production'
                echo 'Built the Angular project.'
            }
        }

        stage('Commit and Push Generated Test') {
            steps {
                script {
            // ... [rest of your code before the checkout]

                    echo "checking out git branch: ${env.GIT_BRANCH}"
                    def localBranchName = env.GIT_BRANCH.split('/')[-1]
                    sh "git checkout -B ${localBranchName}"

            // ... [rest of your code between checkout and push]

                    sh """
            git pull --rebase
            git push https://$GIT_USERNAME:$GIT_PASSWORD@github.com/armper/unit-test-ai.git ${localBranchName}
            """

                    echo 'Committed and pushed the generated tests.'
                }
            }

        }

    // Other stages (e.g., deploy) as needed
    }
}
