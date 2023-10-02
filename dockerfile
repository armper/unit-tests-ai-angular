# Use the official Jenkins LTS image as the base
FROM jenkins/jenkins:lts

# Switch to the root user to install packages
USER root

# Install Maven, Python, Git, and the venv module
RUN apt-get update && \
    apt-get install -y maven python3 python3-pip python3-venv git && \
    rm -rf /var/lib/apt/lists/*

# Create a virtual environment
RUN python3 -m venv /opt/venv

# Activate the virtual environment for subsequent commands
ENV PATH="/opt/venv/bin:$PATH"

# Install Python packages within the virtual environment
RUN pip3 install requests openai

# Switch back to the Jenkins user
USER jenkins
