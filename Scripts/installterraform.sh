#!/bin/bash

#Richard Deodutt
#09/22/2022
#This script is meant to install Terraform on ubuntu

#Source or import standard.sh
source libstandard.sh

#Name of main target
Name='terraform'

#Home directory
Home='.'

#Log file name
LogFileName="InstallTerraform.log"

#Set the log file location and name
setlogs

#The main function
main(){
    #Adding the Keyrings if not already
    wget -q -O - https://apt.releases.hashicorp.com/gpg | gpg --batch --yes --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg && logokay "Successfully installed ${Name} keyring" || { logerror "Failure installing ${Name} keyring" && exiterror ; }

    #Adding the repo to the sources of apt if not already
    sh -c 'echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" > /etc/apt/sources.list.d/hashicorp.list' && logokay "Successfully installed ${Name} repo" || { logerror "Failure installing ${Name} repo" && exiterror ; }

    #Update local apt repo database
    aptupdatelog

    #Install terraform if not already
    aptinstalllog "terraform"
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