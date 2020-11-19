using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class RedeSocialDto
    {
        [Required(ErrorMessage="O Nome deve ser preenchido.")]
        public string Nome { get; set; }

        [Url(ErrorMessage="Preencher com URL valida.")]
        public string URL { get; set; }
    }
}