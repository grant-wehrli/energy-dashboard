import type {
  Analogy,
  AISummaryContent,
  ChatSuggestion,
  CostBreakdownItem,
  CostStats,
  HeatingUptimePoint,
  ProactiveAction,
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

function formatRate(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

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
      body: "Running laundry and the dishwasher together between 4 PM and 9 PM created today's biggest spike. Stagger them after 11 PM to save about ₩1,200.",
      estimatedSavings: 1200,
      confidence: "high",
      evidence: [
        "Smart meter readings show a 4 PM to 6 PM spike of 1.9 kWh, more than double the afternoon baseline.",
        "Laundry and dishwasher signatures overlapped inside the 4 PM to 9 PM peak-rate window.",
        "The same appliances have lower-cost completion windows after 11 PM.",
      ],
      calculation: [
        { label: "Peak overlap", value: "2 appliance cycles" },
        { label: "Peak rate exposure", value: `${formatRate(rates.peakKRWPerKWh)} / kWh` },
        { label: "Estimated saving", value: "about ₩1,200 today" },
      ],
      limitations: [
        "Appliance detection is inferred from load shape, not direct appliance sensors.",
        "Actual savings depend on whether cycle length and comfort constraints allow rescheduling.",
      ],
      sourceIds: ["smart-meter", "kepco-rates"],
    },
    {
      id: "today-2",
      title: "Preheat your room before the evening peak",
      body: "Preheating before 5 PM lets the floor heating coast through the peak window, avoiding the most expensive hours.",
      estimatedSavings: 900,
      confidence: "medium",
      evidence: [
        "Floor heating was active during the early evening price window.",
        "Recent heating uptime shows the room can hold temperature for several hours after a preheat period.",
        "Peak prices are materially higher than off-peak prices.",
      ],
      calculation: [
        { label: "Shifted heating window", value: "5 PM preheat, coast through peak" },
        {
          label: "Rate avoided",
          value: `${formatRate(rates.peakKRWPerKWh - rates.offPeakKRWPerKWh)} / kWh spread`,
        },
        { label: "Estimated saving", value: "about ₩900 today" },
      ],
      limitations: [
        "Comfort impact depends on room insulation and outdoor temperature.",
        "Recommendation assumes occupancy remains similar to recent evenings.",
      ],
      sourceIds: ["smart-meter", "kepco-rates", "kma-forecast"],
    },
    {
      id: "today-3",
      title: "Turn off floor heating in unused rooms",
      body: "Two heating zones were on all day with little movement detected. Turning them off saves immediate cost with no comfort impact.",
      estimatedSavings: 700,
      confidence: "medium",
      evidence: [
        "Two heating zones remained active while usage data stayed flat for several daytime hours.",
        "The day’s largest cost category is floor heating.",
        "Reducing unused-zone heating lowers both kWh consumption and peak exposure.",
      ],
      calculation: [
        { label: "Candidate zones", value: "2 low-activity rooms" },
        { label: "Primary cost driver", value: "Floor heating" },
        { label: "Estimated saving", value: "about ₩700 today" },
      ],
      limitations: [
        "Room occupancy is represented by demo mock data and may not capture every comfort need.",
        "Turning zones off may require manual thermostat changes in the real system.",
      ],
      sourceIds: ["smart-meter"],
    },
  ],
  week: [
    {
      id: "week-1",
      title: "Move two appliance routines to after 11 PM",
      body: "Evening peaks repeated on four weekdays. Shifting two routines to off-peak hours could save around ₩4,900 this week.",
      estimatedSavings: 4900,
      confidence: "high",
      evidence: [
        "Four weekday evenings repeated the same stacked load pattern.",
        "The repeated loads landed inside the peak-rate window.",
        "Moving two recurring routines after 11 PM avoids the most expensive rate period.",
      ],
      calculation: [
        { label: "Repeated peak days", value: "4 weekdays" },
        { label: "Routines shifted", value: "2 high-draw routines" },
        { label: "Estimated saving", value: "about ₩4,900 this week" },
      ],
      limitations: [
        "Savings assume the routines can run after 11 PM without changing cycle length.",
        "Week-to-week patterns may change if occupancy changes.",
      ],
      sourceIds: ["smart-meter", "kepco-rates"],
    },
    {
      id: "week-2",
      title: "Use warmer forecast days to ease heating",
      body: "Thursday and Saturday are forecast warmer than usual. Lowering heating setpoints by 1 °C on those days trims weekly cost.",
      estimatedSavings: 2100,
      confidence: "medium",
      evidence: [
        "KMA forecast data marks Thursday and Saturday as warmer than the surrounding days.",
        "Heating is the largest weekly cost category.",
        "A small setpoint reduction on warmer days should have lower comfort impact.",
      ],
      calculation: [
        { label: "Warmer days", value: "2 forecast days" },
        { label: "Setpoint change", value: "Lower by 1 °C" },
        { label: "Estimated saving", value: "about ₩2,100 this week" },
      ],
      limitations: [
        "Weather forecast accuracy affects actual savings.",
        "The estimate does not model room-by-room heat retention.",
      ],
      sourceIds: ["kma-forecast", "smart-meter"],
    },
    {
      id: "week-3",
      title: "Your evening pattern repeated on 4 days",
      body: "The same 6–9 PM stack appeared Mon, Tue, Thu and Fri. Adjusting one weekday routine breaks the pattern.",
      estimatedSavings: 1800,
      confidence: "medium",
      evidence: [
        "The usage curve shows similar evening peaks on four weekday labels.",
        "Peak activity clusters around 6 PM to 9 PM.",
        "Changing one routine reduces the probability of overlapping high-draw appliances.",
      ],
      calculation: [
        { label: "Pattern days", value: "Mon, Tue, Thu, Fri" },
        { label: "Suggested change", value: "Move one routine" },
        { label: "Estimated saving", value: "about ₩1,800 this week" },
      ],
      limitations: [
        "Pattern matching is based on aggregate electricity use.",
        "The recommendation prioritizes cost, not household schedule convenience.",
      ],
      sourceIds: ["smart-meter", "kepco-rates"],
    },
  ],
  month: [
    {
      id: "month-1",
      title: "Floor heating was your largest monthly cost driver",
      body: "Floor heating accounted for ~61% of the bill. Shifting peak-hour heating could save approximately ₩8,400 this month.",
      estimatedSavings: 8400,
      confidence: "high",
      evidence: [
        "Monthly cost breakdown attributes the largest share to floor heating.",
        "The biggest daily bills coincide with evening peak-rate use.",
        "Three colder periods increased heating runtime and amplified peak exposure.",
      ],
      calculation: [
        { label: "Monthly cost share", value: "~61% floor heating" },
        { label: "Peak heating adjustment", value: "Preheat before 5 PM" },
        { label: "Estimated saving", value: "about ₩8,400 this month" },
      ],
      limitations: [
        "Estimated savings depend on weather and thermostat compliance.",
        "The demo does not model each room’s exact thermal behavior.",
      ],
      sourceIds: ["smart-meter", "kepco-rates", "kma-forecast"],
    },
    {
      id: "month-2",
      title: "Schedule heating around peak rate hours",
      body: "Preheating before 5 PM and reducing setpoints between 4 PM and 9 PM lowers both consumption and rate exposure.",
      estimatedSavings: 6200,
      confidence: "medium",
      evidence: [
        "Monthly usage rises during the same peak-rate window across multiple days.",
        "Preheating shifts some consumption into a lower-cost period.",
        "Reducing setpoints lowers total kWh during the most expensive hours.",
      ],
      calculation: [
        { label: "Peak window", value: rates.peakWindowLabel },
        { label: "Strategy", value: "Preheat and reduce setpoint" },
        { label: "Estimated saving", value: "about ₩6,200 this month" },
      ],
      limitations: [
        "Requires a schedule-capable thermostat or manual routine.",
        "Comfort tolerance varies by household member.",
      ],
      sourceIds: ["smart-meter", "kepco-rates"],
    },
    {
      id: "month-3",
      title: "Monthly usage tracked colder forecast periods",
      body: "Three cold spells in May correlate with the highest daily bills. A weather-aware schedule smooths these peaks.",
      estimatedSavings: 3900,
      confidence: "medium",
      evidence: [
        "Three cold periods line up with the highest mock daily usage values.",
        "Heating usage increases when forecast temperatures drop.",
        "A weather-aware schedule can preheat before peak windows on cold days.",
      ],
      calculation: [
        { label: "Cold spells", value: "3 periods" },
        { label: "Action", value: "Weather-aware preheat" },
        { label: "Estimated saving", value: "about ₩3,900 this month" },
      ],
      limitations: [
        "Correlation does not prove weather is the only driver.",
        "Forecast-based scheduling should be reviewed on unusual occupancy days.",
      ],
      sourceIds: ["smart-meter", "kma-forecast"],
    },
  ],
};

