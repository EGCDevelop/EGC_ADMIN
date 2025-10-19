import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface Props {
  titlesData: string[];
  amountData: number[];
}

export const Chartbar = ({ titlesData, amountData }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Si no hay instancia, crearla
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;

    // Configurar opciones
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      grid: {
        left: "1%",
        right: "1%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: titlesData,
          axisTick: { alignWithLabel: true },
        },
      ],
      yAxis: [{ type: "value" }],
      series: [
        {
          name: "Integrantes",
          type: "bar",
          barWidth: "50%",
          data: amountData,
          itemStyle: {
            color: "#5070dd",
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      // No hacemos dispose aquí, para mantener la instancia si los datos cambian
    };
  }, [titlesData, amountData]); // 👈 dependencia de datos

  // Si se desmonta por completo, liberar instancia
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};
