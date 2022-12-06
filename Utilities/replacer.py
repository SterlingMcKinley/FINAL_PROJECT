#!/usr/bin/python3

#Richard Deodutt
#11/11/2022
#This script is meant to replace a placeholder in a file with a value

#First argument is the input file
#Second argument is the output file
#Third argument is the place holder
#Fourth arugment is the value


#For getting commandline arguments
import sys

#For checking if the file exists
from os.path import exists

#Get CMD line arguments
def getargs():
    try:
        #Get the input file name
        IFile = str(sys.argv[1])
        #Get the output file name
        OFile = str(sys.argv[2])
        #Check if the input file is valid
        assert exists(IFile)
        #Get the placeholder
        Placeholder = str(sys.argv[3])
        #Get the value
        Value = str(sys.argv[4])
        #Return the values as a dicr
        return {"input":IFile, "output":OFile, "placeholder":Placeholder, "value":Value}
    except:
        #Error with the above
        print("Error getting arguments")
        print("First argument is the input file")
        print("Second argument is the output file")
        print("Third argument is the place holder")
        print("Fourth arugment is the value")
        #Stop the program
        exit(1)

#Replace all placeholders with values
def replace(Args):
    try:
        #The file contents
        FileContents = ""
        #Open the file and read the file contents
        with open(Args["input"], 'r', encoding = 'utf-8') as File:
            FileContents = File.read()
        #Replace the file content placeholders with the values
        FileContents = FileContents.replace(Args["placeholder"], Args["value"])
        #Open the file and write the file contents
        with open(Args["output"], 'w', encoding = 'utf-8') as File:
            File.write(FileContents)
    except:
        #Error with the above
        print("Error replacing placeholders")
        #Stop the program
        exit(2)

#The main program
def main():
    #Get the CMD line arguments
    Args = getargs()
    #Replace the placeholders with values
    replace(Args)

#Calls the main program if this script is run directly
if __name__ == "__main__":
    main()