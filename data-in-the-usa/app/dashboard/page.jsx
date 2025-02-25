'use client'
import { useEffect } from 'react';
import * as d3 from 'd3';
import Scatterplot from '@/d3/scatterplot'
import Histplot from '@/d3/histplot'

const Dashboard = () => {
    let colFilter = [];
    let data, scatterplot, histplot;


    useEffect(() => {
        d3.csv('/data/cdc.csv')
            .then(_data => {
                data = cleanData(_data);
                console.log('Data loading complete. Work with dataset.');

                // Initialize color scale
                const colorScale = d3.scaleOrdinal()
                    .range(['#ff0000', '#ffa500', '#0000ff', '#008000']) // ROBG, YIV = ffff00, 4b0082, ee82ee
                    .domain(['percent_high_cholesterol', 'percent_stroke', 'percent_coronary_heart_disease', 'percent_high_blood_pressure']); // percent_smoking, percent_no_heath_insurance

                scatterplot = new Scatterplot({ 
                    parentElement: '#scatterplot',
                    colorScale: colorScale,
                    filter: colFilter
                }, data);
                scatterplot.updateVis();

                histplot = new Histplot({
                    parentElement: '#histplot',
                    colorScale: colorScale
                }, data);
                histplot.updateVis();
            })
            .catch(error => console.error(error));
        return () => {
            d3.select('#scatterplot').select('svg').remove();
            d3.select('#histplot').select('svg').remove();
        };
    }, []);


    // ensure all data is numeric and remove missing values
    const cleanData = (data) => {
        // Convert relevant columns to numbers
        data.forEach(d => {
            d.median_household_income = +d.median_household_income;
            d.percent_high_cholesterol = +d.percent_high_cholesterol;
            d.percent_stroke = +d.percent_stroke;
            d.percent_coronary_heart_disease = +d.percent_coronary_heart_disease;
            d.percent_high_blood_pressure = +d.percent_high_blood_pressure;
        });
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
        console.log(newData);
        return newData;
    }


    function filterColumns(colName) {
        const index = colFilter.indexOf(colName)
        index === -1 ? colFilter.push(colName) : colFilter.splice(index, 1);
        // if (colFilter.length == 0) {
        //     scatterplot.data = data;
        // } else {
        //     scatterplot.data = data.filter(d => difficultyFilter.includes(d.difficulty));
        // }
        scatterplot.updateVis();
    }


    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Health's Relationship with Wealth</h1>
            {/* This is where the D3 chart will be rendered */}

            {/* <ul className="legend">
                <li className="legend-btn" col="percent_high_cholesterol"><span className="legend-symbol"></span>High Cholesterol</li>
                <li className="legend-btn" col="percent_stroke"><span className="legend-symbol"></span>Stroke</li>
                <li className="legend-btn" col="percent_coronary_heart_disease"><span className="legend-symbol"></span>Coranary Heart Disease</li>
                <li className="legend-btn" col="percent_high_blood_pressure"><span className="legend-symbol"></span>High Blood Pressure</li>
            </ul> */}

            <svg className='bg-on-surface' id="scatterplot"></svg>
            <svg className='bg-on-surface' id="histplot"></svg>

            <div id="tooltip"></div>
        </div>
    );
};

export default Dashboard;