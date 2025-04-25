'use client';

import { useEffect, useRef } from 'react';

interface SkillData {
  name: string;
  value: number; // Exact value from transactions
}

interface SkillsRadarChartProps {
  data: Array<{
    type: string;
    amount: number;
  }>;
  width?: number;
  height?: number;
  levels?: number;
  maxSkills?: number;
}

export function SpiderWebChart({ 
  data, 
  width = 500, 
  height = 500,
  levels = 5,
  maxSkills = 8
}: SkillsRadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    // Process data to get the MAX value for each skill
    const skillMap = new Map<string, number>();
    
    data.forEach(transaction => {
      if (!transaction.type.startsWith('skill_')) return;
      
      const skillName = transaction.type.replace('skill_', '');
      const currentMax = skillMap.get(skillName) || 0;
      if (transaction.amount > currentMax) {
        skillMap.set(skillName, transaction.amount);
      }
    });

    // Convert to array and sort by value
    const skills: SkillData[] = Array.from(skillMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Take top skills
    const displaySkills = skills.slice(0, maxSkills);
    const maxValueInData = 100;

    // Clear previous content
    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild);
    }

    // Setup dimensions
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;
    const angleSlice = (Math.PI * 2) / displaySkills.length;

    // Create SVG group
    const svg = svgRef.current;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${centerX},${centerY})`);
    svg.appendChild(g);

    // Draw background circles (levels)
    for (let level = levels; level >= 1; level--) {
      const levelRadius = (level / levels) * radius;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '0');
      circle.setAttribute('cy', '0');
      circle.setAttribute('r', levelRadius.toString());
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', '#e2e8f0');
      circle.setAttribute('stroke-width', '1');
      g.appendChild(circle);

      // Add level label (actual values)
      const levelValue = Math.round((maxValueInData * level) / levels);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '0');
      text.setAttribute('y', (-levelRadius - 5).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#64748b');
      text.setAttribute('font-size', '10');
      text.textContent = levelValue.toString();
      g.appendChild(text);
    }

    // Draw axes
    displaySkills.forEach((skill, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', '0');
      line.setAttribute('x2', (Math.cos(angle) * radius).toString());
      line.setAttribute('y2', (Math.sin(angle) * radius).toString());
      line.setAttribute('stroke', '#e2e8f0');
      line.setAttribute('stroke-width', '1');
      g.appendChild(line);

      // Add skill name
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (Math.cos(angle) * (radius + 20)).toString());
      text.setAttribute('y', (Math.sin(angle) * (radius + 20)).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#334155');
      text.setAttribute('font-size', '12');
      text.textContent = skill.name.replace(/-/g, ' ').toUpperCase();
      g.appendChild(text);
    });

    // Draw data polygon (using exact values)
    const polygonPoints = displaySkills.map((skill, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const valueRatio = skill.value / maxValueInData;
      const x = Math.cos(angle) * radius * valueRatio;
      const y = Math.sin(angle) * radius * valueRatio;
      return `${x},${y}`;
    }).join(' ');

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', polygonPoints);
    polygon.setAttribute('fill', 'rgba(59, 130, 246, 0.2)');
    polygon.setAttribute('stroke', 'rgb(59, 130, 246)');
    polygon.setAttribute('stroke-width', '2');
    g.appendChild(polygon);

    // Add data points with exact values
    displaySkills.forEach((skill, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const valueRatio = skill.value / maxValueInData;
      const x = Math.cos(angle) * radius * valueRatio;
      const y = Math.sin(angle) * radius * valueRatio;

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', 'rgb(59, 130, 246)');
      g.appendChild(circle);

      // Add exact value label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x.toString());
      text.setAttribute('y', (y - 8).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#1e293b');
      text.setAttribute('font-size', '10');
      text.setAttribute('font-weight', 'bold');
      text.textContent = `${skill.value}`;
      g.appendChild(text);
    });

  }, [data, width, height, levels, maxSkills]);

  return (
    <div className="flex flex-col items-center">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
      />
      <p className="text-sm text-muted-foreground mt-2">
        Skill levels (showing highest achieved values)
      </p>
    </div>
  );
}