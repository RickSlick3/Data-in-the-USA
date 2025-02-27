'use client'
import { useEffect, useState } from 'react';

const ViewData = () => {
    const [headers, setHeaders] = useState([]);
    const [rows, setRows] = useState([]);

    // Helper function to parse a CSV line correctly handling quoted commas
    const parseLine = (line) => {
        return line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((val) => {
        const trimmed = val.trim();
        // Remove wrapping quotes if present and unescape double quotes
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
            return trimmed.slice(1, trimmed.length - 1).replace(/""/g, '"');
        }
        return trimmed;
        });
    };

    useEffect(() => {
        // Remove the overflow-x-hidden class on mount
        document.body.classList.remove('overflow-x-hidden');

        fetch('/data/cdc.csv')
        .then((response) => response.text())
        .then((csvText) => {
            const lines = csvText.split('\n').filter(line => line.trim() !== '');
            // Parse the first line as headers
            const headerRow = parseLine(lines[0]);
            setHeaders(headerRow);

            // Process remaining lines as data rows using the custom parser
            const dataRows = lines.slice(1).map(line => parseLine(line));
            setRows(dataRows);
        })
        .catch((error) => console.error('Error fetching CSV file:', error));

        // Re-add the class when this component unmounts (e.g. when navigating away)
        return () => {
        document.body.classList.add('overflow-x-hidden');
        };
    }, []);

    return (
        <>
        <div className='flex items-baseline space-x-8 mb-4'>
            <h1 className="text-2xl font-bold font-Outfit">Full Data Table</h1>
            <div className='text-xs leading-[1]'>
            Data from{' '}
            <a
                className='text-gray-500 underline'
                target='_blank'
                rel="noreferrer"
                href="https://www.cdc.gov/heart-disease-stroke-atlas/about/?CDC_AAref_Val=https://www.cdc.gov/dhdsp/maps/atlas/index.htm"
            >
                the US Heart and Stroke Atlas
            </a>
            </div>
        </div>
        <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-light-surface">
                <tr>
                {headers.map((header, idx) => (
                    <th
                    key={idx}
                    className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider"
                    >
                    {header}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                    <td
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                        {cell}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </>
    );
};

export default ViewData;
