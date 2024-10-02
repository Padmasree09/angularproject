import { DatePipe } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "pe-7s-graph", class: "" },
  { path: "/user", title: "User Profile", icon: "pe-7s-user", class: "" },
  { path: "/table", title: "Data ", icon: "pe-7s-note2", class: "" },
  // { path: '/typography', title: 'Typography',  icon:'pe-7s-news-paper', class: '' },
  { path: "/icons", title: "Icons", icon: "pe-7s-science", class: "" },
  //{ path: '/maps', title: 'Maps',  icon:'pe-7s-map-marker', class: '' },
  {
    path: "/notifications",
    title: "Notifications",
    icon: "pe-7s-bell",
    class: "",
  },
  // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'pe-7s-rocket', class: 'active-pro' },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  providers: [DatePipe],
})
export class SidebarComponent implements OnInit {
  fromDate: string;
  toDate: string;
  @Output() dateRangeChange: EventEmitter<{ from: string; to: string }> =
    new EventEmitter();

  onDateChange() {
    this.dateRangeChange.emit({ from: this.fromDate, to: this.toDate });
    console.log("Date Range Changed:", this.fromDate, this.toDate);
  }
  menuItems = [
    {
      path: "/dashboard",
      icon: "fa fa-dashboard",
      title: "Dashboard",
      class: "",
    },
    { path: "/reports", icon: "fa fa-bar-chart", title: "Reports", class: "" },
    // Add other menu items here
  ];

  constructor() {}
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  isMobileMenu() {
    return window.innerWidth <= 991;
  }
}
