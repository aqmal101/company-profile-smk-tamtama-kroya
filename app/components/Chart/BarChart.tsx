"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
);

type DataPoint = {
  major?: string;
  count?: number;
  label?: string;
  name?: string;
};

export default function BarChart({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const labels = data.map(
      (d: DataPoint, i: number) => d.major || `Data ${i + 1}`,
    );

    const values = data.map((d) => d.count ?? null);

    const colorPalette = [
      "#60A5FA",
      "#34D399",
      "#F97316",
      "#FCA5A5",
      "#F59E0B",
      "#A78BFA",
      "#FB7185",
    ];

    const backgroundColors = labels.map(
      (_, i) => colorPalette[i % colorPalette.length],
    );
    if (chartRef.current) {
      chartRef.current.data.labels = labels as never;
      chartRef.current.data.datasets[0].data = values as never;
      chartRef.current.data.datasets[0].backgroundColor =
        backgroundColors as never;
      chartRef.current.update();
      return;
    }

    chartRef.current = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Pendaftar",
            data: values,
            backgroundColor: backgroundColors,
            borderColor: "rgba(59,130,246,1)",
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.6,
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
    <div className="w-fit h-64 p-4">
      <canvas ref={canvasRef} />
    </div>
  );
}
