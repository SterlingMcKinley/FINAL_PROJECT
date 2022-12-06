#!/bin/bash

#Richard Deodutt
#09/23/2022
#This script is meant to have standard functions for ubuntu

#Home directory
Home='.'

#Log file name
LogFileName="Standard.log"

#Log file location and name
LogFile=$Home/$LogFileName

#Color output, don't change
Red='\033[0;31m'
Green='\033[0;32m'
Yellow='\033[0;33m'
#No color output, don't change
NC='\033[0m'

#Set the LogFile variable
setlogs(){
    #Combine Home and Logfilename
    LogFile=$Home/$LogFileName
}

#function to get a timestamp
timestamp(){
    #Two Different Date and Time Styles
    #echo $(date +"%m/%d/%Y %H:%M:%S %Z")
    echo $(date +"%a %b %d %Y %I:%M:%S %p %Z")
}

#function to log text with a timestamp to a logfile
log(){
    #First arugment is the text to log
    Text=$1
    #Log with a timestamp
    echo "`timestamp` || $Text" | tee -a $LogFile
}

#Print to the console in colored text
colorprint(){
    #Argument 1 is the text to print
    Text=$1
    #Arugment 2 is the color to print
    Color=$2
    printf "${Color}$Text${NC}\n"
}

#Print text in the green color for okay
printokay(){
    #Argument 1 is the text to print
    Text=$1
    #Green color to print
    Color=$Green
    #Echo the colored text
    echo $(colorprint "$Text" $Color)
}

#Print text in the yellow color for warning
printwarning(){
    #Argument 1 is the text to print
    Text=$1
    #Yellow color to print
    Color=$Yellow
    #Echo the colored text
    echo $(colorprint "$Text" $Color)
}

#Print text in the red color for error
printerror(){
    #Argument 1 is the text to print
    Text=$1
    #Red color to print
    Color=$Red
    #Echo the colored text
    echo $(colorprint "$Text" $Color)
}

#Log with print okay
logokay(){
    #Argument 1 is the text to print
    Text=$1
    #Log with okay or green text color
    log "$(printokay "$Text")"
}

#Log with print warning
logwarning(){
    #Argument 1 is the text to print
    Text=$1
    #Log with warning or yellow text color
    log "$(printwarning "$Text")"
}

#Log with print error
logerror(){
    #Argument 1 is the text to print
    Text=$1
    #Log with error or red text color
    log "$(printerror "$Text")"
}

#Function to exit with a error code
exiterror(){
    #Log error
    logerror "Something went wrong. exiting"
    #Exit with error
    exit 1
}

#Run as admin only check
admincheck(){
    #Check if the user has root, sudo or admin permissions
    if [ $UID != 0 ]; then
        #Send out a warning message
        logwarning "Run again with admin permissions"
        #Exit with a error message
        exiterror
    fi
}

#Run a command and exit if it has a error
cmdrunexiterror(){
    #Argument 1 is the command to run
    Command=$1
    #Argument 2 is the success message
    Okay=$2
    #Argument 3 is the failure message
    Fail=$3
    "$Command" > /dev/null 2>&1 && logokay "$Okay" || { logerror "$Fail" && exiterror ; }
}

#Function to log if a apt update succeeded or failed
aptupdatelog(){
    #Update local apt repo database
    apt-get update > /dev/null 2>&1 && logokay "Successfully updated repo list" || { logerror "Failure updating repo list" && exiterror ; }
}

#Function to log if a apt install succeeded or failed
aptinstalllog(){
    #First arugment is the apt package to log
    Pkg=$1
    #Install using apt-get if not already then log if it fails or not and exit if it fails
    DEBIAN_FRONTEND=noninteractive apt-get install $Pkg -y > /dev/null 2>&1 && logokay "Successfully installed $Pkg" || { logerror "Failure installing $Pkg" && exiterror ; }
}

#Don't Log successs as it goes to the Standard.log
#logokay "Successfully imported standard"
#No exit successs as it breaks import
#exit 0