import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SalesDataService } from "app/sales-data.service";
import { Chart, ChartConfiguration, ChartType, registerables } from "chart.js";
import { SidebarComponent } from "../sidebar/sidebar.component";
Chart.register(...registerables); // Register Chart.js components
@Component({
  selector: "app-tables",
  templateUrl: "./tables.component.html",
  styleUrls: ["./tables.component.css"],
})
export class TablesComponent implements OnInit {
  salesData: any[] = []; // Will hold the sales data
  salesForm: FormGroup; // Form to hold user inputs
  filteredSalesData: any[] = []; // Holds the filtered sales data
  dateForm: FormGroup; // Form to hold the date inputs
  currentChartIndex = 0; // Start with the first chart
  totalCharts = 9; // Total number of charts
  currentChart: string = "sales"; // Default chart
  fromDate: string;
  toDate: string;
  //define chart variable
  salesChart: any;
  cancellationsChart: any;
  performanceChart: any;
  bookingSourceChart: any;
  materialGroupChart: any;
  areaChart: any;
  materialGroup3Chart: any;
  saleTypeChart: any;
  channelChart: any;
  activeCanvas: string = "salesChart"; // Initial canvas to display
  @ViewChild(SidebarComponent) sidebar: SidebarComponent;
  onDateRangeChange(dateRange: { from: string; to: string }) {
    this.fromDate = dateRange.from;
    this.toDate = dateRange.to;
    this.filterSalesData();
    console.log("I am in ONDate RangEcHANGE");
  }
  constructor(
    private salesDataService: SalesDataService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dateForm = this.fb.group({
      fromDate: [""],
      toDate: [""],
    });
    //this.fetchSalesData(); // Fetch data on component initialization
    this.salesForm = this.fb.group({
      vkbur: ["1034"],
      vkorg: ["9000"],
      vbeln: [""],
      kunnr: [""],
      matnr: [""],
      budat: [""],
      auart: ["ZRS"],
    });
    this.renderChart(this.currentChart);
  }

  showChart(period: string) {
    this.currentChart = period; // Update the current chart

    // Clear existing charts and render the new one
    this.renderChart(period);
  }
  renderChart(period: string) {
    // Clear the previous chart if it exists
    if (period === "sales") {
      this.createSalesChart();
    } else if (period === "cancellations") {
      this.createCancellationsChart();
    } else if (period === "bookingsource") {
      this.createBookingSourceChart();
    } else if (period === "materialgroup") {
      this.createMaterialGroupChart();
    } else if (period === "area") {
      this.createAreaChart();
    } else if (period === "materialgroup3") {
      this.createMaterialGroup3Chart();
    } else if (period === "saletype") {
      this.createSaleTypeChart();
    } else if (period === "channel") {
      this.createChannelChart();
    }
  }

  // Method to fetch sales data
  fetchSalesData(): void {
    const formData = this.salesForm.value;
    console.log("Sending form data:", formData); // Log the form data
    this.salesDataService.getSalesReport(formData).subscribe(
      (data) => {
        console.log("Received data:", data); // Log the received data
        this.salesData = data; // Assign the data to salesData
        this.filteredSalesData = data; // Initially show all data
        this.createSalesChart();
        this.createCancellationsChart(); // Create chart for cancellations
        this.createPerformanceChart();
        this.createBookingSourceChart();
        this.createMaterialGroupChart();
        this.createAreaChart();
        this.createMaterialGroup3Chart();
        this.createSaleTypeChart();
        this.createSaleTypeChart();
        this.createChannelChart();
      },
      (error) => {
        console.error("Error fetching sales data:", error);
      }
    );
  }
  onFilter(): void {
    const { fromDate, toDate } = this.dateForm.value;
    if (fromDate && toDate) {
      this.fromDate = fromDate;
      this.toDate = toDate;
      this.filterSalesData();
    }

    //   this.filteredSalesData = this.salesData.filter((sale) => {
    //     const saleDate = new Date(sale.AUDAT); // Convert document date to Date object
    //     return saleDate >= new Date(fromDate) && saleDate <= new Date(toDate);
    //   });
    // } else {
    //   this.filteredSalesData = this.salesData; // If no date range selected, show all data
    // }

    // this.updateCharts(this.filteredSalesData); // Update charts with filtered data
    // console.log(this.filteredSalesData);
  }
  filterSalesData() {
    if (this.fromDate && this.toDate) {
      this.filteredSalesData = this.salesData.filter((sale) => {
        const saleDate = new Date(sale.AUDAT); // Convert sale date to Date object
        return (
          saleDate >= new Date(this.fromDate) &&
          saleDate <= new Date(this.toDate)
        );
      });
      console.log("Filtered Sales Data:", this.filteredSalesData);
    } else {
      this.filteredSalesData = this.salesData; // If no date range selected, show all data
      
    }
    this.updateCharts(this.filteredSalesData);
  }

