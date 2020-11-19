using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage="O Local deve ser preenchido.")]
        [StringLength(100, MinimumLength=3, ErrorMessage="Local é entre 3 e 100 caracteres.")]
        public string Local { get; set; }

        public string DataEvento { get; set; }

        [Required(ErrorMessage="O Tema deve ser preenchido.")]
        public string Tema { get; set; }

        [Range(2,1000, ErrorMessage="Quantidade de Pessoas é entre 2 e 1000.")]
        public int QtdPessoas { get; set; }

        public string Lote { get; set; }

        [Phone(ErrorMessage="Preencher o Numero do Telefone corretamente.")]
        [StringLength(9, MinimumLength=9, ErrorMessage="Numero do Telefone deve conter 9 caracteres.")]
        public string Telefone { get; set; }
        
        [EmailAddress(ErrorMessage="Preencher com Email valido.")]
        public string Email { get; set; }

        public string ImagemURL { get; set; }

        public List<LoteDto> Lotes { get; set; }

        public List<RedeSocialDto> RedeSociais { get; set; }

        public List<PalestranteDto> Palestrantes { get; set; }
    }
}