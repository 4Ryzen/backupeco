import { Button } from './ui/button';

export function HeroSection() {
  const handleSaibaMais = () => {
    const element = document.getElementById('solução');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="início" className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Monitoramento Inteligente
            <br />
            da Poluição Industrial
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Controle em tempo real das emissões de gases das indústrias
          </p>

          <div className="pt-4">
            <Button 
              size="lg"
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-base"
              onClick={handleSaibaMais}
            >
              Saiba mais
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}