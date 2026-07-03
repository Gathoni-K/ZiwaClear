import { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { BiogasTrendPoint } from "../api/mockImpact";


ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Tooltip, Legend);

interface MethaneTrendCardProps {
  title: string;
  subtitle: string;
  data: BiogasTrendPoint[];
  totalLabel: string;
  totalValue: string;
  barColor?: string;
}

export function MethaneTrendCard({
  title,
  subtitle,
  data,
  totalLabel,
  totalValue,
  barColor = "#2DD4BF",
}: MethaneTrendCardProps) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "m³",
        data: data.map((d) => d.m3),
        backgroundColor: barColor,
        borderRadius: 6,
        borderSkipped: false as const,
        hoverBackgroundColor: "#5EEAD4",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        borderColor: "#334155",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx: any) => `${ctx.parsed.y.toLocaleString()} m³`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { size: 11 } },
        border: { color: "#334155" },
      },
      y: {
        grid: { color: "#1e293b" },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          callback: (value: any) => `${(value / 1000).toFixed(0)}k`,
        },
        border: { color: "#334155" },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="rounded-tile bg-tile border border-border-ui p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{totalValue}</p>
          <p className="text-xs text-muted">{totalLabel}</p>
        </div>
      </div>

      <div style={{ height: 260 }}>
        <Bar data={chartData} options={options} />
      </div>

      
      <div className="flex gap-3 mt-4">
        {data.slice(-3).map((d) => (
          <div key={d.month} className="flex-1 bg-input rounded-xl p-3 text-center">
            <p className="text-xs text-muted">{d.month}</p>
            <p className="text-sm font-bold">{(d.m3 / 1000).toFixed(1)}k</p>
            <p className="text-[10px] text-muted">m³</p>
          </div>
        ))}
      </div>
    </div>
  );
}