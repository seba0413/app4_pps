import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  splash = true;
  email: string;
  password: string;

  constructor(private authService: AuthService,
              private router: Router ) { }

  onSubmitLogin() {

    this.authService.login(this.email, this.password)
    .then( respuesta => {
      localStorage.setItem('chatUser', respuesta.user.email );
      this.router.navigate(['/home']);
    })
    .catch( error => {
      alert('Datos incorrectos');
    });
  }

  ngOnInit() {
      setTimeout(() => this.splash = false, 4000);
  }
}
