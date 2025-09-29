import { Line } from "react-chartjs-2";

const MiniCharts = ({ labels, data, color }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: color,
        backgroundColor: color,
        tension: 0.4,
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    elements: { point: { radius: 0 } },
    scales: { x: { display: false }, y: { display: false } },
  };

  return <Line data={chartData} options={options} height={50} />;
};

export default MiniCharts;
