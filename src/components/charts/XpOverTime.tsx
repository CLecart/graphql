'use client';

import { useEffect, useRef } from 'react';

interface XpTimelineChartProps {
  data: Array<{
    amount: number;
    createdAt: string;
  }>;
  width?: number;
  height?: number;
}

export function XpTimelineChart({ data, width = 1000, height = 500 }: XpTimelineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    // Process data to get cumulative XP and dates
    const sortedData = [...data]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    let cumulativeXp = 0;
    const processedData = sortedData.map(item => {
      cumulativeXp += item.amount;
      return {
        date: new Date(item.createdAt),
        xp: cumulativeXp,
        amount: item.amount
      };
    });

    // Sample data points to avoid overcrowding (every nth point)
    const sampleEvery = Math.max(1, Math.floor(processedData.length / 15));
    const sampledData = processedData.filter((_, index) => index % sampleEvery === 0 || index === processedData.length - 1);

    // Calculate dimensions and scales
    const svg = svgRef.current;
    const margin = { top: 30, right: 50, bottom: 50, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Create group for margin convention
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);

    // Calculate scales
    const minDate = new Date(Math.min(...sampledData.map(d => d.date.getTime())));
    const maxDate = new Date(Math.max(...sampledData.map(d => d.date.getTime())));
    const minXp = 0;
    const maxXp = Math.max(...sampledData.map(d => d.xp));

    const xScale = (date: Date) => {
      const time = date.getTime() - minDate.getTime();
      const totalTime = maxDate.getTime() - minDate.getTime();
      return (time / totalTime) * innerWidth;
    };

    const yScale = (xp: number) => {
      return innerHeight - (xp / maxXp) * innerHeight;
    };

    // Helper function to create SVG lines
    const createLine = (x1: number, y1: number, x2: number, y2: number, stroke = '#6b7280', strokeWidth = '1', dashArray = '') => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1.toString());
      line.setAttribute('y1', y1.toString());
      line.setAttribute('x2', x2.toString());
      line.setAttribute('y2', y2.toString());
      line.setAttribute('stroke', stroke);
      line.setAttribute('stroke-width', strokeWidth);
      if (dashArray) {
        line.setAttribute('stroke-dasharray', dashArray);
      }
      g.appendChild(line);
      return line;
    };

    // Create a background grid (optional, for better visual)
    const yGridTicks = 10;
    for (let i = 0; i <= yGridTicks; i++) {
      const yValue = (maxXp / yGridTicks) * i;
      const yPos = yScale(yValue);
      createLine(0, yPos, innerWidth, yPos, '#e5e7eb', '1', '4');
    }

    // X and Y axes (main axes)
    createLine(0, innerHeight, innerWidth, innerHeight, '#6b7280', '1.5');
    createLine(0, 0, 0, innerHeight, '#6b7280', '1.5');

    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (innerWidth / 2).toString());
    title.setAttribute('y', '-10');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#1f2937');
    title.textContent = 'XP Progress Timeline';
    g.appendChild(title);

    // Add Y axis labels
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const yValue = (maxXp / yTicks) * i;
      const yPos = yScale(yValue);
      
      createLine(0, yPos, -5, yPos);
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '-10');
      text.setAttribute('y', yPos.toString());
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', '#6b7280');
      text.setAttribute('font-size', '12');
      text.textContent = `${(yValue / 1000).toFixed(0)}k`;
      g.appendChild(text);
    }

    // Add Y axis title
    const yAxisTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yAxisTitle.setAttribute('transform', `translate(-45, ${innerHeight / 2}) rotate(-90)`);
    yAxisTitle.setAttribute('text-anchor', 'middle');
    yAxisTitle.setAttribute('font-size', '14');
    yAxisTitle.setAttribute('fill', '#4b5563');
    yAxisTitle.textContent = 'Cumulative XP';
    g.appendChild(yAxisTitle);

    // Add X axis labels (dates)
    const xTicks = 5;
    for (let i = 0; i <= xTicks; i++) {
      const date = new Date(minDate.getTime() + (i / xTicks) * (maxDate.getTime() - minDate.getTime()));
      const xPos = xScale(date);
      
      createLine(xPos, innerHeight, xPos, innerHeight + 5);
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', xPos.toString());
      text.setAttribute('y', (innerHeight + 20).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#6b7280');
      text.setAttribute('font-size', '12');
      text.textContent = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      g.appendChild(text);
    }

    // Add X axis title
    const xAxisTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xAxisTitle.setAttribute('x', (innerWidth / 2).toString());
    xAxisTitle.setAttribute('y', (innerHeight + 40).toString());
    xAxisTitle.setAttribute('text-anchor', 'middle');
    xAxisTitle.setAttribute('font-size', '14');
    xAxisTitle.setAttribute('fill', '#4b5563');
    xAxisTitle.textContent = 'Date';
    g.appendChild(xAxisTitle);

    // Create path for the line
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let pathData = '';
    sampledData.forEach((point, i) => {
      const x = xScale(point.date);
      const y = yScale(point.xp);
      if (i === 0) {
        pathData += `M ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
      }
    });
    
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#3b82f6');
    path.setAttribute('stroke-width', '2.5');
    g.appendChild(path);

    // Add dots and grid lines at each data point
    sampledData.forEach(point => {
      const x = xScale(point.date);
      const y = yScale(point.xp);
      
      // Add vertical line from point to x-axis
      createLine(x, y, x, innerHeight, '#9ca3af', '1', '3,2');
      
      // Add horizontal line from point to y-axis
      createLine(0, y, x, y, '#9ca3af', '1', '3,2');
      
      // Add the data point circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '5');
      circle.setAttribute('fill', '#3b82f6');
      g.appendChild(circle);

      // Add tooltip on hover with smart positioning
      circle.addEventListener('mouseenter', () => {
        // Create tooltip container
        const tooltipG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tooltipG.setAttribute('class', 'tooltip');
        
        // Determine tooltip position based on point position
        // If point is in the right 20% of the chart, show tooltip on the left
        const tooltipWidth = 120;
        const tooltipHeight = 50;
        const isRightSide = x > innerWidth * 0.8;
        
        const tooltipX = isRightSide ? x - tooltipWidth - 10 : x + 10;
        const tooltipY = y > tooltipHeight ? y - tooltipHeight/2 : 10;
        
        // Background rectangle
        const tooltipBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        tooltipBg.setAttribute('x', tooltipX.toString());
        tooltipBg.setAttribute('y', tooltipY.toString());
        tooltipBg.setAttribute('width', tooltipWidth.toString());
        tooltipBg.setAttribute('height', tooltipHeight.toString());
        tooltipBg.setAttribute('rx', '4');
        tooltipBg.setAttribute('fill', 'white');
        tooltipBg.setAttribute('stroke', '#d1d5db');
        tooltipBg.setAttribute('stroke-width', '1');
        tooltipG.appendChild(tooltipBg);
        
        // XP text
        const xpText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xpText.setAttribute('x', (tooltipX + 10).toString());
        xpText.setAttribute('y', (tooltipY + 20).toString());
        xpText.setAttribute('fill', '#1f2937');
        xpText.setAttribute('font-size', '13');
        xpText.setAttribute('font-weight', 'bold');
        xpText.textContent = `${(point.xp / 1000).toFixed(1)}k XP`;
        tooltipG.appendChild(xpText);
        
        // Date text
        const dateText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        dateText.setAttribute('x', (tooltipX + 10).toString());
        dateText.setAttribute('y', (tooltipY + 40).toString());
        dateText.setAttribute('fill', '#6b7280');
        dateText.setAttribute('font-size', '12');
        dateText.textContent = point.date.toLocaleDateString();
        tooltipG.appendChild(dateText);
        
        g.appendChild(tooltipG);
      });

      circle.addEventListener('mouseleave', () => {
        const tooltip = g.querySelector('.tooltip');
        if (tooltip) g.removeChild(tooltip);
      });
    });

  }, [data, width, height]);

  return (
    <div className="overflow-x-auto">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto"
      />
    </div>
  );
}