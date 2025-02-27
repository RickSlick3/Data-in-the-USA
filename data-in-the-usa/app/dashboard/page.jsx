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
    const [activeXCol, setActiveXCol] = useState("median_household_income")
    const columns = ['median_household_income', 'poverty_perc', 'percent_high_cholesterol', 'percent_stroke', 'percent_coronary_heart_disease', 'percent_high_blood_pressure', 'percent_smoking', 'percent_inactive'];
    const singleGreen = '#00700b';

    useEffect(() => {
        
        Promise.all([
            d3.json('/data/counties-10m.json'),
            d3.csv('/data/cdc.csv')
        ]).then(data => {
            const geoData = data[0];
            const cdcData = data[1];

            dataRef.current = cleanData(cdcData);

            // Initialize color scale
            const colorScale = d3.scaleOrdinal()
                .range([singleGreen])
                .domain(columns);

            // make scatterplot
            if (!scatterplotRef.current) {
                scatterplotRef.current = new Scatterplot({ 
                    parentElement: '#scatterplot',
                    colorScale: colorScale,
                    // filter: colFilter,
                }, dataRef.current);
                scatterplotRef.current.updateVis();
            }

            // makehistoplot
            if (!histplotRef.current) {
                histplotRef.current = new Histplot({
                    parentElement: '#histplot',
                    colorScale: colorScale,
                }, dataRef.current);
                histplotRef.current.updateVis();
            }
            
            // make choropleth map
            if (!choroplethRef.current) {
                choroplethRef.current = new ChoroplethMap({ 
                    parentElement: '.choropleth-map',  
                }, geoData, cdcData);
                choroplethRef.current.updateVis();
            }

            const selectedHistBins = [];

            if (!scatterplotRef.current || !histplotRef.current || choroplethRef.current) {
                
                scatterplotRef.current.onCircleIn = (value, fips) => {
                    histplotRef.current.highlightBinForValue(value);
                    choroplethRef.current.highlightCounty(fips);
                };
                scatterplotRef.current.onCircleOut = () => {
                    histplotRef.current.resetHighlight();
                    choroplethRef.current.resetHighlight();
                };

                histplotRef.current.onBarIn = (x0, x1) => {
                    scatterplotRef.current.filterByRange(x0, x1);
                    choroplethRef.current.highlightByRange(x0, x1);
                };
                histplotRef.current.onBarOut = () => {
                    scatterplotRef.current.resetFilter();
                    choroplethRef.current.resetHighlight();
                };
                histplotRef.current.onBarClick = (x0, x1, isSelected) => {
                    // Check if the bin is already selected
                    const index = selectedHistBins.findIndex(bin => bin.x0 === x0 && bin.x1 === x1);
                    if (isSelected && index === -1) {
                        // Add the bin range if it's being selected
                        selectedHistBins.push({ x0, x1 });
                    } else if (!isSelected && index > -1) {
                        // Remove the bin range if it's being unselected
                        selectedHistBins.splice(index, 1);
                    }
                    // Call the choropleth method to update histogram-based selection
                    choroplethRef.current.applyHistSelection(selectedHistBins);
                };

                choroplethRef.current.onCountyIn = (fipsCode, value) => {
                    scatterplotRef.current.enlargeCircleByFips(fipsCode);
                    histplotRef.current.highlightBinForValue(value);
                    scatterplotRef.current.highlightCircleByFips(fipsCode);
                };
                choroplethRef.current.onCountyOut = () => {
                    scatterplotRef.current.resetCircleRadiusByFips();
                    histplotRef.current.resetHighlight();
                    scatterplotRef.current.resetHighlight();
                };
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
            d.percent_smoking = +d.percent_smoking;
            d.percent_inactve = +d.percent_inactive;
        });
        // filter out rows with -1 in any relevant column
        const newData = data.filter(d => {
            return columns.every(col => d[col] !== -1);
        });
        console.log(newData);
        return newData;
    }


    function changeYColumn(yColName) {
        if (activeCol != yColName){
            console.log('changing y columns')
            setActiveCol(yColName);
            if (scatterplotRef.current && histplotRef.current && choroplethRef.current) {
                scatterplotRef.current.yColName = yColName;
                scatterplotRef.current.data = dataRef.current;
                scatterplotRef.current.updateVis();

                histplotRef.current.yColName = yColName;
                histplotRef.current.data = dataRef.current;
                histplotRef.current.updateVis();

                choroplethRef.current.colName = yColName;
                choroplethRef.current.updateVis();
            }
        }
    }


    function changeXColumn(xColName) {
        if (activeXCol != xColName){
            console.log('changing x columns')
            setActiveXCol(xColName);
            if (scatterplotRef.current && histplotRef.current && choroplethRef.current) {
                scatterplotRef.current.xColName = xColName;
                scatterplotRef.current.data = dataRef.current;
                scatterplotRef.current.updateVis();
            }
        }
    }


    function mapWealth(wealthCol) {
        if (choroplethRef.current) {
            choroplethRef.current.colName = wealthCol;
            choroplethRef.current.updateVis();
        }
    }


    return (
        <div>
            <div className='flex items-baseline space-x-8'>
                <h1 className="text-2xl font-bold font-Outfit">Health's Relationship with Wealth</h1>
                <div className='text-xs leading-[1]'>Data from <a className='text-gray-500 underline' target='_blank' href="https://www.cdc.gov/heart-disease-stroke-atlas/about/?CDC_AAref_Val=https://www.cdc.gov/dhdsp/maps/atlas/index.htm">the US Heart and Stroke Atlas</a></div>
            </div>
            <div className="max-w-5xl">
                <p className="text-sm leading-[1.4]">
                    Select more options from the Health and Wealth rows below to see the correlation, distribution, and spatial distribution on the map to the right. Hover over points, bars, or countis to see corresponding values in the other visuals. Click on the visuals to see them on the map more clearly.
                </p>
            </div>            
            {/* This is where the D3 chart will be rendered */}
            <div className='flex gap-16'>
                <div className='flex flex-col my-3'>
                    <ul className="legend flex gap-2 text-[12px]">
                        <span className='font-bold text-[14px]'>Health:</span>
                        <li className={`legend-btn border px-1 ${activeCol == "percent_stroke" ? 'bg-gray-300' : ''}`} col="ps" onClick={() => {changeYColumn("percent_stroke");}}>Stroke</li>
                        <li className={`legend-btn border px-1 ${activeCol == "percent_high_cholesterol" ? 'bg-gray-300' : ''}`} col="phc" onClick={() => {changeYColumn("percent_high_cholesterol");}}>High Cholesterol</li>
                        <li className={`legend-btn border px-1 ${activeCol == "percent_coronary_heart_disease" ? 'bg-gray-300' : ''}`} col="pchd" onClick={() => {changeYColumn("percent_coronary_heart_disease");}}>Heart Disease</li>
                        <li className={`legend-btn border px-1 ${activeCol == "percent_high_blood_pressure" ? 'bg-gray-300' : ''}`} col="phbp" onClick={() => {changeYColumn("percent_high_blood_pressure");}}>High Blood Pressure</li>
                        <li className={`legend-btn border px-1 ${activeCol == "percent_smoking" ? 'bg-gray-300' : ''}`} col="ps" onClick={() => {changeYColumn("percent_smoking");}}>Smoking</li>
                        <li className={`legend-btn border px-1 ${activeCol == "percent_inactive" ? 'bg-gray-300' : ''}`} col="pi" onClick={() => {changeYColumn("percent_inactive");}}>Physically Inactive</li>
                    </ul>
                    <ul className="legend flex gap-2 text-[12px] my-3">
                        <span className='font-bold text-[14px]'>Wealth:</span>
                        <li className={`legend-btn border px-1 ${activeXCol == "median_household_income" ? 'bg-gray-300' : ''}`} col="mhi" onClick={() => {changeXColumn("median_household_income");}}>Median Household Income</li>
                        <li className={`legend-btn border px-1 ${activeXCol == "poverty_perc" ? 'bg-gray-300' : ''}`} col="pp" onClick={() => {changeXColumn("poverty_perc");}}>Poverty Percent</li>
                    </ul>
                </div>
                <div className='flex flex-col'>
                    <ul className="legend flex gap-2 text-[12px] my-3">
                        <span className='font-bold text-[14px]'>Show Wealth Distribution on Map:</span>
                        <li className='legend-btn border px-1' onClick={() => {mapWealth("median_household_income");}}>Median Household Income</li>
                        <li className='legend-btn border px-1' onClick={() => {mapWealth("poverty_perc");}}>Poverty Percent</li>
                    </ul>
                </div>
            </div>

            <div className="flex">
                <div className="flex flex-col space-y-3">
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