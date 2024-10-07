import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule } from "@angular/router";
import { NguiMapModule } from "@ngui/map";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { LbdModule } from "../../lbd/lbd.module";
import { AdminLayoutRoutes } from "./admin-layout.routing";

import { ChartComponent } from "app/chart/chart.component";
import { LoginComponent } from "app/login/login.component";
import { TestChartComponent } from "app/test-chart/test-chart.component";

import { HomeComponent } from "../../home/home.component";
import { IconsComponent } from "../../icons/icons.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { SidebarModule } from "../../sidebar/sidebar.module";
import { TablesComponent } from "../../tables/tables.component";
import { UpgradeComponent } from "../../upgrade/upgrade.component";
import { UserComponent } from "../../user/user.component";
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatTabsModule,
    ReactiveFormsModule,
    LbdModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    NguiMapModule.forRoot({
      apiUrl: "https://maps.google.com/maps/api/js?key=YOUR_KEY_HERE",
    }),
    SidebarModule,
  ],
  declarations: [
    HomeComponent,
    UserComponent,
    TablesComponent,
    TestChartComponent,
    LoginComponent,
    ChartComponent,
    IconsComponent,

    NotificationsComponent,
    UpgradeComponent,
  ],
})
export class AdminLayoutModule {}