export const recommendations: Recommendation[] = recommendationsByTimeframe.month;

export const proactiveActionsByTimeframe: Record<Timeframe, ProactiveAction[]> = {
  today: [
    {
      id: "today-action-1",
      title: "Run laundry after 11 PM",
      body: "A late cycle avoids the peak window that caused today’s biggest spike.",
      actionLabel: "Schedule late cycle",
      tone: "saving",
      relatedRecommendationId: "today-1",
    },
    {
      id: "today-action-2",
      title: "Preheat before 5 PM",
      body: "Warm the main room before rates rise, then coast through the peak.",
      actionLabel: "Set preheat",
      tone: "comfort",
      relatedRecommendationId: "today-2",
    },
    {
      id: "today-action-3",
      title: "Lower heating by 1 °C",
      body: "Small setpoint changes during 4–9 PM reduce cost without a large comfort tradeoff.",
      actionLabel: "Adjust setpoint",
      tone: "forecast",
      relatedRecommendationId: "today-3",
    },
  ],
  week: [
    {
      id: "week-action-1",
      title: "Shift weekday appliance routines",
      body: "Four evening peaks repeated this week; moving two routines can flatten the pattern.",
      actionLabel: "Review routines",
      tone: "saving",
      relatedRecommendationId: "week-1",
    },
    {
      id: "week-action-2",
      title: "Ease heating on warmer days",
      body: "Thursday and Saturday are warmer in the demo forecast.",
      actionLabel: "Use forecast",
      tone: "forecast",
      relatedRecommendationId: "week-2",
    },
    {
      id: "week-action-3",
      title: "Break the 6–9 PM stack",
      body: "Moving one routine out of the evening window reduces repeated peak exposure.",
      actionLabel: "Pick routine",
      tone: "comfort",
      relatedRecommendationId: "week-3",
    },
  ],
  month: [
    {
      id: "month-action-1",
      title: "Create a peak-hour heating rule",
      body: "Floor heating dominates the monthly bill, especially during peak-rate hours.",
      actionLabel: "Create rule",
      tone: "saving",
      relatedRecommendationId: "month-1",
    },
    {
      id: "month-action-2",
      title: "Preheat on cold days",
      body: "Weather-aware scheduling smooths cold-spell spikes before rates rise.",
      actionLabel: "Add schedule",
      tone: "forecast",
      relatedRecommendationId: "month-3",
    },
    {
      id: "month-action-3",
      title: "Review heating comfort zones",
      body: "A lower peak-hour setpoint trims cost while preserving occupied-room comfort.",
      actionLabel: "Review zones",
      tone: "comfort",
      relatedRecommendationId: "month-2",
    },
  ],
};

