#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>
#include <Adafruit_MPR121.h>
#include <vector>
#include <map>
#include <string>

// include SPI, MP3 and SD libraries
#include <SPI.h>
#include <SD.h>
#include <Adafruit_VS1053.h>

// These are the pins used
#define VS1053_RESET   -1     // VS1053 reset pin (not used!)

// Feather ESP32
#if defined(ESP32) && !defined(ARDUINO_ADAFRUIT_FEATHER_ESP32S2)
  #define VS1053_CS      32     // VS1053 chip select pin (output)
  #define VS1053_DCS     33     // VS1053 Data/command select pin (output)
  #define CARDCS         14     // Card chip select pin
  #define VS1053_DREQ    15     // VS1053 Data request, ideally an Interrupt pin

// Feather M4, M0, 328, ESP32S2, nRF52840 or 32u4
#else
  #define VS1053_CS       6     // VS1053 chip select pin (output)
  #define VS1053_DCS     10     // VS1053 Data/command select pin (output)
  #define CARDCS          5     // Card chip select pin
  // DREQ should be an Int pin *if possible* (not possible on 32u4)
  #define VS1053_DREQ     9     // VS1053 Data request, ideally an Interrupt pin

#endif


Adafruit_VS1053_FilePlayer musicPlayer =
  Adafruit_VS1053_FilePlayer(VS1053_RESET, VS1053_CS, VS1053_DCS, VS1053_DREQ, CARDCS);

Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();
Adafruit_MPR121 touchSensor = Adafruit_MPR121();

#define HEAD_SERVO_NUM 0
#define HEAD_SERVO_MIN 150
#define HEAD_SERVO_MAX 600

#define HAND_SERVO_NUM 2
#define HAND_SERVO_MIN 150
#define HAND_SERVO_MAX 600

#define TAIL_SERVO_NUM 4
#define TAIL_SERVO_MIN 150
#define TAIL_SERVO_MAX 600

// Proper map initialization
std::map<int, std::string> touchSensorMap = {
  {0, "head"},
  {1, "ear_left"},
  {2, "ear_right"},
  {4, "belly"},
  {8, "back"}
};

std::map<std::string, std::vector<std::string>> actionMap = {
  {"head", {"headMove"}},
  {"ear_left", {"handMove"}},
  {"ear_right", {"handMove"}},
  {"belly", {"angrySound", "tailMove"}},
  {"back", {"meowSound", "tailMove"}}
};

std::vector<bool> prevTouched(12, false);
std::vector<bool> currentTouched(12, false);

void setup() {
  Serial.begin(115200);
  while (!Serial);

  Serial.println("Starting PWM Servo Test");

  if (!touchSensor.begin(0x5A)) {
    Serial.println("MPR121 not found, check wiring?");
    while (1);
  }
  Serial.println("MPR121 found");

  if (pwm.begin()) {
    Serial.println("PWM begun");
  } else {
    Serial.println("Failed to start PWM");
  }

  if (! musicPlayer.begin()) { // initialise the music player
    Serial.println(F("Couldn't find VS1053, do you have the right pins defined?"));
    while (1);
 }
 Serial.println(F("VS1053 found"));

 if (!SD.begin(CARDCS)) {
    Serial.println(F("SD failed, or not present"));
    while (1);  // don't do anything more
  }
  Serial.println("SD OK!");

  // list files
  printDirectory(SD.open("/"), 0);

  // Set volume for left, right channels. lower numbers == louder volume!
  musicPlayer.setVolume(10,10);

  pwm.setPWMFreq(50); // 50 Hz for servos
  delay(10);
}

void headMove() {
  Serial.println("head move");
  for (uint16_t pulselen = HEAD_SERVO_MIN; pulselen < HEAD_SERVO_MAX; pulselen++) {
    pwm.setPWM(HEAD_SERVO_NUM, 0, pulselen);
  }
  delay(200);
  for (uint16_t pulselen = HEAD_SERVO_MAX; pulselen > HEAD_SERVO_MIN; pulselen--) {
    pwm.setPWM(HEAD_SERVO_NUM, 0, pulselen);
  }
  delay(200);
}

void handMove() {
  Serial.println("hand move");
  for (uint16_t pulselen = HAND_SERVO_MIN; pulselen < HAND_SERVO_MAX; pulselen++) {
    pwm.setPWM(HAND_SERVO_NUM, 0, pulselen);
  }
  delay(200);
  for (uint16_t pulselen = HAND_SERVO_MAX; pulselen > HAND_SERVO_MIN; pulselen--) {
    pwm.setPWM(HAND_SERVO_NUM, 0, pulselen);
  }
  delay(200);
}

void tailMove() {
  Serial.println("tail move");
  for (uint16_t pulselen = TAIL_SERVO_MIN; pulselen < TAIL_SERVO_MAX; pulselen++) {
    pwm.setPWM(TAIL_SERVO_NUM, 0, pulselen);
  }
  delay(200);
  for (uint16_t pulselen = TAIL_SERVO_MAX; pulselen > TAIL_SERVO_MIN; pulselen--) {
    pwm.setPWM(TAIL_SERVO_NUM, 0, pulselen);
  }
  delay(200);
}

void loop() {
  uint16_t touched = touchSensor.touched();
  std::vector<std::string> actions;
  int touchedSensorNum = -1;

  for (int i = 0; i < 12; i++) {
    if (touchSensorMap.find(i) != touchSensorMap.end()) {
      currentTouched[i] = touched & (1 << i);
      if (currentTouched[i]) {
        Serial.print(i);
        Serial.println(" Sensor touch detected");
        actions = actionMap[touchSensorMap[i]];
        touchedSensorNum = i;
      }
    }
  }

  if (touchedSensorNum != -1 && currentTouched[touchedSensorNum] != prevTouched[touchedSensorNum]) {
    for (int i = 0; i < actions.size(); i++) {
      Serial.println(actions[i].c_str());  // Added .c_str()
      if (actions[i] == "headMove") {
        headMove();
      } else if (actions[i] == "handMove") {
        handMove();
      } else if (actions[i] == "tailMove") {
        tailMove();
      } else if (actions[i] == "meowSound") {
        Serial.println("Meow!");
        musicPlayer.playFullFile("/meow.mp3");
      } else if (actions[i] == "angrySound") {
        Serial.println("Haaaaaaah!!!!!!");
        musicPlayer.playFullFile("/angry.mp3");
      }
    }
  }

  // update prevTouched
  for (int i = 0; i < 12; i++) {
    if (touchSensorMap.find(i) != touchSensorMap.end()) {
      prevTouched[i] = currentTouched[i];
    }
  }
}

/// File listing helper
void printDirectory(File dir, int numTabs) {
  while(true) {

    File entry =  dir.openNextFile();
    if (! entry) {
      // no more files
      //Serial.println("**nomorefiles**");
      break;
    }
    for (uint8_t i=0; i<numTabs; i++) {
      Serial.print('\t');
    }
    Serial.print(entry.name());
    if (entry.isDirectory()) {
      Serial.println("/");
      printDirectory(entry, numTabs+1);
    } else {
      // files have sizes, directories do not
      Serial.print("\t\t");
      Serial.println(entry.size(), DEC);
    }
    entry.close();
  }
}