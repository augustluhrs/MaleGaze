/* 
"Male Gaze (2018)" by August Luhrs
ITP Dec. 2018
thanks to the p5 --> arduino serial tutorials by Tom Igoe
the p5.serialserver by Shawn Van Avery
and zoomkat for the serial string ASCII wizardry
*/

#include <Servo.h>

Servo myservoT;
Servo myservoB; 


int pos = 0;

int incomingByte;
String readString;
int botX;
int topY;

void setup() {
  Serial.begin(9600);
  myservoT.attach(9);  //top
  myservoB.attach(8);  //bottom (horizontal)
  myservoT.write(0); //to start off to side
  myservoB.write(0);
}

void loop() {
  //this section thanks to zoomkat at https://forum.arduino.cc/index.php?topic=280297.0
  if (Serial.available())  { // need >0?
    char c = Serial.read();  //gets one byte from serial buffer
    if (c == ',') {
      if (readString.length() >1) {
        Serial.println(readString); //prints string to serial port out
        int n = readString.toInt();  //convert readString into a number
        
        Serial.print("writing Angle: ");
        Serial.println(n);
        if(readString.indexOf('X') >0) myservoB.write(n);
        if(readString.indexOf('Y') >0) myservoT.write(n);
      
        readString=""; //clears variable for new input
      }
    }  
    else {     
      readString += c; //makes the string readString
      // Serial.println(readString);
    }
  }
}
