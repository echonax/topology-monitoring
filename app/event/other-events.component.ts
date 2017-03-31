import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Event, EventService } from './event.service';
import "rxjs/add/operator/toPromise";

@Component({
  moduleId: module.id,
  selector: 'event',
  templateUrl: './other-events.component.html'
})
export class OtherEventsComponent { 
  title = 'Tour of Events';
  events = [];
  selectedEvent: Event;
  constructor( private router: Router, private es: EventService ) { }

  ngOnInit(){
    this.es.getOtherEvents().toPromise()
      .then((res:any)=>{
        this.events = res;
        console.log(this.events);
      });
  }

  onSelect(event: Event): void {
    //this.selectedEvent = event;
    //this.router.navigate(['/events', event.name]);
  }
}