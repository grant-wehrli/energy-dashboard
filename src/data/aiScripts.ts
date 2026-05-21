import type { AIResponse, Timeframe } from "@/types/energy";
import { analogies } from "./mockData";

export { greetings, analogies } from "./mockData";
export type { Analogy } from "@/types/energy";

type Matcher = {
  test: (t: string) => boolean;
  reply: AIResponse;
};

const fallback: Record<Timeframe, AIResponse> = {
  today: {
    text:
      "I can help with today's usage. Try asking why your usage was high between 4 and 6 PM, or how to lower it tomorrow.",
  },
  week: {
    text:
      "I can help with this week. Try asking which days caused the biggest increase, or what routine to change next week.",
  },
  month: {
    text:
      "I can help with this month. Try asking what drove your bill up, or how to reduce next month's bill.",
  },
};

const replies: Record<Timeframe, Matcher[]> = {
  today: [
    {
      test: (t) => /(4|6).*(pm|peak)|between 4|spike|why.*high/.test(t),
      reply: {
        text:
          "Your usage spiked between 4 PM and 6 PM because the laundry machine and dishwasher were running at the same time during peak-rate hours.",
        highlightRange: [16, 18],
        analogy: analogies.powerbar,
      },
    },
    {
      test: (t) => /most|biggest|what used/.test(t),
      reply: {
        text:
          "Floor heating used the most energy today, followed by the laundry machine and dishwasher running together in the evening.",
        analogy: analogies.kettle,
      },
    },
    {
      test: (t) => /lower|reduce|tomorrow|save/.test(t),
      reply: {
        text:
          "Try scheduling laundry or the dishwasher after 11 PM tomorrow, and preheat your room before 5 PM so heating coasts through the peak window.",
        analogy: analogies.emptyRoad,
      },
    },
  ],
  week: [
    {
      test: (t) => /why.*(week|higher)/.test(t),
      reply: {
        text:
          "Your weekly usage increased because evening heating and appliance routines repeated on four days. The biggest pattern was energy-heavy routines landing inside peak hours.",
        analogy: analogies.rushHour,
      },
    },
    {
      test: (t) => /which day|biggest|increase/.test(t),
      reply: {
        text:
          "Thursday and Friday drove the biggest increase. Both had stacked evening routines and longer floor-heating runs.",
        analogy: analogies.cart,
      },
    },
    {
      test: (t) => /routine|next week|change/.test(t),
      reply: {
        text:
          "Pick one weekday routine — like laundry — and shift it to after 11 PM. That single change breaks the repeated evening peak.",
        analogy: analogies.sale,
      },
    },
  ],
  month: [
    {
      test: (t) => /(drove|why).*(bill|month)/.test(t),
      reply: {
        text:
          "Your monthly bill increased mostly because floor heating ran longer during colder days, and several appliance-heavy routines happened during peak-rate hours.",
        analogy: analogies.wind,
      },
    },
    {
      test: (t) => /which appliance|most|cost/.test(t),
      reply: {
        text:
          "Floor heating was the largest cost driver this month — about 61% of the bill — followed by laundry and the dishwasher.",
        analogy: analogies.kettle,
      },
    },
    {
      test: (t) => /reduce|next month|lower|save/.test(t),
      reply: {
        text:
          "Shift peak-hour heating earlier and move two appliance routines to off-peak hours. Together, these changes could save about ₩8,400 next month.",
        analogy: analogies.sale,
      },
    },
  ],
};

export function scriptReply(userText: string, timeframe: Timeframe): AIResponse {
  const t = userText.toLowerCase();
  const match = replies[timeframe].find((m) => m.test(t));
  return match ? match.reply : fallback[timeframe];
}