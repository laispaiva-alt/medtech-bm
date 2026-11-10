import React, { useState } from 'react';
import { 
  HeartPulse, 
  User, 
  Lock, 
  Calendar, 
  FileText, 
  MessageSquare, 
  LogOut, 
  ChevronRight, 
  Download, 
  CircleCheck, 
  ShieldCheck, 
  Building2, 
  Send 
} from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [activeTab, setActiveTab] = useState("agendar");
  const [user, setUser] = useState({ name: "Maria da Silva", cpf: "123.456.789-00" });
  const [loginForm, setLoginForm] = useState({ cpf: "", senha: "" });
  const [govCpf, setGovCpf] = useState("");
  const [govStep, setGovStep] = useState(1);
  const [govPassword, setGovPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // ESTADO DOS AGENDAMENTOS (Mantido exatamente como estava)
  const [agendamentos, setAgendamentos] = useState([
    {
      id: 1,
      tipo: "Consulta Médica",
      especialidade: "Clínica Geral",
      unidade: "UBS Centro - Barra Mansa",
      data: "2026-10-15",
      status: "Confirmado"
    }
  ]);

  const [formData, setFormData] = useState({
    tipo: "Consulta Médica",
    especialidade: "Clínica Geral",
    unidade: "UBS Centro - Barra Mansa",
    data: "2026-10-15"
  });

  const [showAgendamentoSuccess, setShowAgendamentoSuccess] = useState(false);

  const [exames] = useState([
    {
      id: 1,
      data: "10/08/2026",
      exame: "Hemograma Completo",
      local: "Laboratório Municipal BM",
      status: "Pronto"
    },
    {
      id: 2,
      data: "02/05/2026",
      exame: "Raio-X Torácico",
      local: "UPA Barra Mansa",
      status: "Pronto"
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "user",
      text: "Gostaria de confirmação sobre o jejum para meu exame de amanhã.",
      time: "09:30"
    },
    {
      id: 2,
      sender: "system",
      text: "Olá Maria! Para o Hemograma Completo é necessário jejum absoluto de 8 horas.",
      time: "09:35"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");

  const unidadesBarraMansa = [
    "UBS Centro - Barra Mansa",
    "UBS Ano Bom",
    "UBS Santa Rosa",
    "UBS Reginaldo Roriz (São Luiz)",
    "UBS Vila Nova",
    "UPA 24h - Barra Mansa",
    "Laboratório Municipal BM",
    "Santa Casa de Misericórdia de Barra Mansa"
  ];

  const handleTraditionalLogin = (e) => {
    e.preventDefault();
    if (!loginForm.cpf || !loginForm.senha) {
      setLoginError("Por favor, preencha o CPF e a senha.");
      return;
    }
    setLoginError("");
    setCurrentPage("dashboard");
  };

  const handleGovNextStep = (e) => {
    e.preventDefault();
    if (!govCpf) {
      setLoginError("Digite o seu CPF para continuar.");
      return;
    }
    setLoginError("");
    setGovStep(2);
  };

  const handleGovSubmit = (e) => {
    e.preventDefault();
    if (!govPassword) {
      setLoginError("Digite sua senha do Gov.br.");
      return;
    }
    setLoginError("");
    setCurrentPage("dashboard");
    setGovStep(1);
    setGovCpf("");
    setGovPassword("");
  };

  const handleLogout = () => {
    setCurrentPage("home");
  };

  // SUBMIT DO AGENDAMENTO (Mantido intacto com chamada a API e estado local)
  const handleAgendarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (import.meta.env.VITE_API_URL) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/agendamentos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
    } catch (err) {
      console.error(err);
    }
    const newAgendamento = {
      id: Date.now(),
      ...formData,
      status: "Solicitado"
    };
    setAgendamentos([newAgendamento, ...agendamentos]);
    setShowAgendamentoSuccess(true);
    setTimeout(() => setShowAgendamentoSuccess(false), 4000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");
    setTimeout(() => {
      const autoResponse = {
        id: Date.now() + 1,
        sender: "system",
        text: "Agradecemos sua mensagem! A equipe da UBS Centro responderá em breve.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, autoResponse]);
    }, 1200);
  };

  const handleDownloadPDF = (exameNome) => {
    const element = document.createElement("a");
    const file = new Blob([`MEDTECH BARRA MANSA - LAUDO DIGITAL\nExame: ${exameNome}\nPaciente: Maria da Silva\nStatus: Aprovado`], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${exameNome.toLowerCase().replace(/ /g, "_")}_laudo.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // --- HOME ---
  if (currentPage === "home") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="bg-[#005BAE] text-white sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage("home")}>
              <div className="bg-white p-2 rounded-lg shadow-inner">
                <HeartPulse className="text-[#005BAE]" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight flex items-center">
                  <span>Med</span><span className="text-[#28A745]">Tech</span>
                </h1>
                <p className="text-xs text-blue-200 uppercase tracking-widest font-semibold">Barra Mansa • RJ</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#unidades" className="hover:text-blue-200 transition">Postos de Saúde</a>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentPage("login")}
                className="bg-white text-[#005BAE] hover:bg-blue-50 font-bold px-5 py-2.5 rounded-lg text-sm shadow transition duration-200"
              >
                Entrar no Portal
              </button>
              <button
                onClick={() => setCurrentPage("login-gov")}
                className="bg-[#1351B4] border border-blue-400 hover:bg-[#0c3c88] text-white font-bold px-4 py-2.5 rounded-lg text-sm shadow flex items-center space-x-2 transition"
              >
                <span className="bg-yellow-400 text-blue-900 font-extrabold text-[10px] px-1.5 py-0.5 rounded">gov.br</span>
                <span>Acessar</span>
              </button>
            </div>
          </div>
        </header>

        <section className="bg-gradient-to-r from-[#005BAE] via-[#00488B] to-[#003466] text-white py-16 md:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="bg-blue-500/30 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full border border-blue-300/20 inline-block mb-4">
                Portal Oficial de Saúde Digital
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                Sua saúde em Barra Mansa na palma da mão
              </h2>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Agende consultas médicas, acesse resultados de exames laboratoriais e acompanhe seu histórico no SUS de forma simples, rápida e digital.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setCurrentPage("login")}
                  className="bg-[#28A745] hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition text-center flex items-center justify-center space-x-2"
                >
                  <span>Agendar Consulta</span>
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => setCurrentPage("login-gov")}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-4 rounded-xl transition text-center"
                >
                  Entrar com Gov.br
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl space-y-6">
              <div className="flex items-center space-x-4 border-b border-white/10 pb-4">
                <div className="bg-blue-500/20 p-3 rounded-lg text-green-400">
                  <Calendar size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Agendamento Fácil</h4>
                  <p className="text-sm text-blue-200">Escolha a unidade mais próxima no município</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 border-b border-white/10 pb-4">
                <div className="bg-blue-500/20 p-3 rounded-lg text-green-400">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Resultados Digitais</h4>
                  <p className="text-sm text-blue-200">Baixe exames sem precisar sair de casa</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500/20 p-3 rounded-lg text-green-400">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Segurança Integrada</h4>
                  <p className="text-sm text-blue-200">Autenticação oficial do Governo Federal</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="unidades" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Unidades de Saúde em Barra Mansa</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {unidadesBarraMansa.slice(0, 4).map((unidade, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                <Building2 className="text-[#005BAE] mb-3" size={28} />
                <h4 className="font-bold text-gray-800 mb-2">{unidade}</h4>
                <span className="text-xs bg-green-100 text-green-800 font-semibold px-2.5 py-1 rounded-full">Atendimento SUS</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm mt-auto border-t border-slate-800">
          <p>© 2026 MedTech Barra Mansa - Sistema Único de Saúde (SUS)</p>
        </footer>
      </div>
    );
  }

  // --- LOGIN TRADICIONAL ---
  if (currentPage === "login") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex bg-blue-50 p-3 rounded-xl mb-3">
              <HeartPulse className="text-[#005BAE]" size={36} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Acessar Portal MedTech</h2>
            <p className="text-sm text-gray-500 mt-1">Prefeitura Municipal de Barra Mansa</p>
          </div>

          {loginError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleTraditionalLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">CPF do Cidadão</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005BAE] outline-none"
                  value={loginForm.cpf}
                  onChange={(e) => setLoginForm({ ...loginForm, cpf: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005BAE] outline-none"
                  value={loginForm.senha}
                  onChange={(e) => setLoginForm({ ...loginForm, senha: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#005BAE] hover:bg-[#00488B] text-white font-bold py-3 rounded-lg shadow-md transition"
            >
              Entrar no Sistema
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
            <button
              onClick={() => setCurrentPage("login-gov")}
              className="w-full bg-[#1351B4] text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center space-x-2"
            >
              <span className="bg-yellow-400 text-blue-900 font-extrabold text-[10px] px-1.5 py-0.5 rounded">gov.br</span>
              <span>Entrar com Gov.br</span>
            </button>

            <button
              onClick={() => setCurrentPage("home")}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium block mx-auto mt-2"
            >
              ← Voltar para a página inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGIN GOV.BR ---
  if (currentPage === "login-gov") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <span className="bg-[#1351B4] text-white font-extrabold text-sm px-3 py-1 rounded">gov.br</span>
            <span className="text-xs text-gray-400">Barra Mansa Digital</span>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">Identifique-se no gov.br</h2>
          <p className="text-xs text-gray-500 mb-6">Digite seu CPF para acessar o MedTech BM</p>

          {loginError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {loginError}
            </div>
          )}

          {govStep === 1 ? (
            <form onSubmit={handleGovNextStep} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Número do CPF</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  value={govCpf}
                  onChange={(e) => setGovCpf(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1351B4] hover:bg-[#0c3c88] text-white font-bold py-3 rounded-lg transition"
              >
                Continuar
              </button>
            </form>
          ) : (
            <form onSubmit={handleGovSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Senha gov.br</label>
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  value={govPassword}
                  onChange={(e) => setGovPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#28A745] hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
              >
                Entrar
              </button>
            </form>
          )}

          <button
            onClick={() => setCurrentPage("home")}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium block mx-auto mt-6"
          >
            ← Cancelar e Voltar
          </button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD DO PACIENTE ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-[#005BAE] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage("home")}>
            <HeartPulse size={24} />
            <h1 className="text-xl font-black">MedTech BM</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Olá, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-800 hover:bg-blue-900 p-2 rounded-lg text-white transition"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex border-b border-gray-200 mb-6 space-x-4">
          <button
            onClick={() => setActiveTab("agendar")}
            className={`pb-3 px-4 font-semibold text-sm flex items-center space-x-2 border-b-2 transition ${
              activeTab === "agendar" ? "border-[#005BAE] text-[#005BAE]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Calendar size={18} />
            <span>Consultas e Agendamento</span>
          </button>
          <button
            onClick={() => setActiveTab("exames")}
            className={`pb-3 px-4 font-semibold text-sm flex items-center space-x-2 border-b-2 transition ${
              activeTab === "exames" ? "border-[#005BAE] text-[#005BAE]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText size={18} />
            <span>Resultados de Exames</span>
          </button>
          <button
            onClick={() => setActiveTab("mensagens")}
            className={`pb-3 px-4 font-semibold text-sm flex items-center space-x-2 border-b-2 transition ${
              activeTab === "mensagens" ? "border-[#005BAE] text-[#005BAE]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <MessageSquare size={18} />
            <span>Fale com a UBS</span>
          </button>
        </div>

        {/* ABA AGENDAR: MANTIDA 100% INTATCA */}
        {activeTab === "agendar" && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Novo Agendamento SUS</h3>

              {showAgendamentoSuccess && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 flex items-center space-x-3 border border-green-200">
                  <CircleCheck size={24} />
                  <div>
                    <h4 className="font-bold">Agendamento Realizado!</h4>
                    <p className="text-xs">Sua solicitação foi salva com sucesso no sistema da Prefeitura.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleAgendarSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Atendimento</label>
                  <select
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#005BAE] outline-none"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  >
                    <option value="Consulta Médica">Consulta Médica</option>
                    <option value="Exame Laboratorial">Exame Laboratorial</option>
                    <option value="Vacinação">Vacinação</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Especialidade</label>
                    <select
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#005BAE] outline-none"
                      value={formData.especialidade}
                      onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                    >
                      <option value="Clínica Geral">Clínica Geral</option>
                      <option value="Pediatria">Pediatria</option>
                      <option value="Odontologia">Odontologia</option>
                      <option value="Ginecologia">Ginecologia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Data Pretendida</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#005BAE] outline-none"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Unidade de Saúde (Barra Mansa)</label>
                  <select
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#005BAE] outline-none"
                    value={formData.unidade}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                  >
                    {unidadesBarraMansa.map((u, i) => (
                      <option key={i} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#28A745] hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow transition"
                >
                  Confirmar Solicitação de Consulta
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Meus Agendamentos</h3>
              <div className="space-y-4">
                {agendamentos.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-gray-100 bg-slate-50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-[#005BAE]">{item.especialidade}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">{item.status}</span>
                    </div>
                    <p className="text-xs text-gray-600">{item.unidade}</p>
                    <p className="text-xs font-semibold text-gray-700">Data: {item.data}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "exames" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Resultados de Exames Laboratoriais</h3>
            <div className="space-y-4">
              {exames.map((exame) => (
                <div key={exame.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-100 rounded-xl bg-slate-50 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-800">{exame.exame}</h4>
                    <p className="text-xs text-gray-500">{exame.local} • Realizado em {exame.data}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadPDF(exame.exame)}
                    className="bg-[#005BAE] hover:bg-[#00488B] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition"
                  >
                    <Download size={14} />
                    <span>Baixar Laudo PDF</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "mensagens" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 max-w-3xl mx-auto flex flex-col h-[500px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Atendimento Digital UBS</h3>
            <div className="flex-1 overflow-y-auto space-y-4 p-2">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-sm ${
                    m.sender === "user" ? "bg-[#005BAE] text-white rounded-tr-none" : "bg-slate-100 text-gray-800 rounded-tl-none"
                  }`}>
                    <p>{m.text}</p>
                    <span className={`text-[10px] block mt-1 ${m.sender === "user" ? "text-blue-200" : "text-gray-400"}`}>{m.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t mt-2">
              <input
                type="text"
                placeholder="Digite sua dúvida para a equipe médica..."
                className="flex-1 border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#005BAE] outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="bg-[#005BAE] text-white p-2.5 rounded-lg hover:bg-[#00488B]">
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}