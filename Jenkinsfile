pipeline {
    agent any
    stages {
        stage('Init') {
            steps {
                echo 'Testing..'
                telegramSend(message: 'Building Job Truysuat Web...', chatId: -4013555823)
            }
        }
        stage ('Deployments') {
            steps {
                echo 'Deploying to Production environment...'
                echo 'Copy project over SSH...'
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'swarm1',
                        transfers:
                            [sshTransfer(
                                cleanRemote: false,
                                excludes: '',
                                execCommand: "docker build -t registry.thinklabs.com.vn:5000/traceabilityweb ./thinklabsdev/traceabilitywebCI/ \
                                    && docker image push registry.thinklabs.com.vn:5000/traceabilityweb \
                                    && docker service rm traceability_web || true \
                                    && docker stack deploy -c ./thinklabsdev/traceabilitywebCI/docker-compose.yml traceability \
                                    && rm -rf ./thinklabsdev/traceabilitywebCIB \
                                    && mv ./thinklabsdev/traceabilitywebCI/ ./thinklabsdev/traceabilitywebCIB",
                                execTimeout: 6000000,
                                flatten: false,
                                makeEmptyDirs: false,
                                noDefaultExcludes: false,
                                patternSeparator: '[, ]+',
                                remoteDirectory: './thinklabsdev/traceabilitywebCI',
                                remoteDirectorySDF: false,
                                removePrefix: '',
                                sourceFiles: '*, src/, server/, webpack/'
                            )],
                        usePromotionTimestamp: false,
                        useWorkspaceInPromotion: false,
                        verbose: false
                    )
                ])
                telegramSend(message: 'Build Job Truysuat Web -STATUS: $BUILD_STATUS!', chatId: -4013555823)
            }
        }
    }
}
