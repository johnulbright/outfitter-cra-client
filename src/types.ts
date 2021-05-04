export interface ChildKeys {
  id: number | null;
  name: string | null;
  username: string | null;
  underwearRemind: boolean | null;
  deviceId?: string;
  parentId: number | null;
}
export interface Event {
  childId: number;
  hours: number;
  id: number;
  minutes: number;
  name: string;
  eventTime: any;
}

export interface Clothes {
  id: number;
  name: string;
  requiredMin: number | null;
  requiredMax: number | null;
  optionalMin: number | null;
  optionalMax: number | null;
  category: string;
  icon: string | null;
  parentId: number;
  minTemp: number;
  maxTemp: number;
  step0values: number[];
  step1value: number;
  flipped: boolean;
}

export interface HourlyWeather {
  dt: number;
  temp: number;
  weather: [
    {
      description: string,
      icon: string
    }
  ];
  pop: number
}
export interface DailyWeather {
  dt: number;
  temp: {
    min: number,
    max: number,
  };
  weather: [
    {
      description: string,
      icon: string,
    }
  ],
  pop: number;
}

export interface Weather {
  current: {
    temp: number,
    weather: [
      {
        description: string,
        icon: string
      }
    ]
  };


  hourly: HourlyWeather[];


  daily: DailyWeather[];
}

export const marks = [
  {
    value: -30,
    label: '-30°F'
  },
  {
    value: -10,
    label: '-10°F'
  },
  {
    value: 10,
    label: '10°F'
  },
  {
    value: 30,
    label: '30°F'
  },
  {
    value: 50,
    label: '50°F'
  },
  {
    value: 70,
    label: '70°F'
  },
  {
    value: 90,
    label: '90°F'
  },
  {
    value: 110,
    label: '110°F'
  },
]