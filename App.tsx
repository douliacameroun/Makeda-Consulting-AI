
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { geminiService } from './services/geminiService';
import { SimulationTool } from './components/SimulationTool';
import { ChatMessage } from './types';
import { MAKEDA_BRAND } from './constants';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  ShieldCheck, 
  TrendingUp, 
  GraduationCap, 
  Briefcase,
  Mail,
  MapPin,
  Phone,
  Zap,
  Activity,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

// Composant pour l'arrière-plan riche et texturé
const BackgroundEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 60;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      type: 'dot' | 'signal' | 'crystal' | 'data';

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4;
        const rand = Math.random();
        this.type = rand > 0.9 ? 'crystal' : (rand > 0.7 ? 'signal' : (rand > 0.5 ? 'data' : 'dot'));
      }

      update(width: number, height: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        if (this.type === 'crystal') {
          ctx.moveTo(this.x, this.y - this.size * 3);
          ctx.lineTo(this.x + this.size, this.y);
          ctx.lineTo(this.x, this.y + this.size * 3);
          ctx.lineTo(this.x - this.size, this.y);
          ctx.closePath();
          ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        } else if (this.type === 'data') {
          ctx.rect(this.x, this.y, this.size, this.size);
          ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity * 0.5})`;
        } else if (this.type === 'signal') {
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        } else {
          ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity * 0.3})`;
        }
        ctx.fill();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const drawGrid = (width: number, height: number) => {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawGrid(canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 0, 0, ${0.08 * (1 - distance / 180)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 50%, #f1f1f1 100%)' }}
      />
      {/* Texture grain subtile */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }

    const welcome = async () => {
      setIsTyping(true);
      const res = await geminiService.sendMessage("Bonjour, je suis une PME à Douala avec 5M de trésorerie. Accueil professionnel chaleureux.");
      setMessages([{ role: 'model', content: res, timestamp: new Date() }]);
      setIsTyping(false);
      
      if (!isMuted) {
        const audio = await geminiService.generateSpeech(res);
        if (audio) geminiService.playBase64Audio(audio);
      }
    };
    welcome();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const messageToSend = text || input;
    if (!messageToSend.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: messageToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await geminiService.sendMessage(messageToSend);
    setMessages(prev => [...prev, { role: 'model', content: response, timestamp: new Date() }]);
    setIsTyping(false);

    if (!isMuted) {
      const audio = await geminiService.generateSpeech(response);
      if (audio) geminiService.playBase64Audio(audio);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const toggleMute = () => {
    if (!isMuted) {
      geminiService.stopAudio();
    }
    setIsMuted(!isMuted);
  };

  // Rendu du texte avec support Markdown pour le gras uniquement (**)
  const renderMarkdown = (text: string) => {
    // On divise le texte par les occurrences de **texte**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // C'est un texte en gras
        return (
          <strong key={i} className="font-extrabold text-black">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const formatContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={idx} className="h-2"></div>;

      // Détection des listes numérotées
      const listMatch = trimmedLine.match(/^(\d+)\.\s(.*)/);
      if (listMatch) {
        return (
          <div key={idx} className="flex gap-3 my-4 items-start">
            <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-gray-100">
              {listMatch[1]}
            </span>
            <div className="flex-1 pt-1 text-gray-800 leading-relaxed font-medium">
              {renderMarkdown(listMatch[2])}
            </div>
          </div>
        );
      }

      // Paragraphe normal avec support Markdown
      return (
        <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
           {renderMarkdown(trimmedLine)}
        </p>
      );
    });
  };

  const productTabs = [
    { 
      icon: <TrendingUp size={24} />, 
      title: "Makeda Horizon", 
      desc: "6% Rendement Cible", 
      color: "bg-white/90 border border-gray-100",
      query: "Je souhaite en savoir plus sur l'investissement FCP Makeda Horizon. Quels sont les avantages pour ma trésorerie ?"
    },
    { 
      icon: <GraduationCap size={24} />, 
      title: "Education", 
      desc: "Avenir Garanti", 
      color: "bg-white/90 border border-gray-100",
      query: "Parlez-moi des solutions Makeda pour sécuriser la scolarité de mes enfants. Comment ça fonctionne ?"
    },
    { 
      icon: <Briefcase size={24} />, 
      title: "Mandat PME", 
      desc: "Gestion Active", 
      color: "bg-black text-white shadow-xl",
      query: "En tant que PME, comment la gestion sous mandat peut-elle optimiser mes fonds dormants ?"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden font-sans">
      <BackgroundEffects />
      
      {/* Colonne Simulation */}
      <div className="relative z-10 w-full lg:w-7/12 p-6 lg:p-12 overflow-y-auto max-h-screen bg-white/30 backdrop-blur-md border-r border-gray-200">
        <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <img src={MAKEDA_BRAND.logoUrl} alt="Logo" className="h-16 w-auto object-contain drop-shadow-sm" />
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase text-black">{MAKEDA_BRAND.logoText}</h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest opacity-70">{MAKEDA_BRAND.slogan}</p>
            </div>
          </div>
          <div className="flex flex-col items-end text-right">
             <div className="flex items-center gap-2 text-sm font-bold bg-black text-white px-5 py-2.5 rounded-full shadow-2xl hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                <Phone size={14} /> {MAKEDA_BRAND.contact}
             </div>
             <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1 uppercase font-black tracking-tighter">
               <Mail size={10} /> {MAKEDA_BRAND.email}
             </p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {productTabs.map((item, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(item.query)}
              className={`${item.color} p-6 rounded-2xl shadow-sm hover:translate-y-[-6px] transition-all duration-300 text-left group cursor-pointer focus:outline-none ring-offset-2 ring-black hover:ring-2`}
            >
              <div className="mb-4 opacity-80 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h4 className="text-sm font-black uppercase mb-1 tracking-tight">{item.title}</h4>
              <p className="text-xs opacity-60 font-semibold">{item.desc}</p>
              <div className="mt-4 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Explorer <Zap size={8} />
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-3 mb-12 border border-white">
          <SimulationTool />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="bg-white/60 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/80 transition-colors group">
                <div className="bg-black text-white p-3 rounded-xl group-hover:rotate-12 transition-transform"><Cpu size={20} /></div>
                <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Technologie IA</p>
                    <p className="text-xs font-bold text-black">Analyse Prédictive CEMAC</p>
                </div>
            </div>
            <div className="bg-white/60 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/80 transition-colors group">
                <div className="bg-black text-white p-3 rounded-xl group-hover:rotate-12 transition-transform"><Layers size={20} /></div>
                <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Sécurité</p>
                    <p className="text-xs font-bold text-black">Agrément COSUMAF</p>
                </div>
            </div>
        </div>

        <footer className="mt-auto pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-[10px] uppercase font-black tracking-widest">
           <div className="flex items-center gap-2"><MapPin size={12} className="text-black" /> {MAKEDA_BRAND.address}</div>
           <div className="flex items-center gap-2 italic"><Sparkles size={10} /> © 2024-2025 Makeda Asset Management</div>
        </footer>
      </div>

      {/* Colonne Chat Chatbot */}
      <div className="relative z-10 w-full lg:w-5/12 bg-white/70 backdrop-blur-2xl flex flex-col shadow-2xl h-[600px] lg:h-screen">
        <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <img src={MAKEDA_BRAND.logoUrl} className="w-12 h-12 rounded-full border-2 border-gray-100 bg-white p-1 object-contain shadow-lg group-hover:scale-110 transition-transform" />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h2 className="font-black text-sm uppercase tracking-tight text-black">Makeda Consulting IA</h2>
              <div className="flex items-center gap-1">
                <Activity size={10} className="text-green-500 animate-pulse" />
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Connecté • Temps Réel</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={toggleMute}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                 isMuted ? 'bg-gray-100 text-gray-400' : 'bg-black text-white shadow-lg shadow-gray-200'
               }`}
               title={isMuted ? "Activer la voix" : "Désactiver la voix"}
             >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
             </button>
             <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:text-black transition-colors cursor-help">
                <Zap size={14} />
             </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] transform transition-all duration-300 ${
                msg.role === 'user' 
                  ? 'bg-black text-white rounded-3xl rounded-tr-none px-6 py-4 shadow-2xl' 
                  : 'bg-white text-black rounded-3xl rounded-tl-none px-7 py-7 shadow-xl border border-gray-50'
              }`}>
                <div className="text-[13px] font-medium">
                  {msg.role === 'model' ? formatContent(msg.content) : msg.content}
                </div>
                <div className={`text-[9px] mt-4 font-black uppercase tracking-tighter opacity-40 ${msg.role === 'user' ? 'text-gray-200' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-50 p-5 rounded-3xl rounded-tl-none shadow-sm flex gap-2 items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white/90 backdrop-blur-md border-t border-gray-100">
          <div className="flex gap-3 bg-white p-2.5 rounded-3xl border border-gray-200 shadow-inner focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
            <button 
              onClick={toggleMic}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-100' : 'bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100'
              }`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Échangez avec votre conseiller IA..."
              className="flex-1 bg-transparent px-4 py-3 text-sm font-bold focus:outline-none placeholder:text-gray-300 text-black"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="bg-black text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-5"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[9px] text-center mt-4 text-gray-400 font-black uppercase tracking-widest flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-black" /> Makeda Intelligence Sécurisée • Propriété DOULIA
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
