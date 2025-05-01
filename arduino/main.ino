#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>
#include <Adafruit_MPR121.h>
#include <vector>
#include <map>
#include <string>

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
      } else if (actions[i] == "angrySound") {
        Serial.println("Haaaaaaah!!!!!!");
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