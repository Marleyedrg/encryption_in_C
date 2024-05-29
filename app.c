// Documentation 
/**                      
 * file: app.c 
 * author: Marley 
 * description: implementation of the encryption in C language based on the Enigma machine.
 */

// Link 
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>

// Definition 

// Global Declaration 
char rotor1 = 1;
char rotor2 = 1;
char rotor3 = 1;

int usage(int error);
int rotor(int position,char letter,int counter);
int reflector(int letter);

// Main() Function 
int main(int argc, char *argv[]) {
    if (argc > 5)
    {
        return usage(1);
    }
    if(argc > 2){
        // Create an array of pointers that point to variables
        char *rotors[] = {&rotor1, &rotor2, &rotor3};

        for (int i = 0, value; i < 3; i++) {
            value = atoi(argv[i + 2]);
            // Check if the value is within the valid range
            if (value > 26 || value < 1) {
                return usage(1);
            }
            // Assign the value to the corresponding variable using the pointer array
            *(rotors[i]) = value;
        }
    }else{
        printf("[DEFAULT]1 1 1\n");
    }
      
    char *phrase = argv[1]; 

    for (int i = 0,counter = 0;phrase[i] != '\0'; i++)
    {
        char currentLetter = phrase[i];
        if(isdigit(currentLetter) != 0){
           return usage(2);
        }
        if (!isalpha(currentLetter))
        {
            return usage(2);
        }
        
        if (currentLetter >= 'a' && currentLetter  <= 'z') {
        currentLetter -= 32;//TO upperCase
        }

        for (int i = 0, arr[] = {rotor1 ,rotor2 ,rotor3}; i < 3; i++)
        {
            currentLetter = rotor(arr[i],currentLetter,counter);
            if(i != 2)
            {
                counter+=1;
                if (counter > 26)
                {
                    counter = counter - 26;
                    //Prevents the lap counter from exceeding 26, acting as a gear, returning the cycle
                }
            }
        }
        phrase[i] = reflector(currentLetter);
    }
    char *str = phrase;
   
    printf(">> %s\n",phrase);

    return 0;
}

// Subprogram 
int usage(int error){
    switch (error)
    {
    case 1:
        printf("Usage: <message> <rotor1(1 to 26)> <rotor2(1 to 26)> <rotor3(1 to 26)>\n");
        break;
    case 2:
        printf("ERROR, JUST CHARACTERS!!!");
        break;
    default:
        printf("Unrecognized Error!!!");
    }
    return error;
}

int rotor(int position,char letter,int counter){
    if(position == 0){
        return letter;
    }
//Moment that ends the cycle of one gear and adds an additional rotor to the next gear, in this case, any multiple of 2
    if(counter % 2 == 0 && counter != 0)
    {
        rotor2++;
//Moment that ends the cycle of one gear and adds an additional rotor to the next gear, in this case, any multiple of 3
    }else if (counter % 3 == 0 && counter != 0)
    {
        rotor3++;
    }

     if (rotor2 > 26)
    {
        rotor2 = rotor2 - 26;//Prevents rotor from exceeding 26
    }
    if (rotor3 > 26)
    {
        rotor3 = rotor3 - 26;//Prevents rotor from exceeding 26
    }
            
    letter = letter + position;
    if(letter > 90){
        letter = letter-26;//Prevents the letter from leaking through the sum of the rotor
    }

    return letter;
}

int reflector(int letter){
        letter = letter + 25;

        if(letter > 90){
            letter = 90-(letter-90);
            //"Reflects the letter"
            //This prevents the 'char' from leaking out of the ASCII space of the alphabet, creating a loop
        }

        return letter;
}
