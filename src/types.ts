export interface ChildKeys{
    id:number|null;
    name:string|null;
    username:string|null;
    deviceId?:string;
    parentId:number|null;
}


export interface HourlyWeather{
    dt:number;
    temp: number;
        // "feels_like": 271.22,
        // "pressure": 1017,
        // "humidity": 96,
        // "dew_point": 274.18,
        // "uvi": 0,
        // "clouds": 90,
        // "visibility": 1765,
        // "wind_speed": 2.43,
        // "wind_deg": 303,
    weather: [
          {
            // "id": 804,
            // "main": "Clouds",
            description:string,
            icon: string
          }
        ];
        pop: number
}
export interface DailyWeather{
        dt: number;
        // "sunrise": 1608124431,
        // "sunset": 1608160224,
        temp: {
        //   "day": 278.14,
          min: number,
          max: number,
        //   "night": 273.15,
        //   "eve": 275.82,
        //   "morn": 275.35
        };
        // "feels_like": {
        //   "day": 273.53,
        //   "night": 270.26,
        //   "eve": 271.89,
        //   "morn": 272.11
        // },
        // "pressure": 1021,
        // "humidity": 70,
        // "dew_point": 273.27,
        // "wind_speed": 3.74,
        // "wind_deg": 323,
        weather: [
          {
            // "id": 803,
            // "main": "Clouds",
            description: string,
            icon: string,
          }
        ],
        // "clouds": 60,
        pop: number;
        // "uvi": 2.41
      }

export interface Weather{
                    
    // lat: number;
    // lon: number;
    // timezone: string;
    // timezone_offset: number;
    current: {
    //   "dt": 1595243443,
    //   "sunrise": 1608124431,
    //   "sunset": 1608160224,
      temp: number,
    //   "feels_like": 270.4,
    //   "pressure": 1017,
    //   "humidity": 96,
    //   "dew_point": 274.18,
    //   "uvi": 0,
    //   "clouds": 90,
    //   "visibility": 6437,
    //   "wind_speed": 3.6,
    //   "wind_deg": 320,
      weather: [
        {
        //   "id": 701,
        //   "main": "Mist",
          description: string,
          icon: string
        }
      ]
    };
   
    
    hourly: HourlyWeather[];
      
    
  daily: DailyWeather[];          
}