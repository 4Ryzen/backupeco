import { Link } from 'react-router-dom';

export function EcoFooter() {
  return (
    <footer id="contato" className="bg-green-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Description */}
          <div className="flex items-start gap-4">
            <div className="text-2xl font-bold">
              <span className="text-white">Eco</span>
              <span className="text-teal-300">Air</span>
            </div>
            <div>
              <p className="text-sm text-green-100 max-w-xs">
                Monitoramento inteligente
                <br />
                de emissões industriais.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <p className="text-sm text-green-100 mb-2">Entre em Contato</p>
            <a 
              href="mailto:ecoair.com.br@gmail.com" 
              className="text-white hover:text-teal-300 transition-colors block"
            >
              ecoair.com.br@gmail.com
            </a>
            <Link 
              to="/suporte"
              className="text-white hover:text-teal-300 transition-colors block mt-2"
            >
              Central de Suporte
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-green-700 text-center">
          <p className="text-sm text-green-100">
            © 2026 EcoAir. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}