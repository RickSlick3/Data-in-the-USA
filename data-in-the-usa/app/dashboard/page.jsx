'use client'
import { useEffect } from 'react';
import * as d3 from 'd3';

const Dashboard = () => {
    useEffect(() => {
        // Use d3 to create a simple SVG element
        const svg = d3.select('#chart')
            .append('svg')
            .attr('width', 300)
            .attr('height', 200);

        svg.append('circle')
            .attr('cx', 150)
            .attr('cy', 100)
            .attr('r', 50)
            .attr('fill', 'steelblue');

        // remove the svg when the component unmounts
        return () => {
            d3.select('#chart').select('svg').remove();
        };
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            {/* This is where the D3 chart will be rendered */}
            <div id="chart"></div>
            <p>This is the Dashboard page.</p>
        </div>
    );
};

export default Dashboard;