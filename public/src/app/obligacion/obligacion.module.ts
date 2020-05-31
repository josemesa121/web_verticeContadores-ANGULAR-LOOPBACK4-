import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObligacionComponent } from './obligacion.component';
import { SharedModule } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { ObligacionRoutingModule } from './obligacion-routing.module';
import { ObligacionManageComponent } from './manage/manage.component';
import { ObligacionViewComponent } from './view/view.component';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    ObligacionRoutingModule,
    FormsModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [ObligacionComponent, ObligacionManageComponent, ObligacionViewComponent]
})
export class ObligacionModule {}
