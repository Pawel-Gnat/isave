import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';

Chart.register(CategoryScale);

export const BarChart = ({ chartData }: { chartData: any }) => {
  const options = {
    responsive: true,
  };

  return (
    <div className="rounded-lg border p-4">
      <Bar data={chartData} options={options} className="h-full" />
    </div>
  );
};
