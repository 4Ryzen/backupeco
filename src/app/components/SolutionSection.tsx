import { Cloud, AlertTriangle, BarChart3 } from 'lucide-react';

const solutions = [
  {
    icon: Cloud,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-700',
    title: 'Monitoramento',
    subtitle: 'em tempo real',
    description: 'Sensores detectam gases como CO₂ e partículas poluentes',
  },
  {
    icon: AlertTriangle,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    title: 'Alertas',
    subtitle: 'automáticos',
    description: 'Sistema avisa quando os níveis estão perigosos',
  },
  {
    icon: BarChart3,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    title: 'Relatórios',
    subtitle: 'e controle',
    description: 'Dados ajudam empresas a reduzir a poluição',
  },
];

export function SolutionSection() {
  return (
    <section id="solução" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Nossa Solução
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <div
                key={solution.title}
                className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`${solution.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                  <Icon className={`size-8 ${solution.iconColor}`} />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {solution.title}
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  {solution.subtitle}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {solution.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}