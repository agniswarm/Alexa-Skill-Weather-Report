let request = require('request')
import WeatherObject from "./Model";

namespace WeatherReport {
    let api = "http://api.openweathermap.org/data/2.5/weather?q={place}&APPID="

    class Weather {
        temperature: Number;
    }

    let weather = {
        "coord": {
            "lon": -0.13,
            "lat": 51.51
        },
        "weather": [
            {
                "id": 500,
                "main": "Rain",
                "description": "light rain",
                "icon": "10d"
            }
        ],
        "base": "stations",
        "main": {
            "temp": 282.97,
            "pressure": 1027,
            "humidity": 62,
            "temp_min": 281.15,
            "temp_max": 284.15
        },
        "visibility": 10000,
        "wind": {
            "speed": 6.7,
            "deg": 70
        },
        "clouds": {
            "all": 0
        },
        "dt": 1542554400,
        "sys": {
            "type": 1,
            "id": 5091,
            "message": 0.0144,
            "country": "GB",
            "sunrise": 1542525871,
            "sunset": 1542557192
        },
        "id": 2643743,
        "name": "London",
        "cod": 200
    }
    function parseReponse(input: any): Weather {
        if (typeof (input) == 'string')
            input = JSON.parse(input)
        console.log(input)
        let response: Weather = new Weather()
        response.temperature = Number((input['main']['temp'] - 273.15).toPrecision(2))
        return response
    }
    export async function getTemperature(place: string): Promise<Number> {
        let response = await callAPI({
            uri: api.replace("{place}", place) + process.env.API_KEY,
            method: "GET"
        })
        let temp = parseReponse(response).temperature
        return temp
    }
    function callAPI(requestBody: any): Promise<JSON> {
        return new Promise((resolve, reject) => {
            request(requestBody, (error: any, response: any, body: any) => {
                if (response.statusCode === 200)
                    resolve(body)
                else
                    reject('Internal Server Error')
            })
        })
    }
}
export default WeatherReport