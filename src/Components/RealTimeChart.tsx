import React, { useState, useEffect, ChangeEvent } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, BarElement, ArcElement } from 'chart.js';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'; // Import Form for dropdown menu

Chart.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, BarElement, ArcElement);

const RealTimeChart: React.FC<{ socket: any }> = ({ socket }) => {
  const [timeData, setTimeData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');

  useEffect(() => {
    const handleTimer = (time_remaining: number) => {
      if (!paused) {
        console.log("Received timer data:", time_remaining);
        setTimeData(prevData => [...prevData, time_remaining]);
        setLabels(prevLabels => [...prevLabels, new Date().toLocaleTimeString()]);

        if (loading) {
          setLoading(false);
        }

        if (timeData.length > 50) {
          setTimeData(prevData => prevData.slice(1));
          setLabels(prevLabels => prevLabels.slice(1));
        }
      }
    };

    socket.on("timer", handleTimer);

    socket.on("connect_error", (err: any) => {
      console.error("Connection error:", err);
      setError("Failed to connect to the server. Please try again later.");
      setLoading(false);
    });

    socket.on("disconnect", () => {
      console.warn("Disconnected from server");
      setError("Connection lost. Please check your network and try again.");
      setLoading(false);
    });

    return () => {
      socket.off("timer", handleTimer);
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, [socket, timeData, loading, paused]);

  const handlePauseResume = () => {
    setPaused(prevPaused => !prevPaused);
  };

  const handleChartTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setChartType(event.target.value as 'line' | 'bar' | 'pie');
  };

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
          text: 'Time (seconds)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
    },
    animation: {
      duration: 0,
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={data} options={options} />;
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'pie':
        return <Pie data={data} options={{ responsive: true }} />;
      default:
        return <Line data={data} options={options} />;
    }
  };

  return (
    <div>
      <h2>Real-Time Timer Data</h2>
      {loading && !error && (
        <div>
          <Spinner animation="border" variant="primary" />
          <p>Loading data...</p>
        </div>
      )}
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      {!loading && !error && (
        <>
          <Button onClick={handlePauseResume} variant={paused ? "success" : "warning"}>
            {paused ? "Resume" : "Pause"} Updates
          </Button>
          <Form.Group>
            <Form.Label>Choose Chart Type</Form.Label>
            <Form.Select value={chartType} onChange={handleChartTypeChange}>
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="pie">Pie</option>
            </Form.Select>
          </Form.Group>
          {renderChart()}
        </>
      )}
    </div>
  );
};

export default RealTimeChart;
