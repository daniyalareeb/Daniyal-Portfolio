// Byte (leaf sheep) and Ping (nudibranch). Flat vector, one shared body so they read as a pair.

const INK = "#1B2A3D";
const BLUSH = "#F4A9BC";

const LOOK = {
  byte: { ear: "#F5F8FB", earTip: "#1B2A3D", frill: "#8CCB7A", frillTip: "#C7B5EE", spot: null },
  ping: { ear: "#D9479F", earTip: "#8E1F66", frill: "#F08A3C", frillTip: "#F6B37A", spot: "#4B2479" },
};

// Ear angle (deg from vertical, outward) and length per state.
const EARS = {
  idle: { l: -14, r: 14, len: 22 },
  thinking: { l: -32, r: 6, len: 22 },
  found: { l: -6, r: 6, len: 27 },
  warning: { l: -62, r: 62, len: 20 },
  done: { l: -20, r: 20, len: 22 },
};

// Frill arc behind the body: [x, y, rotation].
const FRILLS = [
  [26, 74, -70], [30, 58, -48], [40, 46, -26], [80, 46, 26], [90, 58, 48], [94, 74, 70],
];

function Eyes({ state }) {
  if (state === "done")
    return (
      <g fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round">
        <path d="M45 71 Q49 66 53 71" />
        <path d="M67 71 Q71 66 75 71" />
      </g>
    );
  const r = state === "found" ? 4.2 : 3.4;
  const [dx, dy] = state === "thinking" ? [2, -2.5] : [0, 0];
  return (
    <g>
      <circle cx={49 + dx} cy={70 + dy} r={r} fill={INK} />
      <circle cx={71 + dx} cy={70 + dy} r={r} fill={INK} />
      {state === "found" && (
        <g fill="#fff">
          <circle cx={50.4} cy={68.4} r={1.3} />
          <circle cx={72.4} cy={68.4} r={1.3} />
        </g>
      )}
      {state === "warning" && (
        <g fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round">
          <path d="M44 62 L52 64.5" />
          <path d="M76 62 L68 64.5" />
        </g>
      )}
    </g>
  );
}

function Mouth({ state }) {
  const d = {
    idle: "M56 80 Q60 83.5 64 80",
    thinking: "M57 81 L63 81",
    found: "M55.5 79 Q60 86 64.5 79 Z",
    warning: "M55 83 Q57.5 80.5 60 83 Q62.5 85.5 65 83",
    done: "M54.5 79 Q60 85.5 65.5 79",
  }[state];
  const filled = state === "found";
  return <path d={d} fill={filled ? INK : "none"} stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />;
}

function Extras({ state }) {
  if (state === "thinking")
    return (
      <g fill={INK} opacity="0.55">
        <circle cx="92" cy="30" r="2.4" />
        <circle cx="100" cy="22" r="3.2" />
        <circle cx="109" cy="12" r="4" />
      </g>
    );
  if (state === "found")
    return (
      <g stroke="#E8A93A" strokeWidth="2.6" strokeLinecap="round">
        <path d="M30 18 L35 24" />
        <path d="M60 4 L60 11" />
        <path d="M90 18 L85 24" />
      </g>
    );
  if (state === "warning") return <path d="M92 52 Q96 59 92 62 Q88 59 92 52 Z" fill="#8FC7EE" />;
  if (state === "done")
    return (
      <g fill="#E8A93A">
        <path d="M100 30 L102 36 L108 38 L102 40 L100 46 L98 40 L92 38 L98 36 Z" />
        <path d="M18 40 L19.3 44 L23 45 L19.3 46 L18 50 L16.7 46 L13 45 L16.7 44 Z" />
      </g>
    );
  return null;
}

export function Mascot({
  who,
  state = "idle",
  size = 96,
  className,
  title,
}) {
  const look = LOOK[who];
  const ears = EARS[state];
  const ear = (x, angle) => (
    <g transform={`translate(${x} 44) rotate(${angle})`}>
      <rect x="-4.5" y={-ears.len} width="9" height={ears.len + 4} rx="4.5" fill={look.ear} stroke="#C5D3E2" strokeWidth="1.2" />
      <circle cx="0" cy={-ears.len + 4} r="3" fill={look.earTip} opacity={who === "byte" ? 1 : 0.6} />
    </g>
  );

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <ellipse cx="60" cy="108" rx="38" ry="5" fill="#0F2A4A" opacity="0.1" />
      {FRILLS.map(([x, y, rot], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <path d="M0 6 C-8 -2 -8 -14 0 -22 C8 -14 8 -2 0 6 Z" fill={look.frill} />
          <ellipse cx="0" cy="-16" rx="3.6" ry="5" fill={look.frillTip} />
          {look.spot && <circle cx="0" cy="-5" r="2.6" fill={look.spot} />}
        </g>
      ))}
      {ear(49, ears.l)}
      {ear(71, ears.r)}
      <path
        d="M22 92 C22 60 39 42 60 42 C81 42 98 60 98 92 C98 101 92 105 84 105 L36 105 C28 105 22 101 22 92 Z"
        fill="#FAFCFE"
        stroke="#C5D3E2"
        strokeWidth="1.5"
      />
      <path d="M32 96 C40 101 80 101 88 96" fill="none" stroke="#DCE6F0" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="41" cy="79" rx="5" ry="3" fill={BLUSH} opacity="0.75" />
      <ellipse cx="79" cy="79" rx="5" ry="3" fill={BLUSH} opacity="0.75" />
      <Eyes state={state} />
      <Mouth state={state} />
      <Extras state={state} />
    </svg>
  );
}
