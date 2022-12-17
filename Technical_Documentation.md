<p align="center">
<a href="https://kuralabs.org/"><img src="https://github.com/kura-labs-org/kuralabs_deployment_1/blob/main/Kuralogo.png" />
</p>

<h1 align="center">F.R.A.N.N.S Grade Tracker</h1> 

# Technical Documentation

## Proposal & System Design: 
- For our final project Team F.R.A.N.N.S decided that we would create a grade tracking application that future cohort students could use in order to track their assignments progress throughout Kura Labs. Despite it requiring an enormous amount of effort, as a group we decided that we wanted to create the entire application from scratch. 
- On the front end we utilized HTML, CSS and Javascript to connect to the back end API of the application where containers of our pieced out application (the frontend, backend, MySQL database, user interface tool to interact with the database Adminer, and nginx acting as a reverse proxy) were hosted in the private subnet of a Virtual Private Cloud we created with Terraform. 
- Throughout the CICD pipeline we utilize various monitoring tools in GitHub Actions and Cloudwatch/SNS that triggers emails for configured alarm settings. 
- The application infrastructure will scale based on traffic and account for fault tolerance with duplicate containers being hosted on two availability zones.

## Diagram:

## Tech Stack:
Frontend Framework
- HTML, CSS, Javascript
- Nginx

Backend Frameworks
- Python
- Flask
Services 
- AWS (IAM, ECS, S3, (RDS or Aurora))
- GitHub (Actions, Secrets*)
- Docker / Docker Hub
- Terraform

Monitoring and performance tools
- Cloudwatch

Data storage and querying
- RDS
- MySQL
- Adminer

# Elements: 

## GitHub:
- We created a GitHub repository for our code and had a main production branch, a staging branch and individual branches for each engineer. The best practices we utilized to update code was to make edits locally and utilize Git commands to merge to our respective remote branches. 
- When ready to add changes to the staging branch we would make a pull request. Once we had run the application in the staging environment and were ready to push into the production branch, we would make a pull request from the staging branch to the production branch.

### GitHub Notifications
	
- In our individual GitHub account settings we configured for notifications to be sent to our emails whenever a pull request was made or a workflow was run in our project repository. This allowed for the team to be aware when changes were being made to our staging and productions branches as well as when workflows were being deployed in our staging and production environments.

### GitHub Projects

- GitHub Projects is a team management platform we used to monitor our project throughout its lifetime by creating and assigning tickets to engineers. Tickets were moved to various columns throughout their lifecycle to reflect urgency and status of completion. 

### GitHub Actions (Environments)

- GitHub Actions builds and tests our pipeline by having virtual machine runners do jobs that we specified, these workflows include installing terraform and docker and all dependencies needed, pull images from Docker Hub and create containers all while deployed. 
- In GitHub Actions we were able to create a staging and two production environments (the primary in the east region and the second in the west region in case of failover Route 53 will direct traffic there) and in the jobs specify the staging or production branches for their respective environments. 

## Monitoring & Alerting:
- In order to keep track of our application we are using Cloudwatch as well as SNS alerts. With Cloudwatch we can monitor the status of different components within our infrastructure as well as insights for each container.

## Containers:
- Within AWS Fargate our containers are able to communicate using a local container network. Our application uses 6 different containers to run the application and they are the following:
 
