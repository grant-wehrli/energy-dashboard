import type {
  Analogy,
  AISummaryContent,
  ChatSuggestion,
  CostBreakdownItem,
  CostStats,
  HeatingUptimePoint,
  RateSchedule,
  Recommendation,
  SourceCitation,
  SpikeDriver,
  Timeframe,
  UsageDataPoint,
} from "@/types/energy";

export type { Timeframe } from "@/types/energy";

export const brand = {
  appName: "Energy Dashboard",
  groupTag: "by SIIG",
} as const;

export const timeframeLabels: Record<Timeframe, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
};

export const peakWindow = { startHour: 16, endHour: 18 } as const;

export const rates: RateSchedule = {
  peakKRWPerKWh: 220,
  offPeakKRWPerKWh: 125,
  peakWindowLabel: "4 PM – 9 PM",
};

// Hourly usage (kWh) for today — spike at 16-18
export const todayUsage: UsageDataPoint[] = Array.from({ length: 24 }, (_, h) => {
  const base = 0.4 + Math.sin((h / 24) * Math.PI * 2) * 0.2;
  let v = Math.max(0.2, base + 0.3);
  if (h >= 16 && h <= 18) v += 1.4;
  if (h >= 19 && h <= 21) v += 0.6;
  return { label: `${h.toString().padStart(2, "0")}:00`, hour: h, kwh: +v.toFixed(2) };
});

export const weekUsage: UsageDataPoint[] = [
  { label: "Mon", kwh: 12.4 },
  { label: "Tue", kwh: 14.1 },
  { label: "Wed", kwh: 11.8 },
  { label: "Thu", kwh: 16.7 },
  { label: "Fri", kwh: 18.2 },
  { label: "Sat", kwh: 19.5 },
  { label: "Sun", kwh: 15.3 },
];

export const monthUsage: UsageDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  let v = 11 + Math.sin(i / 3) * 2.5 + (i % 7 === 4 ? 4 : 0);
  if ([6, 13, 20, 27].includes(i)) v += 3.5;
  return { label: `${day}`, kwh: +v.toFixed(1) };
});

export const usageByTimeframe: Record<Timeframe, UsageDataPoint[]> = {
  today: todayUsage,
  week: weekUsage,
  month: monthUsage,
};

export const costBreakdown: CostBreakdownItem[] = [
  { name: "Floor heating", value: 20250, color: "var(--chart-1)" },
  { name: "Kitchen", value: 9000, color: "var(--chart-2)" },
  { name: "Laundry", value: 6750, color: "var(--chart-3)" },
  { name: "EV charging", value: 4500, color: "var(--chart-4)" },
  { name: "Other", value: 4500, color: "var(--chart-5)" },
];

export const costBreakdownByTimeframe: Record<Timeframe, CostBreakdownItem[]> = {
  today: [
    { name: "Floor heating", value: 2800, color: "var(--chart-1)" },
    { name: "Laundry", value: 1100, color: "var(--chart-3)" },
    { name: "Dishwasher", value: 900, color: "var(--chart-2)" },
    { name: "Standby devices", value: 400, color: "var(--chart-5)" },
  ],
  week: [
    { name: "Floor heating", value: 15400, color: "var(--chart-1)" },
    { name: "Laundry", value: 5600, color: "var(--chart-3)" },
    { name: "Dishwasher", value: 4200, color: "var(--chart-2)" },
    { name: "Standby devices", value: 2100, color: "var(--chart-5)" },
  ],
  month: [
    { name: "Floor heating", value: 45000, color: "var(--chart-1)" },
    { name: "Laundry", value: 12800, color: "var(--chart-3)" },
    { name: "Dishwasher", value: 9600, color: "var(--chart-2)" },
    { name: "Standby devices", value: 6200, color: "var(--chart-5)" },
  ],
};

export const costStatsByTimeframe: Record<Timeframe, CostStats> = {
  today: { estimated: 5200, savedThisMonth: 12000, potentialSavings: 1200 },
  week: { estimated: 27300, savedThisMonth: 12000, potentialSavings: 4900 },
  month: { estimated: 73600, savedThisMonth: 12000, potentialSavings: 8400 },
};

export const costStats: CostStats = costStatsByTimeframe.month;

export const savingsCalc = {
  currentEstimate: 19008,
  recommendedEstimate: 10771,
  estimatedSavings: 8237,
} as const;

