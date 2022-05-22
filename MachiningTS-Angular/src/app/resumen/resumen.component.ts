import { Component, OnInit, OnDestroy} from '@angular/core';
import { ApiService } from 'src/app/api.service';
import {Chart,LinearScale,registerables} from 'node_modules/chart.js';
// import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import {FormGroup, FormControl} from '@angular/forms';
import * as alt from 'alertifyjs';
import { Subject, Subscription } from 'rxjs';
@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit, OnDestroy {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  constructor(private service:ApiService) { }
  proveedorInfo:any=[];
  empleadoInfo:any=[];
  herramientaInfo:any=[];
  numeroproveedores!:number;
  numeroclientes!:number;
  numeroherramientas!:number;
  numeroempleados!:number;
  value1!:string;
  fechas:any=[];
  daten:any=[];
  altas:any=[];
  bajas:any=[];
  grupo:any=[];
  myChart:any;
  
  private subscriptions: Subscription = new Subscription(); 

  ngOnInit(): void {
    Chart.register(...registerables);
    this.gatherInfo();
    this.graficaDona();
     this.myChart = new Chart("myChart", {
      type: 'line',
      data : {
        labels: this.fechas,
        datasets: [{
          label: 'Altas',
          data: this.altas,
          fill: true,
          backgroundColor:'#2a9d8f23',
          borderColor: '#2a9d8f',
          tension: 0.1
        },
        {
          label: 'Bajas',
          data: this.bajas,
          fill: true,
          backgroundColor:'#e76f5123',
          borderColor: '#e76f51',
          tension: 0.1
        }
      ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            beginAtZero: true,
          }
        }
      }
    });
    
  }

  ngOnDestroy(): void{
    this.subscriptions.unsubscribe();
  }
  

  loadData(){
    this.myChart.destroy();
  
    if(this.range.value.start==null || this.range.value.end==null){
      alt.error('Seleccione alguna fecha')
      this.myChart = new Chart("myChart", {
        type: 'line',
        data : {
          labels: this.fechas,
          datasets: [{
            label: 'Altas',
            data: this.altas,
            fill: true,
            backgroundColor:'#2a9d8f23',
            borderColor: '#2a9d8f',
            tension: 0.1
          },
          {
            label: 'Bajas',
            data: this.bajas,
            fill: true,
            backgroundColor:'#e76f5123',
            borderColor: '#e76f51',
            tension: 0.1
          }
        ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            },
            x: {
              beginAtZero: true,
            }
          }
        }
      });
    }else{
    this.subscriptions.add(this.service.postGraph(this.range.value).subscribe(res=>{
    this.daten=res;
    this.fechas=[];
    this.altas=[];
    this.bajas=[];
    this.grupo=[];
    
    for (const obj of this.daten ) {
      this.fechas.push([obj.herramienta,obj.fecha])
    }

    for (const obj of this.daten ) {
      this.altas.push(obj.altas)
    }

    for (const obj of this.daten ) {
      this.bajas.push(obj.bajas)
    }

    for (const obj of this.daten ) {
      this.grupo.push(obj.herramienta)
    }

    this.myChart = new Chart("myChart", {
        type: 'line',
        data : {
          labels: this.fechas,
          datasets: [{
            label: 'Altas',
            data: this.altas,
            fill: true,
            backgroundColor:'#2a9d8f23',
            borderColor: '#2a9d8f',
            tension: 0.1
          },
          {
            label: 'Bajas',
            data: this.bajas,
            fill: true,
            backgroundColor:'#e76f5123',
            borderColor: '#e76f51' ,
            tension: 0.1
          }
        ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            },
            x: {
              beginAtZero: true,
            }
          }
        }
      });
 
    }));
  }
    
  }

  createChart(){
    this.subscriptions.add(this.service.getGraph().subscribe(data=>{
      let toolArray2:any=[];
      let fechas:any=[];
      let altas:any=[];
      let bajas:any=[];
      toolArray2=data;


      for (const obj of toolArray2) {
        fechas.push([ obj.herramienta , obj.fecha ]);
      }
      for (const obj of toolArray2) {
        altas.push(obj.altas);
      }
      for (const obj of toolArray2) {
        bajas.push(obj.bajas);
      }


      var myChart = new Chart("myChart", {
        type: 'line',
        data : {
          labels: this.fechas,
          datasets: [{
            label: 'Altas',
            data: this.altas,
            fill: true,
            backgroundColor:'#2a9d8f23',
            borderColor: '#2a9d8f',
            tension: 0.1
          },
          {
            label: 'Bajas',
            data: this.bajas,
            fill: true,
            backgroundColor:'#e76f5123',
            borderColor: '#e76f51',
            tension: 0.1
          }
        ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            },
            x: {
              beginAtZero: true,
            }
          }
        }
      });
    }));
    

  }

  gatherInfo(){
    this.subscriptions.add(this.service.getGraph().subscribe((res:any)=>{
        this.numeroproveedores = res.prov;
        this.numeroempleados = res.emps;
        this.numeroclientes = res.clie;
        this.numeroherramientas = res.herr;
      }));

  }

  graficaDona(){
    this.subscriptions.add(this.service.getHerramientas().subscribe(data=>{

      let toolArray:any=[];
      let counter1 = 0;
      for (const obj of data) {
        if (obj.nivelInventario === 'Alto') counter1++;
      }
      let counter2 = 0;
      for (const obj of data) {
        if (obj.nivelInventario === 'Medio') counter2++;
      }
      let counter3 = 0;
      for (const obj of data) {
        if (obj.nivelInventario === 'Bajo') counter3++;
      }
      let counter4 = 0;
      for (const obj of data) {
        if (obj.nivelInventario === 'Muy Bajo') counter4++;
      }
      let counter5 = 0;
      for (const obj of data) {
        if (obj.nivelInventario === 'Sin Inventario') counter5++;
      }


      toolArray.push(counter1);
      toolArray.push(counter2);
      toolArray.push(counter3);
      toolArray.push(counter4);
      toolArray.push(counter5);

      var donutChart = new Chart("donutChart", {
        type: 'doughnut',
        data : {
          labels: [
            'Alto',
            'Medio',
            'Bajo',
            'Muy Bajo',
            'Sin Inventario'
          ],
          datasets: [{
            label: 'Nivel de Herramientas',
            data: toolArray,
            backgroundColor: [
              '#264653',
              '#2a9d8f',
              '#e9c46a',
              '#f4a261',
              '#e76f51'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          scales: {
            y: {
              display:false
            }
          }
        }
      });
    }));

  }

}
