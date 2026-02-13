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
