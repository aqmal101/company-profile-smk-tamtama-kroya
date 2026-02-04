"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(PieController, ArcElement, Tooltip, Legend, Title);

type DataPoint = {
  date?: string;
  count?: number;
  label?: string;
  name?: string;
  [key: string]: unknown;
};

export default function PieChart({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const labels = data.map(
      (d: DataPoint, i: number) => d.label || d.major || `Data ${i + 1}`,
    );

    const values = data.map((d: DataPoint) => Number(d.count ?? 0));

    const getColorByLabel = (title: string) => {
      switch (title) {
        case "TKR":
          return "#FF0000";
        case "DKV":
          return "#2369D1";
        case "TITL":
          return "#4D4FA4";
        case "TP":
          return "#5DB1F6";
        default:
          return "#FF0000";
      }
    };

    const backgroundColors = labels.map((label) =>
      getColorByLabel(String(label)),
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
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            label: "Pendaftar",
            data: values,
            borderColor: "#ffffff",
            backgroundColor: backgroundColors,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: "bottom" },
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
