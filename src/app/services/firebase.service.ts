import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, updateDoc, doc, getDoc, where, query, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pacients } from '../pacients';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  pacientsCollection: any;
  private lastDoc: any = null;

  constructor(private firestore: Firestore) {
    this.pacientsCollection = collection(this.firestore, 'pacients');
  }

  listarPacientes(): Observable<Pacients[]>{
    return collectionData(this.pacientsCollection, {
      idField: 'id'
    }) as Observable<Pacients[]>;
  }

  listarPacientesInternados(): Observable<Pacients[]> {
    const q = query(this.pacientsCollection, where('dischargeStatus', '==', 'Internado'));
    return collectionData(q, { idField: 'id' } as any) as Observable<Pacients[]>;
  }

  // async listarPacientes(): Promise<Pacients[]> {
  //   const snapshot = await getDocs(this.pacientsCollection);
  //   return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) } as Pacients));
  // }

  // listarPacientes(): Observable<Pacients[]>{
  //   return collectionData(this.pacientsCollection, {
  //     idField: 'id'
  //   }) as Observable<Pacients[]>;
  // }

  // async listarPacientes(): Promise<Pacients[]> {
  //   const snapshot = await getDocs(this.pacientsCollection);
  //   return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) } as Pacients));
  // }


  // listarPacientes(): Observable<Pacients[]>{
  //   return collectionData(this.pacientsCollection, {
  //     idField: 'id'
  //   }) as Observable<Pacients[]>;
  // }

  async criarRegistro(data: Pacients): Promise<void>{
    await addDoc(this.pacientsCollection, data)
  }

  async atualizarPaciente(data: Pacients): Promise<void>{
    const docRef = doc(this.pacientsCollection, data.id);
    await updateDoc(docRef, { ...data });
  }

  async atualizarPacienteInternado(id: string): Promise<void>{
    try {
      const docRef = doc(this.pacientsCollection, id);
      await updateDoc(docRef, {
        mrcDischarge: null,
        dischargeDate: null
      });
      console.log(`Paciente ${id} atualizado com sucesso.`);
    } catch (error) {
      console.error(`Erro ao atualizar paciente ${id}:`, error);
    }
  }

  async listarPacientePorId(id: string): Promise<Pacients>{
    const docRef = doc(this.pacientsCollection, id);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      return docSnap.data() as Pacients;
    }
    return {} as Pacients;
  }
}
