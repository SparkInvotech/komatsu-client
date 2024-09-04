import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

function getPastDays(numDays: number): string[] {
  const days = [];
  const today = new Date();

  for (let i = numDays - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // Format date as DD/MM
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const formattedDate = `${month}/${day}`;

    days.push(formattedDate);
  }

  console.log(days);
  return days;
}

const dates = getPastDays(7);
let x = [200, 240, 140, 340, 170, 220, 240],
  y = [60, 80, 90, 50, 60, 50, 70],
  i = 0;
const chartData = dates.map((date) => ({
  date: date,
  working: x[i], // Random minutes between 1 hour (60 mins) and 8 hours (480 mins)
  stopped: y[i++], // Random minutes between 0 and 2 hours (120 mins)
  emergency: y[i],
}));

const chartConfig = {
  working: {
    label: "Working",
    color: "#2563eb",
  },
  stopped: {
    label: "Manual Stop",
    color: "#60a5fa",
  },
  emergency: {
    label: "Emergency Stop",
    color: "#AA4A44",
  },
} satisfies ChartConfig;

export function Chart() {
  return (
    <ChartContainer config={chartConfig} className="mx-auto">
      <BarChart
        width={800} // width for desktop
        height={400} // height for desktop
        data={chartData}
        className="w-[90%] h-[90%] sm:w-[450px] sm:h-[300px] md:w-[600px] md:h-[350px] lg:w-[700px] lg:h-[400px] xl:w-[800px] xl:h-[450px]"
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="working" fill="var(--color-working)" radius={4} />
        <Bar dataKey="stopped" fill="var(--color-stopped)" radius={4} />
        <Bar dataKey="emergency" fill="#c30010" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
