import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";

export default function Features() {
  const features = [
    {
      icon: "📧",
      title: "Automated Offer Letters",
      description:
        "Draft, send, and track legally-compliant offer letters in seconds. e-Signatures included.",
    },
    {
      icon: "👥",
      title: "Easy Onboarding",
      description:
        "Self-service registration for new hires. Collect bank details, IDs, and tax forms automatically.",
    },
    {
      icon: "🧾",
      title: "One-Click Invoices",
      description:
        "Automate your contractor billing. Professional invoices generated and sent on your schedule.",
    },
    {
      icon: "💵",
      title: "Instant Salary Slips",
      description:
        "Run payroll and distribute payslips instantly. Integrated with local compliance rules.",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#060010] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold text-white mb-4">
            Simplify your HR workflow
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Everything you need to manage your team documents in one place, from
            first hire to global expansion.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="relative overflow-hidden bg-white/5 border-white/10 hover:bg-white/10 transition-all hover:shadow-lg"
            >
              <CardHeader>
                {/* Icon */}
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-2xl">
                  {feature.icon}
                </div>
                <CardTitle className="text-white text-xl">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>

              <BorderBeam
                duration={8}
                size={100}
                // colorFrom="#ef4444"
                colorTo="#3b82f6"
              />
              <BorderBeam
                duration={8}
                size={100}
                reverse
                // colorFrom="#ef4444"
                colorTo="#3b82f6"
              />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
