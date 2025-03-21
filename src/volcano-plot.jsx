import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

// Helper function to calculate symmetric domain for xScale
const calculateSymmetricDomain = (data, accessor) => {
  const maxAbsValue = Math.max(
    Math.abs(d3.min(data, accessor)),
    Math.abs(d3.max(data, accessor))
  );
  return [-maxAbsValue, maxAbsValue];
};

// Helper function to create xScale
const createXScale = (data, width) => {
  return d3
    .scaleLinear()
    .domain(calculateSymmetricDomain(data, (d) => d.log2FoldChange))
    .range([0, width]);
};

// Helper function to create yScale
const createYScale = (data, height) => {
  return d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => -Math.log10(d.pvalue))])
    .range([height, 0]);
};

const VolcanoPlot = ({ data }) => {
  const svgRef = useRef(null);
  const width = 800;
  const height = 400;

  useEffect(() => {
    // TODO: Move to a separate function
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', 'white');

    // Use helper functions for scales
    const xScale = createXScale(data, width);
    const yScale = createYScale(data, height);

    const xAxis = d3.axisBottom(xScale);
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('Log2 Fold Change');

    const yAxis = d3.axisLeft(yScale);
    svg
      .append('g')
      .call(yAxis)
      .append('text')
      .attr('x', -40)
      .attr('y', height / 2)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('-Log10(p-value)');

    // Tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'white')
      .style('border', '1px solid black')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('box-shadow', '0px 0px 10px rgba(0, 0, 0, 0.1)')
      .style('color', 'black');

    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.log2FoldChange))
      .attr('cy', (d) => yScale(-Math.log10(d.pvalue)))
      .attr('r', 5)
      .attr('fill', (d) =>
        d.pvalue < 0.05 && Math.abs(d.log2FoldChange) > 1 ? 'red' : 'gray'
      )
      .on('mouseover', function (event, d) {
        console.log(d);
        // TODO: Improve HTML and styling for tooltip
        tooltip.style('visibility', 'visible').html(`
            <strong>Gene ID:</strong> ${d.GeneID}<br>
            <strong>Log FC:</strong> ${d.log2FoldChange}<br>
            <strong>-Log10(p-value):</strong> ${-Math.log10(d.pvalue)}<br>
            <strong>P-value:</strong> ${d.pvalue}
          `);
      })
      .on('mousemove', function (event) {
        tooltip
          .style('top', event.pageY + 10 + 'px')
          .style('left', event.pageX + 10 + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('visibility', 'hidden');
      });
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default VolcanoPlot;
