import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Preview gerado on-demand — evita manter um PNG de 1200x630 no repositório.
export const alt = "MyRobot Araraquara — Robótica Educacional";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #F97316 0%, #FF8C00 55%, #FA8533 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 14,
            fontWeight: 300,
            opacity: 0.85,
          }}
        >
          ARARAQUARA
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 800,
            lineHeight: 1.05,
            marginTop: 24,
          }}
        >
          MyRobot
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 44,
            fontWeight: 600,
            marginTop: 8,
          }}
        >
          Robótica Educacional
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 32,
            opacity: 0.9,
            maxWidth: 900,
          }}
        >
          Cursos de robótica, programação e empreendedorismo a partir dos 5 anos.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            marginTop: "auto",
            opacity: 0.85,
          }}
        >
          {site.telefoneExibicao} · {site.endereco.cidade}/{site.endereco.estado}
        </div>
      </div>
    ),
    size
  );
}
