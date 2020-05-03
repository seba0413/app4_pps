import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

export class Usuario {
  id: string;
  saldo: number;
  perfil: string;
  cargo10: number;
  cargo100: number;
  cargo50: number;
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

  updateDatabase(id, saldoParam, cargaAdmin) {
    if ( cargaAdmin.isAdmin ) {
      switch ( cargaAdmin.tipo ) {
        case 'cargo10':
          return this.dbRef.doc(id).update({
            saldo: saldoParam,
            cargo10: cargaAdmin.numero
          });
          break;
        case 'cargo50':
          return this.dbRef.doc(id).update({
            saldo: saldoParam,
            cargo50: cargaAdmin.numero
          });
          break;
        case 'cargo100':
          return this.dbRef.doc(id).update({
            saldo: saldoParam,
            cargo100: cargaAdmin.numero
          });
          break;
      }
    } else {
      return this.dbRef.doc(id).update({
        saldo: saldoParam
      });
    }
  }

  anularCarga( id, isAdmin ) {
    if ( isAdmin ) {
      return this.dbRef.doc(id).update({
        saldo: 0,
        cargo10: 0,
        cargo50: 0,
        cargo100: 0
      });
    } else {
      return this.dbRef.doc(id).update({
        saldo: 0
      });
    }
  }
}
