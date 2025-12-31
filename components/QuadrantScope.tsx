import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ASTNode, FlowNode, RelationNode } from '../types';

interface QuadrantScopeProps {
  ast: ASTNode | null;
  reduced: ASTNode | null;
}

const QuadrantScope: React.FC<QuadrantScopeProps> = ({ ast, reduced }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 300;
    const cx = width / 2;
    const cy = height / 2;
    const radius = 100;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Draw Grid
    const gridGroup = svg.append("g").attr("class", "grid");
    
    // Circle
    gridGroup.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", radius)
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1)
      .attr("fill", "none");

    // Crosshairs
    gridGroup.append("line")
      .attr("x1", cx - radius).attr("y1", cy)
      .attr("x2", cx + radius).attr("y2", cy)
      .attr("stroke", "#1e293b");
    
    gridGroup.append("line")
      .attr("x1", cx).attr("y1", cy - radius)
      .attr("x2", cx).attr("y2", cy + radius)
      .attr("stroke", "#1e293b");

    // If resolved to **, show explosion/center glow
    if (reduced?.type === 'Resolution') {
       svg.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", 5)
        .attr("fill", "#fbbf24")
        .transition()
        .duration(1000)
        .attr("r", 20)
        .attr("opacity", 0)
        .style("filter", "blur(4px)");
        
       svg.append("text")
        .attr("x", cx)
        .attr("y", cy + 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#fbbf24")
        .attr("font-size", "24px")
        .attr("font-weight", "bold")
        .text("**");
       return;
    }

    // Helper to collect vectors from AST
    const vectors: { pol: string, color: string }[] = [];
    
    const collectVectors = (node: ASTNode | null) => {
        if (!node) return;
        if (node.type === 'Flow') {
            const isAnchored = (node.unit as any).anchored;
            vectors.push({ 
                pol: node.polarity, 
                color: isAnchored ? "#ef4444" : "#22d3ee" // Red for anchor, Cyan for standard
            });
        }
        if (node.type === 'Relation') {
            collectVectors(node.left);
            collectVectors(node.right);
        }
    };

    // We visualize the REDUCED state (what remains)
    collectVectors(reduced);

    // Draw vectors
    vectors.forEach((v) => {
        let x2 = cx, y2 = cy;
        const length = radius * 0.8;
        
        switch(v.pol) {
            case '/+': // Up Right (Q1)
                x2 = cx + length * 0.707;
                y2 = cy - length * 0.707;
                break;
            case '\\-': // Up Left (Q2 - based on inverse logic of Up-Right)
                 // NOTE: Logic says /+ (Up-Right) cancels \- (Up-Left). 
                 // Visually: Up-Left is x negative, y negative (in screen coords y is inverted)
                 // Screen coords: y=0 is top. 
                 // Up-Right: x+, y-
                 // Up-Left: x-, y-
                 x2 = cx - length * 0.707;
                 y2 = cy - length * 0.707;
                 break;
            case '\\+': // Down Right (Q4)
                 x2 = cx + length * 0.707;
                 y2 = cy + length * 0.707;
                 break;
            case '/-': // Down Left (Q3)
                 x2 = cx - length * 0.707;
                 y2 = cy + length * 0.707;
                 break;
        }

        // Arrow marker
        const defs = svg.append("defs");
        const markerId = `arrow-${v.pol.replace(/\\/g, 'b').replace(/\//g, 'f').replace(/\+/g, 'p').replace(/-/g, 'm')}-${v.color.replace('#', '')}`;
        
        defs.append("marker")
            .attr("id", markerId)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", v.color);

        svg.append("line")
            .attr("x1", cx)
            .attr("y1", cy)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", v.color)
            .attr("stroke-width", 3)
            .attr("marker-end", `url(#${markerId})`);
    });

  }, [reduced]);

  return (
    <div className="relative flex justify-center items-center bg-slate-900 rounded-xl border border-slate-700 p-4 shadow-2xl">
        <div className="absolute top-2 left-3 text-xs text-slate-500 font-mono">SCOPE</div>
        <svg ref={svgRef} width={300} height={300} className="overflow-visible" />
        
        {/* Quadrant Labels */}
        <div className="absolute top-4 right-4 text-slate-600 text-[10px] font-mono">Q1 /+</div>
        <div className="absolute top-4 left-4 text-slate-600 text-[10px] font-mono">Q2 \-</div>
        <div className="absolute bottom-4 left-4 text-slate-600 text-[10px] font-mono">Q3 /-</div>
        <div className="absolute bottom-4 right-4 text-slate-600 text-[10px] font-mono">Q4 \+</div>
    </div>
  );
};

export default QuadrantScope;