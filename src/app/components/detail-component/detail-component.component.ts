import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-detail-component',
  imports: [CommonModule],
  templateUrl: './detail-component.component.html',
  styleUrl: './detail-component.component.css',
})
export class DetailComponentComponent implements OnInit {
  @Input() itemId!: string | null;
  name: string = ''
  gender: string = ''
  insurance: string = ''
  department: string = ''
  especialist: string = ''
  procedures?: string = ''
  age: number = 0
  admissionDate?: Date
  dischargeDate?: Date
  mrc: string = ''
  mrcDischarge: string = ''
  sector: string = ''
  dischargeStatus: string = ''
  diagnoses: string = ''
  comorbidities: string = ''

  constructor( private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    console.log(this.itemId)
    if(this.itemId){
      this.firebaseService.listarPacientePorId(this.itemId).then((response) => {
        this.name = response.name
        this.gender = response.gender
        this.insurance = response.insurance
        this.department = response.department
        this.especialist = response.specialist
        this.procedures = response.procedures
        this.age = response.age
        this.admissionDate = response.admissionDate
        this.dischargeDate = response.dischargeDate
        this.mrc = response.mrc
        this.mrcDischarge = response.mrcDischarge
        this.dischargeStatus = response.dischargeStatus
        this.diagnoses = response.diagnoses
        this.comorbidities = response.comorbidities
      })
    }
  }
}
