"use client";
import { useState, useEffect, useRef } from "react";

type ProjectXP = {
  path: string;
  amount: number;
  name: string;
};

export function XPByProjectChart({ data }: { data: any[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [projectsXP, setProjectsXP] = useState<ProjectXP[]>([]);

  // Traitement des données pour regrouper XP par projet
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Regrouper les transactions par chemin de projet
    const projectXPMap = new Map<string, number>();
    const projectNameMap = new Map<string, string>();

    data.forEach((item) => {
      // Extraire le nom du projet du chemin
      const pathParts = item.path?.split("/") || [];
      const projectName =
        pathParts.length > 2 ? pathParts[pathParts.length - 2] : "Unknown";

      // Regrouper par nom de projet
      const key = projectName;
      const currentAmount = projectXPMap.get(key) || 0;
      projectXPMap.set(key, currentAmount + item.amount);
      projectNameMap.set(key, projectName);
    });

    // Convertir en tableau trié par montant d'XP
    const sortedProjects = Array.from(projectXPMap.entries())
      .map(([path, amount]) => ({
        path,
        amount,
        name: projectNameMap.get(path) || path,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Top 10 projets

    setProjectsXP(sortedProjects);
  }, [data]);

  // Mise à jour des dimensions sur redimensionnement
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height: 400 });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (projectsXP.length === 0) return <div>No project XP data available</div>;

  // Paramètres du graphique
  const margin = { top: 30, right: 30, bottom: 70, left: 80 };
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  // Calcul des échelles
  const maxXP = Math.max(...projectsXP.map((p) => p.amount));
  const barWidth = Math.min(40, width / projectsXP.length - 10);

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
        {/* Axe X */}
        <line
          x1={margin.left}
          y1={height + margin.top}
          x2={width + margin.left}
          y2={height + margin.top}
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Axe Y */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height + margin.top}
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Barres */}
        {projectsXP.map((project, i) => {
          const x =
            margin.left +
            (width / projectsXP.length) * i +
            (width / projectsXP.length - barWidth) / 2;
          const barHeight = (project.amount / maxXP) * height;
          const y = height + margin.top - barHeight;

          // Animation
          const [currentHeight, setCurrentHeight] = useState(0);

          useEffect(() => {
            const timer = setTimeout(() => {
              setCurrentHeight(barHeight);
            }, 100 + i * 50);

            return () => clearTimeout(timer);
          }, [barHeight]);

          return (
            <g key={i}>
              {/* Barre */}
              <rect
                x={x}
                y={height + margin.top - currentHeight}
                width={barWidth}
                height={currentHeight}
                fill={`hsl(${210 + i * 15}, 80%, 60%)`}
                rx={4}
                opacity={0.8}
                className="transition-all duration-500"
              />

              {/* Valeur */}
              <text
                x={x + barWidth / 2}
                y={height + margin.top - currentHeight - 5}
                textAnchor="middle"
                fontSize="12"
                fill="currentColor"
                fontWeight="bold"
              >
                {project.amount}
              </text>

              {/* Étiquette */}
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

        {/* Graduations Y */}
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
          );
        })}
      </svg>
    </div>
  );
}
