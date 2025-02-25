import * as d3 from 'd3';
import topojson from '@/d3/topojson.v3'

class ChoroplethMap {

    /**
     * Class constructor with basic configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data, cdcData) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 1100,
            containerHeight: _config.containerHeight || 500,
            margin: _config.margin || {top: 0, right: 0, bottom: 0, left: 0},
            tooltipPadding: 10,
            legendBottom: 50,
            legendLeft: 100,
            legendRectHeight: 200, 
            legendRectWidth: 12,
        }
        this.geoData = _data;
        this.cdcData = cdcData;
        this.colName = "percent_stroke";
        // this.config = _config;
        this.us = _data;
        // this.active = d3.select(null);
        this.initVis();
    }

    /**
     * We initialize scales/axes and append static elements, such as axis titles.
     */
    initVis() {
        let vis = this;

        // Calculate inner chart size. Margin specifies the space around the actual chart.
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement).append('svg')
            .attr('class', 'center-container')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // title
        // Add a title at the top center of the map
        vis.svg.append("text")
            .attr("x", vis.config.containerWidth / 2)
            .attr("y", 30) // Adjust the y-position as needed
            .attr("text-anchor", "middle")
            .attr("class", "map-title font-bold")
            .text("Spacial Distribution of Health");

        vis.projection = d3.geoAlbersUsa()
            .translate([vis.width /2 , vis.height / 2])
            .scale(vis.width);

        vis.g = vis.svg.append("g")
                .attr('class', 'center-container center-items us-state')
                .attr('transform', 'translate('+vis.config.margin.left+','+vis.config.margin.top+')')
                .attr('width', vis.width + vis.config.margin.left + vis.config.margin.right)
                .attr('height', vis.height + vis.config.margin.top + vis.config.margin.bottom)
    }

    updateVis() {
        let vis = this;

        if (d3.select("#legend")) {
            d3.select("#legend").remove();
            d3.select("#legend-axis").remove();
        }
        
        // Combine both datasets by adding the population density to the TopoJSON file
        // console.log(geoData);
        vis.geoData.objects.counties.geometries.forEach(d => {
            // console.log(d);  
            for (let i = 0; i < vis.cdcData.length; i++) {
                if (d.id === vis.cdcData[i].cnty_fips) {
                    // assign a new property to d to use in the map
                    d.properties.colValue = +vis.cdcData[i][vis.colName];
                    d.properties.colName = vis.colName
                }
            }
        });

        // Extract valid colValue values (exclude -1)
        const validValues = vis.geoData.objects.counties.geometries
            .map(d => d.properties.colValue)
            .filter(val => val !== -1);

        vis.colorScale = d3.scaleLinear()
            // use 0 as min to emphasize the higher percents
            .domain([0, d3.max(validValues)]) // d3.min(validValues)
            .range(['#39FF14', '#000'])
            .interpolate(d3.interpolateHcl);

        vis.path = d3.geoPath()
            .projection(vis.projection);

        vis.counties = vis.g.append("g")
            .attr("id", "counties")
            .selectAll("path")
            .data(topojson.feature(vis.us, vis.us.objects.counties).features)
        .enter().append("path")
            .attr("d", vis.path)
            .attr("class", "county-boundary")
            .attr('fill', d => {
                if (d.properties.colValue === -1) {
                    return '#ff9195';
                } else if (d.properties.colValue) {
                    return vis.colorScale(d.properties.colValue);
                } else {
                    return 'url(#lightstripe)';
                }
            });

        /**
        * Here we will create the legend for the map
        */
        const defs = vis.svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "legend-gradient")
            // Set gradient direction: from bottom (low values) to top (high values)
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "0%")
            .attr("y2", "0%");

        gradient.selectAll("stop")
            .data(vis.colorScale.ticks().map((d, i, nodes) => ({
                offset: `${(100 * i) / (nodes.length - 1)}%`,
                color: vis.colorScale(d)
            })))
            .enter().append("stop")
            .attr("offset", d => d.offset)
            .attr("stop-color", d => d.color);

        // Draw the vertical legend rectangle filled with the gradient
        // Adjust legend dimensions: e.g., a narrow width and a taller height.
        vis.svg.append("rect")
            .attr("x", vis.config.legendLeft)
            .attr("y", vis.config.containerHeight - vis.config.legendBottom - vis.config.legendRectHeight)
            .attr("width", vis.config.legendRectWidth)
            .attr("height", vis.config.legendRectHeight)
            .style("fill", "url(#legend-gradient)");

        // Create a scale for the legend axis using the same domain as your color scale
        //  the range is inverted because the vertical axis goes from bottom (low) to top (high)
        const legendAxisScale = d3.scaleLinear()
            .domain(vis.colorScale.domain())
            .range([vis.config.legendRectHeight, 0]);

        // Append a vertical axis next to the legend rectangle
        const legendAxis = d3.axisRight(legendAxisScale)
            .ticks(5); // Adjust tick count as needed

        vis.svg.append("g")
            .attr("id", "legend-axis")
            .attr("class", "legend-axis")
            .attr("transform", `translate(${vis.config.legendLeft + vis.config.legendRectWidth}, ${vis.config.containerHeight - vis.config.legendBottom - vis.config.legendRectHeight})`)
            .call(legendAxis);

        vis.renderVis();
    }

    renderVis() {
        let vis = this;
        
        vis.counties
            .on('mouseover', (event,d) => {
                console.log(d);
                // console.log(event);
                const percentValue = d.properties.colValue && d.properties.colValue != -1 ? `${d.properties.colName}: <strong>${d.properties.colValue}</strong>%</sup>` : 'No data available'; 
                d3.select('#tooltip-choropleth')
                    .style('display', 'block')
                    .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                    .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                    .html(`
                        <div class="tooltip-title">${d.properties.name}</div>
                        <div>${percentValue}</div>
                    `);
            })
            .on('mouseleave', () => {
                d3.select('#tooltip-choropleth').style('display', 'none');
            });

        vis.g.append("path")
            .datum(topojson.mesh(vis.us, vis.us.objects.states, function(a, b) { return a !== b; }))
            .attr("id", "state-borders")
            .attr("d", vis.path);
    }
}

export default ChoroplethMap