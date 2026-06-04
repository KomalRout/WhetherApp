export const unit_options = [
  {
    key: "imperial",
    label: "Switch to Imperial",
    selected: false,
    imperial: ["fehrenheit", "mph", "in"],
  },
  {
    key: "metric",
    label: "Switch to Metric",
    selected: true,
    metric: ["celsius", "kmph", "mm"],
  },
  {
    group: "temperature",
    groupLabel: "Temperature",
    options: [
      {
        key: "celsius",
        label: "Celsius (°C)",
        selected: true,
      },
      {
        key: "fehrenheit",
        label: "Fehrenheit (°F)",
        selected: false,
      },
    ],
  },
  {
    group: "windSpeed",
    groupLabel: "Wind Speed",
    options: [
      {
        key: "kmph",
        label: "km/h",
        selected: true,
      },
      {
        key: "mph",
        label: "m/h",
        selected: false,
      },
    ],
  },
  {
    group: "precipitation",
    groupLabel: "Precipitation",
    options: [
      {
        key: "mm",
        label: "Millimeters (mm)",
        selected: true,
      },
      {
        key: "in",
        label: "Inches (in)",
        selected: false,
      },
    ],
  },
];

export const daysOfWeek = [
  {
    key: "Mon",
    label: "Monday",
  },
  {
    key: "Tue",
    label: "Tuesday",
  },
  {
    key: "Wed",
    label: "Wednesday",
  },
  {
    key: "Thu",
    label: "Thursday",
  },
  {
    key: "Fri",
    label: "Friday",
  },
  {
    key: "Sat",
    label: "Saturday",
  },
  {
    key: "Sun",
    label: "Sunday",
  },
];

export const ai_Data = {
  parsed: {
    location: "Paris",
    date: null,
    intent: "general",
    weather_type: null,
    activity: null,
  },
  reply:
    "Hello there! Let's check the weather for Paris.\n\nI have the forecast starting from **Sunday, March 8th, 2026**.\n\nFor **today, March 8th**, you can expect a mild day with temperatures ranging from a low of **7.5°C** to a high of **17.4°C**. There's a very low chance of rain, almost negligible (only 0.1mm is expected, with a 0% precipitation probability).\n\nLooking ahead, Monday (March 9th) and Tuesday (March 10th) will see similar mild conditions. However, things are set to change on **Wednesday, March 11th**. The temperature will drop quite a bit, with a high of **11.7°C**, and there's a much higher chance of rain, with an **88% probability** and 6.1mm expected.\n\nSo, mild for the start of the week, but prepare for cooler, wetter weather mid-week!",
};
