const steps = [
  {
    number: '1',
    title: 'Sensor instalado na indústria',
    color: 'bg-green-700',
  },
  {
    number: '2',
    title: 'Coleta de dados do ar',
    color: 'bg-green-700',
  },
  {
    number: '3',
    title: 'Envio para sistema online',
    color: 'bg-green-700',
  },
  {
    number: '4',
    title: 'Exibição e alertas em tempo real',
    color: 'bg-green-700',
  },
];

export function HowItWorksSection() {
  return (
    <section id="sobre" className="py-16 md:py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Como Funciona
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-4">
              <div className={`${step.color} text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold`}>
                {step.number}
              </div>
              <p className="text-lg text-gray-700">
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}