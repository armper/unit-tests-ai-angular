# Use the official Jenkins LTS image as the base
FROM jenkins/jenkins:lts

# Switch to the root user to install packages
USER root

# Install Maven, Python, Git, Node.js, npm, and the venv module
RUN apt-get update && \
    apt-get install -y maven python3 python3-pip python3-venv git curl npm libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0 && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs

# Verify that Node.js and npm were installed correctly
RUN node -v && npm -v
RUN npm install -g @angular/cli

# Create a virtual environment
RUN python3 -m venv /opt/venv

# Activate the virtual environment for subsequent commands
ENV PATH="/opt/venv/bin:$PATH"

# Install Python packages within the virtual environment
RUN pip3 install requests openai

# Switch back to the Jenkins user
USER jenkins
