import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  clave: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  splash = true;
  correo: string;
  clave: string;
  datosCorrectos = true;
  usuarios: Usuario[] = [
    { id: 0, nombre: 'admin', correo: 'admin@admin.com', clave: '111111' },
    { id: 1, nombre: 'invitado', correo: 'invitado@invitado.com', clave: '222222' },
    { id: 2, nombre: 'usuario', correo: 'usuario@usuario.com', clave: '333333' },
    { id: 3, nombre: 'anonimo', correo: 'anonimo@anonimo.com', clave: '444444' },
    { id: 4, nombre: 'tester', correo: 'tester@tester.com', clave: '555555' }
  ];

  constructor(private authService: AuthService,
              private router: Router ) {}

  onChange( id ) {
    this.correo = this.usuarios[id].correo;
    this.clave = this.usuarios[id].clave;
  }

  onSubmitLogin() {

    this.authService.login(this.correo, this.clave)
    .then( respuesta => {
      localStorage.setItem('chatUser', respuesta.user.email );
      this.correo = '';
      this.clave = '';
      this.datosCorrectos = true;
      this.router.navigate(['/home']);
    })
    .catch( error => {
      this.datosCorrectos = false;
    });
  }

  ngOnInit() {
      setTimeout(() => this.splash = false, 4000);
  }
}
