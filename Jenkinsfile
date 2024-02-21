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

    /*     stage('Install Dependencies') {
            steps {
                // Install project dependencies
                sh 'npm install'
                echo 'Installed project dependencies.'
            }
        } */

        stage('Generate Unit Test') {
            steps {
                script {
                    // Call a Python script to generate unit tests through OpenAI
                    sh 'python3 generate_tests.py'
                    echo 'Generated unit tests.'
                }
            }
        }

    /*     stage('Run Generated Unit Tests') {
            steps {
                    // Run the Angular unit tests
                    sh 'ng test --watch=false'
                    echo 'Ran the generated unit tests.'
            }
        } */
/* 
        stage('Build Project') {
            steps {
                // Build the Angular project
                sh 'ng build --configuration production'
                echo 'Built the Angular project.'
            }
        } */

          stage('Commit and Push Generated Test') {
            steps {
                script {
                        // Use Jenkins environment variable to get the branch name
            def currentBranch = env.BRANCH_NAME ?: env.GIT_BRANCH.split('/')[-1]
            echo "Current branch is ${currentBranch}"

            // Define the unit test branch name
            def unitTestBranch = "${currentBranch}-unitTest"
            echo "Unit test branch will be ${unitTestBranch}"

                    // Fetch all branches from remote to update local info
                    sh 'git fetch'

                    // Check if the unit test branch exists on the remote
                    def branchExists = sh(script: "git ls-remote --heads origin ${unitTestBranch}", returnStatus: true) == 0
                    if (branchExists) {
                        // Checkout the existing remote unit test branch
                        sh "git checkout ${unitTestBranch}"
                    } else {
                        // Create and checkout a new local branch
                        sh "git checkout -b ${unitTestBranch}"
                    }

                    // Read the paths from the file
                    def testFilePaths = readFile('generated_test_path.txt').trim().split('\n')
                    if (testFilePaths instanceof String[]) {
                        testFilePaths = testFilePaths.toList()
                    }

                    if (!testFilePaths.isEmpty() && !(testFilePaths.size() == 1 && testFilePaths[0].isEmpty())) {
                        testFilePaths.each { path ->
                            if (path.trim()) {
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

                        // Use credentials to push to the unit test branch, specifying the full branch reference
                        withCredentials([string(credentialsId: 'github-password', variable: 'GITHUB_TOKEN')]) {
                            sh "git push https://${env.GITHUB_TOKEN}@github.com/armper/unit-test-ai.git ${unitTestBranch}:${unitTestBranch}"
                        }

                        echo 'Committed and pushed the generated tests to the unit test branch.'
                    } else {
                        echo 'No files to commit and push.'
                    }
                }
            }
        }

    // Other stages (e.g., deploy) as needed
    }
}
