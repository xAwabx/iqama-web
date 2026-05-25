import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Iqama — a quiet prayer companion for Muslims";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [fraunces, logoSvg] = await Promise.all([
    readFile(join(process.cwd(), "src/app/_assets/Fraunces-SemiBold.ttf")),
    readFile(
      join(process.cwd(), "public/logos/iqama-qaf-me-k1-bare.svg"),
      "utf-8",
    ),
  ]);

  const logoSrc = `data:image/svg+xml;utf8,${encodeURIComponent(logoSvg)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F1EB",
          color: "#2A1F18",
          padding: "80px",
          fontFamily: "Fraunces",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#2A1F18",
            marginBottom: 48,
            gap: 32,
          }}
        >
          <span>Prayer</span>
          <span style={{ color: "#8E7E70", opacity: 0.5 }}>·</span>
          <span>Partners</span>
          <span style={{ color: "#8E7E70", opacity: 0.5 }}>·</span>
          <span>Streaks</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 40,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={140} height={140} alt="" />
          <span
            style={{
              fontSize: 200,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              color: "#C96442",
            }}
          >
            IQAMA
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#8E7E70",
            marginTop: 24,
          }}
        >
          A quiet prayer companion for Muslims
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#8E7E70",
            opacity: 0.7,
            marginTop: "auto",
            paddingTop: 48,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          iqama.net · iOS &amp; Android
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Fraunces",
          data: fraunces,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
