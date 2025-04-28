"use client";
import { useState, useEffect } from "react";

type Skill = {
  name: string;
  score: number;
};

export function SkillsRadarChart({ data }: { data: any[] }) {
  // Déplacer TOUS les hooks au début du composant
  const [skills, setSkills] = useState<Skill[]>([]);
  const [scale, setScale] = useState(0); // Déplacé ici en haut

  // Extraire les compétences à partir des données progress
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Définir les catégories de compétences communes
    const skillCategories = [
      { key: "go", name: "Go" },
      { key: "js", name: "JavaScript" },
      { key: "html", name: "HTML/CSS" },
      { key: "react", name: "React" },
      { key: "algo", name: "Algorithms" },
      { key: "docker", name: "Docker" },
      { key: "sql", name: "SQL" },
    ];

    // Calculer les scores pour chaque catégorie
    const skillScores = skillCategories.map((category) => {
      // Filtrer les projets qui correspondent à cette catégorie
      const categoryProjects = data.filter(
        (item) =>
          (item.path || "")
            .toLowerCase()
            .includes(category.key.toLowerCase()) ||
          (item.object?.name || "")
            .toLowerCase()
            .includes(category.key.toLowerCase())
      );

      // Calculer le score moyen (note moyenne)
      const totalGrade = categoryProjects.reduce(
        (sum, project) => sum + (project.grade || 0),
        0
      );
      const avgScore =
        categoryProjects.length > 0
          ? (totalGrade / categoryProjects.length) * 100
          : 0;

      return {
        name: category.name,
        score: Math.min(Math.round(avgScore), 100), // Score max 100
      };
    });

    setSkills(skillScores);
  }, [data]);

  // Animation de l'effet d'échelle
  useEffect(() => {
    const timer = setTimeout(() => setScale(1), 100);
    return () => clearTimeout(timer);
  }, []);

  if (skills.length === 0) return <div>No skills data available</div>;

  // Paramètres du graphique
  const size = 300;
  const center = size / 2;
  const radius = size * 0.4;
  const angleStep = (Math.PI * 2) / skills.length;

  // Points du polygone des compétences
  const skillsPoints = skills
    .map((skill, i) => {
      const angle = i * angleStep - Math.PI / 2; // Commencer par le haut
      const distance = (skill.score / 100) * radius;
      const x = center + distance * Math.cos(angle);
      const y = center + distance * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-lg font-medium mb-4">Skills Overview</h3>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Cercles concentriques */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((level, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * level}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1"
            opacity={0.2}
          />
        ))}

        {/* Lignes des axes */}
        {skills.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);

          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}

        {/* Polygone des compétences */}
        <polygon
          points={skillsPoints}
          fill="var(--color-chart-1)"
          opacity="0.7"
          strokeWidth="2"
          stroke="var(--color-chart-1)"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center",
            transition: "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />

        {/* Points des compétences */}
        {skills.map((skill, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const distance = (skill.score / 100) * radius;
          const x = center + distance * Math.cos(angle);
          const y = center + distance * Math.sin(angle);

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="var(--color-chart-1)"
              className="animate-pulse"
            />
          );
        })}

        {/* Étiquettes */}
        {skills.map((skill, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelDistance = radius * 1.15;
          const x = center + labelDistance * Math.cos(angle);
          const y = center + labelDistance * Math.sin(angle);

          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fontWeight="500"
              fill="currentColor"
            >
              {skill.name}
            </text>
          );
        })}
      </svg>

      {/* Légende des scores */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {skills.map((skill, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: `var(--color-chart-${(i % 5) + 1})` }}
            ></div>
            <span className="text-sm">
              {skill.name}:{" "}
              <span className="font-semibold">{skill.score}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
