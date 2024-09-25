import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './Grafico.css';

const Grafico = () => {
  const chartRef = useRef(null);

  useEffect(() => {
   
    const produccionEnergia = [
      10, 15, 20, 25, 30, 40, 50,
      80, 90, 100, 110, 120, 130,
      100, 90, 80, 70, 60, 50, 40, 
      30, 20, 15, 10 
    ];


    const consumoEnergia = [
      30, 10, 10, 20, 30, 40, 50,
      80, 90, 100, 70, 60, 50, 
      60, 70, 80, 90, 100, 80,
      60, 30, 30, 30 
    ];



    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [
          {
            label: 'Producción de Energía',
            data: produccionEnergia,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4,
          },
          {
            label: 'Consumo de Energía',
            data: consumoEnergia,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Hora del día'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Energía (kW)'
            }
          }
        }
      }
    });

  
    return () => chart.destroy();
  }, []);

  return (
    <div className="grafico-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default Grafico;
