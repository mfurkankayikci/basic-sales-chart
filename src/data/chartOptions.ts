export const chartOptions = {
  chart: {
    type: "bar",
    height: 350,
    width: "100%",
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    events: {
      click(event, chartContext, config) {
        console.log(config.config.series[config.seriesIndex]);
        console.log(config.config.series[config.seriesIndex].name);
        console.log(
          config.config.series[config.seriesIndex].data[config.dataPointIndex]
        );
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: string) {
      return "$" + val;
    },
    style: {
      fontSize: "12px",
      colors: ["#fff"],
    },
    offsetY: 15,
  },
  plotOptions: {
    bar: {
      dataLabels: {
        orientation: "vertical",
        position: "center", // bottom/center/top
      },
    },
  },
  xaxis: {
    categories: [],
  },
  yaxis: {
    labels: {
      formatter: function (value: number) {
        if (value >= 1000) {
          return (value / 1000).toFixed(0) + "k";
        }
        return value.toString();
      },
    },
  },
  tooltip: {
    enabled: true,
    intersect: true,
    shared: false,
  },
  markers: {
    size: 1,
  },
  selection: {
    enabled: true,
    type: "x",
  },
};
