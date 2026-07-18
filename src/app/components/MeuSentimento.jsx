
import "./MeuSentimento.css";

const fotos = [
  {
    imagem: "/artes.png",
    nome: "sua arte"
  },
  {
    imagem: "/comoAgir.png",
    nome: "seu jeito de agir"
  },
  {
    imagem: "/gosto.png",
    nome: "os seus gostos"
  },
  {
    imagem: "/seuCabelo.png",
    nome: "seu cabelo"
  },
  {
    imagem: "/seuEstilo.png",
    nome: "seu estilo"
  },
  {
    imagem: "/seuJeito.png",
    nome: "e essa sua vibe"
  }
];

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