import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Pacients } from '../../pacients';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ToastModule, ButtonModule, RippleModule],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css'
})
export class GenericFormComponent implements OnInit, OnChanges {
  @Input() itemId!: string | null;

  title: string = 'Cadastro';
  idUser: string = '';
  flag: boolean = false;

  constructor(
              private route: ActivatedRoute,
              private messageService: MessageService,
              private firebaseService: FirebaseService
  ) {
    this.form.get('dischargeStatus')?.valueChanges.subscribe(value => {
      if (value == 'Internado'){
        this.form.get('mrcDischarge')?.disable();
        this.form.get('dischargeDate')?.disable();
        this.form.get('dischargeDate')?.reset();
        this.form.get('mrcDischarge')?.reset();
        this.firebaseService.atualizarPacienteInternado(this.idUser)
      } else {
        this.form.get('mrcDischarge')?.enable();
        this.form.get('dischargeDate')?.enable();
        this.form.markAllAsTouched();
      }
    })
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    age: new FormControl<number | null>(null, [Validators.required, Validators.max(100)]),
    gender: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    insurance: new FormControl('', Validators.required),
    admissionDate: new FormControl<Date | null>(null, Validators.required),
    dischargeDate: new FormControl<Date | null>(null, Validators.required),
    dischargeStatus: new FormControl('', Validators.required),
    specialist: new FormControl('', Validators.required),
    diagnoses: new FormControl('', Validators.required),
    comorbidities: new FormControl('', Validators.required),
    mrc: new FormControl('', Validators.required),
    mrcDischarge: new FormControl('', Validators.required),
    motorPhysiotherapy: new FormControl<Boolean | null>(null),
    respiratoryPhysiotherapy: new FormControl<Boolean | null>(null),
    oxygenTherapy: new FormControl<Boolean | null>(null),
    nonInvasiveVentilation: new FormControl<Boolean | null>(null),
    therapeuticPlan: new FormControl<Boolean | null>(null),
    procedures: new FormControl('')
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const newId = params.get('itemId');
      if (newId) {
        this.updateFormWithUser(newId);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemId'] && this.itemId) {
      this.updateFormWithUser(this.itemId);
    }
  }

  updateFormWithUser(id: string): void {
    this.idUser = id;
    this.title = 'Editar';
    this.flag = true;

    this.firebaseService.listarPacientePorId(id).then((pacient) => {
      this.form.patchValue({
            name: pacient.name,
            age: pacient.age,
            gender: pacient.gender,
            department: pacient.department,
            insurance: pacient.insurance,
            admissionDate: pacient.admissionDate,
            dischargeDate: pacient.dischargeDate,
            dischargeStatus: pacient.dischargeStatus,
            specialist: pacient.specialist,
            diagnoses: pacient.diagnoses,
            comorbidities: pacient.comorbidities,
            mrc: pacient.mrc,
            mrcDischarge: pacient.mrcDischarge,
            procedures: pacient.procedures,
            motorPhysiotherapy: pacient.motorPhysiotherapy,
            respiratoryPhysiotherapy: pacient.respiratoryPhysiotherapy,
            oxygenTherapy: pacient.oxygenTherapy,
            nonInvasiveVentilation: pacient.nonInvasiveVentilation,
            therapeuticPlan: pacient.therapeuticPlan
      });
    })
  }

  async submit() {
    try {
    const DATA = this.form.value;
    if (this.idUser) {
      this.firebaseService.atualizarPaciente({ ...DATA, id: this.idUser} as Pacients)
      this.showMessageSucess();

    } else {
      await this.firebaseService.criarRegistro({ ...DATA, id: this.idUser } as Pacients);
      this.showMessageSucess();
      this.form.reset();
    }
    } catch (error) {}
  }

  showMessageSucess() {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Dados salvos com sucesso', key: 'br', life: 3000 });
  }

}
