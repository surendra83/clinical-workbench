import React, { useState,useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../assets/styles/DecisionTree.css';
import ZoomOutMapOutlinedIcon from '@mui/icons-material/ZoomOutMapOutlined';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import ZoomOutOutlinedIcon from '@mui/icons-material/ZoomOutOutlined';
import type { SimulationNodeDatum, SimulationLinkDatum } from "d3-force";
import { generateDecisionTree, getSelectedTaskTracker } from '../services/apiService';

interface CustomNode extends SimulationNodeDatum {
  x: number;
  y: number;
}
interface CustomLink extends SimulationLinkDatum<CustomNode> {}

interface TreeNode {
  member_id: string;
  content: string;
  question: string;
  logical_relation: string;
  classification_type: string;
  clinical_criteria: string;
  children?: TreeNode[];
}

const DecisionTreeBox: React.FC = () => {
  
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const zoomBehavior = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  let  dataView: any = {};
   const getDecisionTree = async () => {
             const param_stored = localStorage.getItem('param_data');
              if (param_stored){
                   const temp_parseData =JSON.parse(param_stored);
                    try {
                          console.log("Dession Tree Generation");
                          const temp_dession_tree_data = await generateDecisionTree(temp_parseData.document_id);
                          if (temp_dession_tree_data){

                                dataView =[{
                                  'member_id': '',
                                  'content': temp_parseData.document_type,
                                  'question': '',
                                  'logical_relation':'',
                                  'children':temp_dession_tree_data
                                }] 

                             }
                          // const selectedDoct = await getSelectedTaskTracker(temp_parseData.document_id);
                          // localStorage.setItem('param_data', JSON.stringify(selectedDoct));

                      } catch (error) {
                          if (error instanceof Error) {
                            console.error("Caught an error:", error.message);
                          }
                    } finally {
                      console.log("Finally block executed.");
                    }
              }

            return dataView;
   }; 


  useEffect(() => {
    getDecisionTree().then(data => {
      if (!svgRef.current) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const width = svg.node()?.getBoundingClientRect().width || 800;
      const height = 450;
      const g = svg.append("g");
      gRef.current = g.node();

      zoomBehavior.current = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 2])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });

      svg.call(zoomBehavior.current);

      const treeLayout = d3.tree<TreeNode>().size([width / 2 - 50, height - 100]);

      const trees = Array.isArray(data) ? data : [data];

      trees.forEach((treeData, index) => {
        const root = d3.hierarchy<TreeNode>(treeData);
        treeLayout(root);

        const xOffset = index * (width / trees.length);

        // Draw links
        g.selectAll(`line.tree-${index}`)
          .data(root.links() as CustomLink[])
          .enter()
          .append("line")
          .attr("x1", d => d.source.x + xOffset)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x + xOffset)
          .attr("y2", d => d.target.y)
          .attr("stroke", "#999");

        // Draw nodes
        const node = g.selectAll(`g.node.tree-${index}`)
          .data(root.descendants())
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", d => `translate(${d.x + xOffset},${d.y})`);

        const RECT_W = 18;
        const RECT_H = 18;

        node.append("rect")
          .attr("x", -RECT_W / 2)
          .attr("y", -RECT_H / 2)
          .attr("width", RECT_W)
          .attr("height", RECT_H)
          .attr("rx", 8)
          .attr("fill", "#fff")
          .attr("stroke", "#69b3a2")
          .attr("stroke-width", 1.5)
          .on("mouseover", function (event, d) {
            const svgRect = svgRef.current?.getBoundingClientRect();
            if (!svgRect) return;
            const [x, y] = d3.pointer(event, svgRef.current);

            const tooltip = d3.select("#tooltip");
            let quest = d.data.question == undefined? '': d.data.question;
            let logical= d.data.logical_relation!=''? `[ ${d.data.logical_relation} ]` : '';

            tooltip
              .style("left", `${svgRect.left + x + 10}px`)
              .style("top", `${svgRect.top + y - 10}px`)
              .style("opacity", "1")
              .html(`<strong>${d.data.content} ${logical}</strong><p>${quest}</p>`);

            d3.select(this as SVGRectElement)
              .attr("stroke", "#ffbf00ff")
              .attr("stroke-width", 2);
          })
          .on("mouseout", (event) => {
            d3.select("#tooltip").style("opacity", "0");
            d3.select(event.currentTarget as SVGRectElement)
              .attr("stroke", "#69b3a2")
              .attr("stroke-width", 1.5);
          });

        node.append("text")
          .attr("text-anchor", "middle")
          .attr("x", 0)
          .attr("y", 0)
          .attr("dy", "0.35em")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .text(d => '');
      });

      setTimeout(() => {
        handleAutoFit();
      }, 0);
    });
  }, []);

  const handleZoom = (scaleFactor: number) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    if (zoomBehavior.current) {
      svg.transition().duration(500).call(zoomBehavior.current.scaleBy, scaleFactor);
    }
  };

  const handleAutoFit = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);
    const bbox = g.node()?.getBBox();

    if (!bbox || !zoomBehavior.current) return;

    const svgWidth = svg.node()?.getBoundingClientRect().width || 800;
    const svgHeight = 450;
    const scale = Math.min(
      svgWidth / (bbox.width + 40),
      svgHeight / (bbox.height + 40)
    );

    const translateX = (svgWidth - bbox.width * scale) / 2 - bbox.x * scale;
    const translateY = (svgHeight - bbox.height * scale) / 2 - bbox.y * scale;
    const transform = d3.zoomIdentity.translate(translateX, translateY).scale(scale);
    svg.transition().duration(500).call(zoomBehavior.current.transform, transform);
  };

  return (
    <div className="decision-tree-panel">
      <div className="zoom-controls">
        <button onClick={() => handleZoom(1.2)}><ZoomInOutlinedIcon /></button>
        <button onClick={() => handleZoom(0.8)}><ZoomOutOutlinedIcon /></button>
        <button onClick={handleAutoFit}><ZoomOutMapOutlinedIcon /></button>
      </div>
      <svg ref={svgRef} width="100%" height={450}></svg>
      <div id="tooltip" className="tooltip"></div>
    </div>
  );
};

export default DecisionTreeBox;