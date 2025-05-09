import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Pacients } from '../../pacients';

@Injectable({
  providedIn: 'root'
})
export class ChartServiceService {

  platformId = inject(PLATFORM_ID);

  constructor() { }

  generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    return {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
          },
          grid: {
            color: textColor,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColor,
          },
          grid: {
            color: textColor,
          },
        },
      },
    };
  }

  graficoPorGenero(listPacient: Pacients[]) {
    const genderMap = new Map<string, number>();

    listPacient.forEach(p => {
      genderMap.set(p.gender, (genderMap.get(p.gender) || 0) + 1)
    })
    const labels = Array.from(genderMap.keys());

    const backgroundColors = labels.map(() => this.generateRandomColor())
    const hoverbackgroundColors = backgroundColors.map(color => `${color}80`)

    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      return {
        labels: [...genderMap.keys()],
        datasets: [
          {
            data: [...genderMap.values()],
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverbackgroundColors
          }]
      };
    }
    return {
      labels: [],
      datasets: []
    };
  }

  graficoPorEspecialidade(listPacient: Pacients[]) {
    const specialistMap = new Map<string, number>();

    listPacient.forEach(p => {
      specialistMap.set(p.specialist, (specialistMap.get(p.specialist) || 0) + 1)
    })

    const labels = Array.from(specialistMap.keys());
    const backgroundColors = labels.map(() => this.generateRandomColor())
    const hoverbackgroundColors = backgroundColors.map(color => `${color}80`)

    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      return {
        labels: [...specialistMap.keys()],
        datasets: [
          {
            data: [...specialistMap.values()],
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverbackgroundColors
          }
        ]
      };
    }
    return {
      labels: [],
      datasets: []
    };
  }

  graficoPorData(listPacient: Pacients[]) {
    const dadosAdm = new Map<string, number>();

    listPacient.forEach(p => {
      const dataAdm = new Date(p.admissionDate).toISOString().split('T')[0];
      const [year, month, day] = dataAdm.split('-');
      const dataFormatada = `${day}/${month}/${year}`;;
      dadosAdm.set(dataFormatada, (dadosAdm.get(dataFormatada) || 0) + 1)
    })
    const labels = Array.from(dadosAdm.keys()).map(date => {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    });

    const backgroundColors = labels.map(() => this.generateRandomColor())
    const hoverbackgroundColors = backgroundColors.map(color => `${color}80`)

    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      return {
        labels: [...dadosAdm.keys()],
        datasets: [
          {
            label: 'Número de pacientes',
            data: [...dadosAdm.values()],
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverbackgroundColors
          },
        ]
      };
    }
    return {
      labels: [],
      datasets: []
    };
  }

  graficoPorSetores(listPacient: Pacients[]) {
    const departmentMap = new Map<string, number>();

    listPacient.forEach(p => {
      departmentMap.set(p.department, (departmentMap.get(p.department) || 0) + 1)
    })

    const labels = Array.from(departmentMap.keys());
    const backgroundColors = labels.map(() => this.generateRandomColor())
    const hoverbackgroundColors = backgroundColors.map(color => `${color}80`)

    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      return {
        labels: [...departmentMap.keys()],
        datasets: [
          {
            label: 'Número de Pacientes',
            data: [...departmentMap.values()],
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverbackgroundColors
          }
        ]
      };
    }
    return {
      labels: [],
      datasets: []
    };
  }

  graficoPorCondutas(listPacient: Pacients[]) {
    const fisioMotoraMap = new Map<string, number>();
    const fisioRespiratoriaMap = new Map<string, number>();
    const oxigenoMap = new Map<string, number>();
    const vniMap = new Map<string, number>();
    const venturiMap = new Map<string, number>();
    const naoReinalanteMap = new Map<string, number>();
    fisioMotoraMap.set('Fisioterapia Motora', 0);
    fisioRespiratoriaMap.set('Fisioterapia Respiratória', 0);

    listPacient.forEach(p => {
      if (p.motorPhysiotherapy) {
        fisioMotoraMap.set('Fisioterapia Motora', (fisioMotoraMap.get('Fisioterapia Motora') || 0) + 1);
      }

      if (p.respiratoryPhysiotherapy) {
        fisioRespiratoriaMap.set('Fisioterapia Respiratória', (fisioRespiratoriaMap.get('Fisioterapia Respiratória') || 0) + 1);
      }

      if (p.oxygenTherapy) {
        oxigenoMap.set('Uso de O2', (oxigenoMap.get('Uso de O2') || 0) + 1);
      }

      if (p.nonInvasiveVentilation) {
        vniMap.set('Uso de VNI', (vniMap.get('Uso de VNI') || 0) + 1);
      }

      if (p.venturi) {
        venturiMap.set('venturi', (venturiMap.get('venturi') || 0) + 1);
      }

      if (p.nreinalante) {
        naoReinalanteMap.set('naoReinalante', (naoReinalanteMap.get('naoReinalante') || 0) + 1);
      }
    });

    const labels = ['Fisioterapia Motora', 'Fisioterapia Respiratória', 'Uso de O2', 'Uso de VNI', 'Uso Venturi', 'Uso Máscara Não Reinalante'];
    const values = [
      fisioMotoraMap.get('Fisioterapia Motora'),
      fisioRespiratoriaMap.get('Fisioterapia Respiratória'),
      oxigenoMap.get('Uso de O2'),
      vniMap.get('Uso de VNI'),
      venturiMap.get('venturi'),
      naoReinalanteMap.get('naoReinalante'),
    ];

    const backgroundColors = labels.map(() => this.generateRandomColor());
    const hoverBackgroundColors = backgroundColors.map(color => `${color}80`);

    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      return {
        labels: labels,
        datasets: [
          {
            label: 'Número de Pacientes',
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverBackgroundColors,
            data: values,
            borderColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth: 2
          },

        ]
      };
    }
    return {
      labels: [],
      datasets: []
    };
  }

  graficoPorStatus(listPacient: Pacients[]) {
    const dischargeStatustMap = new Map<string, number>();

    listPacient.forEach(p => {
      dischargeStatustMap.set(p.dischargeStatus, (dischargeStatustMap.get(p.dischargeStatus) || 0) + 1)
    })
    const labels = Array.from(dischargeStatustMap.keys());
    const backgroundColors = labels.map(() => this.generateRandomColor())
    const hoverbackgroundColors = backgroundColors.map(color => `${color}80`)

    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      return {
        labels: [...dischargeStatustMap.keys()],
        datasets: [
          {
            label: 'Número de Pacientes',
            data: [...dischargeStatustMap.values()],
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverbackgroundColors
          }
        ]
      };
    }
    return {
      labels: [],
      datasets: []
    };
  }

  graficoPorMediaIdade(listPacient: Pacients[]) {
    const agetMap = new Map<number, number>();
    let age0_1 = 0;
    let age2_5 = 0;
    let age6_9 = 0;
    let age10_14 = 0;



    listPacient.forEach(p => {
      if (p.age >= 0 && p.age <= 1) {
        age0_1++;
      } else if (p.age >= 2 && p.age <= 5) {
        age2_5++;
      } else if (p.age >= 6 && p.age <= 9) {
        age6_9++;
      } else if (p.age >= 10 && p.age <= 15) {
        age10_14++;
      }
      agetMap.set(p.age, (agetMap.get(p.age) || 0) + 1);
    });

    const labels = Array.from(agetMap.keys());
    const backgroundColors = labels.map(() => this.generateRandomColor());
    const hoverbackgroundColors = backgroundColors.map(color => `${color}80`);

    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      return {
        labels: [
          "0 a 1 ano",
          "2 a 5 anos",
          "6 a 9 anos",
          "10 a 15 anos",
        ],
        datasets: [
          {
            label: 'Número de Pacientes',
            data: [
              age0_1,
              age2_5,
              age6_9,
              age10_14,
            ],
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverbackgroundColors
          }
        ]
      };
    }

    return {
      labels: [],
      datasets: []
    };
  }

  graficoGeral(listPacient: Pacients[]) {
    const atendidosPorMes = new Map<string, number>();
    const internados = new Map<string, number>();
    const mrcAdmissaoValoresMes: Map<string, number[]> = new Map();
    const mrcAltaValoresMes: Map<string, number[]> = new Map();

    listPacient.forEach(p => {
      const dataISO = new Date(p.admissionDate).toISOString().split('T')[0]; // YYYY-MM-DD
      const [year, month] = dataISO.split('-'); // Extraindo apenas MM/YYYY
      const mesAno = `${month}/${year}`; // Exemplo: "01/2025"

      // Contagem total de pacientes atendidos no mês
      atendidosPorMes.set(mesAno, (atendidosPorMes.get(mesAno) || 0) + 1);

      // Contagem de pacientes que tiveram alta
      if (p.dischargeStatus === "Internado") {
        internados.set(mesAno, (internados.get(mesAno) || 0) + 1);
      }

      const mrcAdmissao = parseFloat(p.mrc);
        if (!isNaN(mrcAdmissao)) {
          if (!mrcAdmissaoValoresMes.has(mesAno)) {
            mrcAdmissaoValoresMes.set(mesAno, []);
          }
          mrcAdmissaoValoresMes.get(mesAno)!.push(mrcAdmissao); // Adiciona o valor de MRC ao mês correto
        }

        //MRC ALTA
        const mrcAlta = parseFloat(p.mrcDischarge);
        if (!isNaN(mrcAlta)) {
          if (!mrcAltaValoresMes.has(mesAno)) {
            mrcAltaValoresMes.set(mesAno, []);
          }
          mrcAltaValoresMes.get(mesAno)!.push(mrcAlta); // Adiciona o valor de MRC ao mês correto
        }
    });

    const allMonths = Array.from(new Set([...atendidosPorMes.keys(), ...mrcAdmissaoValoresMes.keys()]));

    //media MRC ADM
    const mediaMrcAdmissao: Map<string, number> = new Map();

    allMonths.forEach(mesAno => {
      if (mrcAdmissaoValoresMes.has(mesAno)) {
        const values = mrcAdmissaoValoresMes.get(mesAno)!;
        const mediaAdm = values.reduce((sum, value) => sum + value, 0) / values.length;
        mediaMrcAdmissao.set(mesAno, mediaAdm);
      } else {
        mediaMrcAdmissao.set(mesAno,0); // Para meses sem MRC, definir como 0
      }
    });

    //media MRC ADM
    const mediaMrcAlta: Map<string, number> = new Map();

    allMonths.forEach(mesAno => {
      if (mrcAltaValoresMes.has(mesAno)) {
        const values = mrcAltaValoresMes.get(mesAno)!;
        const mediaAlta = values.reduce((sum, value) => sum + value, 0) / values.length;
        mediaMrcAlta.set(mesAno, mediaAlta);
      } else {
        mediaMrcAlta.set(mesAno,0); // Para meses sem MRC, definir como 0
      }
    });

    // Criar rótulos ordenados por mês/ano
    const labels = Array.from(atendidosPorMes.keys()).sort();

    // 🔹 Definição de cores fixas para cada categoria
    const colorAtendidos = this.generateRandomColor(); // Ex: Azul
    const colorInternados = this.generateRandomColor(); // Ex: Vermelho
    const mrcAdm = this.generateRandomColor(); // Ex: Vermelho
    const mrcAlta = this.generateRandomColor(); // Ex: Vermelho

    // Criando arrays de cores consistentes
    const backgroundColorsAtendidos = labels.map(() => colorAtendidos);
    const hoverBackgroundColorsAtendidos = backgroundColorsAtendidos.map(color => `${color}80`);

    const backgroundColorsInternados = labels.map(() => colorInternados);
    const hoverBackgroundColorsInternados = backgroundColorsInternados.map(color => `${color}80`);

    const backgroundColorsMrcAdm = labels.map(() => mrcAdm);
    const hoverBackgroundColorsMrcAdm = backgroundColorsMrcAdm.map(color => `${color}80`);

    const backgroundColorsMrcAlta = labels.map(() => mrcAlta);
    const hoverBackgroundColorsMrcAlta = backgroundColorsMrcAlta.map(color => `${color}80`);

    if (isPlatformBrowser(this.platformId)) {
      return {
        labels,
        datasets: [
          {
            label: 'Total Atendimentos',
            hidden: true,
            data: labels.map(m => atendidosPorMes.get(m) || 0),
            backgroundColor: backgroundColorsAtendidos,
            hoverBackgroundColor: hoverBackgroundColorsAtendidos
          },
          {
            label: 'Internados',
            hidden: true,
            data: labels.map(m => internados.get(m) || 0),
            backgroundColor: backgroundColorsInternados,
            hoverBackgroundColor: hoverBackgroundColorsInternados
          },
          {
            label: 'MRC - Admissão',
            data: labels.map(m => mediaMrcAdmissao.get(m) || 0),
            backgroundColor: backgroundColorsMrcAdm,
            hoverBackgroundColor: hoverBackgroundColorsMrcAdm
          },
          {
            label: 'MRC - Alta',
            data: labels.map(m => mediaMrcAlta.get(m) || 0),
            backgroundColor: backgroundColorsMrcAlta,
            hoverBackgroundColor: hoverBackgroundColorsMrcAlta
          },
        ]
      };
    }

    return {
      labels: [],
      datasets: []
    };
  }

  AltasPorMes(listPacient: Pacients[]) {
    const atendidosPorMes = new Map<string, number>();
    const altasPorMes = new Map<string, number>();
    const contraIndicadosPorMes = new Map<string, number>();
    const transfBoulevard = new Map<string, number>();
    const transfUti = new Map<string, number>();
    const transfCc = new Map<string, number>();
    const transfsalaVermelha = new Map<string, number>();
    const transfUtiNeo = new Map<string, number>();
    const obito = new Map<string, number>();
    const evasao = new Map<string, number>();

    listPacient.forEach(p => {
      const dataISO = new Date(p.admissionDate).toISOString().split('T')[0]; // YYYY-MM-DD
      const [year, month] = dataISO.split('-'); // Extraindo apenas MM/YYYY
      const mesAno = `${month}/${year}`; // Exemplo: "01/2025"

      // Contagem total de pacientes atendidos no mês
      atendidosPorMes.set(mesAno, (atendidosPorMes.get(mesAno) || 0) + 1);

      // Contagem de pacientes que tiveram alta
      if (p.dischargeStatus === "Alta-Melhorada") {
        altasPorMes.set(mesAno, (altasPorMes.get(mesAno) || 0) + 1);
      }
      if(p.dischargeStatus === "Contra-Indicado"){
        contraIndicadosPorMes.set(mesAno, (contraIndicadosPorMes.get(mesAno) || 0) + 1)
      }
      if (p.dischargeStatus == "Transf-Boulevard"){
        transfBoulevard.set(mesAno, (transfBoulevard.get(mesAno) || 0) + 1)
      }
      if(p.dischargeStatus == "Transf-UTI"){
        transfUti.set(mesAno, (transfUti.get(mesAno) || 0) + 1)
      }
      if(p.dischargeStatus === "Transf-CC") {
        transfCc.set(mesAno, (transfCc.get(mesAno) || 0) + 1)
      }
      if(p.dischargeStatus == 'Óbito'){
        obito.set(mesAno, (obito.get(mesAno) || 0) + 1)
      }
      if(p.dischargeStatus == 'Evasão'){
        evasao.set(mesAno, (evasao.get(mesAno) || 0) + 1)
      }
      if(p.dischargeStatus == 'Transf-Sala-Vermelha'){
        transfsalaVermelha.set(mesAno, (transfsalaVermelha.get(mesAno) || 0) + 1)
      }
      if(p.dischargeStatus == 'Transf-UTI-NEO'){
        transfUtiNeo.set(mesAno, (transfUtiNeo.get(mesAno) || 0) + 1)
      }


      });

    // Criar rótulos ordenados por mês/ano
    const labels = Array.from(atendidosPorMes.keys()).sort();

    // 🔹 Definição de cores fixas para cada categoria
    const colorAtendidos = this.generateRandomColor();
    const colorAltas = this.generateRandomColor();
    const colorcontraIndicadosPorMes = this.generateRandomColor();
    const colorTransfBoulevard = this.generateRandomColor();
    const colorTransfUti = this.generateRandomColor();
    const colorTransfCc = this.generateRandomColor();
    const colorObito = this.generateRandomColor();
    const colorEvasao = this.generateRandomColor();
    const colorsalaVermelha = this.generateRandomColor();
    const colorsUtiNeo = this.generateRandomColor();

    // Criando arrays de cores consistentes
    const backgroundColorsAtendidos = labels.map(() => colorAtendidos);
    const hoverBackgroundColorsAtendidos = backgroundColorsAtendidos.map(color => `${color}80`);

    const backgroundColorsAltas = labels.map(() => colorAltas);
    const hoverBackgroundColorsAltas = backgroundColorsAltas.map(color => `${color}80`);

    const backgroundColorsContraIndicados = labels.map(() => colorcontraIndicadosPorMes);
    const hoverBackgroundColorsContraIndicados = backgroundColorsAltas.map(color => `${color}80`);

    const backgroundColorsTransfBoulevard = labels.map(() => colorTransfBoulevard);
    const hoverBackgroundColorsTransfBoulevard = backgroundColorsAltas.map(color => `${color}80`);

    const backgroundColorsTransfUti = labels.map(() => colorTransfUti);
    const hoverBackgroundColorsTransfUti = backgroundColorsAltas.map(color => `${color}80`);

    const backgroundColorsTransfCc = labels.map(() => colorTransfCc);
    const hoverBackgroundColorsTransfCc = backgroundColorsAltas.map(color => `${color}80`);

    const backgroundColorsObito = labels.map(() => colorObito);
    const hoverBackgroundColorsObito = backgroundColorsAltas.map(color => `${color}80`);

    const backgroundColorsEvasao = labels.map(() => colorEvasao);
    const hoverBackgroundColorsEvasao = backgroundColorsAltas.map(color => `${color}80`);

    const backgroundColorsSalaVemelha = labels.map(() => colorsalaVermelha);
    const hoverBackgroundSalaVemelha = backgroundColorsAltas.map(color => `${color}80`);

    const backgroundColorsUtiNeo = labels.map(() => colorsUtiNeo);
    const hoverBackgroundcolorsUtiNeo = backgroundColorsAltas.map(color => `${color}80`);

    if (isPlatformBrowser(this.platformId)) {
      return {
        labels,
        datasets: [
          {
            label: 'Total Atendimentos',
            hidden: true,
            data: labels.map(m => atendidosPorMes.get(m) || 0),
            backgroundColor: backgroundColorsAtendidos,
            hoverBackgroundColor: hoverBackgroundColorsAtendidos
          },
          {
            label: 'Alta Melhorada',
            hidden: true,
            data: labels.map(m => altasPorMes.get(m) || 0),
            backgroundColor: backgroundColorsAltas,
            hoverBackgroundColor: hoverBackgroundColorsAltas
          },
          {
            label: 'Contra Indicados',
            data: labels.map(m => contraIndicadosPorMes.get(m) || 0),
            backgroundColor: backgroundColorsContraIndicados,
            hoverBackgroundColor: hoverBackgroundColorsContraIndicados
          },
          {
            label: 'Transf/ Boulevard',
            data: labels.map(m => transfBoulevard.get(m) || 0),
            backgroundColor: backgroundColorsTransfBoulevard,
            hoverBackgroundColor: hoverBackgroundColorsTransfBoulevard
          },
          {
            label: 'Transf/ UTI',
            data: labels.map(m => transfUti.get(m) || 0),
            backgroundColor: backgroundColorsTransfUti,
            hoverBackgroundColor: hoverBackgroundColorsTransfUti
          },
          {
            label: 'Transf/ CC',
            data: labels.map(m => transfCc.get(m) || 0),
            backgroundColor: backgroundColorsTransfCc,
            hoverBackgroundColor: hoverBackgroundColorsTransfCc
          },
          {
            label: 'Transf/ Sala Vermelha',
            data: labels.map(m => transfsalaVermelha.get(m) || 0),
            backgroundColor: backgroundColorsSalaVemelha,
            hoverBackgroundColor: hoverBackgroundSalaVemelha
          },
          {
            label: 'Transf/ UTI NEO',
            data: labels.map(m => transfUtiNeo.get(m) || 0),
            backgroundColor: backgroundColorsUtiNeo,
            hoverBackgroundColor: hoverBackgroundcolorsUtiNeo
          },
          {
            label: 'Óbito',
            data: labels.map(m => obito.get(m) || 0),
            backgroundColor: backgroundColorsObito,
            hoverBackgroundColor: hoverBackgroundColorsObito
          },
          {
            label: 'Evasão',
            data: labels.map(m => evasao.get(m) || 0),
            backgroundColor: backgroundColorsEvasao,
            hoverBackgroundColor: hoverBackgroundColorsEvasao
          },
        ]
      };
    }

    return {
      labels: [],
      datasets: []
    };
  }
}
