"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

type Props = {
  labels: string[];
  values: number[];
  metaPerPerson: number;
};

export function ProductivityChart({ labels, values, metaPerPerson }: Props) {
  const metaLine = labels.map(() => metaPerPerson);

  return (
    <div className="chart-wrap">
      <Chart
        type="bar"
        aria-label="Gráfico de produtividade do time"
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Story points" } },
          },
          plugins: {
            legend: { position: "bottom" },
          },
        }}
        data={{
          labels,
          datasets: [
            {
              type: "bar",
              label: "Story Points (período)",
              data: values,
              backgroundColor: "rgba(0, 82, 204, 0.55)",
              borderColor: "#0052CC",
              borderWidth: 1,
              order: 2,
            },
            {
              type: "line",
              label: `Meta (${metaPerPerson} SP / pessoa)`,
              data: metaLine,
              borderColor: "#FF5630",
              borderWidth: 2,
              borderDash: [6, 4],
              pointRadius: 0,
              order: 1,
            },
          ],
        }}
      />
    </div>
  );
}
