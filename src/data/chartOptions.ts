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
    enabled: false,
  },
};
