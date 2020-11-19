using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class LoteDto
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage="O Nome deve ser preenchido.")]
        public string Nome { get; set; }

        [Required(ErrorMessage="O Preço deve ser preenchido.")]
        public decimal Preco { get; set; }

        public string DataInicio { get; set; }

        public string DataFim { get; set; }

        [Range(2, 1000, ErrorMessage="Quantidade é entre 2 e 1000.")]
        public int Quantidade { get; set; }
    }
}
