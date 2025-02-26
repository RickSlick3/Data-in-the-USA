'use client'
import { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import Scatterplot from '@/d3/scatterplot';
import Histplot from '@/d3/histplot';
import ChoroplethMap from '@/d3/choroplethMap';

const Dashboard = () => {
    const scatterplotRef = useRef(null);
    const histplotRef = useRef(null);
    const choroplethRef = useRef(null);
    const dataRef = useRef(null);

    const [activeCol, setActiveCol] = useState("percent_stroke");
    const singleGreen = '#00700b';

    useEffect(() => {
        d3.csv('/data/cdc.csv').then(_data => {
            dataRef.current = cleanData(_data);
            console.log('Data loading complete. Work with dataset.');

            // Initialize color scale
            const colorScale = d3.scaleOrdinal()
                .range([singleGreen])
                .domain(['percent_high_cholesterol', 'percent_stroke', 'percent_coronary_heart_disease', 'percent_high_blood_pressure']); // percent_smoking, percent_no_heath_insurance

            scatterplotRef.current = new Scatterplot({ 
                parentElement: '#scatterplot',
                colorScale: colorScale,
                // filter: colFilter,
                containerWidth: 300,
                containerHeight: 200
            }, dataRef.current);
            scatterplotRef.current.updateVis();

            histplotRef.current = new Histplot({
                parentElement: '#histplot',
                colorScale: colorScale,
                containerWidth: 300,
                containerHeight: 300
            }, dataRef.current);
            histplotRef.current.updateVis();
        })
        .catch(error => console.error(error));
        
        // choropleth map
        Promise.all([
            d3.json('/data/counties-10m.json'),
            d3.csv('/data/cdc.csv')
        ]).then(data => {
            const geoData = data[0];
            const cdcData = data[1];
        
            if (!choroplethRef.current) {
                choroplethRef.current = new ChoroplethMap({ 
                    parentElement: '.choropleth-map',  
                }, geoData, cdcData);
                choroplethRef.current.updateVis();
            }
        })
        .catch(error => console.error(error));

        return () => {
            d3.select('#map').select('svg').remove();
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


    function changeColumn(colName) {
        // const index = colFilter.indexOf(colName)
        // index === -1 ? colFilter.push(colName) : colFilter.splice(index, 1);
        // if (colFilter.length == 0) {
        //     scatterplot.data = data;
        // } else {
        //     scatterplot.data = data.filter(d => difficultyFilter.includes(d.difficulty));
        // }
        if (activeCol != colName){
            console.log('changing columns')
            setActiveCol(colName);
            if (scatterplotRef.current && histplotRef.current && choroplethRef.current) {
                scatterplotRef.current.colName = colName;
                scatterplotRef.current.data = dataRef.current;
                scatterplotRef.current.updateVis();

                histplotRef.current.colName = colName;
                histplotRef.current.data = dataRef.current;
                histplotRef.current.updateVis();

                choroplethRef.current.colName = colName;
                choroplethRef.current.updateVis();
            }
        }
    }


    return (
        <div>
            <h1 className="text-2xl font-bold font-Outfit mb-4">Health's Relationship with Wealth</h1>
            {/* This is where the D3 chart will be rendered */}

            <ul className="legend flex gap-2">
                <span className='font-bold text-xl'>Columns:</span>
                <li className={`legend-btn border px-1 ${activeCol == "percent_high_cholesterol" ? 'bg-[#bbb]' : ''}`} col="phc" onClick={() => {changeColumn("percent_high_cholesterol");}}>High Cholesterol</li>
                <li className={`legend-btn border px-1 ${activeCol == "percent_stroke" ? 'bg-[#bbb]' : ''}`} col="ps" onClick={() => {changeColumn("percent_stroke");}}>Stroke</li>
                <li className={`legend-btn border px-1 ${activeCol == "percent_coronary_heart_disease" ? 'bg-[#bbb]' : ''}`} col="pchd" onClick={() => {changeColumn("percent_coronary_heart_disease");}}>Coranary Heart Disease</li>
                <li className={`legend-btn border px-1 ${activeCol == "percent_high_blood_pressure" ? 'bg-[#bbb]' : ''}`} col="phbp" onClick={() => {changeColumn("percent_high_blood_pressure");}}>High Blood Pressure</li>
            </ul>

            <div className="flex gap-4">
                <div className="flex flex-col space-y-4">
                    <svg id="scatterplot"></svg>
                    <svg id="histplot"></svg>
                </div>
                <div className="choropleth-map" id="map"></div>
            </div>     
                        
            <div className="tooltip" id="tooltip-choropleth"></div>
            <div className="tooltip" id="tooltip-scatterplot"></div>
            <div className="tooltip" id="tooltip-histplot"></div>
        </div>
    );
};

export default Dashboard;