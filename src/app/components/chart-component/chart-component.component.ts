import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SearchComponentComponent } from "../search-component/search-component.component";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pacients } from '../../pacients';
import { ChartServiceService } from '../../services/chart-service/chart-service.service';
import { FirebaseService } from '../../services/firebase.service';

@Component({
    selector: 'app-chart-component',
    imports: [ChartModule, SearchComponentComponent, CommonModule],
    templateUrl: './chart-component.component.html',
    styleUrl: './chart-component.component.css'
})
export class ChartComponentComponent {
    data: any;
    options: any;
    filterForm: FormGroup;
    platformId = inject(PLATFORM_ID);
    chartType: any[] = []

    listPacients: Pacients[] = []
    allPacients: Pacients[] = []

    totalDeAtendimentos: number = 0
    totalAtendimentoDiario: number = 0

    mediaAtendimentosDiarios: number = 0;

    totaldePacientes: number = 0

    totalPacientesUnicos: number = 0;
    totalDiasInternacao: number = 0;
    totalAtendimentosMes: number = 0;

    mediaDiasInternacaoPorPaciente: number = 0;


    constructor(
        private firebaseService: FirebaseService,
        private fb: FormBuilder,
        private chartService: ChartServiceService
    ) {
        this.filterForm = this.fb.group({
            name: [''],
            department: [''],
            dischargeStatus: [''],
            internacaoStart: [''],
            internacaoEnd: ['']
        })
    }

    ngOnInit() {
        this.loadPacients();
    }

    clearFilter() {
        this.filterForm.reset();
        this.listPacients = [...this.allPacients];
        this.initCharts();
        this.generalReport();
    }

    // ESSA FORMA GASTA MENOS LEITUA DO FIREBASE
    // async loadPacients() {
    //     try {
    //       const pacients = await this.firebaseService.listarPacientes();
    //       console.log(pacients);
    //       this.listPacients = pacients.sort((a, b) =>
    //         new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
    //       );
    //       this.initCharts();
    //       this.generalReport();
    //       this.allPacients = [...this.listPacients];
    //     } catch (error) {
    //       console.error("Erro ao carregar pacientes:", error);
    //     }
    //   }

    async loadPacients() {
        try {
          this.firebaseService.listarPacientes().subscribe(pacients => {
            this.listPacients = pacients.sort((b, a) =>
              new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
            );
            this.initCharts();
            this.generalReport();
            this.allPacients = [...this.listPacients];
          }, error => {
            console.error("Erro ao carregar pacientes:", error);
          });
        } catch (error) {
          console.error("Erro ao carregar pacientes:", error);
        }
      }


      generalReport() {
        try {
          const pacientesValidos = this.listPacients.filter(p => p.age >= 0);
          this.totalPacientesUnicos = pacientesValidos.length;

          this.totalDiasInternacao = pacientesValidos.reduce((total, paciente) => {
              const dataAdmissao = new Date(paciente.admissionDate);
              const dataAlta = paciente.dischargeDate ? new Date(paciente.dischargeDate) : new Date();

              dataAdmissao.setHours(0, 0, 0, 0);
              dataAlta.setHours(0, 0, 0, 0);

              // Verificação de erro lógico
              if (dataAlta < dataAdmissao) {
                  console.warn(`⚠️ Alta anterior à admissão para ${paciente.name}`);
                  return total;
              }

              const diffDias = Math.floor((dataAlta.getTime() - dataAdmissao.getTime()) / (1000 * 60 * 60 * 24));
              return total + diffDias;
          }, 0);

          this.totalAtendimentosMes = this.totalDiasInternacao * 2;

          const diasNoMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
          this.mediaAtendimentosDiarios = this.totalAtendimentosMes / diasNoMes;

          this.mediaDiasInternacaoPorPaciente = this.totalDiasInternacao / this.totalPacientesUnicos;

          // Relatório por paciente com datas formatadas
          const detalhesPacientes = pacientesValidos.map(p => {
            const admissaoDate = new Date(p.admissionDate);
            const altaDate = p.dischargeDate ? new Date(p.dischargeDate) : new Date();

            admissaoDate.setHours(0, 0, 0, 0);
            altaDate.setHours(0, 0, 0, 0);

            const dias = Math.floor((altaDate.getTime() - admissaoDate.getTime()) / (1000 * 60 * 60 * 24) );

            const formatarData = (data: Date): string => {
              const iso = data.toISOString().split('T')[0]; // yyyy-mm-dd
              const [ano, mes, dia] = iso.split('-');
              return `${dia}/${mes}/${ano}`;
            };

            return {
              Nome: p.name,
              Admissão: formatarData(admissaoDate),
              Alta: p.dischargeDate ? formatarData(altaDate) : "Sem alta (contou até hoje)",
              Dias: dias
            };
          });
        } catch (error) {
          console.error("❌ Erro no relatório:", error);
        }
      }

    getDiasNoMes(date: Date): number {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }

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
        this.initCharts();
        this.generalReport();
    }

    initCharts() {
        this.chartType = [
            {
                type: 'bar',
                title: 'MRC',
                data: this.chartService.graficoGeral(this.listPacients),
                options: this.chartService.getOptions()
            },
            {
                type: 'bar',
                title: 'Status Geral',
                data: this.chartService.AltasPorMes(this.listPacients),
                options: this.chartService.getOptions()
            },
            {
                type: 'pie',
                title: 'Gêneros',
                data: this.chartService.graficoPorGenero(this.listPacients),
                options: this.chartService.getOptions()
            },
            {
                type: 'polarArea',
                title: 'Especialidades',
                data: this.chartService.graficoPorEspecialidade(this.listPacients),
                options: this.chartService.getOptions()
            },
            {
                type: 'polarArea',
                title: 'Condutas',
                data: this.chartService.graficoPorCondutas(this.listPacients),
                options: this.chartService.getOptions()
            },
            {
                type: 'doughnut',
                title: 'Status',
                data: this.chartService.graficoPorStatus(this.listPacients),
                options: this.chartService.getOptions()
            },
            {
                type: 'polarArea',
                title: 'Faixa Etária',
                data: this.chartService.graficoPorMediaIdade(this.listPacients),
                options: this.chartService.getOptions()
            },
            {
                type: 'line',
                title: 'Admissões Diárias',
                data: this.chartService.graficoPorData(this.listPacients),
                options: this.chartService.getOptions()
            },
            {
                type: 'bar',
                title: 'Setores',
                data: this.chartService.graficoPorSetores(this.listPacients),
                options: this.chartService.getOptions()
            },
        ]
    }
}
