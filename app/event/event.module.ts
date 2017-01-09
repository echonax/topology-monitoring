import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { EventRoutingModule } from './event-routing.module';
import { EventService } from './event.service';
import { EventComponent }    from './event.component';
import { EventDetailComponent }    from './event-detail.component';
import { EventCreateComponent }    from './event-create/event-create.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EventRoutingModule
  ],
  declarations: [    
    EventComponent,
    EventDetailComponent,
    EventCreateComponent,
  ],
  providers: [
    EventService
  ]
})
export class EventModule {}