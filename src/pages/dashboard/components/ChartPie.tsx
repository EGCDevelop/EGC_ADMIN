import * as echarts from "echarts";
import { useEffect, useRef } from "react";

interface ChartPieProps {
  data: { value: number; name: string }[];
}

export const ChartPie = ({ data }: ChartPieProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        // a = nombre de la serie, b = name, c = value, d = porcentaje
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      color: ["#1B2435", "#0C2523", "#221D36"],
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"], // donut
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
            },
          },
          label: {
            show: true,
            formatter: "{b}: {d}%",
            // b = nombre, d = porcentaje
            fontSize: 14,
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "450px" }} />;
};
