import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import AxiosInstance from './Axios';

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = today.getDate();
    day = day < 10 ? `0${day}` : day;
    return `${year}-${month}-${day}`;
};

const InformacionContador = ({ serialNumber }) => {
    const [informacionContadorData, setInformacionContadorData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIP, setSelectedIP] = useState('');
    const [fecha, setFecha] = useState(getTodayDate());
    const svgRef = useRef(null);
    const variables = ['aexp', 'aimp', 'q1', 'q2', 'q3', 'q4'];
    const [selectedVariable, setSelectedVariable] = useState(variables[0]);
    const [variableVisible, setVariableVisible] = useState({});
    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());

    useEffect(() => {
        fetchInformacionContadorData();
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            drawChart();
        }
    }, [startDate, endDate, informacionContadorData, loading, selectedIP, selectedVariable, variableVisible]);

    const fetchInformacionContadorData = () => {
        AxiosInstance.get(`informacion-contador/${serialNumber}/`)
            .then(response => {
                console.log('Datos del contador recibidos:', response.data);
                const sortedData = response.data.sort((a, b) => {
                    if (a.fecha < b.fecha) return -1;
                    if (a.fecha > b.fecha) return 1;
                    return a.hora - b.hora;
                });
                const modifiedData = addMidnightPoint(sortedData);
                setInformacionContadorData(modifiedData);
                setLoading(false);
                if (sortedData.length > 0) {
                    setSelectedIP(sortedData[0].numeros_serie);
                    setFecha(sortedData[0].fecha);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    const addMidnightPoint = (data) => {
        if (data.length === 0) return data;
        const firstPoint = { ...data[0], hora: 0 };
        return [firstPoint, ...data];
    };

    const drawChart = () => {
        d3.select(svgRef.current).selectAll('*').remove();

        const dataForSelectedIP = informacionContadorData.filter(data => data.numeros_serie === selectedIP);
        const dataInRange = dataForSelectedIP.filter(data => {
            const fechaData = new Date(data.fecha);
            return fechaData >= startDate && fechaData <= endDate;
        });

        const margin = { top: 20, right: 20, bottom: 70, left: 20 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        let xScale;
        let xAxis;

        if (startDate.toISOString().split('T')[0] === endDate.toISOString().split('T')[0]) {
            // Mostrar horas del día seleccionado
            xScale = d3.scaleBand()
                .domain(Array.from({ length: 24 }, (_, i) => i))
                .range([0, width])
                .padding(0.1);
            xAxis = d3.axisBottom(xScale).tickFormat(formatHour);
        } else if ((endDate - startDate) / (1000 * 60 * 60 * 24) < 30) {
            // Mostrar días del rango seleccionado
            const daysInRange = getDaysInRange(startDate, endDate);
            xScale = d3.scaleBand()
                .domain(daysInRange)
                .range([0, width])
                .padding(0.1);
            xAxis = d3.axisBottom(xScale).tickFormat(d => d);
        } else {
            // Mostrar meses del rango seleccionado
            const monthsInRange = getMonthsInRange(startDate, endDate);
            xScale = d3.scaleBand()
                .domain(monthsInRange)
                .range([0, width])
                .padding(0.1);
            xAxis = d3.axisBottom(xScale).tickFormat(d => d);
        }

        const yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('transform', 'rotate(-45)');

        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background', '#fff')
            .style('border', '1px solid #000')
            .style('padding', '5px')
            .style('border-radius', '5px');

        variables.forEach(variable => {
            const line = d3.line()
                .x(d => xScale(getXValue(d, startDate, endDate)) + xScale.bandwidth() / 2)
                .y(d => yScale(d[variable]));

            if (variableVisible[variable]) {
                svg.append('path')
                    .datum(dataInRange)
                    .attr('fill', 'none')
                    .attr('stroke', getColor(variable))
                    .attr('stroke-width', 2)
                    .attr('d', line)
                    .attr('class', `${variable}-line`);

                svg.selectAll(`.${variable}-circle`)
                    .data(dataInRange)
                    .enter()
                    .append('circle')
                    .attr('class', `${variable}-circle`)
                    .attr('cx', d => xScale(getXValue(d, startDate, endDate)) + xScale.bandwidth() / 2)
                    .attr('cy', d => yScale(d[variable]))
                    .attr('r', 5)
                    .style('fill', getColor(variable))
                    .on('mouseover', (event, d) => {
                        tooltip.html(`Fecha: ${d.fecha}<br>Hora: ${d.hora}<br>${variable.toUpperCase()}: ${d[variable]}`)
                            .style('visibility', 'visible');
                    })
                    .on('mousemove', event => {
                        tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px');
                    })
                    .on('mouseout', () => {
                        tooltip.style('visibility', 'hidden');
                    });

                svg.selectAll(`.${variable}-text`)
                    .data(dataInRange)
                    .enter()
                    .append('text')
                    .attr('class', `${variable}-text`)
                    .attr('x', d => xScale(getXValue(d, startDate, endDate)) + xScale.bandwidth() / 2)
                    .attr('y', d => yScale(d[variable]) - 10)
                    .attr('text-anchor', 'middle')
                    .attr('fill', getColor(variable))
                    .text(d => `${d.fecha}`);
            }
        });
    };

    const getXValue = (d, startDate, endDate) => {
        if (startDate.toISOString().split('T')[0] === endDate.toISOString().split('T')[0]) {
            return d.hora;
        } else if ((endDate - startDate) / (1000 * 60 * 60 * 24) < 30) {
            return d.fecha;
        } else {
            return d.fecha.slice(0, 7); // YYYY-MM
        }
    };

    const getDaysInRange = (startDate, endDate) => {
        const days = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            days.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return days;
    };

    const getMonthsInRange = (startDate, endDate) => {
        const months = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const year = currentDate.getFullYear();
            let month = currentDate.getMonth() + 1;
            month = month < 10 ? `0${month}` : month;
            months.push(`${year}-${month}`);
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return months;
    };

    const formatHour = hour => {
        const formattedHour = hour % 12 || 12;
        return formattedHour < 10 ? `0${formattedHour}:00 ${hour < 12 ? 'AM' : 'PM'}` : `${formattedHour}:00 ${hour < 12 ? 'AM' : 'PM'}`;
    };

    const handleChangeIP = event => {
        setSelectedIP(event.target.value);
    };

    const handleVariableClick = variable => {
        setSelectedVariable(variable);
        setVariableVisible(prevState => ({
            ...prevState,
            [variable]: !prevState[variable]
        }));
    };

    const handleChangeStartDate = event => {
        setStartDate(new Date(event.target.value));
    };

    const handleChangeEndDate = event => {
        setEndDate(new Date(event.target.value));
    };

    const getColor = variable => {
        switch (variable) {
            case 'aexp':
                return 'red';
            case 'aimp':
                return 'blue';
            case 'q1':
                return 'green';
            case 'q2':
                return 'orange';
            case 'q3':
                return 'purple';
            case 'q4':
                return 'cyan';
            default:
                return 'black';
        }
    };

    return (
        <div>
            <p>Serial Number: {serialNumber}</p>
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    <select value={selectedIP} onChange={handleChangeIP}>
                        {informacionContadorData.map((data, index) => (
                            <option key={index} value={data.numeros_serie}>
                                {data.numeros_serie}
                            </option>
                        ))}
                    </select>
                    <p>Fecha de inicio: <input type="date" value={startDate ? startDate.toISOString().split('T')[0] : ''} onChange={handleChangeStartDate} /></p>
                    <p>Fecha de fin: <input type="date" value={endDate.toISOString().split('T')[0]} onChange={handleChangeEndDate} /></p>
                    <div>
                        {variables.map(variable => (
                            <button key={variable} style={{ backgroundColor: getColor(variable) }} onClick={() => handleVariableClick(variable)}>
                                {variable.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <svg ref={svgRef}></svg>
                </>
            )}
        </div>
    );
};

export default InformacionContador;
