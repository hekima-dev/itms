#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <DHT.h>


const char* ssid     = "wifi-ssid";
const char* password = "wifi-password";

const char* server = "https://itms.bapig.dev:1001/temperature/create";
//  const char* server = "http://192.168.43.123:1000/temperature/create";

WiFiClient wifiClient;

// #define DHTPIN 2

// #define DHTTYPE DHT11

// DHT dht(DHTPIN, DHTTYPE);
// bro line graph???
void setup()
{
  Serial.begin(9600);
    delay(10);
  // dht.begin();
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  // WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);


  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Timer set to 10 seconds (timerDelay variable), it will take 10 seconds before publishing the first reading.");

  // Random seed is a number used to initialize a pseudorandom number generator
  randomSeed(analogRead(0));
}

void loop() {
    // float temp = dht.readTemperature();
    float temp = 28.5

    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      HTTPClient http;

    http.begin(wifiClient, server);

      //   If you need an HTTP request with a content type: application/json, use the following:
      http.addHeader("Content-Type", "application/json");
      // JSON data to send with HTTP POST
      String httpRequestData = "{\"branch\":\"" + String(1) + "\",\"temperature\":\"" + String(temp) + "\",\"value3\":\"" + String(random(4)) + "\"}";
      // Send HTTP POST request
      int httpResponseCode = http.POST(httpRequestData);


      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
            // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }

    delay(30000);
}

