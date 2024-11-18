import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const TrafficChart = () => {
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    // Fetch data from Google Analytics API here
    async function fetchData() {
      try {
        const response = await fetch('/api/google-analytics-data'); // Your API endpoint
        const data = await response.json();

        // Update the chart with the fetched data
        setAnalyticsData(data.sessions); // Assuming sessions data is what you need
      } catch (error) {
        console.error('Error fetching Google Analytics data:', error);
      }
    }

    fetchData();
  }, []);

  const data = {
    labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
    datasets: [
      {
        fill: true,
        data: analyticsData.length ? analyticsData : [58, 72, 59, 74, 91, 55, 72, 38, 60, 72, 58, 65], // Default/fallback data
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Traffic from Google Analytics',
        align: 'start',
        font: {
          size: 20,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          },
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 5,
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <Line data={data} options={options} />

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          <input type="radio" name="timeframe" value="daily" defaultChecked /> Daily
        </label>
        <label style={{ marginRight: '10px' }}>
          <input type="radio" name="timeframe" value="weekly" /> Weekly
        </label>
        <label>
          <input type="radio" name="timeframe" value="monthly" /> Monthly
        </label>
      </div>
    </div>
  );
};

export default TrafficChart;
