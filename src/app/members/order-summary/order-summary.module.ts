import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderSummaryPage } from './order-summary.page';
import { TableModalComponent } from 'src/app/modals/table-modal/table-modal.component';

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
  declarations: [OrderSummaryPage, TableModalComponent],
  entryComponents: [TableModalComponent]
})
export class OrderSummaryPageModule {}
