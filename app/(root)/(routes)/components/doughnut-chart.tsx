import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart({ chartData }: { chartData: any }) {
  return (
    <div>
      <Doughnut data={chartData} />
    </div>
  );
}
export default DoughnutChart;
