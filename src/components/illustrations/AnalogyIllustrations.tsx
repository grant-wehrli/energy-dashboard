import type { AnalogyKey } from "@/types/energy";

const stroke = "var(--primary)";
const accent = "var(--highlight)";

function OpenDoorIllustration() {
  return (
    <svg viewBox="0 0 120 90" className="h-20 w-20" role="img" aria-label="House with open door and heat escaping">
      <path d="M20 50 L60 20 L100 50 V80 H20 Z" fill="var(--secondary)" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="50" y="55" width="20" height="25" fill="var(--card)" stroke={stroke} strokeWidth="2" />
      <path d="M70 55 L82 50 V78 L70 80 Z" fill={accent} fillOpacity="0.35" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="65" cy="68" r="1.4" fill={stroke} />
      <path d="M86 40 q4 -6 0 -12 M94 44 q5 -7 0 -14 M102 40 q4 -6 0 -12" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function EmptyRoadIllustration() {
  return (
    <svg viewBox="0 0 120 90" className="h-20 w-20" role="img" aria-label="Car on an empty road">
      <path d="M5 75 L115 75" stroke="var(--muted-foreground)" strokeWidth="2" opacity="0.4" />
      <path d="M10 60 L110 60" stroke={stroke} strokeWidth="2.5" strokeDasharray="8 8" />
      <rect x="42" y="38" width="36" height="14" rx="4" fill={accent} fillOpacity="0.4" stroke={stroke} strokeWidth="2" />
      <rect x="48" y="30" width="22" height="12" rx="3" fill="var(--card)" stroke={stroke} strokeWidth="2" />
      <circle cx="50" cy="54" r="5" fill="var(--card)" stroke={stroke} strokeWidth="2" />
      <circle cx="70" cy="54" r="5" fill="var(--card)" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

function RushHourIllustration() {
  return (
    <svg viewBox="0 0 120 90" className="h-20 w-20" role="img" aria-label="Traffic at rush hour">
      <path d="M5 75 L115 75" stroke="var(--muted-foreground)" strokeWidth="2" opacity="0.4" />
      <rect x="14" y="42" width="26" height="12" rx="3" fill={accent} fillOpacity="0.55" stroke={stroke} strokeWidth="1.8" />
      <rect x="46" y="42" width="26" height="12" rx="3" fill="var(--card)" stroke={stroke} strokeWidth="1.8" />
      <rect x="78" y="42" width="26" height="12" rx="3" fill={accent} fillOpacity="0.55" stroke={stroke} strokeWidth="1.8" />
      <circle cx="20" cy="58" r="3.5" fill="var(--card)" stroke={stroke} strokeWidth="1.6" />
      <circle cx="34" cy="58" r="3.5" fill="var(--card)" stroke={stroke} strokeWidth="1.6" />
      <circle cx="52" cy="58" r="3.5" fill="var(--card)" stroke={stroke} strokeWidth="1.6" />
      <circle cx="66" cy="58" r="3.5" fill="var(--card)" stroke={stroke} strokeWidth="1.6" />
      <circle cx="84" cy="58" r="3.5" fill="var(--card)" stroke={stroke} strokeWidth="1.6" />
      <circle cx="98" cy="58" r="3.5" fill="var(--card)" stroke={stroke} strokeWidth="1.6" />
      <path d="M30 30 q4 -5 0 -10 M60 30 q4 -5 0 -10 M90 30 q4 -5 0 -10" stroke="var(--muted-foreground)" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function KettleIllustration() {
  return (
    <svg viewBox="0 0 120 90" className="h-20 w-20" role="img" aria-label="Kettle still boiling">
      <path d="M30 50 h50 v20 a8 8 0 0 1 -8 8 h-34 a8 8 0 0 1 -8 -8 z" fill="var(--secondary)" stroke={stroke} strokeWidth="2.5" />
      <path d="M80 55 q14 4 10 18" stroke={stroke} strokeWidth="2.5" fill="none" />
      <rect x="44" y="40" width="22" height="6" rx="2" fill={accent} fillOpacity="0.5" stroke={stroke} strokeWidth="2" />
      <path d="M48 28 q4 -8 0 -16 M58 32 q5 -9 0 -18 M68 28 q4 -8 0 -16" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function PowerbarIllustration() {
  return (
    <svg viewBox="0 0 120 90" className="h-20 w-20" role="img" aria-label="Overloaded power bar">
      <rect x="14" y="45" width="92" height="22" rx="6" fill="var(--secondary)" stroke={stroke} strokeWidth="2.5" />
      {[24, 40, 56, 72, 88].map((x) => (
        <g key={x}>
          <rect x={x - 4} y={50} width="8" height="12" rx="1.5" fill="var(--card)" stroke={stroke} strokeWidth="1.6" />
          <circle cx={x - 1.5} cy={56} r="0.9" fill={stroke} />
          <circle cx={x + 1.5} cy={56} r="0.9" fill={stroke} />
        </g>
      ))}
      <path d="M24 45 q-4 -14 -16 -16 M56 45 q0 -16 -10 -22 M72 45 q4 -14 14 -18" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function CartIllustration() {
  return (
    <svg viewBox="0 0 120 90" className="h-20 w-20" role="img" aria-label="Shopping cart filling up">
      <path d="M14 28 h14 l10 36 h44 l8 -22 h-52" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="44" cy="76" r="5" fill="var(--card)" stroke={stroke} strokeWidth="2" />
      <circle cx="78" cy="76" r="5" fill="var(--card)" stroke={stroke} strokeWidth="2" />
      <rect x="46" y="34" width="12" height="10" rx="2" fill={accent} fillOpacity="0.55" stroke={stroke} strokeWidth="1.6" />
      <rect x="62" y="30" width="14" height="14" rx="2" fill="var(--secondary)" stroke={stroke} strokeWidth="1.6" />
      <rect x="80" y="36" width="10" height="8" rx="2" fill={accent} fillOpacity="0.4" stroke={stroke} strokeWidth="1.6" />
    </svg>
  );
}

function WindIllustration() {
  return (
    <svg viewBox="0 0 120 90" className="h-20 w-20" role="img" aria-label="Cold wind">
      <path d="M10 30 h60 a8 8 0 1 0 -8 -8" stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M10 50 h80 a10 10 0 1 0 -10 -10" stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M10 70 h50 a6 6 0 1 0 -6 -6" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function SaleIllustration() {
  return (
    <svg viewBox="0 0 120 90" className="h-20 w-20" role="img" aria-label="Discount sale tag">
      <path d="M62 14 l44 0 l0 44 l-44 44 l-44 -44 z" fill="var(--secondary)" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="84" cy="36" r="6" fill="var(--card)" stroke={stroke} strokeWidth="2" />
      <text x="50" y="68" fontSize="20" fontWeight="700" fill={stroke} fontFamily="ui-sans-serif, system-ui">%</text>
    </svg>
  );
}

export function AnalogyIllustration({ analogyKey }: { analogyKey: AnalogyKey }) {
  switch (analogyKey) {
    case "openDoor":
      return <OpenDoorIllustration />;
    case "emptyRoad":
      return <EmptyRoadIllustration />;
    case "rushHour":
      return <RushHourIllustration />;
    case "kettle":
      return <KettleIllustration />;
    case "powerbar":
      return <PowerbarIllustration />;
    case "cart":
      return <CartIllustration />;
    case "wind":
      return <WindIllustration />;
    case "sale":
      return <SaleIllustration />;
  }
}