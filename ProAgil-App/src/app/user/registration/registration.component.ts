import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;

  constructor(public fb: FormBuilder,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.validation();
  }

  validation(): void {
    this.registerForm = this.fb.group({
        fullName: ['', Validators.required],
        email: ['', Validators.required, Validators.email],
        userName: ['', Validators.required],
        passwords : this.fb.group({
          password: ['', Validators.required, Validators.minLength(4)],
          confirmPassword: ['', Validators.required],
        })
    });
  }

  compararSenhas(fb: FormGroup): void {
    const confirmaSenhaCtrl = fb.get('confirmPassword');
    if (confirmaSenhaCtrl.errors == null || 'mismatch' in confirmaSenhaCtrl.errors) {
      if (fb.get('password').value != confirmaSenhaCtrl.value) {
        fb.get('password').setErrors({mismatch: true});
      }else{
        confirmaSenhaCtrl.setErrors(null);
      }
    }
  }

  cadastrarUsuario(): void {
    console.log('Cadastrar Usuário.');
  }

}
