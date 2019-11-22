import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderSummaryPage } from './order-summary.page';

const routes: Routes = [
  {
    path: '',
    component: OrderSummaryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderSummaryPage],
  entryComponents: []
})
export class OrderSummaryPageModule {}
