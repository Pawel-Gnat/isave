import Chart from 'chart.js/auto';
import { ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = ({ chartData }: { chartData: any }) => {
  const options = {
    responsive: true,
  };

  return (
    <div>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};