export const recommendationsByTimeframe: Record<Timeframe, Recommendation[]> = {
  today: [
    {
      id: "today-1",
      title: "Avoid stacking laundry and dishwasher tonight",
      body:
        "Running laundry and the dishwasher together between 4 PM and 9 PM created today's biggest spike. Stagger them after 11 PM to save about ₩1,200.",
    },
    {
      id: "today-2",
      title: "Preheat your room before the evening peak",
      body:
        "Preheating before 5 PM lets the floor heating coast through the peak window, avoiding the most expensive hours.",
    },
    {
      id: "today-3",
      title: "Turn off floor heating in unused rooms",
      body:
        "Two heating zones were on all day with little movement detected. Turning them off saves immediate cost with no comfort impact.",
    },
  ],
  week: [
    {
      id: "week-1",
      title: "Move two appliance routines to after 11 PM",
      body:
        "Evening peaks repeated on four weekdays. Shifting two routines to off-peak hours could save around ₩4,900 this week.",
    },
    {
      id: "week-2",
      title: "Use warmer forecast days to ease heating",
      body:
        "Thursday and Saturday are forecast warmer than usual. Lowering heating setpoints by 1 °C on those days trims weekly cost.",
    },
    {
      id: "week-3",
      title: "Your evening pattern repeated on 4 days",
      body:
        "The same 6–9 PM stack appeared Mon, Tue, Thu and Fri. Adjusting one weekday routine breaks the pattern.",
    },
  ],
  month: [
    {
      id: "month-1",
      title: "Floor heating was your largest monthly cost driver",
      body:
        "Floor heating accounted for ~61% of the bill. Shifting peak-hour heating could save approximately ₩8,400 this month.",
    },
    {
      id: "month-2",
      title: "Schedule heating around peak rate hours",
      body:
        "Preheating before 5 PM and reducing setpoints between 4 PM and 9 PM lowers both consumption and rate exposure.",
    },
    {
      id: "month-3",
      title: "Monthly usage tracked colder forecast periods",
      body:
        "Three cold spells in May correlate with the highest daily bills. A weather-aware schedule smooths these peaks.",
    },
  ],
};

export const recommendations: Recommendation[] = recommendationsByTimeframe.month;

export const heatingUptime: HeatingUptimePoint[] = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  hours: +(3 + Math.sin(i / 2) * 1.2 + (i % 3 === 0 ? 1.5 : 0)).toFixed(1),
}));

export const sources: SourceCitation[] = [
  {
    label: "Korea Meteorological Administration — Seoul 10-day forecast",
    citation:
      "Korea Meteorological Administration. \"Seoul 10-Day Weather Forecast.\" KMA, 2026, weather.go.kr/w/weather/forecast/short-term.do.",
    url: "https://www.weather.go.kr/w/weather/forecast/short-term.do",
  },
  {
    label: "KEPCO residential time-of-use rate schedule",
    citation:
      "Korea Electric Power Corporation. \"Residential Time-of-Use Tariff Schedule.\" KEPCO, 2026, cyber.kepco.co.kr/ckepco/front/jsp/CY/E/E/CYEEHP00101.jsp.",
    url: "https://cyber.kepco.co.kr/ckepco/front/jsp/CY/E/E/CYEEHP00101.jsp",
  },
  {
    label: "Local smart meter — last 14 days, 15-minute resolution",
    citation:
      "Smart Meter Reading Log, Apartment 402, 1–14 May 2026. Local device export.",
    url: "#",
  },
];

export const greetings: Record<Timeframe, string> = {
  today: "Hello! Do you have any questions about today's consumption?",
  week: "Hello! Do you have any questions about this week's consumption?",
  month: "Hello! Do you have any questions about this month's consumption?",
};

export const analogies = {
  openDoor: {
    key: "openDoor",
    title: "Analogy",
    body:
      "This is like leaving the front door open while the heat is on: the system works harder, but you do not get much extra comfort.",
  },
  emptyRoad: {
    key: "emptyRoad",
    title: "Analogy",
    body: "Think of it like driving in traffic: energy is cheaper when the road is empty.",
  },
  rushHour: {
    key: "rushHour",
    title: "Everyday analogy",
    body:
      "Think of peak hours like rush-hour traffic: the road is crowded, so every trip costs more. Using appliances later is like driving when the road is empty.",
  },
  kettle: {
    key: "kettle",
    title: "Heating analogy",
    body:
      "Leaving floor heating on during peak hours is like keeping a kettle boiling after the water is already hot — extra effort, no extra benefit.",
  },
  powerbar: {
    key: "powerbar",
    title: "Appliance stacking analogy",
    body:
      "Running laundry and the dishwasher together is like plugging too many devices into one power bar: the load jumps quickly.",
  },
  cart: {
    key: "cart",
    title: "Monthly bill analogy",
    body:
      "A monthly energy bill is like a shopping cart. One small item does not look expensive, but repeated habits add up by checkout.",
  },
  wind: {
    key: "wind",
    title: "Weather analogy",
    body:
      "Cold weather affects heating like wind affects cycling: you can still move forward, but it takes more energy.",
  },
  sale: {
    key: "sale",
    title: "Savings analogy",
    body:
      "Moving appliances to cheaper hours is like buying the same item during a sale instead of paying full price.",
  },
} as const satisfies Record<string, Analogy>;

