import { motion, useScroll, useTransform } from "framer-motion";
import * as React from "react";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function tokenizeWordsOrLetters(raw: string, unit: "Words" | "Letters") {
  const lines = (raw ?? "").split("\n");
  const out: Array<{ kind: "token" | "br"; value?: string; animIndex?: number | null }> = [];
  let animIndex = 0;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (unit === "Words") {
      const words = line.trim() ? line.trim().split(/\s+/) : [];
      for (let i = 0; i < words.length; i++) {
        out.push({ kind: "token", value: words[i], animIndex });
        animIndex++;
        if (i !== words.length - 1) {
          out.push({ kind: "token", value: " ", animIndex: null });
        }
      }
      if (!words.length) out.push({ kind: "token", value: "\u00A0", animIndex: null });
    } else {
      for (const ch of line) {
        if (ch === " ") {
          out.push({ kind: "token", value: ch, animIndex: null });
        } else {
          out.push({ kind: "token", value: ch, animIndex });
          animIndex++;
        }
      }
      if (!line.length) out.push({ kind: "token", value: "\u00A0", animIndex: null });
    }
    if (li !== lines.length - 1) out.push({ kind: "br" });
  }
  return out;
}

function tokenizeLines(raw: string) {
  const lines = (raw ?? "").split("\n");
  return lines.map((line, idx) => ({ kind: "line", value: line, animIndex: idx }));
}

function RevealToken({
  value,
  animIndex,
  totalAnimated,
  progress,
  unit,
  activeColor = "#ffffff",
  inactiveColor = "rgba(255,255,255,0.15)",
}: {
  value: string;
  animIndex: number | null;
  totalAnimated: number;
  progress: any;
  unit: "Words" | "Letters";
  activeColor?: string;
  inactiveColor?: string;
}) {
  if (animIndex === null || totalAnimated <= 0) {
    if (unit === "Letters") {
      return <span>{value === " " ? "\u00A0" : value}</span>;
    }
    return <span>{value}</span>;
  }
  const start = animIndex / totalAnimated;
  const end = start + 1 / totalAnimated;
  const color = useTransform(progress, [start, end], [inactiveColor, activeColor]);
  
  return unit === "Letters" ? (
    <motion.span style={{ color, display: "inline-block" }}>
      {value === " " ? "\u00A0" : value}
    </motion.span>
  ) : (
    <motion.span style={{ color, display: "inline" }}>
      {value}
    </motion.span>
  );
}

function RevealLine({
  line,
  animIndex,
  totalLines,
  progress,
  activeColor = "#ffffff",
  inactiveColor = "rgba(255,255,255,0.15)",
}: {
  line: string;
  animIndex: number;
  totalLines: number;
  progress: any;
  activeColor?: string;
  inactiveColor?: string;
}) {
  const denom = Math.max(1, totalLines);
  const start = animIndex / denom;
  const end = start + 1 / denom;
  const color = useTransform(progress, [start, end], [inactiveColor, activeColor]);
  return (
    <motion.div style={{ color, display: "block" }}>
      {line.length ? line : "\u00A0"}
    </motion.div>
  );
}

interface TextScrollProps {
  text: string;
  unit?: "Words" | "Letters" | "Lines";
  sectionHeightVh?: number;
  speed?: number;
  alignY?: "Top" | "Center" | "Bottom";
  stickyOffsetPx?: number;
  maxWidth?: number | string;
  activeColor?: string;
  inactiveColor?: string;
  style?: React.CSSProperties;
}

export default function TextScroll({
  text,
  unit = "Words",
  sectionHeightVh = 150,
  speed = 1.2,
  alignY = "Center",
  stickyOffsetPx = 0,
  maxWidth = "100%",
  activeColor = "#ffffff",
  inactiveColor = "rgba(255,255,255,0.15)",
  style,
}: TextScrollProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const baseProgress = useTransform(scrollYProgress, (v) => clamp01(v * speed));

  const top = alignY === "Top" ? `${stickyOffsetPx}px` : alignY === "Bottom" ? `calc(100vh - ${stickyOffsetPx}px)` : `calc(50vh + ${stickyOffsetPx}px)`;
  const transform = alignY === "Top" ? "none" : alignY === "Bottom" ? "translateY(-100%)" : "translateY(-50%)";

  const wordOrLetterTokens = React.useMemo(() => {
    if (unit === "Words" || unit === "Letters") return tokenizeWordsOrLetters(text, unit);
    return [];
  }, [text, unit]);

  const totalAnimated = React.useMemo(() => {
    let max = -1;
    for (const t of wordOrLetterTokens) {
      if (t.kind === "token" && t.animIndex !== null && t.animIndex !== undefined) {
        max = Math.max(max, t.animIndex);
      }
    }
    return max + 1;
  }, [wordOrLetterTokens]);

  const lineTokens = React.useMemo(() => {
    if (unit === "Lines") return tokenizeLines(text);
    return [];
  }, [text, unit]);

  return (
    <div ref={containerRef} style={{ position: "relative", height: `${sectionHeightVh}vh`, overflow: "visible" }}>
      <div
        style={{
          position: "sticky",
          top,
          transform,
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <div
          style={{
            position: "relative",
            maxWidth,
            width: "100%",
            whiteSpace: "pre-wrap",
            ...style,
          }}
        >
          {unit === "Lines"
            ? lineTokens.map((t, i) => (
                <RevealLine
                  key={i}
                  line={t.value}
                  animIndex={t.animIndex}
                  totalLines={lineTokens.length}
                  progress={baseProgress}
                  activeColor={activeColor}
                  inactiveColor={inactiveColor}
                />
              ))
            : wordOrLetterTokens.map((t, i) =>
                t.kind === "br" ? (
                  <br key={i} />
                ) : (
                  <RevealToken
                    key={i}
                    value={t.value!}
                    animIndex={t.animIndex!}
                    totalAnimated={totalAnimated}
                    progress={baseProgress}
                    unit={unit}
                    activeColor={activeColor}
                    inactiveColor={inactiveColor}
                  />
                )
              )}
        </div>
      </div>
    </div>
  );
}
