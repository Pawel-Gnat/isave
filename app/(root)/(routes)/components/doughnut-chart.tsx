'use client';

import { Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface DougnnutChartProps {
  chartData: any;
  chartConfig: any;
  title: string;
  description: string;
}

export const DoughnutChart = ({
  title,
  description,
  chartData,
  chartConfig,
}: DougnnutChartProps) => {
  return (
    <Card className=" border-0 shadow-none">
      <CardHeader className="p-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="max-w-80 p-0">
        <ChartContainer
          config={chartConfig}
          className="max-h-[500px] min-h-[200px] w-full"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="value" nameKey="user" innerRadius={60} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
