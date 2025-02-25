import * as d3 from 'd3';

class Scatterplot {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            colorScale: _config.colorScale,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 500,
            margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 35},
            tooltipPadding: _config.tooltipPadding || 15
        }
        this.data = _data;
        this.initVis();
    }

    /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.xScale = d3.scaleLinear()
            .range([0, vis.width]);

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(6)
            .tickSize(-vis.height - 10)
            .tickPadding(10)
            .tickFormat(d => '$' + d);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
            .tickSize(-vis.width - 10)
            .tickPadding(10)
            .tickFormat(d => d);

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // Append group element that will contain our actual chart 
        // and position it according to the given margin config
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // Append empty x-axis group and move it to the bottom of the chart
        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        // Append y-axis group
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');

         // Append both axis titles
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('y', vis.height - 15)
            .attr('x', vis.width + 10)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Median Household Income');

        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '.71em')
            .text('Percent People with Cardiovascular Disease');
    }

    /**
   * Prepare the data and scales before we render it.
   */
    updateVis() {
        let vis = this;

        // Transform the data from wide to long format
        const metrics = [
            'percent_high_cholesterol', 
            'percent_stroke', 
            'percent_coronary_heart_disease', 
            'percent_high_blood_pressure'
        ];
        
        vis.data = vis.data.flatMap(d =>
            metrics.map(metric => ({
                median_household_income: +d.median_household_income,
                metric: metric,
                value: +d[metric]
            }))
        );
    
        // Specificy accessor functions
        // vis.colorValue = d => d.???;
        // vis.xValue = d => d.median_household_income;
        // vis.yValue = d => d.???;
        vis.xValue = d => d.median_household_income;
        vis.yValue = d => d.value;
        vis.colorValue = d => d.metric;

        // Set the scale input domains
        vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
        vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);

        vis.renderVis();
    }

    /**
   * Bind data to visual elements.
   */
    renderVis() {
        let vis = this;

        // Add circles
        const circles = vis.chart.selectAll('.point')
                .data(vis.data, d => d.trail)
            .join('circle')
                .attr('class', 'point')
                .attr('r', 4)
                .attr('cy', d => vis.yScale(vis.yValue(d)))
                .attr('cx', d => vis.xScale(vis.xValue(d)))
                .attr('fill', d => vis.config.colorScale(vis.colorValue(d)));

        // Tooltip event listeners
        circles
            .on('mouseover', (event,d) => {
                d3.select('#tooltip')
                    .style('display', 'block')
                    .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                    .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                    .html(`
                        <div class="tooltip-title">${d.display_name}</div>
                        <div><i>${d.median_household_income}</i></div>
                        <ul>
                            <li>${d.percent_high_cholesterol}</li>
                            <li>${d.percent_stroke}</li>
                            <li>${d.percent_coronary_heart_disease}</li>
                            <li>${d.percent_high_blood_pressure}</li>
                        </ul>
                    `);
            })
            .on('mouseleave', () => {
                d3.select('#tooltip').style('display', 'none');
            });
        
        // Update the axes/gridlines
        // We use the second .call() to remove the axis and just show gridlines
        vis.xAxisG
            .call(vis.xAxis)
            .call(g => g.select('.domain').remove());

        vis.yAxisG
            .call(vis.yAxis)
            .call(g => g.select('.domain').remove())
    }
}

export default Scatterplot;