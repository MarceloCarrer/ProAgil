import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { BsLocaleService} from 'ngx-bootstrap/datepicker';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  titulo = 'Eventos';
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  modoSalvar = 'post';
  bodyDeletarEvento = '';
  file: File;

  private listaFiltro: string;
  fileNametoUpdate: string;
  dataAtual: string;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
    ) {
      this.localeService.use('pt-br');
    }

  public get filtroLista(): string {
    return this.listaFiltro;
  }
  public set filtroLista(value: string) {
    this.listaFiltro = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  editarEvento(evento: Evento, template: any): void{
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNametoUpdate = evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);
  }

  novoEvento(template: any): void{
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  excluirEvento(evento: Evento, template: any): void{
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.tema}`;
  }

  confirmeDelete(template: any): void{
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com Sucesso!');
        }, error => {
          this.toastr.error(`Erro ao tentar Deletar: ${error}`);
        }
    );
  }

  openModal(template: any): void{
    this.registerForm.reset();
    template.show();
  }

  ngOnInit(): void {
    this.validation();
    this.getEventos();
    this.eventosFiltrados = this.eventos;
  }

  filtrarEventos(filtraPor: string): Evento[]{
    filtraPor = filtraPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtraPor) !== -1
    );
  }

  alternarImagem(): void{
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation(): void{
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(1000)]],
      imagemURL: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onFileChange(event): void{
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
      console.log(this.file);
    }
  }

  uploadImagem(): void{
    if (this.modoSalvar === 'post') {
      const nomeArquivo = this.evento.imagemURL.split('\\', 3);
      this.evento.imagemURL = nomeArquivo[2];

      this.eventoService.postUpload(this.file, nomeArquivo[2])
      .subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    }
    else{
      this.evento.imagemURL = this.fileNametoUpdate;
      this.eventoService.postUpload(this.file, this.fileNametoUpdate)
      .subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    }
  }

  salvarAlteracao(template: any): void{
    if (this.registerForm.valid){
      if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
        (novoEvento: Evento) => {
          template.hide();
          this.getEventos();
          this.toastr.success('Inserido com Sucesso!');
        }, error => {
          this.toastr.error(`Erro ao tentar Inserir: ${error}`);
        }
      );
      }
      else{
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.putEvento(this.evento).subscribe(
        () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Editado com Sucesso!');
        }, error => {
          this.toastr.error(`Erro ao tentar Editar: ${error}`);
        }
      );
      }
    }
  }

  getEventos(): void{
    this.eventoService.getAllEvento().subscribe(
      (eventoss: Evento[]) => {
        this.eventos = eventoss;
        this.eventosFiltrados = this.eventos;
      },
      error => {
        this.toastr.error(`Erro ao tentar Listar: ${error}`);
      }
    );
  }
}
