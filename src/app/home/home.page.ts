import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { DataService } from '../servicios/data.service';
import { ScannerService } from '../servicios/scanner.service';
import { ToastService } from '../servicios/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  email: string;
  saldo: any;
  idUser: string;
  nombreUsuario: string;

  constructor(
    private scanner: ScannerService,
    private dataServ: DataService,
    private Afauth: AuthService,
    private toast: ToastService ) {
  }

  ngOnInit() {
    this.idUser = this.Afauth.getCurrentUserId();
    this.email = this.Afauth.getCurrentUserMail();
    this.dataServ.getUsuarioByUid(this.idUser).subscribe(res => {
      this.saldo = res[0].saldo;
    });
    this.nombreUsuario = this.email.split('@')[0];
  }

  logOut() {
    this.Afauth.logout();
  }

  scan() {
    this.scanner.scan()
      .then(barcodeData => {

        // 8c95def646b6127282ed50454b73240300dccabc = 10
        // ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 = 50
        // 2786f4877b9091dcad7f35751bfcf5d5ea712b2f = 100

        switch (barcodeData.text) {

          case '8c95def646b6127282ed50454b73240300dccabc':
            if ( (this.saldo === 0) || (this.saldo === 50) || (this.saldo === 100) || (this.saldo === 150 )) {
              this.acreditar(10);
            } else {
              this.toast.errorToast('No se puede repetir la carga');
            }
            break;

          case 'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ':
            if (this.saldo === 0 || this.saldo === 10 || this.saldo === 100 || this.saldo === 110) {
              this.acreditar(50);
            } else {
              this.toast.errorToast('No se puede repetir la carga');
            }
            break;

          case '2786f4877b9091dcad7f35751bfcf5d5ea712b2f':
            if (this.saldo === 0 || this.saldo === 10 || this.saldo === 50 || this.saldo === 60) {
              this.acreditar(100);
            } else {
              this.toast.errorToast('No se puede repetir la carga');
            }
            break;

          default:
            break;
        }
      }).catch(err => {
        console.log('Error', err);
      });
  }

  acreditar(monto: number) {
    console.log('monto', monto);
    const montoFinal = this.saldo + monto;
    this.dataServ.updateDatabase(this.idUser, montoFinal)
      .then(res => {
        this.toast.confirmationToast('La carga se acreditó correctamente');
      })
      .catch(err => {
        this.toast.errorToast('Ocurrió un error durante la carga');
      });
  }

  limpiar() {
    this.dataServ.updateDatabase(this.idUser, 0)
      .then(res => {
        this.toast.confirmationToast('Tu carga fue anulada');
      })
      .catch(err => {
        this.toast.errorToast('Ocurrió un error al anular tu carga');
      });
  }
}
