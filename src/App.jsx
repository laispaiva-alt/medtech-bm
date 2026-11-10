import React, { useState } from 'react';
import { 
  Calendar, 
  FileText, 
  MessageSquare, 
  LogOut, 
  PlusCircle, 
  Download, 
  Clock, 
  Send, 
  Building2, 
  User, 
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileCheck,
  UserCheck,
  Lock,
  UserPlus
} from 'lucide-react';

export default function App() {
  // Estado das visões: 'home' | 'login' | 'cadastro' | 'dashboard-cidadao' | 'dashboard-posto'
  const [currentView, setCurrentView] = useState('home');
  const [userRole, setUserRole] = useState('cidadao'); // 'cidadao' | 'posto'
  
  // Login States (Iniciam vazios para bloquear login automático)
  const [loginMethod, setLoginMethod] = useState('traditional'); // 'traditional' | 'gov'
  const [govStep, setGovStep] = useState(1);
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('UBS Centro - Barra Mansa');
  const [erroLogin, setErroLogin] = useState('');

  // Cadastro States
  const [formCadastro, setFormCadastro] = useState({
    nome: '',
    cpf: '',
    cartaoSus: '',
    dataNascimento: '',
    bairro: 'Centro',
    senha: '',
    confirmarSenha: ''
  });

  // Abas do Cidadão: 'meus-agendamentos' | 'agendar' | 'exames' | 'chat'
  const [activeTabCidadao, setActiveTabCidadao] = useState('agendar');

  // Abas do Posto: 'gestao-agendamentos' | 'enviar-laudos'
  const [activeTabPosto, setActiveTabPosto] = useState('gestao-agendamentos');

  // Estado dos Agendamentos
  const [agendamentos, setAgendamentos] = useState([]);

  // Formulário de Agendamento do Cidadão
  const [formAgendamento, setFormAgendamento] = useState({
    tipo: 'Consulta Médica',
    especialidade: 'Clínica Geral',
    unidade: 'UBS Centro - Barra Mansa',
    data: '2026-11-20'
  });

  // Mensagens do Chat
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      remetente: 'ubs',
      texto: 'Olá! Bem-vindo ao canal de atendimento digital da Secretaria Municipal de Saúde de Barra Mansa.'
    }
  ]);

  const [novaMensagem, setNovaMensagem] = useState('');

  // Exames do Cidadão
  const exames = [
    {
      id: 1,
      data: '10/08/2026',
      exame: 'Hemograma Completo',
      local: 'Laboratório Municipal BM',
      status: 'Pronto',
      pdf: 'Laudo_Hemograma_Completo.pdf'
    },
    {
      id: 2,
      data: '02/05/2026',
      exame: 'Raio-X Toráxico',
      local: 'UPA Barra Mansa',
      status: 'Pronto',
      pdf: 'Laudo_RaioX_Toraxico.pdf'
    }
  ];

  // Postos de Saúde de Barra Mansa
  const postosBarraMansa = [
    'UBS Centro - Barra Mansa',
    'UPA Barra Mansa',
    'USF Ano Bom - Barra Mansa',
    'USF Santa Rosa - Barra Mansa',
    'USF Vila Nova - Barra Mansa',
    'Laboratório Municipal BM'
  ];

  const bairrosBarraMansa = [
    'Ano Bom', 'Centro', 'Vila Nova', 'Santa Rosa', 'Boa Sorte', 
    'Reginalda', 'Paraíso', 'São Luiz', 'Sirenio', 'Vila Maria'
  ];

  // Validação estrita no Login
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setErroLogin('');

    if (userRole === 'cidadao') {
      if (!cpf.trim() || !password.trim()) {
        setErroLogin('Preencha seu CPF e senha de acesso para entrar.');
        return;
      }
      if (!userName.trim()) {
        setUserName(`Cidadão (${cpf})`);
      }
      setCurrentView('dashboard-cidadao');
    } else {
      setUserName(unidadeSelecionada);
      setCurrentView('dashboard-posto');
    }
  };

  // Ação de Cadastro
  const handleCadastro = (e) => {
    e.preventDefault();
    setErroLogin('');

    if (!formCadastro.nome.trim() || !formCadastro.cpf.trim() || !formCadastro.senha.trim()) {
      setErroLogin('Preencha todos os campos obrigatórios do cadastro.');
      return;
    }

    if (formCadastro.senha !== formCadastro.confirmarSenha) {
      alert('As senhas digitadas não coincidem.');
      return;
    }
    setUserName(formCadastro.nome);
    setCpf(formCadastro.cpf);
    alert('Cadastro realizado com sucesso no SUS Barra Mansa!');
    setCurrentView('dashboard-cidadao');
  };

  // Sair do Sistema
  const handleSair = () => {
    setUserName('');
    setCpf('');
    setPassword('');
    setErroLogin('');
    setCurrentView('home');
  };

  // Criar Agendamento (Integrado ao Backend Render + LocalState)
  const handleAgendar = async (e) => {
    e.preventDefault();
    const dataPartes = formAgendamento.data.split('-');
    const dataFormatada = dataPartes.length === 3 ? `${dataPartes[2]} / ${dataPartes[1]} / ${dataPartes[0]}` : formAgendamento.data;

    const novo = {
      id: Date.now(),
      paciente: userName || 'Cidadão Logado',
      cpf: cpf || '000.000.000-00',
      ...formAgendamento,
      data: dataFormatada,
      status: 'Solicitado'
    };

    try {
      if (import.meta.env.VITE_API_URL) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/agendamentos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novo)
        });
      }
    } catch (err) {
      console.error(err);
    }

    setAgendamentos([novo, ...agendamentos]);
    setActiveTabCidadao('meus-agendamentos');
  };

  // Enviar Mensagem Chat
  const handleEnviarMensagem = (e) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    const nova = {
      id: Date.now(),
      remetente: 'usuario',
      texto: novaMensagem
    };

    setMensagens((prev) => [...prev, nova]);
    setNovaMensagem('');

    if (userRole === 'cidadao') {
      setTimeout(() => {
        const respostaAuto = {
          id: Date.now() + 1,
          remetente: 'ubs',
          texto: `Olá ${userName || 'Cidadão'}! Sua mensagem foi recebida pela equipe da ${formAgendamento.unidade}. Em breve retornaremos com a resposta.`
        };
        setMensagens((prev) => [...prev, respostaAuto]);
      }, 1000);
    }
  };

  // Aprovar/Recusar Agendamento no Posto
  const handleAlterarStatusAgendamento = (id, novoStatus) => {
    setAgendamentos(agendamentos.map(a => a.id === id ? { ...a, status: novoStatus } : a));
  };

  // Simulação de Download de PDF
  const handleDownloadPDF = (exameNome, localColeta) => {
    const conteudo = `PREFEITURA MUNICIPAL DE BARRA MANSA\nSECRETARIA MUNICIPAL DE SAÚDE\nSYSTEM MEDTECH BARRA MANSA\n\n--------------------------------------------\nLAUDO DIGITAL DE EXAME DE LABORATÓRIO/IMAGEM\n--------------------------------------------\n\nPaciente: ${userName || 'Cidadão Logado'}\nCPF: ${cpf || '000.000.000-00'}\nExame: ${exameNome}\nLocal de Coleta: ${localColeta}\nData de Emissão: ${new Date().toLocaleDateString('pt-BR')}\nStatus: Laudo Validado e Autenticado Digitalmente pelo SUS Barra Mansa.\n\nResultado: Parâmetros e índices laboratoriais dentro da normalidade de referência.\n\nDocumento gerado eletronicamente via Portal MedTech Barra Mansa.`;
    
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laudo_${exameNome.replace(/ /g, '_')}_BarraMansa.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col">
      {/* 1. TELA HOME */}
      {currentView === 'home' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="z-10 flex flex-col items-center text-center max-w-3xl w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl">
                <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 48V20C12 16 15 12 20 12C24 12 26 15 28 19L32 28L36 19C38 15 40 12 44 12C49 12 52 16 52 20V34" stroke="#0080FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 48C12 52 16 54 28 54C24 54 28 50 28 44V28" stroke="#28A745" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="52" cy="42" r="6" stroke="#28A745" strokeWidth="4" fill="#0f172a"/>
                </svg>
              </div>
            </div>

            <div className="flex items-center text-4xl sm:text-5xl font-black tracking-tight mb-2">
              <span className="text-[#0080FF]">Med</span>
              <span className="text-[#28A745]">Tech</span>
              <span className="text-[#0080FF] ml-2 text-3xl sm:text-4xl font-extrabold">BM</span>
            </div>

            <p className="text-slate-400 text-sm sm:text-base mb-10 font-medium max-w-lg">
              Sistema Unificado de Agendamentos e Exames - Barra Mansa
            </p>

            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              COMO DESEJA ACESSAR O SISTEMA?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              <div 
                onClick={() => {
                  setUserRole('cidadao');
                  setCurrentView('login');
                }}
                className="group bg-slate-800/80 hover:bg-slate-800 border border-blue-500/30 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 cursor-pointer text-left shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Portal do Cidadão</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                    Para usuários do SUS solicitar agendamentos de exames/consultas, ver filas e acessar laudos.
                  </p>
                </div>
                <button className="w-full py-3 px-4 rounded-xl bg-[#005BAE] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-lg">
                  ACESSAR COMO CIDADÃO
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div 
                onClick={() => {
                  setUserRole('posto');
                  setCurrentView('login');
                }}
                className="group bg-slate-800/80 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-500 rounded-2xl p-6 transition-all duration-300 cursor-pointer text-left shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Postos de Saúde</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                    Acesso administrativo para gestão dos postos de Barra Mansa, aprovação de vagas e envio de laudos.
                  </p>
                </div>
                <button className="w-full py-3 px-4 rounded-xl bg-[#28A745] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-lg">
                  ACESSAR COMO POSTO DE SAÚDE
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TELA DE LOGIN */}
      {currentView === 'login' && (
        <div className="flex-1 bg-slate-100 flex flex-col">
          <header className="bg-[#005BAE] text-white px-8 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">
                Med<span className="text-[#28A745]">Tech</span>
              </span>
              <span className="text-xs border-l border-blue-400 pl-2 text-blue-100">
                Barra Mansa
              </span>
            </div>

            <button 
              onClick={() => setCurrentView('home')} 
              className="text-xs text-blue-100 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para Home
            </button>
          </header>

          <div className="flex-1 flex items-center justify-center p-4">
            {loginMethod === 'traditional' ? (
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-10 space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#005BAE] text-left">
                  {userRole === 'cidadao' ? 'Acesso ao Portal do Cidadão' : 'Acesso do Posto de Saúde'}
                </h2>

                {erroLogin && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold border border-red-200">
                    {erroLogin}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  {userRole === 'cidadao' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                        CPF ou Cartão SUS
                      </label>
                      <input
                        type="text"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005BAE] text-sm"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                        Unidade de Saúde
                      </label>
                      <select
                        value={unidadeSelecionada}
                        onChange={(e) => setUnidadeSelecionada(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                      >
                        {postosBarraMansa.map((p, idx) => (
                          <option key={idx} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                      Senha de Acesso
                    </label>
                    <input
                      type="password"
                      placeholder="•••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005BAE] text-sm"
                    />
                  </div>

                  <div className="bg-[#EBF9F1] border border-emerald-200/60 rounded-xl p-3.5 text-xs text-[#1E7E34] flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-[#28A745] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      <strong>Conformidade LGPD:</strong> Seus dados são protegidos segundo a Lei nº 13.709/2018.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3.5 ${userRole === 'cidadao' ? 'bg-[#005BAE] hover:bg-blue-700' : 'bg-[#28A745] hover:bg-emerald-700'} text-white font-bold rounded-xl text-sm tracking-wide transition-colors shadow-sm uppercase`}
                  >
                    ENTRAR NO SISTEMA
                  </button>
                </form>

                {userRole === 'cidadao' && (
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setCurrentView('cadastro')}
                      className="text-[#005BAE] font-bold hover:underline flex items-center gap-1"
                    >
                      <UserPlus className="w-4 h-4" /> Primeiro acesso? Cadastre-se
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setLoginMethod('gov')}
                      className="text-slate-500 hover:text-[#005BAE] font-medium transition-colors"
                    >
                      Entrar com <strong className="text-[#1351B4]">gov.br</strong>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-[#1351B4] p-5 text-white flex items-center justify-between">
                  <span className="text-2xl font-black tracking-tight">gov.br</span>
                  <span className="text-xs bg-blue-900/40 px-2.5 py-1 rounded-full border border-blue-300/30">
                    Autenticação Digital
                  </span>
                </div>

                <div className="p-6">
                  {govStep === 1 ? (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-800">
                        Identifique-se no gov.br com seu CPF
                      </h3>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Seu Nome Completo
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Seu Nome Completo"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#1351B4] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Número do CPF
                        </label>
                        <input
                          type="text"
                          placeholder="000.000.000-00"
                          value={cpf}
                          onChange={(e) => setCpf(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#1351B4] outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!cpf.trim() || !userName.trim()) {
                            alert('Informe seu nome e CPF antes de continuar.');
                            return;
                          }
                          setGovStep(2);
                        }}
                        className="w-full py-3 bg-[#1351B4] hover:bg-blue-800 text-white font-bold rounded-lg text-sm transition-colors"
                      >
                        Continuar
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
                        Entrando como: <strong className="text-slate-900">{userName}</strong> ({cpf})
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Digite sua senha do gov.br
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#1351B4] outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full py-3 bg-[#1351B4] hover:bg-blue-800 text-white font-bold rounded-lg text-sm transition-colors shadow-md"
                      >
                        Entrar no Sistema
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setLoginMethod('traditional')}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800 mt-6 underline block"
                  >
                    Voltar para o login tradicional
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TELA DE CADASTRO */}
      {currentView === 'cadastro' && (
        <div className="flex-1 bg-slate-100 flex flex-col">
          <header className="bg-[#005BAE] text-white px-8 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">
                Med<span className="text-[#28A745]">Tech</span>
              </span>
              <span className="text-xs border-l border-blue-400 pl-2 text-blue-100">
                Barra Mansa
              </span>
            </div>

            <button 
              onClick={() => setCurrentView('login')} 
              className="text-xs text-blue-100 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Já tenho conta
            </button>
          </header>

          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-10 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold text-[#005BAE]">Cadastro no Portal do Cidadão</h2>
                <p className="text-xs text-slate-500 mt-1">Preencha seus dados para solicitar agendamentos no SUS Barra Mansa</p>
              </div>

              {erroLogin && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold border border-red-200">
                  {erroLogin}
                </div>
              )}

              <form onSubmit={handleCadastro} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome completo"
                      value={formCadastro.nome}
                      onChange={(e) => setFormCadastro({ ...formCadastro, nome: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#005BAE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={formCadastro.cpf}
                      onChange={(e) => setFormCadastro({ ...formCadastro, cpf: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#005BAE]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                      Cartão do SUS
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="000 0000 0000 0000"
                      value={formCadastro.cartaoSus}
                      onChange={(e) => setFormCadastro({ ...formCadastro, cartaoSus: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#005BAE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      required
                      value={formCadastro.dataNascimento}
                      onChange={(e) => setFormCadastro({ ...formCadastro, dataNascimento: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#005BAE]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Bairro de Residência (Barra Mansa)
                  </label>
                  <select
                    value={formCadastro.bairro}
                    onChange={(e) => setFormCadastro({ ...formCadastro, bairro: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#005BAE]"
                  >
                    {bairrosBarraMansa.map((b, idx) => (
                      <option key={idx} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                      Criar Senha
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formCadastro.senha}
                      onChange={(e) => setFormCadastro({ ...formCadastro, senha: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#005BAE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                      Confirmar Senha
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formCadastro.confirmarSenha}
                      onChange={(e) => setFormCadastro({ ...formCadastro, confirmarSenha: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#005BAE]"
                    />
                  </div>
                </div>

                <div className="bg-[#EBF9F1] border border-emerald-200/60 rounded-xl p-3.5 text-xs text-[#1E7E34] flex items-start gap-2.5 mt-2">
                  <Lock className="w-4 h-4 text-[#28A745] shrink-0 mt-0.5" />
                  <span>
                    Ao se cadastrar, você concorda com o tratamento de dados pessoais de acordo com a LGPD (Lei nº 13.709/2018) para fins de gestão pública de saúde em Barra Mansa.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#28A745] hover:bg-emerald-600 text-white font-bold rounded-xl text-sm tracking-wide transition-colors shadow-sm uppercase mt-4"
                >
                  CONCLUIR CADASTRO
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 4. PAINEL DO CIDADÃO */}
      {currentView === 'dashboard-cidadao' && (
        <div className="flex-1 bg-white text-slate-800 flex flex-col">
          <header className="bg-[#005BAE] text-white px-8 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">
                Med<span className="text-[#28A745]">Tech</span>
              </span>
              <span className="text-xs border-l border-blue-400 pl-2 text-blue-100">
                Barra Mansa
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium">
              <span>{userName || 'Cidadão Logado'}</span>
              <span className="text-blue-200">|</span>
              <button
                onClick={handleSair}
                className="hover:underline text-white font-normal"
              >
                Sair
              </button>
            </div>
          </header>

          <div className="flex-1 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-[#F8FAFC] border-r border-slate-200/80 p-4 space-y-1 shrink-0">
              <button
                onClick={() => setActiveTabCidadao('meus-agendamentos')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all rounded-r-md ${
                  activeTabCidadao === 'meus-agendamentos'
                    ? 'bg-[#005BAE] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Calendar className="w-4 h-4" /> Meus Agendamentos
              </button>

              <button
                onClick={() => setActiveTabCidadao('agendar')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all rounded-r-md ${
                  activeTabCidadao === 'agendar'
                    ? 'bg-[#005BAE] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <PlusCircle className="w-4 h-4" /> Solicitar Agendamento
              </button>

              <button
                onClick={() => setActiveTabCidadao('exames')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all rounded-r-md ${
                  activeTabCidadao === 'exames'
                    ? 'bg-[#005BAE] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <FileText className="w-4 h-4" /> Laudos & Exames
              </button>

              <button
                onClick={() => setActiveTabCidadao('chat')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all rounded-r-md ${
                  activeTabCidadao === 'chat'
                    ? 'bg-[#005BAE] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Atendimento Digital
              </button>
            </aside>

            <main className="flex-1 p-6 md:p-10">
              {/* ABA 1: MEUS AGENDAMENTOS */}
              {activeTabCidadao === 'meus-agendamentos' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Meus Agendamentos no SUS</h2>
                    <p className="text-xs text-slate-500 mt-1">Acompanhe o status das suas solicitações</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {agendamentos.length === 0 ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
                        Nenhum agendamento realizado ainda. Clique na aba <strong>"Solicitar Agendamento"</strong> para enviar sua primeira solicitação.
                      </div>
                    ) : (
                      agendamentos.map((item) => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{item.tipo}</span>
                            <h4 className="text-lg font-bold text-slate-800">{item.especialidade}</h4>
                            <p className="text-xs text-slate-500">{item.unidade} • Data: <strong className="text-slate-700">{item.data}</strong></p>
                          </div>
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                            item.status === 'Confirmado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ABA 2: AGENDAR */}
              {activeTabCidadao === 'agendar' && (
                <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Novo Agendamento de Consulta ou Exame</h2>
                    <p className="text-xs text-slate-500 mt-1">Selecione o tipo de atendimento e o posto em Barra Mansa</p>
                  </div>

                  <form onSubmit={handleAgendar} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tipo de Atendimento</label>
                      <select
                        value={formAgendamento.tipo}
                        onChange={(e) => setFormAgendamento({ ...formAgendamento, tipo: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#005BAE]"
                      >
                        <option value="Consulta Médica">Consulta Médica</option>
                        <option value="Exame Laboratorial">Exame Laboratorial</option>
                        <option value="Vacinação">Vacinação</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Especialidade / Exame</label>
                        <select
                          value={formAgendamento.especialidade}
                          onChange={(e) => setFormAgendamento({ ...formAgendamento, especialidade: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#005BAE]"
                        >
                          <option value="Clínica Geral">Clínica Geral</option>
                          <option value="Pediatria">Pediatria</option>
                          <option value="Odontologia">Odontologia</option>
                          <option value="Hemograma Completo">Hemograma Completo</option>
                          <option value="Raio-X Toráxico">Raio-X Toráxico</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Data Pretendida</label>
                        <input
                          type="date"
                          value={formAgendamento.data}
                          onChange={(e) => setFormAgendamento({ ...formAgendamento, data: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#005BAE]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Posto / Unidade de Saúde</label>
                      <select
                        value={formAgendamento.unidade}
                        onChange={(e) => setFormAgendamento({ ...formAgendamento, unidade: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#005BAE]"
                      >
                        {postosBarraMansa.map((p, idx) => (
                          <option key={idx} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#28A745] hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm uppercase mt-4"
                    >
                      SOLICITAR AGENDAMENTO
                    </button>
                  </form>
                </div>
              )}

              {/* ABA 3: EXAMES */}
              {activeTabCidadao === 'exames' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Resultados e Laudos Digitais</h2>
                    <p className="text-xs text-slate-500 mt-1">Baixe os exames em PDF autenticados pela Prefeitura</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {exames.map((ex) => (
                      <div key={ex.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-slate-800">{ex.exame}</h4>
                          <p className="text-xs text-slate-500">{ex.local} • Realizado em {ex.data}</p>
                        </div>
                        <button
                          onClick={() => handleDownloadPDF(ex.exame, ex.local)}
                          className="px-4 py-2 bg-[#005BAE] hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                        >
                          <Download className="w-4 h-4" /> Baixar Laudo
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA 4: CHAT */}
              {activeTabCidadao === 'chat' && (
                <div className="max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[500px]">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
                    <h3 className="font-bold text-slate-800 text-sm">Canal Direto com o Posto de Saúde</h3>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {mensagens.map((m) => (
                      <div key={m.id} className={`flex ${m.remetente === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-3 rounded-xl text-sm ${
                          m.remetente === 'usuario' ? 'bg-[#005BAE] text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}>
                          {m.texto}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleEnviarMensagem} className="p-3 border-t border-slate-200 flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite sua mensagem..."
                      value={novaMensagem}
                      onChange={(e) => setNovaMensagem(e.target.value)}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#005BAE]"
                    />
                    <button type="submit" className="p-2.5 bg-[#005BAE] hover:bg-blue-700 text-white rounded-lg">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* 5. PAINEL DO POSTO DE SAÚDE */}
      {currentView === 'dashboard-posto' && (
        <div className="flex-1 bg-white text-slate-800 flex flex-col">
          <header className="bg-[#28A745] text-white px-8 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">
                Med<span className="text-white">Tech</span> Admin
              </span>
              <span className="text-xs border-l border-emerald-300 pl-2 text-emerald-100">
                {unidadeSelecionada}
              </span>
            </div>

            <button
              onClick={handleSair}
              className="text-xs hover:underline text-white font-medium"
            >
              Sair da Gestão
            </button>
          </header>

          <main className="flex-1 p-6 md:p-10 space-y-6 max-w-6xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Gestão de Vagas e Solicitações</h2>
              <p className="text-xs text-slate-500 mt-1">Aprove ou recuse os agendamentos da população de Barra Mansa</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {agendamentos.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
                  Nenhuma solicitação pendente no momento para esta unidade.
                </div>
              ) : (
                agendamentos.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">{item.tipo}</span>
                      <h4 className="text-base font-bold text-slate-800">{item.paciente} ({item.cpf})</h4>
                      <p className="text-xs text-slate-500">{item.especialidade} • Data: <strong>{item.data}</strong></p>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === 'Solicitado' ? (
                        <>
                          <button
                            onClick={() => handleAlterarStatusAgendamento(item.id, 'Confirmado')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Aprovar
                          </button>
                          <button
                            onClick={() => handleAlterarStatusAgendamento(item.id, 'Cancelado')}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-sm"
                          >
                            <XCircle className="w-4 h-4" /> Recusar
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          item.status === 'Confirmado' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}