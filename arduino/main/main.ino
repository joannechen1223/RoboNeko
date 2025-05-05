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

// websocket
#include <WiFi.h>
#include <ESPAsyncWebServer.h>

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

#define TOUCH_SENSITIVITY 20

// websocket
const char* ssid = "MakerLab";
const char* password = "makerlab";

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

// Proper map initialization
std::map<int, std::string> touchSensorMap = {
  {6, "head"},
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
  
  // init websocket
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi");
  Serial.print("ESP32 IP address: ");
  Serial.println(WiFi.localIP());

  // Setup WebSocket
  ws.onEvent(onWebSocketEvent);
  server.addHandler(&ws);

  // Serve a simple page (optional)
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", "WebSocket server running.");
  });

  server.begin();

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
  ws.cleanupClients();

  //uint16_t touched = touchSensor.touched();

  std::vector<std::string> actions;
  int touchedSensorNum = -1;

  for (int i = 0; i < 12; i++) {
    if (touchSensorMap.find(i) != touchSensorMap.end()) {
      uint16_t filtered = touchSensor.filteredData(i);
      uint16_t baseline = touchSensor.baselineData(i);
      int diff = baseline - filtered;
      currentTouched[i] = diff > TOUCH_SENSITIVITY;
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
      //Serial.println(actions[i].c_str());  // Added .c_str()
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

void onWebSocketEvent(AsyncWebSocket *server, AsyncWebSocketClient *client,
                      AwsEventType type, void *arg, uint8_t *data, size_t len) {
  switch (type) {
    case WS_EVT_CONNECT:
      Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
      break;

    case WS_EVT_DISCONNECT:
      Serial.printf("WebSocket client #%u disconnected\n", client->id());
      break;

    case WS_EVT_DATA: {
      AwsFrameInfo *info = (AwsFrameInfo *)arg;
      if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
        String msg = String((char *)data);
        Serial.print("Received WebSocket message: ");
        Serial.println(msg);
      }
      break;
    }

    case WS_EVT_PONG:
      Serial.printf("WebSocket client #%u sent pong\n", client->id());
      break;

    case WS_EVT_ERROR:
      Serial.printf("WebSocket client #%u error\n", client->id());
      break;
  }
}