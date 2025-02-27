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
            // filter: _config.filter,
            containerWidth: _config.containerWidth || 300,
            containerHeight: _config.containerHeight || 300,
            margin: _config.margin || {top: 25, right: 20, bottom: 30, left: 35},
            tooltipPadding: _config.tooltipPadding || 15
        }
        this.data = _data;
        this.yColName = "percent_stroke";
        this.xColName = "median_household_income";
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

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
            // .tickSize(-vis.width - 10)
            .tickPadding(10)
            .tickFormat(d => d + '%');

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
    }

    /**
   * Prepare the data and scales before we render it.
   */
    updateVis() {
        let vis = this;
        console.log("Updating scatterplot for column:", vis.yColName);
        
        if (d3.select("#x-title-scat")) { d3.select("#x-title-scat").remove(); d3.select("#y-title-scat").remove(); }

        if (vis.xColName == "median_household_income") {
            vis.xAxis = d3.axisBottom(vis.xScale)
                .ticks(6)
                .tickPadding(10)
                .tickFormat(d => '$' + d/1000 + 'K');
        } else {
            vis.xAxis = d3.axisBottom(vis.xScale)
                .ticks(6)
                .tickPadding(10)
                .tickFormat(d => d + '%');
        }

        // Append both axis titles
        vis.chart.append('text')
            .attr('id', 'x-title-scat')
            .attr('class', 'axis-title')
            .attr('y', vis.height - 15)
            .attr('x', vis.width + 10)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .style('font-size', '12px')
            .text(vis.xColName.replace(/_/g, ' '));

        vis.svg.append('text')
            .attr('id', 'y-title-scat')
            .attr('class', 'axis-title font-Outfit')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '.71em')
            .text(vis.yColName.replace(/_/g, ' '));

        // Transform the data from wide to long format
        // const cols = [
        //     // 'percent_high_cholesterol', 
        //     // 'percent_stroke', 
        //     // 'percent_coronary_heart_disease', 
        //     'percent_high_blood_pressure'
        // ];
        
        // vis.data = vis.data.flatMap(d =>
        //     cols.map(col => ({
        //         display_name: d.display_name,
        //         median_household_income: +d.median_household_income,
        //         col: col,
        //         value: +d[col]
        //     }))
        // );

        const col = vis.yColName;
        const xCol = vis.xColName;
        vis.data = vis.data.map(d => ({
            display_name: d.display_name,
            xCol: +d[xCol],
            col: col,
            value: +d[col]
        }));

        console.log(vis.data)
    
        // Specificy accessor functions
        vis.xValue = d => d.xCol;
        vis.yValue = d => d.value;
        vis.colorValue = d => d.col;

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
                .attr('r', 2)
                .attr('cy', d => vis.yScale(vis.yValue(d)))
                .attr('cx', d => vis.xScale(vis.xValue(d)))
                .attr('fill', d => vis.config.colorScale(vis.colorValue(d)))
                .style('cursor', 'pointer');

        // Tooltip event listeners
        const xFormatName = vis.xColName.replace(/_/g, ' ');
        let perc = '';
        let dol = '';
        if (vis.xColName == "median_household_income") { dol = '$'; } 
        else { perc = '%'; }
        circles
            .on('mouseover', (event,d) => {
                // console.log(d); // log data in tooltip
                d3.select('#tooltip-scatterplot')
                    .style('display', 'block')
                    .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                    .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                    .html(`
                        <div class="tooltip-title">${d.display_name}</div>
                        <div><i>${xFormatName}: ${dol}${d.xCol}${perc}</i></div>
                        <div><i>${d.col}: ${d.value}%</i></div>
                    `);
            })
            .on('mouseleave', () => {
                d3.select('#tooltip-scatterplot').style('display', 'none');
            });

        circles.on('mouseover', (event, d) => {
            // If an external callback is provided, pass the clicked circle's value.
            if (this.onCircleClick) {
                this.onCircleClick(d.value);
            }
        });
        circles.on('mouseleave.highlight', (event, d) => {
            if (this.onCircleOut) {
                this.onCircleOut();  // This callback should trigger a reset in the histogram.
            }
        });
        
        // Update the axes/gridlines
        // We use the second .call() to remove the axis and just show gridlines
        // vis.xAxisG
        //     .call(vis.xAxis)
        //     .call(g => g.select('.domain').remove());

        // vis.yAxisG
        //     .call(vis.yAxis)
        //     .call(g => g.select('.domain').remove())

        // update axis
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }

    filterByRange(rangeLow, rangeHigh) {
        let vis = this;
        // Define the highlight color (adjust as needed)
        const highlightColor = '#ffa500';
        // Reset or update the fill color for all circles
        vis.chart.selectAll('.point')
            .attr('fill', d => {
                // If the value is within the selected bin range, use the highlight color.
                return (d.value >= rangeLow && d.value < rangeHigh) 
                    ? highlightColor 
                    : vis.config.colorScale(d.col);
            });
    }

    resetFilter() {
        let vis = this;
        vis.chart.selectAll('.point')
            .attr('fill', d => vis.config.colorScale(d.col));
    }
}

export default Scatterplot;