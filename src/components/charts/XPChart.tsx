"use client";
import { useState, useEffect, useRef } from "react";

// Constantes globales pour les couleurs et dimensions
const CHART_COLOR_1 = "var(--color-chart-1)";
const CHART_COLOR_5 = "var(--color-chart-5)";
const CHART_HEIGHT = 300;
const CHART_MARGIN = { top: 20, right: 30, bottom: 30, left: 60 };

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Point de données pour l'évolution de l'XP.
 */
type XPDataPoint = {
  date: Date;
  total: number;
};

/**
 * Props pour le composant XPChart.
 */
interface XPChartProps {
  data: Array<{
    amount: number;
    createdAt: string;
  }>;
}

/**
 * Affiche l'évolution de l'XP dans le temps sous forme de courbe.
 */
export function XPChart({ data }: XPChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: CHART_HEIGHT,
  });
  const [cumulativeXP, setCumulativeXP] = useState<XPDataPoint[]>([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    let totalXP = 0;
    const xpData = data.map((item) => {
      totalXP += item.amount;
      return {
        date: new Date(item.createdAt),
        amount: item.amount,
        total: totalXP,
      };
    });

    setCumulativeXP(xpData);
  }, [data]);

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height: CHART_HEIGHT });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (cumulativeXP.length === 0) return <div>No XP data available</div>;

  const margin = CHART_MARGIN;
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  const xMin = cumulativeXP[0].date;
  const xMax = cumulativeXP[cumulativeXP.length - 1].date;
  const yMax = cumulativeXP[cumulativeXP.length - 1].total;

  const points = cumulativeXP
    .map((d) => {
      const x =
        margin.left +
        (width * (d.date.getTime() - xMin.getTime())) /
          (xMax.getTime() - xMin.getTime());
      const y = height + margin.top - (height * d.total) / yMax;
      return `${x},${y}`;
    })
    .join(" ");

  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((percent) => {
    const date = new Date(
      xMin.getTime() + percent * (xMax.getTime() - xMin.getTime())
    );
    const x = margin.left + width * percent;
    return { date, x };
  });

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((percent) => {
    const value = Math.round(yMax * percent);
    const y = height + margin.top - height * percent;
    return { value, y };
  });

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">XP Growth Over Time</h3>
      <svg
        ref={svgRef}
        width="100%"
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="overflow-visible"
      >
        <line
          x1={margin.left}
          y1={height + margin.top}
          x2={width + margin.left}
          y2={height + margin.top}
          stroke="currentColor"
          strokeWidth="2"
        />

        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height + margin.top}
          stroke="currentColor"
          strokeWidth="2"
        />

        {xTicks.map(({ date, x }, i) => (
          <g key={i}>
            <line
              x1={x}
              y1={height + margin.top}
              x2={x}
              y2={height + margin.top + 6}
              stroke="currentColor"
            />
            <text
              x={x}
              y={height + margin.top + 20}
              textAnchor="middle"
              fontSize="12"
              fill="currentColor"
            >
              {formatDate(date)}
            </text>
          </g>
        ))}

        {yTicks.map(({ value, y }, i) => (
          <g key={i}>
            <line
              x1={margin.left - 6}
              y1={y}
              x2={margin.left}
              y2={y}
              stroke="currentColor"
            />
            <text
              x={margin.left - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="currentColor"
            >
              {value.toLocaleString()}
            </text>
            <line
              x1={margin.left}
              y1={y}
              x2={width + margin.left}
              y2={y}
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="4"
              opacity="0.3"
            />
          </g>
        ))}

        <polyline
          fill="none"
          stroke={CHART_COLOR_1}
          strokeWidth="3"
          points={points}
        />

        <linearGradient id="xpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={CHART_COLOR_1} stopOpacity="0.5" />
          <stop offset="100%" stopColor={CHART_COLOR_1} stopOpacity="0.05" />
        </linearGradient>
        <polygon
          fill="url(#xpGradient)"
          points={`${margin.left},${height + margin.top} ${points} ${
            width + margin.left
          },${height + margin.top}`}
        />
      </svg>
    </div>
  );
}