export const aiSummaryByTimeframe: Record<Timeframe, AISummaryContent> = {
  today: {
    shortSummary:
      "Your usage spiked between 4 PM and 6 PM today — laundry and dishwasher ran together during peak-rate hours. Shifting one of them after 11 PM could save about ₩1,200 today.",
    longSummary:
      "Today's bill was dominated by a short evening spike. The laundry machine and dishwasher both ran between 4 PM and 6 PM, right inside the peak-rate window. Floor heating was also active, which stacked the load. Staggering one of these routines after 11 PM would have flattened the curve and saved about ₩1,200.",
    detailTitle: "AI Summary",
    detailSubtitle: "Today · plain-language overview",
    spikeDrivers: [
      { icon: "washer", label: "Laundry machine", share: "18%" },
      { icon: "stove", label: "Dishwasher", share: "14%" },
      { icon: "bulb", label: "Standby devices", share: "6%" },
      { icon: "car", label: "Floor heating", share: "42%" },
    ],
    tips: [
      "Run laundry after 11 PM tonight to use off-peak rates.",
      "Skip the dishwasher until late evening — the load is lighter.",
      "Lower heating setpoints by 1 °C between 4 PM and 9 PM.",
    ],
    dataNotes: [
      "Today's smart-meter readings (15-min resolution)",
      "KEPCO time-of-use rate schedule",
      "Real-time appliance disaggregation",
    ],
    analogyKey: "powerbar",
    estimatedSaving: 1200,
    savingLabel: "today",
  },
  week: {
    shortSummary:
      "This week, evening peaks repeated on four weekdays. Heating and appliance routines kept landing inside the peak window. Moving two routines off-peak could save around ₩4,900 this week.",
    longSummary:
      "Your weekly usage rose because the same 6–9 PM pattern repeated on Mon, Tue, Thu and Fri. Floor heating ran longer on the two coldest evenings, while laundry and the dishwasher overlapped with cooking. Moving two routines to off-peak hours and lowering heating during the peak window could save around ₩4,900 this week.",
    detailTitle: "AI Summary",
    detailSubtitle: "This week · plain-language overview",
    spikeDrivers: [
      { icon: "car", label: "Floor heating", share: "48%" },
      { icon: "washer", label: "Laundry routines", share: "16%" },
      { icon: "stove", label: "Cooking + dishwasher", share: "18%" },
      { icon: "bulb", label: "Standby devices", share: "8%" },
    ],
    tips: [
      "Schedule laundry and the dishwasher after 11 PM on weekdays.",
      "Use warmer forecast days to ease heating setpoints.",
      "Stagger high-draw appliances so they do not overlap.",
    ],
    dataNotes: [
      "7 days of smart-meter readings (15-min resolution)",
      "KEPCO time-of-use rate schedule",
      "KMA short-term weather forecast",
    ],
    analogyKey: "rushHour",
    estimatedSaving: 4900,
    savingLabel: "this week",
  },
  month: {
    shortSummary:
      "This month, your energy use increased mostly during evening peak hours. Floor heating, laundry and the dishwasher were the biggest drivers. Shifting peak-hour heating could save about ₩8,400 this month.",
    longSummary:
      "This month, your energy use increased mostly during evening peak hours. The biggest drivers were floor heating, laundry, and dishwasher use between 4 PM and 9 PM, amplified by three colder-than-usual periods. Shifting one or two of these activities outside peak hours — and preheating before 5 PM on cold days — could save about ₩8,400 this month.",
    detailTitle: "AI Summary",
    detailSubtitle: "This month · plain-language overview",
    spikeDrivers: [
      { icon: "car", label: "Floor heating", share: "61%" },
      { icon: "washer", label: "Laundry machine", share: "10%" },
      { icon: "stove", label: "Cooking appliances", share: "8%" },
      { icon: "bulb", label: "Lighting & standby", share: "9%" },
    ],
    tips: [
      "Run laundry and the dishwasher after 11 PM, when off-peak rates apply.",
      "Preheat floor heating before 5 PM so the system coasts through peak hours.",
      "Stagger high-draw appliances — avoid running them at the same time.",
    ],
    dataNotes: [
      "30 days of smart-meter readings (15-min resolution)",
      "KEPCO time-of-use rate schedule",
      "KMA weather data correlated with heating load",
    ],
    analogyKey: "cart",
    estimatedSaving: 8400,
    savingLabel: "this month",
  },
};

export const chatSuggestionsByTimeframe: Record<Timeframe, ChatSuggestion[]> = {
  today: [
    { id: "t1", text: "Why was my usage high between 4 and 6 PM?" },
    { id: "t2", text: "What used the most energy today?" },
    { id: "t3", text: "How can I lower this tomorrow?" },
  ],
  week: [
    { id: "w1", text: "Why was my usage higher this week?" },
    { id: "w2", text: "Which days caused the biggest increase?" },
    { id: "w3", text: "What routine should I change next week?" },
  ],
  month: [
    { id: "m1", text: "What drove my bill up this month?" },
    { id: "m2", text: "Which appliance cost me the most?" },
    { id: "m3", text: "How can I reduce next month's bill?" },
  ],
};
