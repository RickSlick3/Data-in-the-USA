'use client'
import { useEffect } from 'react';
import * as d3 from 'd3';
import Scatterplot from '@/d3/scatterplot';
import Histplot from '@/d3/histplot';
import ChoroplethMap from '@/d3/choroplethMap';

const Dashboard = () => {
    let colFilter = [];
    let data, scatterplot, histplot;


    useEffect(() => {
        d3.csv('/data/cdc.csv').then(_data => {
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
        
        // choropleth map
        Promise.all([
            d3.json('/data/counties-10m.json'),
            d3.csv('/data/cdc.csv')
        ]).then(data => {
            const geoData = data[0];
            const cdcData = data[1];
        
            // Combine both datasets by adding the population density to the TopoJSON file
            console.log(geoData);
            geoData.objects.counties.geometries.forEach(d => {
                // console.log(d);  
                for (let i = 0; i < cdcData.length; i++) {
                    if (d.id === cdcData[i].cnty_fips) {
                        // assign a new property to d to use in the map
                        d.properties.percent_stroke = +cdcData[i].percent_stroke;
                    }
                }
            });
        
            const choroplethMap = new ChoroplethMap({ 
                parentElement: '.choropleth-map',   
            }, geoData);
        })
        .catch(error => console.error(error));

        return () => {
            d3.select('#scatterplot').select('svg').remove();
            d3.select('#histplot').select('svg').remove();
            d3.select('#map').select('svg').remove();
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

            <div className="choropleth-map" id="map"></div>     
            {/* <svg height="5" width="5" xmlns="http://www.w3.org/2000/svg" version="1.1"> <defs> <pattern id="lightstripe" patternUnits="userSpaceOnUse" width="5" height="5"> <image xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1JyBoZWlnaHQ9JzUnPgogIDxyZWN0IHdpZHRoPSc1JyBoZWlnaHQ9JzUnIGZpbGw9J3doaXRlJy8+CiAgPHBhdGggZD0nTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVonIHN0cm9rZT0nIzg4OCcgc3Ryb2tlLXdpZHRoPScxJy8+Cjwvc3ZnPg==" x="0" y="0" width="5" height="5"> </image> </pattern> </defs></svg> */}

            <svg className='bg-on-surface' id="scatterplot"></svg>
            <svg className='bg-on-surface' id="histplot"></svg>
            
            {/* <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.7.0/d3.min.js"></script> */}
            
            <div className="tooltip" id="tooltip-choropleth"></div>
            <div className="tooltip" id="tooltip-scatterplot"></div>
            <div className="tooltip" id="tooltip-histplot"></div>
        </div>
    );
};

export default Dashboard;