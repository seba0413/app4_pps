import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

interface Usuario {
  id: string;
  saldo: number;
  perfil: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  dbRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.dbRef = this.db.collection('usuarios');
  }

  getUsuarios() {
    return this.dbRef.snapshotChanges().pipe(
      map(saldo => {
        return saldo.map(c => {
          const data = c.payload.doc.data() as Usuario;
          data.id = c.payload.doc.id;
          return data;
        });
      }));
  }

  getUsuarioByUid(uid: string) {
    return this.getUsuarios().pipe(
      map(user => {
        return user.filter(usuario => {
          return usuario.id === uid;
        });
      })
    );
  }

  updateDatabase(id, saldoParam) {
    console.log('update id: ', id, 'saldo: ', saldoParam);
    return this.dbRef.doc(id).update({
      saldo: saldoParam
    });
  }
}