export const heatingUptime: HeatingUptimePoint[] = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  hours: +(3 + Math.sin(i / 2) * 1.2 + (i % 3 === 0 ? 1.5 : 0)).toFixed(1),
}));

export const sources: SourceCitation[] = [
  {
    id: "kma-forecast",
    label: "Korea Meteorological Administration — Seoul 10-day forecast",
    citation:
      'Korea Meteorological Administration. "Seoul 10-Day Weather Forecast." KMA, 2026, weather.go.kr/w/weather/forecast/short-term.do.',
    url: "https://www.weather.go.kr/w/weather/forecast/short-term.do",
  },
  {
    id: "kepco-rates",
    label: "KEPCO residential time-of-use rate schedule",
    citation:
      'Korea Electric Power Corporation. "Residential Time-of-Use Tariff Schedule." KEPCO, 2026, cyber.kepco.co.kr/ckepco/front/jsp/CY/E/E/CYEEHP00101.jsp.',
    url: "https://cyber.kepco.co.kr/ckepco/front/jsp/CY/E/E/CYEEHP00101.jsp",
  },
  {
    id: "smart-meter",
    label: "Local smart meter — last 14 days, 15-minute resolution",
    citation: "Smart Meter Reading Log, Apartment 402, 1–14 May 2026. Local device export.",
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
    body: "This is like leaving the front door open while the heat is on: the system works harder, but you do not get much extra comfort.",
  },
  emptyRoad: {
    key: "emptyRoad",
    title: "Analogy",
    body: "Think of it like driving in traffic: energy is cheaper when the road is empty.",
  },
  rushHour: {
    key: "rushHour",
    title: "Everyday analogy",
    body: "Think of peak hours like rush-hour traffic: the road is crowded, so every trip costs more. Using appliances later is like driving when the road is empty.",
  },
  kettle: {
    key: "kettle",
    title: "Heating analogy",
    body: "Leaving floor heating on during peak hours is like keeping a kettle boiling after the water is already hot — extra effort, no extra benefit.",
  },
  powerbar: {
    key: "powerbar",
    title: "Appliance stacking analogy",
    body: "Running laundry and the dishwasher together is like plugging too many devices into one power bar: the load jumps quickly.",
  },
  cart: {
    key: "cart",
    title: "Monthly bill analogy",
    body: "A monthly energy bill is like a shopping cart. One small item does not look expensive, but repeated habits add up by checkout.",
  },
  wind: {
    key: "wind",
    title: "Weather analogy",
    body: "Cold weather affects heating like wind affects cycling: you can still move forward, but it takes more energy.",
  },
  sale: {
    key: "sale",
    title: "Savings analogy",
    body: "Moving appliances to cheaper hours is like buying the same item during a sale instead of paying full price.",
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
