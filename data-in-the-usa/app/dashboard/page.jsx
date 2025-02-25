'use client'
import { useEffect } from 'react';
import * as d3 from 'd3';
import Scatterplot from '@/d3/scatterplot'

const Dashboard = () => {
    let difficultyFilter = [];
    let data, scatterplot;

    useEffect(() => {

        d3.csv('/data/cdc.csv')
            .then(_data => {
                data = _data;
                console.log('Data loading complete. Work with dataset.');
                console.log(data);

                // Convert relevant columns to numbers
                data.forEach(d => {
                    d.median_household_income = +d.median_household_income;
                    d.percent_high_cholesterol = +d.percent_high_cholesterol;
                    d.percent_stroke = +d.percent_stroke;
                    d.percent_coronary_heart_disease = +d.percent_coronary_heart_disease;
                    d.percent_high_blood_pressure = +d.percent_high_blood_pressure;
                });
            
                // Initialize scales
                const colorScale = d3.scaleOrdinal()
                    .range(['#ff0000', '#ffa500', '#ffff00', '#008000']) // ROYG, BIV = 0000ff, 4b0082, ee82ee
                    .domain(['percent_high_cholesterol', 'percent_stroke', 'percent_coronary_heart_disease', 'percent_high_blood_pressure']); // percent_smoking, percent_no_heath_insurance
                
                // filter out rows with -1 in any relevant column
                const columnsToCheck = [
                    'median_household_income',
                    'percent_high_cholesterol',
                    'percent_stroke',
                    'percent_coronary_heart_disease',
                    'percent_high_blood_pressure'
                ];

                const newData = data.filter(d => {
                    return columnsToCheck.every(col => d[col] !== -1);
                });

                scatterplot = new Scatterplot({ 
                    parentElement: '#scatterplot',
                    colorScale: colorScale
                }, newData);
                scatterplot.updateVis();

                // barchart = new Barchart({
                //     parentElement: '#barchart',
                //     colorScale: colorScale
                // }, data);
                // barchart.updateVis();
            })
            .catch(error => console.error(error));
        return () => {
            d3.select('#scatterplot').select('svg').remove();
        };
    }, []);

    // function filterData() {
    //     if (difficultyFilter.length == 0) {
    //         scatterplot.data = data;
    //     } else {
    //         scatterplot.data = data.filter(d => difficultyFilter.includes(d.difficulty));
    //     }
    //     scatterplot.updateVis();
    // }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            {/* This is where the D3 chart will be rendered */}
            <svg className='bg-on-surface' id="scatterplot"></svg>
        </div>
    );
};

export default Dashboard;