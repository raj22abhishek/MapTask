// google-maps.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

interface Marker {
  lat: number;
  lng: number;
  label: string;
  draggable: boolean;
}

interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?: string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements OnInit {
  

  geocoder: any;
  public formData:Marker = {
    lat : null,
    lng: null,
    draggable: true,
    label: null
  };
  longitude:FormControl;
  latitude:FormControl;
  form:FormGroup;
  Name:FormControl;
  public location: Location = {
    lat: 51.678418,
    lng: 7.809007,
    marker: {
      lat: 51.678418,
      lng: 7.809007,
      draggable: true,
      label:""
    },
    zoom: 5
  };
  clicked:boolean = false;
  tableData: any = [];
  dummyData: any = [];
  @ViewChild(AgmMap, { static: true }) map: AgmMap;
  coordinates: { latitude: number; longitude: number; };

  constructor(public mapsApiLoader: MapsAPILoader,private formBuilder:FormBuilder) {
    this.mapsApiLoader = mapsApiLoader;

    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }
 
 
  ngOnInit() {
    this.Name = new FormControl();
    this.latitude = new FormControl();
    this.longitude = new FormControl();
    this.form = this.formBuilder.group({
      Name : this.Name,
      latitude: this.latitude,
      longitude: this.longitude
    })
    this.getPosition().subscribe(
      (pos: any) => {
          this.coordinates = {
            latitude:  +(pos.coords.latitude),
            longitude: +(pos.coords.longitude)
          };
          this.location.lat = pos.coords.latitude;
          this.location.lng = pos.coords.longitude;
          console.log(this.coordinates);
      });
      
  }

  submit(){
    if(this.form.value.Name && this.form.value.latitude && this.form.value.longitude){

      this.tableData.push(this.form.value)
      this.dummyData.push(this.form.value)
      console.log(this.tableData)
      this.form.reset();
    }
    
  }

  
  public getPosition(): Observable<any> {
    return Observable.create(
      (observer) => {
      navigator.geolocation.watchPosition((pos: any) => {
        observer.next(pos);
      }),
      () => {
          console.log('Position is not available');
      },
      {
        enableHighAccuracy: true
      };
    });
  }

  showRoute(){
    this.clicked = true;
    
    console.log(this.tableData)
    this.dummyData.push({"Name":"","latitude":this.coordinates.latitude,"longitude":this.coordinates.longitude})
  }
}
