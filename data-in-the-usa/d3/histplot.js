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
            margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 35},
            tooltipPadding: _config.tooltipPadding || 15
        }
        this.data = _data;
        this.yColName =  "percent_stroke";
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

        // vis.updateVis()
    }

    /**
    * Prepare data and scales before we render it
    */
    updateVis() {
        let vis = this;

        if (d3.select("#y-title-hist")) { d3.select("#y-title-hist").remove(); }

        // Append axis title
        vis.svg.append('text')
            .attr('id', 'y-title-hist')
            .attr('class', 'axis-title')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '.71em')
            .text(`Dist. of \n ${vis.yColName.replace(/_/g, ' ')}`);

        // Get the extent of the column values
        const col = vis.yColName;
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

        vis.bars = vis.chart.selectAll('.bar')
            .data(vis.bins)
            .join('rect')
                .attr('class', 'bar')
                // Use d.x0 for the left edge and compute the width from the bin boundaries.
                .attr('x', d => vis.xScale(d.x0))
                .attr('width', d => Math.max(0, vis.xScale(d.x1) - vis.xScale(d.x0) - 1))
                .attr('y', d => vis.yScale(d.length))
                .attr('height', d => vis.height - vis.yScale(d.length))
                .attr('fill', d => vis.colorScale(vis.yColName))
                .style('cursor', 'pointer');
    
        vis.bars
            .on('mouseover.tooltip', (event,d) => {
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
            .on('mouseleave.tooltip', () => {
                d3.select('#tooltip-histplot').style('display', 'none');
            });

        vis.bars.on('mouseover.highlight', (event, d) => {
            // Check if an external callback has been set
            if (this.onBarIn) {
                // Pass the bin range (d.x0 and d.x1) to the callback
                this.onBarIn(d.x0, d.x1);
            }
        });
        vis.bars.on('mouseleave.highlight', (event, d) => {
            if (this.onBarOut) {
                this.onBarOut();  // This callback should trigger a reset in the scatterplot.
            }
        });

        vis.bars.on('click.toggle', function(event, d) {
            d.selected = !d.selected;
            // Call the external callback if defined, passing the bin range and new state
            if (vis.onBarClick) {
                vis.onBarClick(d.x0, d.x1, d.selected);
            }
        });

        // Update axes
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }

    highlightBinForValue(value) {
        let vis = this;
        vis.bars
            .attr('stroke', null)
            .attr('stroke-width', null);
        
            const targetBin = vis.bins.find(b => value >= b.x0 && value < b.x1);
        if (targetBin) {
            vis.bars
                .filter(d => d === targetBin)
                .attr('fill', '#ffa500');
        }
    }

    resetHighlight() {
        let vis = this;
        vis.bars.attr('fill', d => vis.colorScale(vis.yColName));
    }
}
export default Histplot