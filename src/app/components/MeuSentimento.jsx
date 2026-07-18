
import "./MeuSentimento.css";

const fotos = [
  {
    imagem: "public/artes.png",
    nome: "sua arte"
  },
  {
    imagem: "public/comoAgir.png",
    nome: "seu jeito de agir"
  },
  {
    imagem: "public/gosto.png",
    nome: "o seus gostos"
  },
  {
    imagem: "public/seuCabelo.png",
    nome: "seu cabelo"
  },
  {
    imagem: "public/seuEstilo.png",
    nome: "seu estilo"
  },
  {
    imagem: "public/seuJeito.png",
    nome: "e essa sua vibe"
  }
  
]

export default function MuralFotos() {
  return (
    <section className="mural">

      <div className="galeria">
        {fotos.map((foto, index) => (
          <div className="cardFoto" key={index}>
            <img src={foto.imagem} alt={foto.nome} />
            <p>{foto.nome}</p>
          </div>
        ))}
      </div>
    </section>
  );
}