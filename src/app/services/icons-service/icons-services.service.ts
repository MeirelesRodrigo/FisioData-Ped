import { Injectable } from '@angular/core';
import { faCirclePlus,
         faList,
         faBars,
         faHospital,
         faHouseChimneyCrack,
         faReceipt,
         faChartPie,
         faBookMedical } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IconsServicesService {
  faCirclePlus = faCirclePlus;
  faList = faList;
  faBars = faBars
  faHospital = faHospital
  faHouseChimneyCrack = faHouseChimneyCrack
  faReceipt = faReceipt
  faChartPie = faChartPie
  faBookMedial = faBookMedical

  constructor() { }
}
