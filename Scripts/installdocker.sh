#!/bin/bash

#Richard Deodutt
#11/15/2022
#This script is meant to install Docker on ubuntu

#Source or import standard.sh
source libstandard.sh

#Name of main target
Name='docker'

#Home directory
Home='.'

#Log file name
LogFileName="InstallDocker.log"

#Set the log file location and name
setlogs

#The main function
main(){
    #Adding the Keyrings if not already
    wget -q -O - https://download.docker.com/linux/ubuntu/gpg | gpg --batch --yes --dearmor -o  /usr/share/keyrings/docker.gpg && logokay "Successfully installed ${Name} keyring" || { logerror "Failure installing ${Name} keyring" && exiterror ; }

    #Adding the repo to the sources of apt if not already
    sh -c 'echo "deb [signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list' && logokay "Successfully installed ${Name} repo" || { logerror "Failure installing ${Name} repo" && exiterror ; }

    #Update local apt repo database
    aptupdatelog

    #Install docker-ce if not already
    aptinstalllog "docker-ce"

    #Install docker-ce-cli if not already
    aptinstalllog "docker-ce-cli"

    #Install containerd.io if not already
    aptinstalllog "containerd.io"

    #Install docker-compose-plugin if not already
    aptinstalllog "docker-compose-plugin"

    #Add 'ubuntu' user to the docker group so sudo is not required to run docker commands.
    sudo usermod -aG docker ubuntu

    #Use the new changes to the group docker
    #newgrp docker
}

#Log start
logokay "Running the install ${Name} script"

#Check for admin permissions
admincheck

#Call the main function
main

#Log successs
logokay "Ran the install ${Name} script successfully"

#Exit successs
exit 0