import React from "react";
import { Layout, CreditCard, ShieldCheck, Users, Key, CheckCircle, Code, Server, Database, Mail, ArrowRight } from "lucide-react";

/* FeatureCard, RoleCard, TechItem - section-local helpers */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group h-full">
    <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-500">
      <div className="text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors duration-500">
        {React.cloneElement(icon, { size: 24 })}
      </div>
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const RoleCard = ({ title, desc, icon, color, features }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  };

  return (
    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-500 hover:shadow-lg h-full flex flex-col">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${colors[color]}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow">{desc}</p>
      <ul className="space-y-3 mt-auto">
        {features.map((feat, i) => (
          <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            <CheckCircle className="w-4 h-4 text-slate-400" />
            {feat}
          </li>
        ))}
      </ul>
    </div>
  );
};

const TechItem = ({ icon, label, sub, color }) => (
  <div className="flex flex-col items-center gap-4 group cursor-default">
    <div className={`p-6 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 group-hover:bg-white dark:group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500 ${color}`}>
      {React.cloneElement(icon, { size: 40 })}
    </div>
    <div>
      <div className="font-bold text-lg text-slate-900 dark:text-white">{label}</div>
      <div className="text-slate-500 dark:text-slate-400 text-sm">{sub}</div>
    </div>
  </div>
);

const Sections = () => {
  return (
    <>
      {/* Features */}
      <section id="features" className="py-32 bg-white dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase text-sm mb-2 block">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Everything you need to run your rentals
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Powerful features wrapped in a simple, intuitive interface.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={<Layout />} title="Intuitive Dashboard" desc="Clean, clutter-free interfaces designed specifically for tenants, landlords, and admins." />
            <FeatureCard icon={<CreditCard />} title="Secure Payments" desc="Integrated payment gateways for rent collection, deposit tracking, and financial history." />
            <FeatureCard icon={<ShieldCheck />} title="Role-Based Security" desc="Advanced JWT authentication ensures that users only access what they are authorized to see." />
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="who-its-for" className="py-32 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center md:text-left">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase text-sm">The Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mt-2">Tailored experiences for every user</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <RoleCard title="Tenant" desc="Search properties, sign leases digitally, and pay rent in seconds." icon={<Users className="w-6 h-6 text-blue-500" />} color="blue" features={["One-click applications", "Maintenance requests", "Rent history"]} />
            <RoleCard title="Landlord" desc="List properties, screen tenants, and manage your portfolio effortlessly." icon={<Key className="w-6 h-6 text-emerald-500" />} color="emerald" features={["Property analytics", "Tenant screening", "Automated reminders"]} />
            <RoleCard title="Admin" desc="Oversee the entire platform with powerful moderation and oversight tools." icon={<ShieldCheck className="w-6 h-6 text-purple-500" />} color="purple" features={["User verification", "Dispute resolution", "System logs"]} />
          </div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-xs uppercase tracking-widest mb-6">
            <Users size={14} /> Join Our Network
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Are you a Service Professional?
          </h2>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Expand your business with RentEase. Connect with thousands of tenants and landlords looking for quality maintenance services.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=bhavanimuttukuru@gmail.com&su=Service%20Provider%20Application&body=Hi%20RentEase%20Team%2C%0A%0AI%20am%20interested%20in%20becoming%20a%20service%20provider%20on%20your%20platform.%0A%0ACompany%20Name%3A%0AService%20Type%3A%0AContact%20Number%3A%0A%0AThank%20you!"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-lg shadow-orange-600/30 group"
            >
              <Mail size={20} />
              Join as Partner
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-sm text-slate-500 mt-4 sm:mt-0">
              *Verification required
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech-stack" className="py-32 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">Engineered for Scale</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <TechItem icon={<Code />} label="React.js" sub="Frontend" color="text-cyan-500" />
            <TechItem icon={<Server />} label="Node.js" sub="Backend" color="text-green-500" />
            <TechItem icon={<Database />} label="PostgreSQL" sub="Database" color="text-blue-500" />
            <TechItem icon={<Layout />} label="MVC" sub="Architecture" color="text-pink-500" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Sections;