  // Function to change the active canvas
  changeCanvas(canvasId: string) {
    this.activeCanvas = canvasId;
    console.log(`Active canvas changed to: ${this.activeCanvas}`);
  }
  // Method to create a sales chart
  createSalesChart(): void {
    const labels = this.filteredSalesData.map((sale) => sale.AUDAT); // Assuming AUDAT is the sale date
    const salesValues = this.filteredSalesData.map((sale) => sale.SO_VAL); // Assuming 'amount' is in sales data

    const chartData = {
      labels,
      datasets: [
        {
          label: "Sales Amount",
          data: salesValues,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: "bar" as ChartType, // Can be 'bar', 'line', 'pie', etc.
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
    // Destroy the existing chart if already rendered
    if (this.salesChart) {
      this.salesChart.destroy();
    }

    const ctx = (
      document.getElementById("salesChart") as HTMLCanvasElement
    ).getContext("2d");
    this.salesChart = new Chart(ctx, config);
  }
  // Method to create a cancellations chart
  createCancellationsChart(): void {
    const labels = this.filteredSalesData.map((sale) => sale.AUDAT); // Assuming AUDAT is the sale date
    const cancellations = this.filteredSalesData.filter(
      (sale) => sale.CANC_CHRG
    ).length; // Filter cancelled sales

    // Group by date for cancellations
    const cancellationCounts = this.filteredSalesData.reduce((acc, sale) => {
      if (sale.CANC_CHRG) {
        const saleDate = new Date(sale.AUDAT).toDateString(); // Group by date
        acc[saleDate] = (acc[saleDate] || 0) + 1; // Count cancellations per date
      }
      return acc;
    }, {});

    const chartLabels = Object.keys(cancellationCounts);
    const chartData = Object.values(cancellationCounts) as number[];

    const config: ChartConfiguration = {
      type: "bar" as ChartType, // Can be 'bar', 'line', 'pie', etc.
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Cancellations",
            data: chartData,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 2,
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.cancellationsChart) {
      this.cancellationsChart.destroy();
    }

    const ctx = (
      document.getElementById("cancellationsChart") as HTMLCanvasElement
    ).getContext("2d");
    this.cancellationsChart = new Chart(ctx, config);
  }
  //method to create performance chart
  createPerformanceChart(): void {
    // Aggregate performance data by sales executive
    const performanceData = this.filteredSalesData.reduce((acc, sale) => {
      const execName = sale.SALE_EXE; // SAL_EXE is the sales executive name
      acc[execName] = (acc[execName] || 0) + sale.SO_VAL; // Sum up the sales amount per executive
      return acc;
    }, {});

    const execLabels = Object.keys(performanceData); // Sales executive names
    const execSalesValues = Object.values(performanceData) as number[]; // Their total sales amounts

    const config: ChartConfiguration = {
      type: "bar" as ChartType, // Bar chart for performance
      data: {
        labels: execLabels,
        datasets: [
          {
            label: "Sales Executive Performance",
            data: execSalesValues,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }

    const ctx = (
      document.getElementById("performanceChart") as HTMLCanvasElement
    ).getContext("2d");
    this.performanceChart = new Chart(ctx, config);
  }

  createBookingSourceChart(): void {
    // Group sales data by booking source
    const bookingSourceCounts = this.filteredSalesData.reduce((acc, sale) => {
      const source = sale.KVGR2 || "Unknown"; // Use a default value if no source is present
      acc[source] = (acc[source] || 0) + 1; // Count the occurrences of each source
      return acc;
    }, {});

    const labels = Object.keys(bookingSourceCounts); // Booking sources
    const data = Object.values(bookingSourceCounts) as number[]; // Count of each source

    const chartData = {
      labels,
      datasets: [
        {
          label: "Source of Booking",
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: "pie" as ChartType, // Pie chart type
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.bookingSourceChart) {
      this.bookingSourceChart.destroy();
    }

    const ctx = (
      document.getElementById("bookingSourceChart") as HTMLCanvasElement
    ).getContext("2d");
    this.bookingSourceChart = new Chart(ctx, config);
  }
  // Method to create a material group chart
  createMaterialGroupChart(): void {
    const materialGroups = this.filteredSalesData.reduce((acc, sale) => {
      const group = sale.MATKL; // Assuming MATERIAL_GROUP is the field name
      acc[group] = (acc[group] || 0) + sale.SO_VAL; // Sum sales values by material group
      return acc;
    }, {});

    const chartLabels = Object.keys(materialGroups);
    const chartData = Object.values(materialGroups) as number[];

    const config: ChartConfiguration = {
      type: "pie" as ChartType, // Pie chart
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Material Group",
            data: chartData,
            backgroundColor: [
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              // Add more colors as needed
            ],
            borderColor: "rgba(255, 205, 86, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    };

    if (this.materialGroupChart) {
      this.materialGroupChart.destroy();
    }

    const ctx = (
      document.getElementById("materialGroupChart") as HTMLCanvasElement
    ).getContext("2d");
    this.materialGroupChart = new Chart(ctx, config);
  }

  // Method to create an area chart
  createAreaChart(): void {
    const areas = this.filteredSalesData.reduce((acc, sale) => {
      const area = sale.UMREN; // Assuming AREA is the field name
      acc[area] = (acc[area] || 0) + sale.SO_VAL; // Sum sales values by area
      return acc;
    }, {});

    const chartLabels = Object.keys(areas);
    const chartData = Object.values(areas) as number[];

    const config: ChartConfiguration = {
      type: "pie" as ChartType,
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Unit Area",
            data: chartData,
            backgroundColor: [
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: "rgba(255, 205, 86, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    };

    if (this.areaChart) {
      this.areaChart.destroy();
    }

    const ctx = (
      document.getElementById("areaChart") as HTMLCanvasElement
    ).getContext("2d");
    this.areaChart = new Chart(ctx, config);
  }

  // Method to create a material group 3 chart
  createMaterialGroup3Chart(): void {
    const materialGroup3 = this.filteredSalesData.reduce((acc, sale) => {
      const group3 = sale.MVGR3; // Assuming MATERIAL_GROUP_3 is the field name
      acc[group3] = (acc[group3] || 0) + sale.SO_VAL; // Sum sales values by material group 3
      return acc;
    }, {});

    const chartLabels = Object.keys(materialGroup3);
    const chartData = Object.values(materialGroup3) as number[];

    const config: ChartConfiguration = {
      type: "pie" as ChartType,
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Material Group 3",
            data: chartData,
            backgroundColor: [
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: "rgba(255, 205, 86, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    };

    if (this.materialGroup3Chart) {
      this.materialGroup3Chart.destroy();
    }

    const ctx = (
      document.getElementById("materialGroup3Chart") as HTMLCanvasElement
    ).getContext("2d");
    this.materialGroup3Chart = new Chart(ctx, config);
  }

  // Method to create a sale type chart
  createSaleTypeChart(): void {
    const saleTypes = this.filteredSalesData.reduce((acc, sale) => {
      const type = sale.KVGR5; // Assuming SALE_TYPE is the field name
      acc[type] = (acc[type] || 0) + sale.SO_VAL; // Sum sales values by sale type
      return acc;
    }, {});

    const chartLabels = Object.keys(saleTypes);
    const chartData = Object.values(saleTypes) as number[];

    const config: ChartConfiguration = {
      type: "pie" as ChartType,
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Sale Type",
            data: chartData,
            backgroundColor: [
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: "rgba(255, 205, 86, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    };

    if (this.saleTypeChart) {
      this.saleTypeChart.destroy();
    }

    const ctx = (
      document.getElementById("saleTypeChart") as HTMLCanvasElement
    ).getContext("2d");
    this.saleTypeChart = new Chart(ctx, config);
  }

  // Method to create a channel chart
  createChannelChart(): void {
    const channels = this.filteredSalesData.reduce((acc, sale) => {
      const channel = sale.CHANNEL; // Assuming CHANNEL is the field name
      acc[channel] = (acc[channel] || 0) + sale.SO_VAL; // Sum sales values by channel
      return acc;
    }, {});

    const chartLabels = Object.keys(channels);
    const chartData = Object.values(channels) as number[];

    const config: ChartConfiguration = {
      type: "pie" as ChartType,
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Channel",
            data: chartData,
            backgroundColor: [
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: "rgba(255, 205, 86, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    };

    if (this.channelChart) {
      this.channelChart.destroy();
    }

    const ctx = (
      document.getElementById("channelChart") as HTMLCanvasElement
    ).getContext("2d");
    this.channelChart = new Chart(ctx, config);
  }

  // Method to update charts based on the filtered data
  updateCharts(filteredData: any[]): void {
    this.createSalesChart(); // Recreate the chart with the filtered data
    this.createCancellationsChart();
    this.createPerformanceChart();
    this.createBookingSourceChart();
    this.createMaterialGroupChart();
    this.createAreaChart();
    this.createMaterialGroup3Chart();
    this.createSaleTypeChart();
    this.createChannelChart();
  }
}
