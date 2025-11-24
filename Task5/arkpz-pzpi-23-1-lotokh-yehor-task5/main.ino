#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DallasTemperature.h>
#include <OneWire.h>
#include <Adafruit_MPU6050.h>
#include <WiFi.h>
#include <PubSubClient.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

Adafruit_MPU6050 mpu;
sensors_event_t accelerometer, gyroscope, temp;
const float STEP_THRESHOLD = 1.5;
float accMag, gyroMag;
int stepCount = 0;

#define ONE_WIRE_BUS 23
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature temperatureSensors(&oneWire);

#define PULSE_PIN 2
volatile uint16_t pulse = 0;
uint16_t count = 0;
float heartRate = 0;
const unsigned long SAMPLING_INTERVAL = 1000;

const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_topic = "vetmonitor/animalData";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

void IRAM_ATTR pulseISR() {
  pulse++;
}

void setup() {
  Serial.begin(115200);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)){
    Serial.println("OLED not found");
    while(true);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED){
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected");

  temperatureSensors.begin();
  if(!mpu.begin()){
    Serial.println("MPU6050 Error!");
    while(true);
  }

  pinMode(PULSE_PIN, INPUT);
  attachInterrupt(digitalPinToInterrupt(PULSE_PIN), pulseISR, RISING);

  mqttClient.setServer(mqtt_server, mqtt_port);
  reconnectMQTT();
}

void loop() {
  if(!mqttClient.connected()) reconnectMQTT();
  mqttClient.loop();

  static unsigned long lastSample = 0;
  if(millis() - lastSample < SAMPLING_INTERVAL) return;
  lastSample = millis();

  temperatureSensors.requestTemperatures();
  float temperature = temperatureSensors.getTempCByIndex(0);

  count = pulse;
  pulse = 0;
  heartRate = map(count, 0, 220, 0, 220);

  mpu.getEvent(&accelerometer, &gyroscope, &temp);
  accMag = sqrt(sq(accelerometer.acceleration.x) + sq(accelerometer.acceleration.y) + sq(accelerometer.acceleration.z));
  gyroMag = sqrt(sq(gyroscope.gyro.x) + sq(gyroscope.gyro.y) + sq(gyroscope.gyro.z));

  if(accMag > STEP_THRESHOLD || gyroMag > STEP_THRESHOLD) stepCount++;

  display.clearDisplay();
  display.setCursor(0,0);
  display.print("Temp: "); display.println(temperature);
  display.print("Pulse: "); display.println(heartRate);
  display.print("Activity: "); display.println(stepCount);
  display.display();

  String payload = "{\"temperature\": " + String(temperature) +
                   ", \"pulse\": " + String(heartRate) +
                   ", \"activity\": " + String(stepCount) + "}";
  mqttClient.publish(mqtt_topic, payload.c_str());
  Serial.println("MQTT: " + payload);
}

void reconnectMQTT() {
  while(!mqttClient.connected()){
    if(mqttClient.connect("ESP32Client")){
      mqttClient.subscribe(mqtt_topic);
    } else {
      delay(5000);
    }
  }
}
