<p align="center">
<a href="https://kuralabs.org/"><img src="https://github.com/kura-labs-org/kuralabs_deployment_1/blob/main/Kuralogo.png" />
</p>

<h1 align="center">FINAL_PROJECT</h1> 

# F.R.A.N.N.S GRADE TRACKER

## Overview:
- For our final project at Kura Labs, Group 3 created a F.R.A.N.N.S (acronym for team members  Faye Beerom-Henry, Richard Deodutt, Adreonnis Reyes, Nasir York, Nicole Narvarrete and Sterling McKinley) Grade Tracker application from scratch for future Kura Labs Cohort usage. We utilized a Continuous Integration and Continuous Deployment (CI/CD) pipeline to automate our software delivery process. We stored our code in GitHub, used GitHub Actions to build and test our application which was containerized with Docker and finally deployed into a production environment with infrastructure spun up by Terraform.

## Objectives:
- To demonstrate mastery of the CI/CD pipeline
- To deploy an application to a production environment
- To utilize and diagram infrastructure as code
- To build a system that can scale, is secure, and resilient
- To demonstrate effective project management 
- To adhere to a budget of $200 and follow a project timeline
- To communicate learning via presentation and demonstration

## Roles:
1. Nasir York- Project Manager: Coordinates all check-in meetings, manages the budget, monitors each team member’s progress, manages the communication platform, sets deadlines, evaluates the project, and makes final decisions.
2. Sterling McKinley- Administrator: Oversees IT accounts, permissions, and access to technology.
3. Nicole Navarrete- Chief Architect: Serves as lead technical architect and ensures cohesive final product. Serves as lead for the infrastructure, application, and pipeline design.

## The Application:
- The F.R.A.N.N.S Grade Tracker is an interactive web application with two main user audiences;  the students to view grades for assessments and administrators (such as instructors) to upload  grades to a database. Users must first register from the registration page and then proceed to login from the login page while administrator credentials are manually added in the database in the backend so they can navigate to the login page right away.

![image](https://github.com/SterlingMcKinley/FINAL_PROJECT/blob/nasir/Images/login.png)


- After logging in authentication is checked in the database and the user is redirected to either a student homepage or an instructor homepage. 

![image](https://github.com/SterlingMcKinley/FINAL_PROJECT/blob/nasir/Images/Student%20home%20old.png)

- The student **“Homepage”** greets the user and presents three line graphs with grades for each assessment type namely Build Scripts, Deployments and Diagnostics. If multiple takes were done, the grade for each take will be represented by a different line on the respective graph. 
- As the user hovers over the data points on a graph, the grade and take number will pop up.

- The student homepage also provides access to a menu with options to navigate to the Overview page, the Submissions page or to Logout.

![image](https://github.com/SterlingMcKinley/FINAL_PROJECT/blob/nasir/Images/Grades%20Overview.png)


- The **“Overview”** page includes the question “would you like to see all grades?”  When the user clicks the submit button, a table with all grades will be displayed.

![image](https://github.com/SterlingMcKinley/FINAL_PROJECT/blob/nasir/Images/Submission%20Page.png)

- The **“Submissions”** page includes the table of grades and assignments with scores.  If any of the boxes on the table is clicked, a dropdown textbox appears  for the uploading of scripts, github repository links or other submissions. After clicking the submission button at the bottom of the page, a popup message will appear confirming whether your submission was successful.

![image](https://github.com/SterlingMcKinley/FINAL_PROJECT/blob/nasir/Images/Logout.png)

- The **“Logout”** button takes the user back to the login page.


- When an instructor logs in, the instructor is redirected to the admin **"Dashboard"** page  which is connected to an Adminer database management tool. From this page, all student information and assessment data can be viewed and edited by the instructor.  In addition, the instructor has the option to logout from this page.

![image](https://github.com/SterlingMcKinley/FINAL_PROJECT/blob/nasir/Images/Admin%20Page.png)
