FROM jenkins/jenkins:lts-jdk17
USER root
# Install the Docker CLI (not the daemon — we use the host's via the mounted socket)
RUN apt-get update && apt-get install -y docker.io && rm -rf /var/lib/apt/lists/*
# Let the jenkins user access the mounted docker socket
RUN groupadd -f docker && usermod -aG docker jenkins
USER jenkins