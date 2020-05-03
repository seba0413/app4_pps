import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { DataService } from '../servicios/data.service';
import { ScannerService } from '../servicios/scanner.service';
import { ToastService } from '../servicios/toast.service';
import { Usuario } from '../servicios/data.service';

export class CargaAdmin {
    isAdmin: boolean;
    tipo: string;
    numero: number;
}

const CARGO10 = 'cargo10';
const CARGO50 = 'cargo50';
const CARGO100 = 'cargo100';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  usuario: Usuario = new Usuario();
  cargaAdmin: CargaAdmin = new CargaAdmin();

  constructor(
    private scanner: ScannerService,
    private dataServ: DataService,
    private Afauth: AuthService,
    private toast: ToastService ) {
  }

  ngOnInit() {
    this.usuario.id = this.Afauth.getCurrentUserId();
    this.dataServ.getUsuarioByUid( this.usuario.id ).subscribe(res => {
      if ( res[0].perfil === 'admin' ) {
        this.usuario.cargo10 = res[0].cargo10;
        this.usuario.cargo50 = res[0].cargo50;
        this.usuario.cargo100 = res[0].cargo100;
      }
      this.usuario.saldo = res[0].saldo;
      this.usuario.perfil = res[0].perfil;
    });
  }

  logOut() {
    this.Afauth.logout();
  }

  scan() {
    this.scanner.scan()
      .then(barcodeData => {

        switch (barcodeData.text) {

          case '8c95def646b6127282ed50454b73240300dccabc':
            if ( this.usuario.perfil === 'admin' ) {
              if ( this.usuario.cargo10 < 2 ) {
                this.cargaAdmin.isAdmin = true;
                this.cargaAdmin.tipo = CARGO10;
                this.cargaAdmin.numero = this.usuario.cargo10 + 1;
                this.acreditar( 10, this.cargaAdmin );
              } else {
                this.toast.errorToast( 'Un usuario administrador puede repetir la carga solo una vez' );
              }
            } else {
              if ( this.usuario.saldo === 0 || this.usuario.saldo === 50 || this.usuario.saldo === 100 || this.usuario.saldo === 150 ) {
                this.cargaAdmin.isAdmin = false;
                this.acreditar( 10, this.cargaAdmin );
              } else {
                this.toast.errorToast('No se puede repetir la carga');
              }
            }
            break;

          case 'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ':
            if ( this.usuario.perfil === 'admin' ) {
              if ( this.usuario.cargo50 < 2) {
                this.cargaAdmin.isAdmin = true;
                this.cargaAdmin.tipo = CARGO50;
                this.cargaAdmin.numero = this.usuario.cargo50 + 1;
                this.acreditar( 50, this.cargaAdmin );
              } else {
                this.toast.errorToast( 'Un usuario administrador puede repetir la carga solo una vez' );
              }
            } else {
              if (this.usuario.saldo === 0 || this.usuario.saldo === 10 || this.usuario.saldo === 100 || this.usuario.saldo === 110) {
                this.cargaAdmin.isAdmin = false;
                this.acreditar( 50, this.cargaAdmin );
              } else {
                this.toast.errorToast('No se puede repetir la carga');
              }
            }
            break;

          case '2786f4877b9091dcad7f35751bfcf5d5ea712b2f':
            if ( this.usuario.perfil === 'admin') {
              if ( this.usuario.cargo100 < 2 ) {
                this.cargaAdmin.isAdmin = true;
                this.cargaAdmin.tipo = CARGO100;
                this.cargaAdmin.numero = this.usuario.cargo100 + 1;
                this.acreditar( 100, this.cargaAdmin );
              } else {
                this.toast.errorToast( 'Un usuario administrador puede repetir la carga solo una vez' );
              }
            } else {
              if (this.usuario.saldo === 0 || this.usuario.saldo === 10 || this.usuario.saldo === 50 || this.usuario.saldo === 60) {
                this.cargaAdmin.isAdmin = false;
                this.acreditar(100, this.cargaAdmin );
              } else {
                this.toast.errorToast('No se puede repetir la carga');
              }
            }
            break;

          default:
            break;
        }
      }).catch(err => {
        console.log('Error', err);
      });
  }

  acreditar(monto: number, cargaAdmin: CargaAdmin) {
    console.log('monto', monto);
    const montoFinal = this.usuario.saldo + monto;
    this.dataServ.updateDatabase(this.usuario.id, montoFinal, cargaAdmin)
      .then(res => {
        this.toast.confirmationToast('La carga se acreditó correctamente');
      })
      .catch(err => {
        this.toast.errorToast('Ocurrió un error durante la carga');
      });
  }

  limpiar() {
    this.dataServ.anularCarga(this.usuario.id, this.usuario.perfil === 'admin' )
      .then(res => {
        this.toast.confirmationToast('Tu carga fue anulada');
      })
      .catch(err => {
        this.toast.errorToast('Ocurrió un error al anular tu carga');
      });
  }
}
