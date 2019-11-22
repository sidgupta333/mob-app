import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MixersPage } from './mixers.page';
import { MixerModalComponent } from 'src/app/modals/mixer-modal/mixer-modal.component';

const routes: Routes = [
  {
    path: '',
    component: MixersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MixersPage, MixerModalComponent],
  entryComponents: [MixerModalComponent]
})
export class MixersPageModule {}
