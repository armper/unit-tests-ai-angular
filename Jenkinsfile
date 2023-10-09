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

        stage('Run Generated Unit Tests') {
            steps {
                    // Run the Angular unit tests
                    sh 'ng test --watch=false'
                    echo 'Ran the generated unit tests.'
              
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
                    // Read the paths from the file
                    def testFilePaths = readFile('generated_test_path.txt').trim().split('\n')

                    // Convert the array to a List if it's a primitive array
                    if (testFilePaths instanceof String[]) {
                        testFilePaths = testFilePaths.toList()
                    }

                    if (testFilePaths.isEmpty() || (testFilePaths.size() == 1 && testFilePaths[0].isEmpty())) {
                        echo 'No files to commit and push.'
                    } else {
                        testFilePaths.each { path ->
                            if (path.trim()) { // Check if the path is not empty or just whitespaces
                                echo "Path to the generated test file: ${path}"

                                // Set Git user name and email
                                sh 'git config user.email "aleoperea@yahoo.com"'
                                sh 'git config user.name "Jenkins AI"'

                                // Add the file to git
                                sh "git add ${path}"

                                // Commit
                                sh 'git commit -m "Add or update generated unit test for feature XYZ"'
                            } else {
                                echo 'Skipping empty path.'
                            }
                        }

                          // Use credentials to pull the latest changes and then push
            withCredentials([usernamePassword(credentialsId: 'github-password', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                sh '''
                    git stash  # Stash any unstaged changes
                    git pull --rebase https://$GIT_USERNAME:$GIT_PASSWORD@github.com/armper/unit-test-ai.git main
                    git stash pop  # Apply the stashed changes
                    git push https://$GIT_USERNAME:$GIT_PASSWORD@github.com/armper/unit-test-ai.git HEAD:main
                '''
            }

                        echo 'Committed and pushed the generated tests.'
                    }
                }
            }
        }

        // Other stages (e.g., deploy) as needed
    }
}
