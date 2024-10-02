import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
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
export class TablesComponent implements OnInit, OnDestroy, AfterViewInit {
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
  salesChart: Chart;
  cancellationsChart: Chart;
  performanceChart: Chart;
  bookingSourceChart: Chart;
  materialGroupChart: Chart;
  areaChart: Chart;
  materialGroup3Chart: Chart;
  saleTypeChart: Chart;
  channelChart: Chart;
  salesComparisionChart: Chart;
  activeCanvas: string = "salesChart"; // Initial canvas to display
  activeChartInstance: Chart | null = null;
  isReportVisible = true;
  isFilterVisible = false;

  toggleReport() {
    this.isReportVisible = !this.isReportVisible; // Toggle the visibility
  }
  toggleFilter() {
    this.isFilterVisible = !this.isFilterVisible;
  }
  @ViewChild(SidebarComponent) sidebar: SidebarComponent;
  @ViewChild("graphSection") graphSection: ElementRef;
  onDateRangeChange(dateRange: { from: string; to: string }) {
    this.fromDate = dateRange.from;
    this.toDate = dateRange.to;
    this.filterSalesData();
    this.createSalesChart(); // Your existing method for detailed sales chart
    this.createMonthlySalesComparisonChart(this.fromDate, this.toDate); // New comparison chart
    console.log("Date range changed. Creating comparison chart.");
  }
  constructor(
    private salesDataService: SalesDataService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}
  scrollToGraph() {
    // Scroll to the graph section when called
    this.graphSection.nativeElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
  ngOnDestroy(): void {
    this.destroyChart(this.salesChart);
    this.destroyChart(this.cancellationsChart);
    this.destroyChart(this.bookingSourceChart);
    this.destroyChart(this.performanceChart);
    this.destroyChart(this.areaChart);
    this.destroyChart(this.materialGroupChart);
    this.destroyChart(this.materialGroup3Chart);
    this.destroyChart(this.channelChart);
    this.destroyChart(this.salesComparisionChart);
  }
  destroyChart(chart: Chart | undefined): void {
    if (chart) {
      chart.destroy();
    }
  }
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
  ngAfterViewInit(): void {
    this.renderChart("sales");
  }

  showChart(period: string) {
    this.currentChart = period; // Update the current chart
    this.cdr.detectChanges();
    // Clear existing charts and render the new one
    this.renderChart(period);
  }
  renderChart(period: string) {
    if (this.activeChartInstance) {
      this.activeChartInstance.destroy();
    }
    // Clear the previous chart if it exists
    if (period === "sales") {
      this.scrollToGraph();
      this.createSalesChart();
      this.createMonthlySalesComparisonChart(this.fromDate, this.toDate);
    } else if (period === "cancellations") {
      this.createCancellationsChart();
      this.createMonthlySalesComparisonChart(this.fromDate, this.toDate);
      this.scrollToGraph();
    } else if (period === "bookingsource") {
      this.createBookingSourceChart();
      this.createMonthlySalesComparisonChart(this.fromDate, this.toDate);
      this.scrollToGraph();
    } else if (period === "materialgroup") {
      this.createMaterialGroupChart();
      this.createMonthlySalesComparisonChart(this.fromDate, this.toDate);
      this.scrollToGraph();
    } else if (period === "area") {
      this.createAreaChart();
      this.createMonthlySalesComparisonChart(this.fromDate, this.toDate);
      this.scrollToGraph();
    } else if (period === "materialgroup3") {
      this.createMaterialGroup3Chart();
      this.createMonthlySalesComparisonChart(this.fromDate, this.toDate);
      this.scrollToGraph();
    } else if (period === "performance") {
      this.createPerformanceChart();
      this.createMonthlySalesComparisonChart(this.fromDate, this.toDate);
      this.scrollToGraph();
    } else if (period === "channel") {
      this.createChannelChart();
      this.createMonthlySalesComparisonChart(this.fromDate, this.toDate);
      this.scrollToGraph();
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
      this.filteredSalesData = this.salesData.filter((sale) => {
        const saleDate = new Date(sale.AUDAT); // Convert document date to Date object
        return saleDate >= new Date(fromDate) && saleDate <= new Date(toDate);
      });
    } else {
      this.filteredSalesData = this.salesData; // If no date range selected, show all data
    }

    //this.updateCharts(this.filteredSalesData); // Update charts with filtered data
    console.log(this.filteredSalesData);
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

  // Method to create a sales chart
  createSalesChart(): void {
    const labels = this.filteredSalesData.map((sale) => sale.AUDAT); // Assuming AUDAT is the sale date
    const salesValues = this.filteredSalesData.map((sale) => sale.MAIN); // Assuming 'MAIN' is the sales value

    const chartData = {
      labels,
      datasets: [
        {
          label: "Sales Amount",
          data: salesValues,
          backgroundColor: "rgba(75, 192, 192, 0.6)", // Softer greenish color for bars
          borderColor: "rgba(75, 192, 192, 1)", // Darker green for borders
          borderWidth: 2,
          hoverBackgroundColor: "rgba(75, 192, 192, 0.8)", // Slightly darker hover color
          hoverBorderColor: "rgba(75, 192, 192, 1)", // Same hover border
        },
      ],
    };

    const config: ChartConfiguration = {
      type: "bar" as ChartType, // Keeping 'bar' chart
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to resize dynamically
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(200, 200, 200, 0.3)", // Subtle grid lines for cleaner look
            },
            ticks: {
              color: "#333", // Darker tick labels for better readability
              font: {
                family: "Arial", // Custom font for better legibility
                size: 12, // Slightly larger font
              },
            },
          },
          x: {
            grid: {
              color: "rgba(200, 200, 200, 0.3)", // Subtle grid lines on the x-axis as well
            },
            ticks: {
              color: "#333", // Darker tick labels for better readability
              font: {
                family: "Arial", // Custom font for x-axis labels
                size: 12,
              },
            },
          },
        },
        plugins: {
          legend: {
            position: "top", // Position the legend at the top of the chart
            labels: {
              color: "#333", // Darker legend text for improved visibility
              font: {
                family: "Arial", // Custom font for legend labels
                size: 14, // Slightly larger font size for the legend
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark background for tooltips
            titleColor: "#fff", // White tooltip title
            bodyColor: "#fff", // White tooltip text
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.5)", // Subtle border around tooltips
            callbacks: {
              label: (context) => {
                const value = context.raw;
                return `Sales: $${value}`; // Format the tooltip label
              },
            },
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.salesChart) {
      this.salesChart.destroy();
    }

    // Get the canvas element and initialize the chart
    const ctx = (
      document.getElementById("salesChart") as HTMLCanvasElement
    ).getContext("2d");
    this.salesChart = new Chart(ctx, config);
  }
  createMonthlySalesComparisonChart(fromDate: string, toDate: string): void {
    // Parse the input dates
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    // Filter sales data for the given date range
    const salesInRange = this.filteredSalesData.filter((sale) => {
      const saleDate = new Date(sale.AUDAT);
      return saleDate >= startDate && saleDate <= endDate;
    });

    // Group sales by month
    const monthlySales = salesInRange.reduce((acc, sale) => {
      const saleDate = new Date(sale.AUDAT);
      const monthYear = `${saleDate.getFullYear()}-${(saleDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += sale.MAIN;
      return acc;
    }, {});

    // Prepare data for the chart
    const labels = Object.keys(monthlySales).sort();
    const data = labels.map((month) => monthlySales[month]);

    const chartData = {
      labels: labels.map((month) => {
        const [year, monthNum] = month.split("-");
        return new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString(
          "default",
          { month: "long", year: "numeric" }
        );
      }),
      datasets: [
        {
          label: "Monthly Sales",
          data: data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: "bar" as ChartType,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Total Sales",
            },
          },
          x: {
            title: {
              display: true,
              text: "Month",
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Hide legend as we only have one dataset
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `Total Sales: $${value.toFixed(2)}`;
              },
            },
          },
        },
      },
    };

    // Destroy the existing chart if already rendered
    if (this.salesComparisionChart) {
      this.salesComparisionChart.destroy();
    }

    // Get the canvas element and initialize the chart
    const ctx = (
      document.getElementById("salesComparisionChart") as HTMLCanvasElement
    ).getContext("2d");
    this.salesComparisionChart = new Chart(ctx, config);
  }

  // createSalesComparisonChart(): void {
  //   // Assuming that 'this.filteredSalesData' contains all the sales data for both months
  //   // Group sales data by month.
  //   const month1Sales = this.filteredSalesData.filter((sale) =>
  //     sale.AUDAT.startsWith("01-09-2023")
  //   );
  //   const month2Sales = this.filteredSalesData.filter((sale) =>
  //     sale.AUDAT.startsWith("01-10-2023")
  //   );

  //   const labels = month1Sales.map((sale) => sale.AUDAT); // Assuming sales are on the same dates
  //   const month1Values = month1Sales.map((sale) => sale.MAIN); // September sales values
  //   const month2Values = month2Sales.map((sale) => sale.MAIN); // October sales values

  //   const chartData = {
  //     labels, // Using the same labels for both months (dates)
  //     datasets: [
  //       {
  //         label: "September Sales",
  //         data: month1Values,
  //         backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue color for September
  //         borderColor: "rgba(54, 162, 235, 1)",
  //         borderWidth: 2,
  //         hoverBackgroundColor: "rgba(54, 162, 235, 0.8)", // Darker on hover
  //         hoverBorderColor: "rgba(54, 162, 235, 1)",
  //       },
  //       {
  //         label: "October Sales",
  //         data: month2Values,
  //         backgroundColor: "rgba(255, 99, 132, 0.6)", // Red color for October
  //         borderColor: "rgba(255, 99, 132, 1)",
  //         borderWidth: 2,
  //         hoverBackgroundColor: "rgba(255, 99, 132, 0.8)", // Darker on hover
  //         hoverBorderColor: "rgba(255, 99, 132, 1)",
  //       },
  //     ],
  //   };

  //   const config: ChartConfiguration = {
  //     type: "bar" as ChartType, // Bar chart for comparison
  //     data: chartData,
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           grid: {
  //             color: "rgba(200, 200, 200, 0.3)",
  //           },
  //           ticks: {
  //             color: "#333",
  //             font: {
  //               family: "Arial",
  //               size: 12,
  //             },
  //           },
  //         },
  //         x: {
  //           grid: {
  //             color: "rgba(200, 200, 200, 0.3)",
  //           },
  //           ticks: {
  //             color: "#333",
  //             font: {
  //               family: "Arial",
  //               size: 12,
  //             },
  //           },
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: "top",
  //           labels: {
  //             color: "#333",
  //             font: {
  //               family: "Arial",
  //               size: 14,
  //             },
  //           },
  //         },
  //         tooltip: {
  //           backgroundColor: "rgba(0, 0, 0, 0.7)",
  //           titleColor: "#fff",
  //           bodyColor: "#fff",
  //           borderWidth: 1,
  //           borderColor: "rgba(255, 255, 255, 0.5)",
  //           callbacks: {
  //             label: (context) => {
  //               const value = context.raw;
  //               return `Sales: $${value}`; // Format the tooltip label
  //             },
  //           },
  //         },
  //       },
  //     },
  //   };

  //   // Destroy the existing chart if already rendered
  //   if (this.salesComparisionChart) {
  //     this.salesComparisionChart.destroy();
  //   }

  //   // Get the canvas element and initialize the chart
  //   const ctx = (
  //     document.getElementById("salesComparisionChart") as HTMLCanvasElement
  //   ).getContext("2d");
  //   this.salesComparisionChart = new Chart(ctx, config);
  // }

  // Method to create a cancellations chart
  createCancellationsChart() {
    const labels = this.filteredSalesData.map((sale) => sale.AUDAT); // Assuming AUDAT is the sale date
    const cancellations = this.filteredSalesData.filter(
      (sale) => sale.CANC_CHRG
    ).length; // Filter cancelled sales

    // Group by date for cancellations
    const cancellationCounts = this.filteredSalesData.reduce((acc, sale) => {
      if (sale.CANC_CHRG) {
        const saleDate = new Date(sale.AUDAT).toDateString(); // Group by date
        acc[saleDate] = (acc[saleDate] || 0) + 1; // Count cancellations per date
        console.log(
          "Cancellations Data: ",
          this.filteredSalesData.filter((sale) => sale.CANC_CHRG)
        );
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
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 2,
          },
        },
      },
    };
    const ctx = document.getElementById(
      "cancellationsChart"
    ) as HTMLCanvasElement;
    if (ctx) {
      const chartCtx = ctx.getContext("2d");
      if (chartCtx) {
        this.activeChartInstance = new Chart(chartCtx, config);
      } else {
        console.error("Failed to get 2D context for cancellations chart");
      }
    } else {
      console.error("Cancellations chart element not found");
    }

    // Destroy the existing chart if already rendered
    if (this.cancellationsChart) {
      this.cancellationsChart.destroy();
    }
  }
  //method to create performance chart
  createPerformanceChart(): void {
    // Aggregate performance data by sales executive
    const performanceData = this.filteredSalesData.reduce((acc, sale) => {
      const execName = sale.SALE_EXE; // Assuming 'SALE_EXE' is the sales executive name
      acc[execName] = (acc[execName] || 0) + sale.MAIN; // Sum up the sales amount per executive
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
            backgroundColor: "rgba(153, 102, 255, 0.6)", // Softer purple for bar background
            borderColor: "rgba(153, 102, 255, 1)", // Darker purple for bar borders
            borderWidth: 2,
            hoverBackgroundColor: "rgba(153, 102, 255, 0.8)", // Slightly darker on hover
            hoverBorderColor: "rgba(153, 102, 255, 1)", // Same border on hover
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.1)", // Subtle white grid lines
            },
            ticks: {
              color: "#333", // Darker tick labels
              font: {
                family: "Arial",
                size: 12, // Custom font size for y-axis
              },
            },
          },
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.1)", // Subtle white grid lines for x-axis
            },
            ticks: {
              color: "#333", // Darker tick labels for x-axis
              font: {
                family: "Arial",
                size: 12, // Custom font size for x-axis
              },
            },
          },
        },
        plugins: {
          legend: {
            position: "top", // Position legend at the top
            labels: {
              color: "#333", // Darker text for legend
              font: {
                family: "Arial",
                size: 14, // Larger font for legend
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark background for tooltips
            titleColor: "#fff", // White title text
            bodyColor: "#fff", // White body text
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.5)", // Subtle border for tooltips
            callbacks: {
              label: (context) => {
                const value = context.raw;
                return `Sales: $${value}`; // Format the tooltip label
              },
            },
          },
        },
      },
    };

    const ctx = document.getElementById(
      "performanceChart"
    ) as HTMLCanvasElement;
    if (ctx) {
      const chartCtx = ctx.getContext("2d");
      if (chartCtx) {
        // Destroy the existing chart if already rendered
        if (this.performanceChart) {
          this.performanceChart.destroy();
        }

        this.performanceChart = new Chart(chartCtx, config);
      } else {
        console.error("Failed to get 2D context for performance chart");
      }
    } else {
      console.error("Performance chart element not found");
    }
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
        maintainAspectRatio: false,
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
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              // Add more colors as needed
            ],
            borderColor: "rgba(153, 102, 255, 0.6)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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

  //method to create an area chart
  createAreaChart(): void {
    const areas = this.filteredSalesData.reduce((acc, sale) => {
      const area = sale.UMREN; // Assuming UMREN is the field name for area
      acc[area] = (acc[area] || 0) + sale.SO_VAL; // Sum sales values by area
      return acc;
    }, {});

    const chartLabels = Object.keys(areas);
    const chartData = Object.values(areas) as number[];

    const config: ChartConfiguration = {
      type: "bar" as ChartType, // Change to 'bar' chart
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Sales by Area",
            data: chartData,
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)", // Red
              "rgba(54, 162, 235, 0.6)", // Blue
              "rgba(255, 206, 86, 0.6)", // Yellow
              "rgba(75, 192, 192, 0.6)", // Green
              "rgba(153, 102, 255, 0.6)", // Purple
              "rgba(255, 159, 64, 0.6)", // Orange
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
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(200, 200, 200, 0.2)", // Customize grid lines
            },
            ticks: {
              color: "#666", // Customize y-axis labels color
            },
          },
          x: {
            grid: {
              color: "rgba(200, 200, 200, 0.2)", // Customize grid lines
            },
            ticks: {
              color: "#666", // Customize x-axis labels color
            },
          },
        },
        plugins: {
          legend: {
            position: "top", // Move the legend to the top
            labels: {
              color: "#333", // Customize legend text color
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Darken the tooltip background
            titleColor: "#fff",
            bodyColor: "#fff",
          },
        },
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
              "rgba(255, 205, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
            borderColor: "rgba(255, 205, 86, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
      acc[type] = (acc[type] || 0) + sale.MAIN; // Sum sales values by sale type
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
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#FFFFFF", // White legend text
              font: {
                size: 14, // Smaller font size for legend
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark tooltip background
            titleColor: "#FFFFFF", // White tooltip title
            bodyColor: "#FFFFFF", // White tooltip body
          },
        },
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
              "rgba(255, 205, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
            borderColor: "rgba(255, 205, 86, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
    this.createMonthlySalesComparisonChart(this.fromDate, this.toDate);
  }
}
