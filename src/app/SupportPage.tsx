import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from './components/ui/button';
import { ArrowLeft, MessageCircle, Phone, Mail, HelpCircle, ChevronDown, ChevronUp, X, Info } from 'lucide-react';

const faqs = [
  {
    question: 'O que é o EcoAir?',
    answer: 'O EcoAir é um sistema de monitoramento inteligente da poluição industrial que utiliza sensores avançados para detectar gases como CO₂ e partículas poluentes em tempo real.'
  },
  {
    question: 'Como funciona o sistema de alertas?',
    answer: 'O sistema monitora continuamente os níveis de poluentes e envia alertas automáticos quando os níveis atingem valores perigosos, permitindo ações rápidas para proteger a saúde e o meio ambiente.'
  },
  {
    question: 'Quais tipos de poluentes o EcoAir detecta?',
    answer: 'O EcoAir detecta uma variedade de poluentes, incluindo dióxido de carbono (CO₂), monóxido de carbono (CO), óxidos de nitrogênio (NOx), partículas em suspensão (PM2.5 e PM10), e outros gases industriais.'
  },
  {
    question: 'Como acessar os relatórios de monitoramento?',
    answer: 'Os relatórios podem ser acessados através do painel do usuário no site, onde você pode visualizar dados históricos, gráficos e análises detalhadas da qualidade do ar.'
  },
  {
    question: 'O sistema é compatível com regulamentações ambientais?',
    answer: 'Sim, o EcoAir foi desenvolvido para cumprir com as regulamentações ambientais vigentes, ajudando empresas a manterem a conformidade com leis como a CONAMA e normas internacionais.'
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full text-left py-4 px-6 flex justify-between items-center hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? <ChevronUp className="size-5 text-gray-500" /> : <ChevronDown className="size-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
}

function FAQSection() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border mb-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Perguntas Frequentes</h3>
      <div className="space-y-0">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border mb-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Sobre a EcoAir</h3>
      <div className="text-gray-600 space-y-4">
        <p>
          A EcoAir é uma empresa líder em soluções de monitoramento ambiental, dedicada a promover um futuro mais sustentável através da tecnologia inovadora.
        </p>
        <p>
          Fundada em 2024, nossa missão é ajudar indústrias e comunidades a monitorar e controlar a poluição do ar, garantindo conformidade com regulamentações ambientais e protegendo a saúde pública.
        </p>
        <p>
          Com uma equipe de especialistas em engenharia, ciência de dados e sustentabilidade, desenvolvemos sistemas avançados que combinam sensores IoT, inteligência artificial e análise em tempo real para fornecer insights acionáveis sobre a qualidade do ar.
        </p>
        <p>
          Nosso compromisso é com a transparência, inovação e responsabilidade ambiental, trabalhando lado a lado com nossos clientes para criar um impacto positivo no planeta.
        </p>
      </div>
    </div>
  );
}

function ContactFormModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setFormData({ name: '', email: '', message: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Entre em Contato</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="size-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <Button type="submit" className="w-full">Enviar Mensagem</Button>
        </form>
      </div>
    </div>
  );
}

function ChatModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { text: 'Olá! Como podemos ajudar você hoje?', sender: 'support' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Mock response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: 'Obrigado pela sua mensagem. Um de nossos agentes entrará em contato em breve.', sender: 'support' }]);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Chat Online</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-4 max-h-64 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-900'}`}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <Button onClick={sendMessage}>Enviar</Button>
        </div>
      </div>
    </div>
  );
}

export default function SupportPage() {
  const [showFAQ, setShowFAQ] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="size-5" />
              <div className="text-2xl font-bold">
                <span className="text-green-700">Eco</span>
                <span className="text-teal-600">Air</span>
              </div>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Central de Suporte</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como podemos ajudar?
            </h2>
            <p className="text-lg text-gray-600">
              Encontre respostas para suas dúvidas ou entre em contato com nossa equipe.
            </p>
          </div>

          {/* Support Options */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* FAQ */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <HelpCircle className="size-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Perguntas Frequentes
              </h3>
              <p className="text-gray-600 mb-4">
                Encontre respostas rápidas para as dúvidas mais comuns.
              </p>
              <Button onClick={() => setShowFAQ(!showFAQ)} className="w-full">
                {showFAQ ? 'Ocultar FAQ' : 'Ver FAQ'}
              </Button>
            </div>

            {/* Chat */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <MessageCircle className="size-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chat Online
              </h3>
              <p className="text-gray-600 mb-4">
                Converse com nossa equipe de suporte em tempo real.
              </p>
              <Button onClick={() => setShowChat(true)} variant="outline" className="w-full">
                Iniciar Chat
              </Button>
            </div>

            {/* Contact */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Mail className="size-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Contato
              </h3>
              <p className="text-gray-600 mb-4">
                Preencha o formulário para entrar em contato conosco.
              </p>
              <Button onClick={() => setShowContactForm(true)} variant="outline" className="w-full">
                Formulário de Contato
              </Button>
            </div>

            {/* About */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Info className="size-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sobre a EcoAir
              </h3>
              <p className="text-gray-600 mb-4">
                Saiba mais sobre nossa missão e valores.
              </p>
              <Button onClick={() => setShowAbout(!showAbout)} variant="outline" className="w-full">
                {showAbout ? 'Ocultar Sobre' : 'Ver Sobre'}
              </Button>
            </div>
          </div>

          {/* Sections */}
          {showFAQ && <FAQSection />}
          {showAbout && <AboutSection />}

          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Informações de Contato
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="size-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Telefone</p>
                    <p className="text-gray-600">(11) 9999-9999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">suporte@ecoair.com.br</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Horário de Atendimento</h4>
                <p className="text-gray-600">Segunda a Sexta: 8h às 18h</p>
                <p className="text-gray-600">Sábado: 8h às 12h</p>
                <p className="text-gray-600">Domingo: Fechado</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Links Úteis
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/" className="text-green-600 hover:text-green-700">
                Voltar ao Site Principal
              </Link>
              <a href="/#início" className="text-green-600 hover:text-green-700">
                Sobre a EcoAir
              </a>
              <a href="/#solução" className="text-green-600 hover:text-green-700">
                Nossa Solução
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      {showContactForm && <ContactFormModal onClose={() => setShowContactForm(false)} />}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 EcoAir. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}