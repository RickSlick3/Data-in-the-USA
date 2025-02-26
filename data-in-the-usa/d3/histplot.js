import * as d3 from 'd3';

class Histplot {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
        // Configuration object with defaults
            this.config = {
            parentElement: _config.parentElement,
            colors: _config.colorScale,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 200,
            margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 40},
            tooltipPadding: _config.tooltipPadding || 15
        }
        this.data = _data;
        this.colName =  "percent_stroke";
        this.initVis();
    }

    /**
    * Initialize scales/axes and append static elements, such as axis titles
    */
    initVis() {
        let vis = this;

        // Calculate inner chart size. Margin specifies the space around the actual chart.
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.colorScale = vis.config.colors;

        // Important: we flip array elements in the y output range to position the rectangles correctly
        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]) 

        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(0.2);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickFormat(d => `${d}%`)
            .tickSizeOuter(0);        

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
            .tickSizeOuter(0)

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // SVG Group containing the actual chart; D3 margin convention
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // Append empty x-axis group and move it to the bottom of the chart
        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        // Append y-axis group 
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');

        // Append axis title
        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '.71em')
            .text('Distribution of Counties');

        // vis.updateVis()
    }

    /**
    * Prepare data and scales before we render it
    */
    updateVis() {
        let vis = this;

        // Prepare data: count number of trails in each difficulty category
        // i.e. [{ key: 'easy', count: 10 }, {key: 'intermediate', ...
        // const aggregatedDataMap = d3.rollups(
        //     vis.data, 
        //     v => v.length, 
        //     d => Math.floor(d.percent_stroke)
        // );
        // vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({ key, count }));
        
        // // Sort the aggregated data numerically by the key
        // vis.aggregatedData.sort((a, b) => a.key - b.key);       

        // const orderedKeys = ['Easy', 'Intermediate', 'Difficult'];
        // vis.aggregatedData = vis.aggregatedData.sort((a,b) => {
        // return orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key);
        // });

        // // Specificy accessor functions
        // vis.colorValue = d => d.key;
        // vis.xValue = d => d.key;
        // vis.yValue = d => d.count;

        // // Set the scale input domains
        // vis.xScale.domain(vis.aggregatedData.map(vis.xValue));
        // vis.yScale.domain([0, d3.max(vis.aggregatedData, vis.yValue)]);

        // Get the extent of the column values
        const col = vis.colName;
        const [min, max] = d3.extent(vis.data, d => d[col]);
        const numBins = 8;

        // Create a histogram generator that bins data into x bins
        const histogram = d3.histogram()
            .value(d => d[col])
            .domain([min, max])
            .thresholds(numBins); // exactly x bins

        // Generate the bins
        vis.bins = histogram(vis.data);

        // Update the x-scale as a linear scale based on the data domain
        vis.xScale = d3.scaleLinear()
            .domain([min, max])
            .range([0, vis.width]);

        // Update y-scale based on the maximum count in any bin
        vis.yScale.domain([0, d3.max(vis.bins, d => d.length)]);

        // Update x-axis to display 10 ticks
        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(numBins)
            .tickFormat(d => `${d}%`)
            .tickSizeOuter(0);

        vis.renderVis();
    }

    /**
   * Bind data to visual elements
   */
    renderVis() {
        let vis = this;

        // Add rectangles
        // const bars = vis.chart.selectAll('.bar')
        //     .data(vis.aggregatedData, vis.xValue)
        // .join('rect')
        //     .attr('class', 'bar')
        //     .attr('x', d => vis.xScale(vis.xValue(d)))
        //     .attr('width', vis.xScale.bandwidth())
        //     .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
        //     .attr('y', d => vis.yScale(vis.yValue(d)))
        //     .attr('fill', d => vis.colorScale('percent_stroke'));
        
            // .attr('fill', d => vis.colorScale(vis.colorValue(d)))
            // .on('click', function(event, d) {
            //     const isActive = difficultyFilter.includes(d.key);
            //     if (isActive) {
            //         difficultyFilter = difficultyFilter.filter(f => f !== d.key); // Remove filter
            //     } else {
            //         difficultyFilter.push(d.key); // Append filter
            //     }
            
            //     filterData(); // Call global function to update scatter plot
            //     d3.select(this).classed('active', !isActive); // Add class to style active filters with CSS
            // });

        const bars = vis.chart.selectAll('.bar')
            .data(vis.bins)
            .join('rect')
                .attr('class', 'bar')
                // Use d.x0 for the left edge and compute the width from the bin boundaries.
                .attr('x', d => vis.xScale(d.x0))
                .attr('width', d => Math.max(0, vis.xScale(d.x1) - vis.xScale(d.x0) - 1))
                .attr('y', d => vis.yScale(d.length))
                .attr('height', d => vis.height - vis.yScale(d.length))
                .attr('fill', d => vis.colorScale(vis.colName));
    

        bars
            .on('mouseover', (event,d) => {
                // console.log(d); // log data in tooltip
                d3.select('#tooltip-histplot')
                    .style('display', 'block')
                    .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                    .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                    .html(`
                        <div class="tooltip-title">
                            ${d.x0} - ${d.x1}%: ${d.length} Counties
                        </div>
                    `);
            })
            .on('mouseleave', () => {
                d3.select('#tooltip-histplot').style('display', 'none');
            });

        // Update axes
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }
}
export default Histplot