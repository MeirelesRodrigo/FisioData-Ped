import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { IconsServicesService } from '../../services/icons-service/icons-services.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GenericFormComponent } from '../generic-form/generic-form.component';
import { Pacients } from '../../pacients';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchComponentComponent } from "../search-component/search-component.component";
import { ToastModule } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { DetailComponentComponent } from "../detail-component/detail-component.component";
import { FirebaseService } from '../../services/firebase.service';
import { PaginatorModule } from 'primeng/paginator';
import { pipe, take } from 'rxjs';

@Component({
  selector: 'app-list-pacient',
  imports: [
    FontAwesomeModule,
    GenericFormComponent,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SearchComponentComponent,
    ToastModule,
    Dialog,
    DetailComponentComponent
],
  templateUrl: './list-pacient.component.html',
  styleUrl: './list-pacient.component.css'
})

export class ListPacientComponent implements OnInit{
  listPacients: Pacients[] = []
  allPacients: Pacients[] = []
  filterForm: FormGroup
  editModalVisible: boolean = false
  detailModalVisible: boolean = false
  itemSelect: string | null = null

  constructor(
    private fb: FormBuilder,
    public IconsService: IconsServicesService,
    private cdr: ChangeDetectorRef,
    private firebaseService: FirebaseService
  ){
    this.filterForm = this.fb.group({
      name: [''],
      department: [''],
      dischargeStatus : [''],
      internacaoStart: [''],
      internacaoEnd: ['']
    })
  }

  ngOnInit(): void{
    this.loadPacients();
  }

  loadPacients(){
    this.firebaseService.listarPacientesInternados().subscribe((pacients) => {
      this.listPacients = pacients.sort((b, a) =>
      new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime())
      this.allPacients = [...this.listPacients]
    })
  }
//   async loadPacients() {
//   try {
//     const pacients = await this.firebaseService.listarPacientes();
//     console.log(pacients);
//     this.listPacients = pacients.sort((a, b) =>
//       new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
//     );
//     this.allPacients = [...this.listPacients];
//   } catch (error) {
//     console.error("Erro ao carregar pacientes:", error);
//   }
// }

  searchPacients(filters: any): void {
    this.listPacients = this.allPacients.filter((pacient) => {
      return (
        (!filters.name || pacient.name.toLocaleLowerCase().includes(filters.name.toLocaleLowerCase())) &&
        (!filters.department || pacient.department === filters.department) &&
        (!filters.dischargeStatus || pacient.dischargeStatus === filters.dischargeStatus) &&
        (!filters.internacaoStart || new Date(pacient.admissionDate) >= new Date(filters.internacaoStart)) &&
        (!filters.internacaoEnd || (pacient.dischargeDate && new Date(pacient.dischargeDate) <= new Date(filters.internacaoEnd)))
      )
    })
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.listPacients = this.allPacients;
  }

  showEditModal(itemId: string){
      this.editModalVisible = true
      this.itemSelect = itemId
  }

  showDetailModal(itemId: string){
    this.detailModalVisible = true
    this.itemSelect = itemId
  }

  showAllPacientes(){
    this.firebaseService.listarPacientes().subscribe((pacients) => {
      this.listPacients = pacients.sort((b, a ) =>
      new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime())
      this.allPacients = [...this.listPacients]
    })
  }
}
