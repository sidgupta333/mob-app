import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';
import { ModalComponent } from './modal/modal.component';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  { path: 'outlets', loadChildren: () => import('./outlets/outlets.module').then(m => m.OutletsPageModule) },
  { path: 'menu', loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule) },
  { path: 'mixers', loadChildren: () => import('./mixers/mixers.module').then(m => m.MixersPageModule) },
  { path: 'orderSummary', loadChildren: () => import('./order-summary/order-summary.module').then(m => m.OrderSummaryPageModule) },
  { path: 'notif', loadChildren: () => import('./notif/notif.module').then(m => m.NotifPageModule) }
  
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],
  exports: [RouterModule],
  entryComponents: []
})
export class MemberRoutingModule { }
