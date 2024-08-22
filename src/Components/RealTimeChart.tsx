import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const RealTimeChart: React.FC<{ socket: any }> = ({ socket }) => {
  const [timeData, setTimeData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    socket.on("timer", (time_remaining: number) => {
      console.log("Received timer data:", time_remaining);
      setTimeData(prevData => [...prevData, time_remaining]);
      setLabels(prevLabels => [...prevLabels, new Date().toLocaleTimeString()]);

      // Optional: Limit the number of data points to maintain performance
      if (timeData.length > 50) {
        setTimeData(prevData => prevData.slice(1));
        setLabels(prevLabels => prevLabels.slice(1));
      }
    });

    return () => {
      socket.off("timer");
    };
  }, [socket, timeData]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Time Remaining',
        data: timeData,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (seconds)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    },
    animation: {
      duration: 0 // Disable animation for real-time updates
    }
  };

  return (
    <div>
      <h2>Real-Time Timer Data</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default RealTimeChart;
