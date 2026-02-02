"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
  Title,
);

type DataPoint = { date: string; count: number };

export default function AreaChart({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const labels = data.map((d) =>
      new Date(d.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
    );
    const values = data.map((d) => d.count);

    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, "rgba(51,106,66,0.5)");
    gradient.addColorStop(1, "rgba(51,106,66,0.5)");

    if (chartRef.current) {
      chartRef.current.data.labels = labels as never;
      chartRef.current.data.datasets[0].data = values as never;
      chartRef.current.data.datasets[0].backgroundColor = gradient as never;
      chartRef.current.update();
      return;
    }

    chartRef.current = new ChartJS(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Pendaftar",
            data: values,
            borderColor: "rgba(51,106,66, 1)",
            backgroundColor: gradient,
            fill: "start",
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: "rgba(51,106,66,1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: "#374151" },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: { color: "#374151" },
            grid: { color: "rgba(15,23,42,0.04)" },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
          title: { display: false },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data]);

  return (
    <div className="w-full h-72 p-4">
      <canvas ref={canvasRef} />
    </div>
  );
}
