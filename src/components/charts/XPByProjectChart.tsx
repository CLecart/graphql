"use client";
import { useState, useEffect, useRef } from "react";

/**
 * Données d'XP par projet.
 */
type ProjectXP = {
  path: string;
  amount: number;
  name: string;
};

/**
 * Props pour le composant XPByProjectChart.
 */
interface XPByProjectChartProps {
  data: Array<{
    path: string;
    amount: number;
    object?: { name?: string };
  }>;
}

// Constantes globales pour la chart
const CHART_COLOR_1 = "var(--color-chart-1)";
const CHART_HEIGHT = 400;
const CHART_MARGIN = { top: 30, right: 30, bottom: 70, left: 80 };
const BAR_MAX_WIDTH = 40;

function formatNumber(n: number) {
  return n.toLocaleString();
}

/**
 * Affiche un graphique des projets ayant rapporté le plus d'XP.
 */
export function XPByProjectChart({ data }: XPByProjectChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: CHART_HEIGHT,
  });
  const [projectsXP, setProjectsXP] = useState<ProjectXP[]>([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const projectXPMap = new Map<string, number>();
    const projectNameMap = new Map<string, string>();

    data.forEach((item) => {
      const pathParts = item.path?.split("/") || [];
      const projectName =
        pathParts.length > 2 ? pathParts[pathParts.length - 2] : "Unknown";

      const key = projectName;
      const currentAmount = projectXPMap.get(key) || 0;
      projectXPMap.set(key, currentAmount + item.amount);
      projectNameMap.set(key, projectName);
    });

    const sortedProjects = Array.from(projectXPMap.entries())
      .map(([path, amount]) => ({
        path,
        amount,
        name: projectNameMap.get(path) || path,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    setProjectsXP(sortedProjects);
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

  if (projectsXP.length === 0) return <div>No project XP data available</div>;

  const margin = CHART_MARGIN;
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  const maxXP = Math.max(...projectsXP.map((p) => p.amount));
  const barWidth = Math.min(BAR_MAX_WIDTH, width / projectsXP.length - 10);

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Top Projects by XP</h3>
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

        {projectsXP.map((project, i) => {
          const x =
            margin.left +
            (width / projectsXP.length) * i +
            (width / projectsXP.length - barWidth) / 2;
          const barHeight = (project.amount / maxXP) * height;
          const y = height + margin.top - barHeight;

          const [currentHeight, setCurrentHeight] = useState(0);

          useEffect(() => {
            const timer = setTimeout(() => {
              setCurrentHeight(barHeight);
            }, 100 + i * 50);

            return () => clearTimeout(timer);
          }, [barHeight]);

          return (
            <g key={i}>
              <rect
                x={x}
                y={height + margin.top - currentHeight}
                width={barWidth}
                height={currentHeight}
                fill={CHART_COLOR_1}
                rx={4}
                opacity={0.8}
                className="transition-all duration-500"
              />

              <text
                x={x + barWidth / 2}
                y={height + margin.top - currentHeight - 5}
                textAnchor="middle"
                fontSize="12"
                fill="currentColor"
                fontWeight="bold"
              >
                {formatNumber(project.amount)}
              </text>

              <text
                x={x + barWidth / 2}
                y={height + margin.top + 15}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                transform={`rotate(45, ${x + barWidth / 2}, ${
                  height + margin.top + 15
                })`}
              >
                {project.name}
              </text>
            </g>
          );
        })}

        {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => {
          const value = Math.round(maxXP * percent);
          const y = height + margin.top - height * percent;

          return (
            <g key={i}>
              <line
                x1={margin.left - 5}
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
                {formatNumber(value)}
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
          );
        })}
      </svg>
    </div>
  );
}
