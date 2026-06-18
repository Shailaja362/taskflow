# Jenkins (local, free)

Run a local Jenkins with Docker access:

    docker compose -f jenkins/docker-compose.jenkins.yml up -d

Open http://localhost:8081 and unlock with:

    docker compose -f jenkins/docker-compose.jenkins.yml exec jenkins \
      cat /var/jenkins_home/secrets/initialAdminPassword

Install suggested plugins, then create a **Pipeline** job:
- Definition: "Pipeline script from SCM"
- SCM: Git -> point at your repo
- Script Path: Jenkinsfile

Because the container mounts the host Docker socket and runs Node via
`docker`, install the NodeJS plugin OR add a Docker agent. Simplest path
for learning: install Node inside the container or use the NodeJS plugin.
