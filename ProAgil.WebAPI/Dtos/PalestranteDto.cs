using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class PalestranteDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage="O Nome deve ser preenchido.")]
        public string Nome { get; set; }

        public string MiniCurriculo { get; set; }

        public string ImagemURL { get; set; }

        [Phone(ErrorMessage="Preencher o Numero do Telefone corretamente.")]
        [StringLength(9, MinimumLength=9, ErrorMessage="Numero do Telefone deve conter 9 caracteres.")]
        public string Telefone { get; set; }

        [EmailAddress(ErrorMessage="Preencher com Email valido.")]
        public string Email { get; set; }   

        public List<RedeSocialDto> RedeSociais { get; set; }

        public List<EventoDto> Eventos { get; set; }
    }
}