- Nginx Container (A reverse proxy that redirects traffic to gain access to the frontend and backend microservices containers
- Front End Container (Serves the html page)
- Backend User Microservice (Houses the logic to create, read, update, and delete users in the database and login users by creating a session with an API access key to access web pages that require permission to enter)
- Backend Assignment Microservice (API backend for assignments as well as their grades and usernames. 
- Adminer Container (User interface tool to easily access and manage the database)

## AWS IAM:
- We used AWS IAM to create User accounts for everyone in our team as well as an admin account to grant our terraform file permission to spin up infrastructure via Terraform. We also needed to create an execution role for ECS to run our images from Docker Hub.

## Github Secrets: 
- In order to keep our credentials secured within our pipeline we used GitHub Secrets. With secrets we can place our credentials within a variable on GitHub so it can be accessed by the pipeline without being visible. 
- Some of the secrets were configured within the repo and some were configured within the environments (staging and the two production environments for the east and west US regions). 
- Since we utilized GitHub Secrets for our pipeline to run we had to create​​ specific environment keys for each stage to use. There were some authentication keys we could make as repository and not environment keys since they were not unique to specific branches.

## Docker/DockerHub:
- Docker was installed and used to pull our application images from DockerHub and containerize them. 
- We had two separate DockHub accounts, one with images specifically for the staging environment and another for production use. 

## Terraform:
- Within the terraform section in our repository there are 6 folders for different parts of our infrastructure.
- We have 3 cluster folders for all of the aws infrastructure in deployment. There’s one we used for staging and two for production. 
- We have two database folders for our RDS databases in Production and Staging. 
- Finally we have a folder with all terraform files for an S3 bucket in which our statefile.tf will be stored. Depending on whether the pipeline is in a staging or one of the two production environments the same infrastructure and bucket will be made but with different names to those created in the production environment. In addition each branch will have a different statefile.tf which will be stored in their respective S3 buckets. 

## Production vs. Staging:
- When working on our application we had a total of 8 branches that we made contributions to. One branch for each member of our group to post changes, a Staging branch, and a branch for Production. 
- Whenever someone in our group wanted to add to the application, they needed to first make the change on their local machine and with Git push their changes to their assigned branch. After pushing to their branch they can then create a pull request for their changes to be added to the staging branch. Once we were ready to deploy into production we would do a pull request from the staging to the main branch.

## Pipeline:
- For our pipeline we used Github actions to create our infrastructure for our application.
- We have 4 workflows within our pipeline. These workflows include Build and Test, Deploy Cluster, Init Remote Statefile, and Release Cluster.	
- For the **Build and Test** workflow Github runs an install docker and install terraform script. Since Github Actions provisions a new virtual machine for each work both Docker and Terraform need to be installed at the start of the workflow. After each program is installed then it runs a unit test for the application. 
- The **Init Remote Statefile** workflow creates an S3 bucket and a table to store our state file. This file has the current state of our infrastructure and is used to get to the desired infrastructure state.
- The **Deploy Cluster** is used to deploy the necessary components for the application to run and function. The workflow starts by downloading Docker and Terraform. It then uses the credentials for Docker Hub to log in and creates 6 images. After the images are created they are then pushed to Docker Hub. The Last step that is executed is the formation of the infrastructure using Terraform.  
- The **Release Cluster** workflow is used to destroy the entire infrastructure within staging.

# Takeaways:
#### Private to Public GitHub Repository

- We initially had a private repository in order to hide our application files from the public, but we ran into issues where we weren’t allowed to create repository staging and development environments unless we made the repository public, so we did. We needed  ​​environments in order for GitHub Actions to run the staging and production pipelines separately. We also needed to make separate staging and production branches to specify from where GitHub Action runners should pull code from when in each environment. 

#### Secret Keys

- Our code utilized Secret Keys placeholders for security of sensitive information. We had a few repository secrets that could be used by both environments but we had to ensure we made environment specific keys that would differentiate the resources, names and credentials used in staging and production. 

#### Alarms

- With Cloudwatch we were able to collect metrics from our containers and create a memory and CPU task that with Container insights enabled would track if our containers were below or over a certain threshold we configured in Terraform. We set up a Simple Notification System to then send an email to our group email teamfranns@gmail.com.

#### Changing Steps to Jobs in Deploy Cluster Workflow on GitHub Actions

- For our Deploy Cluster Workflow on GitHub Actions we had run the workflow with steps, meaning each action was run one at a time. This meant that this workflow took up to 10 minutes to complete. The solution to cut time was to create jobs that ran simultaneously, in this workflow images could then be made at the same time and pushed at the same time opposed to one by one. You can see this in the first box in the diagram below.  

#### Failover Routing with Route 53

- When navigating to our application url (http://app.team.franns.net) traffic will by default be routed to the east region (http://east.team.franns.net) but if there is ever a failover in that region, Route 53 know that is down through it’s health checks and automatically reroute to the west region (http://west.team.franns.net) as you can see in the diagram below. 

#### Domain Name Service Hosted Zone

- When buying a DNS for our application we ran into issues registering as our account was under Kura Lab’s AWS. Therefore Kura Labs had to buy the DNS and add hosted zones we created for us to route our application to the DNS teams.franns.net. 



