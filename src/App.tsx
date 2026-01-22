// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { 
  Apple, Carrot, Plus, Trash2, Users, Lock, School, LogOut, Settings, 
  Star, Heart, Sun, Cloud, Flower, Music, Cat, Car, 
  ArrowLeft, Upload, Image as ImageIcon,
  Flag, LayoutGrid, Pencil, X, ExternalLink, Smile, Frown, Meh, Volume2
} from 'lucide-react';

// ==============================================================================
// ⚠️ ISTRUZIONI PER LA PUBBLICAZIONE (LEGGERE BENE)
// ==============================================================================
// Quando copierai questo codice su GitHub/VS Code per la versione finale:
// 1. Togli i due slash "//" davanti a "import { createClient }..." qui sotto.
// 2. Togli i due slash "//" davanti alle costanti SUPABASE_URL e SUPABASE_ANON_KEY con "import.meta..."
// 3. Metti i due slash "//" davanti alle versioni con le virgolette vuote "".
// ==============================================================================

// 1. SCOMMENTA QUESTA RIGA PER LA VERSIONE FINALE:
// import { createClient } from '@supabase/supabase-js';

// ==========================================
// 🚀 CONFIGURAZIONE SUPABASE
// ==========================================

// 2. SCOMMENTA QUESTE DUE RIGHE PER LA VERSIONE FINALE (Vercel):
// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 3. COMMENTA QUESTE DUE RIGHE PER LA VERSIONE FINALE (servono solo qui per l'anteprima):
const SUPABASE_URL = ""; 
const SUPABASE_ANON_KEY = "";

// --- MOCK CLIENT (PER L'ANTEPRIMA QUI O FALLBACK) ---
// Se le chiavi non ci sono (es. anteprima), usa questo finto database.
class MockSupabaseClient {
  constructor() {
    const classId = 'mock-class-id';
    this.data = { 
      classes: [{ id: classId, name: 'Classe Prova', password_sequence: ['apple', 'star', 'car'] }],
      students: [
        { id: '1', class_id: classId, name: 'Mario', avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Mario', total_points: 5, last_check_date: '' },
        { id: '2', class_id: classId, name: 'Lucia', avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Lucia', total_points: 8, last_check_date: '' }
      ]
    };
  }
  
  from(table) {
    return {
      select: () => Promise.resolve({ data: this.data[table] || [], error: null }),
      insert: (rows) => {
        const newRows = rows.map(r => ({ ...r, id: Math.random().toString(36).substr(2, 9) }));
        if(!this.data[table]) this.data[table] = [];
        this.data[table].push(...newRows);
        return Promise.resolve({ data: newRows, error: null });
      },
      update: (updates) => ({
        eq: (col, val) => {
          if(this.data[table]) {
            this.data[table] = this.data[table].map(r => r[col] === val ? { ...r, ...updates } : r);
          }
          return Promise.resolve({ data: [], error: null });
        }
      }),
      delete: () => ({
        eq: (col, val) => {
          if(this.data[table]) {
            this.data[table] = this.data[table].filter(r => r[col] !== val);
          }
          return Promise.resolve({ data: [], error: null });
        }
      })
    };
  }
  
  channel() { 
    const mockChannel = {
      on: () => mockChannel,
      subscribe: () => mockChannel,
      unsubscribe: () => {}
    };
    return mockChannel; 
  }
  
  removeChannel() {}
}

// Logica di selezione client:
let supabase;

try {
  // @ts-ignore
  if (typeof createClient !== 'undefined' && SUPABASE_URL && SUPABASE_ANON_KEY) {
    // @ts-ignore
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase collegato correttamente!");
  } else {
    throw new Error("Chiavi mancanti");
  }
} catch (e) {
  console.log("Modalità Demo/Mock attiva (Chiavi Supabase mancanti o libreria non trovata)");
  supabase = new MockSupabaseClient();
}

// ==========================================
// 🎨 ASSET E COSTANTI
// ==========================================

const PASSWORD_ICONS = [
  { id: 'apple', icon: Apple, label: 'Mela', color: 'text-red-500', bg: 'bg-red-100' },
  { id: 'star', icon: Star, label: 'Stella', color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { id: 'car', icon: Car, label: 'Auto', color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 'heart', icon: Heart, label: 'Cuore', color: 'text-pink-500', bg: 'bg-pink-100' },
  { id: 'sun', icon: Sun, label: 'Sole', color: 'text-orange-500', bg: 'bg-orange-100' },
  { id: 'cat', icon: Cat, label: 'Gatto', color: 'text-slate-600', bg: 'bg-slate-200' },
  { id: 'flower', icon: Flower, label: 'Fiore', color: 'text-purple-500', bg: 'bg-purple-100' },
  { id: 'cloud', icon: Cloud, label: 'Nuvola', color: 'text-sky-400', bg: 'bg-sky-100' },
  { id: 'music', icon: Music, label: 'Musica', color: 'text-indigo-500', bg: 'bg-indigo-100' },
];

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Bella',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Coco',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Jack',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Milo',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sasha',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Leo',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Lola',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Zoey',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophie',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Max',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna',
];

// --- Audio System ---
const playSound = (type) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const now = ctx.currentTime;

  const createOsc = (type, freq, start, dur, vol) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.01, start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur);
  };

  if (type === 'yes') {
    createOsc('sine', 523.25, now, 0.1, 0.2); 
    createOsc('sine', 659.25, now + 0.1, 0.1, 0.2);
    createOsc('triangle', 1046.50, now + 0.2, 0.8, 0.3);
  } else if (type === 'no') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.5);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  } else {
    createOsc('square', 150, now, 0.15, 0.1);
  }
};

// --- Componenti SVG Cartoon ---
const HappyFace = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`}>
    <circle cx="50" cy="50" r="45" fill="#4ade80" stroke="#166534" strokeWidth="4" className="drop-shadow-lg" />
    <circle cx="50" cy="45" r="35" fill="white" opacity="0.2" />
    <ellipse cx="35" cy="40" rx="6" ry="8" fill="#166534" />
    <ellipse cx="65" cy="40" rx="6" ry="8" fill="#166534" />
    <path d="M 25 60 Q 50 85 75 60" stroke="#166534" strokeWidth="5" fill="none" strokeLinecap="round" />
  </svg>
);

const SadFace = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`}>
    <circle cx="50" cy="50" r="45" fill="#f87171" stroke="#991b1b" strokeWidth="4" className="drop-shadow-lg" />
    <path d="M 25 35 L 40 42" stroke="#991b1b" strokeWidth="4" strokeLinecap="round" />
    <path d="M 75 35 L 60 42" stroke="#991b1b" strokeWidth="4" strokeLinecap="round" />
    <circle cx="35" cy="50" r="6" fill="#991b1b" />
    <circle cx="65" cy="50" r="6" fill="#991b1b" />
    <path d="M 30 75 Q 50 55 70 75" stroke="#991b1b" strokeWidth="5" fill="none" strokeLinecap="round" />
  </svg>
);

const AbsentFace = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`}>
    <circle cx="50" cy="50" r="45" fill="#94a3b8" stroke="#475569" strokeWidth="4" className="drop-shadow-lg" />
    <path d="M 28 45 L 42 45" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
    <path d="M 58 45 L 72 45" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
    <line x1="35" y1="70" x2="65" y2="70" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
    <text x="75" y="30" fontSize="20" fill="#475569" fontWeight="bold" className="animate-pulse">Z</text>
  </svg>
);

const AvatarDisplay = ({ src, size = 100 }) => {
  const isUrl = src && (src.startsWith('http') || src.startsWith('data:'));
  return (
    <div 
      className="rounded-full bg-white border-4 border-slate-800 shadow-[0_4px_0_rgba(0,0,0,0.2)] overflow-hidden relative"
      style={{ width: size, height: size }}
    >
      {isUrl ? <img src={src} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-yellow-200 text-4xl">{src || '👤'}</div>}
    </div>
  );
};

const PasswordIcon = ({ id, size = 32 }) => {
  const item = PASSWORD_ICONS.find(i => i.id === id);
  if (!item) return null;
  const Icon = item.icon;
  return <Icon size={size} className={item.color} fill="currentColor" fillOpacity={0.2} />;
};

// ==========================================
// 📱 APP PRINCIPALE
// ==========================================

export default function App() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('landing');
  const [currentClass, setCurrentClass] = useState(null);
  
  // Stati UI
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherError, setTeacherError] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [newClassPassword, setNewClassPassword] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const fileInputRef = useRef(null);
  
  // Stati Runner
  const [selectedDay, setSelectedDay] = useState(null);
  const [runnerIndex, setRunnerIndex] = useState(0);
  const [graphicPasswordInput, setGraphicPasswordInput] = useState([]);
  const [loginError, setLoginError] = useState(false);

  // --- FETCH DATI INIZIALI ---
  useEffect(() => {
    // Controllo speciale per link maestra (es. miosito.com/?p=maestra)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('p') === 'maestra') {
      setView('teacher-auth');
    }

    const initData = async () => {
      if (supabase && typeof supabase.from === 'function') {
        fetchData();
        // Setup Realtime Subscription
        if (typeof supabase.channel === 'function') {
          const channel = supabase.channel('db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, fetchData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, fetchData)
            .subscribe();
          return () => { supabase.removeChannel(channel); };
        }
      } else {
        setLoading(false); // Sblocco se supabase non c'è
      }
    };
    
    initData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: classesData } = await supabase.from('classes').select('*');
      const { data: studentsData } = await supabase.from('students').select('*');
      
      if (classesData) setClasses(classesData.sort((a, b) => a.name.localeCompare(b.name)));
      if (studentsData) setStudents(studentsData);
    } catch(e) { console.error("Errore fetch:", e); }
    setLoading(false);
  };

  // --- MAESTRA ACTIONS ---
  const handleTeacherLogin = (e) => {
    e.preventDefault();
    if (teacherPassword === '1234') {
      setView('teacher-classes-list');
      setTeacherError('');
      setTeacherPassword('');
    } else {
      setTeacherError('Password errata');
    }
  };

  const createClass = async () => {
    const trimmedName = newClassName.trim();
    if (!trimmedName || newClassPassword.length !== 3) {
      alert("Nome classe e password (3 icone) obbligatori!");
      return;
    }
    await supabase.from('classes').insert([{ 
      name: trimmedName, 
      password_sequence: newClassPassword 
    }]);
    setNewClassName('');
    setNewClassPassword([]);
    fetchData(); 
  };

  const deleteClass = async (classId) => {
    if (!confirm("Sicura di voler eliminare la classe?")) return;
    await supabase.from('classes').delete().eq('id', classId);
    fetchData();
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!newStudentName.trim() || !currentClass) return;

    if (editingStudentId) {
      await supabase.from('students').update({
        name: newStudentName.trim(),
        avatar: selectedAvatar
      }).eq('id', editingStudentId);
      setEditingStudentId(null);
    } else {
      await supabase.from('students').insert([{
        name: newStudentName.trim(),
        class_id: currentClass.id,
        avatar: selectedAvatar,
        total_points: 0,
        last_check_date: ''
      }]);
    }
    setNewStudentName('');
    setSelectedAvatar(AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)]);
    fetchData();
  };

  const removeStudent = async (id) => {
    if (!confirm("Rimuovere studente?")) return;
    await supabase.from('students').delete().eq('id', id);
    fetchData();
  };

  // --- STUDENTE ACTIONS ---
  const handleIconClick = (iconId) => {
    if (graphicPasswordInput.length >= 3) return;
    const newInput = [...graphicPasswordInput, iconId];
    setGraphicPasswordInput(newInput);

    if (newInput.length === 3) {
      if (currentClass && JSON.stringify(newInput) === JSON.stringify(currentClass.password_sequence)) {
        setView('student-day-select');
      } else {
        setLoginError(true);
        setTimeout(() => {
          setGraphicPasswordInput([]);
          setLoginError(false);
        }, 1000);
      }
    }
  };

  const handleVote = async (type) => {
    playSound(type);
    
    const classStudents = students
      .filter(s => s.class_id === currentClass?.id)
      .sort((a,b) => a.name.localeCompare(b.name));
      
    const currentStudent = classStudents[runnerIndex];
    if (!currentStudent) return;

    if (type === 'yes') {
      const today = new Date().toISOString().split('T')[0];
      const updatedPoints = (currentStudent.total_points || 0) + 1;
      
      await supabase.from('students').update({
        total_points: updatedPoints,
        last_check_date: today
      }).eq('id', currentStudent.id);
      
      setStudents(prev => prev.map(s => s.id === currentStudent.id ? {...s, total_points: updatedPoints} : s));
    }

    if (runnerIndex < classStudents.length - 1) {
      setRunnerIndex(prev => prev + 1);
    } else {
      setView('summary');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 200000) { alert("File troppo grande!"); return; }
        const reader = new FileReader();
        reader.onloadend = () => setSelectedAvatar(reader.result);
        reader.readAsDataURL(file);
    }
  };

  // --- RENDER ---
  if (loading) return <div className="flex h-screen items-center justify-center font-black text-4xl text-yellow-500 animate-bounce">Caricamento... 🍌</div>;

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#F0F8FF] flex flex-col items-center justify-center p-6 gap-8 font-sans bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] relative">
        {/* Pulsante Segreto Maestra */}
        <button 
          onClick={() => setView('teacher-auth')} 
          className="absolute top-4 right-4 text-slate-200 hover:text-slate-400 p-2"
          title="Area Maestra (Segreta)"
        >
          <Lock size={20} />
        </button>

        <div className="bg-yellow-400 p-8 rounded-[3rem] shadow-[0_15px_0_rgba(0,0,0,0.1)] rotate-[-2deg] mb-8 border-4 border-slate-900">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 text-center tracking-tight leading-none">
            Merenda<br/>
            <span className="text-white text-6xl md:text-8xl drop-shadow-[4px_4px_0_#000] stroke-black" style={{WebkitTextStroke: "3px black"}}>CHALLENGE</span>
            </h1>
        </div>
        
        <div className="w-full max-w-md">
          <button 
            onClick={() => setView('student-class-list')}
            className="w-full group bg-white border-4 border-slate-900 rounded-[2rem] p-8 flex flex-col items-center gap-4 shadow-[8px_8px_0_#3b82f6] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
          >
            <div className="bg-blue-100 p-6 rounded-full border-4 border-slate-900 group-hover:bg-blue-200 transition-colors">
              <Users size={64} className="text-blue-600" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 uppercase">Siamo la Classe</h2>
              <p className="text-slate-500 font-bold">Entra nel gioco! 🚀</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (view === 'teacher-auth') {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-[10px_10px_0_rgba(0,0,0,0.2)] w-full max-w-md text-center border-4 border-slate-900 relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-2 rounded-full font-bold border-4 border-white">SOLO MAESTRE</div>
          <form onSubmit={handleTeacherLogin}>
            <input type="password" placeholder="Password (1234)" value={teacherPassword} onChange={e => setTeacherPassword(e.target.value)} className="w-full text-center text-3xl p-4 rounded-xl border-4 border-slate-300 focus:border-slate-900 focus:outline-none mb-6 font-mono font-bold bg-slate-50" autoFocus />
            {teacherError && <p className="text-white bg-red-500 font-bold mb-4 p-2 rounded-lg border-2 border-slate-900">{teacherError}</p>}
            <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xl hover:bg-slate-800 shadow-lg uppercase tracking-wider">Apri Registro</button>
          </form>
          <button onClick={() => setView('landing')} className="mt-6 text-slate-400 hover:text-slate-900 font-bold underline">Torna Indietro</button>
        </div>
      </div>
    );
  }

  if (view === 'teacher-classes-list') {
    return (
      <div className="min-h-screen bg-sky-100 p-6 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-[4px_4px_0_rgba(0,0,0,0.1)] border-4 border-slate-900">
            <h1 className="text-3xl font-black text-slate-900 ml-2 uppercase">Le mie Classi 📚</h1>
            <button onClick={() => setView('landing')} className="flex items-center gap-2 text-red-500 hover:bg-red-50 font-bold px-4 py-2 rounded-xl border-2 border-transparent hover:border-red-200"><LogOut size={20} /> Esci</button>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-[8px_8px_0_rgba(0,0,0,0.1)] border-4 border-slate-900 mb-8 relative overflow-hidden">
            <h3 className="font-black text-2xl mb-6 flex items-center gap-3 text-slate-800 relative z-10"><Plus className="text-green-500 stroke-[4px]" /> NUOVA CLASSE</h3>
            <div className="space-y-6 relative z-10">
              <input placeholder="Nome Classe (es. 1ª A)" value={newClassName} onChange={e => setNewClassName(e.target.value)} className="w-full p-4 border-4 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-xl font-bold" />
              <div className="bg-slate-50 p-6 rounded-2xl border-4 border-dashed border-slate-300">
                <p className="text-sm font-black text-slate-400 mb-4 uppercase tracking-wide">Scegli 3 icone segrete:</p>
                <div className="flex gap-3 flex-wrap justify-center">
                  {PASSWORD_ICONS.map(item => (
                    <button key={item.id} onClick={() => { if(newClassPassword.includes(item.id)) setNewClassPassword(newClassPassword.filter(id => id !== item.id)); else if(newClassPassword.length < 3) setNewClassPassword([...newClassPassword, item.id]); }} className={`p-4 rounded-2xl border-4 transition-all ${newClassPassword.includes(item.id) ? 'border-slate-900 bg-white shadow-[4px_4px_0_#000] -translate-y-1' : 'border-transparent bg-white hover:bg-slate-100'}`}>
                      <item.icon className={item.color} size={32} strokeWidth={2.5} />
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={createClass} className="w-full bg-green-500 text-white py-4 rounded-xl font-black text-xl hover:bg-green-600 shadow-[0_6px_0_#15803d] active:translate-y-[6px] active:shadow-none transition-all border-b-0 border-green-700">CREA CLASSE</button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {classes.map((cls, idx) => (
              <div key={cls.id} className="bg-white p-6 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0_rgba(0,0,0,1)] flex justify-between items-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 ${['bg-pink-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400'][idx % 4]}`}></div>
                <div className="z-10">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">{cls.name}</h2>
                  <div className="flex gap-2 mt-2 bg-slate-100 p-2 rounded-xl inline-flex border-2 border-slate-200">
                    {cls.password_sequence?.map(iconId => <PasswordIcon key={iconId} id={iconId} size={24} />)}
                  </div>
                </div>
                <div className="flex flex-col gap-2 z-10">
                  <button onClick={() => { setCurrentClass(cls); setView('teacher-class-manage'); setSelectedAvatar(AVATAR_PRESETS[0]); }} className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 border-2 border-blue-200 font-bold"><Settings size={24} /></button>
                  <button onClick={() => deleteClass(cls.id)} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 border-2 border-red-200 font-bold"><Trash2 size={24} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'teacher-class-manage') {
    const classStudents = students.filter(s => s.class_id === currentClass?.id);
    return (
      <div className="min-h-screen bg-violet-100 p-6 font-sans">
        <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-[8px_8px_0_rgba(0,0,0,0.15)] border-4 border-slate-900 overflow-hidden">
          <div className="bg-slate-900 p-6 flex justify-between items-center text-white border-b-4 border-slate-900">
            <div className="flex items-center gap-4"><button onClick={() => setView('teacher-classes-list')} className="p-2 hover:bg-slate-700 rounded-lg"><ArrowLeft size={28} /></button><h1 className="text-3xl font-black uppercase">Classe {currentClass?.name}</h1></div>
          </div>
          <div className="p-8">
            <div className={`bg-white p-6 rounded-3xl mb-8 border-4 ${editingStudentId ? 'border-blue-400 bg-blue-50' : 'border-dashed border-slate-300'}`}>
              <h3 className="font-black uppercase mb-6 flex items-center gap-2 text-xl">{editingStudentId ? <><Pencil size={24}/> Modifica</> : <><LayoutGrid size={24}/> Aggiungi</>}</h3>
              <div className="mb-6">
                <div className="flex flex-wrap gap-4 mb-4 max-h-48 overflow-y-auto p-4 bg-slate-50 rounded-2xl border-2 border-slate-200">
                  {AVATAR_PRESETS.map((src, idx) => (
                    <button key={idx} onClick={() => setSelectedAvatar(src)} className={`rounded-full transition-all ${selectedAvatar === src ? 'ring-4 ring-blue-500 scale-110' : 'opacity-80'}`}><AvatarDisplay src={src} size={60} /></button>
                  ))}
                </div>
                <div className="border-t-2 border-slate-100 pt-4 flex items-center justify-between">
                   <div className="flex items-center gap-2"><button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-slate-300 font-bold text-sm"><Upload size={16} /> Carica...</button><input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} /></div>
                   <a href="https://www.creaavatar.it/" target="_blank" className="text-blue-500 font-bold hover:underline flex items-center gap-2 text-sm"><ExternalLink size={14} /> Crea avatar</a>
                </div>
              </div>
              <form onSubmit={handleStudentSubmit} className="flex flex-col md:flex-row gap-6 items-center bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm">
                 <div className="flex-shrink-0 animate-bounce-slow"><AvatarDisplay src={selectedAvatar} size={100} /></div>
                 <div className="flex-1 flex gap-2 w-full">
                    <input type="text" placeholder="Nome alunno..." value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} className="flex-1 p-4 rounded-xl border-4 border-slate-200 focus:border-slate-900 outline-none text-xl font-bold" />
                    {editingStudentId ? (
                        <>
                            <button type="button" onClick={() => { setEditingStudentId(null); setNewStudentName(''); }} className="bg-slate-200 text-slate-500 px-4 rounded-xl border-b-4 border-slate-300 active:border-b-0 active:translate-y-1"><X size={28} /></button>
                            <button type="submit" className="bg-blue-500 text-white px-6 rounded-xl font-bold border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 flex items-center gap-2"><Pencil size={24} /> Salva</button>
                        </>
                    ) : <button type="submit" className="bg-green-500 text-white px-6 rounded-xl font-bold border-b-4 border-green-700 active:border-b-0 active:translate-y-1 flex items-center gap-2"><Plus size={28} /> Aggiungi</button>}
                </div>
              </form>
            </div>
            <div className="bg-slate-50 rounded-2xl border-4 border-slate-200 p-4 max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <tbody>
                  {classStudents.map(s => (
                    <tr key={s.id} className="group bg-white hover:bg-yellow-50 shadow-sm rounded-xl transition-all">
                      <td className="py-3 pl-4 rounded-l-xl border-y border-l border-slate-100"><AvatarDisplay src={s.avatar} size={50} /></td>
                      <td className="py-3 pl-2 font-bold text-xl text-slate-800 border-y border-slate-100">{s.name}</td>
                      <td className="py-3 text-right pr-4 rounded-r-xl border-y border-r border-slate-100">
                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100">
                            <button onClick={() => { setNewStudentName(s.name); setSelectedAvatar(s.avatar); setEditingStudentId(s.id); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-blue-500 bg-blue-50 p-2 rounded-lg"><Pencil size={20} /></button>
                            <button onClick={() => removeStudent(s.id)} className="text-red-500 bg-red-50 p-2 rounded-lg"><Trash2 size={20} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'student-class-list') {
    return (
      <div className="min-h-screen bg-indigo-500 p-6 flex flex-col items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="w-full max-w-4xl relative mb-12 mt-8 text-center">
          <button onClick={() => setView('landing')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-white font-black bg-indigo-700 hover:bg-indigo-800 px-6 py-3 rounded-2xl border-2 border-indigo-400">← INDIETRO</button>
          <h1 className="text-5xl font-black text-white drop-shadow-[4px_4px_0_#000] stroke-black px-4">TROVA LA TUA CLASSE</h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {classes.map((cls, idx) => (
            <button key={cls.id} onClick={() => { setCurrentClass(cls); setGraphicPasswordInput([]); setLoginError(false); setView('student-login-graphic'); }} className={`${['bg-pink-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400'][idx%4]} border-4 border-slate-900 p-8 rounded-[2.5rem] shadow-[10px_10px_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[5px_5px_0_rgba(0,0,0,1)] transition-all text-center group relative overflow-hidden`}>
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-900 shadow-sm group-hover:scale-110 transition-transform"><School size={48} className="text-slate-900" /></div>
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{cls.name}</h2>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'student-login-graphic') {
    return (
      <div className="min-h-screen bg-yellow-400 flex flex-col items-center justify-center p-6">
         <button onClick={() => setView('student-class-list')} className="absolute top-6 left-6 text-slate-900 font-bold bg-white px-6 py-3 rounded-2xl shadow-[4px_4px_0_#000] border-2 border-black hover:translate-y-1 hover:shadow-none transition-all">← CAMBIA CLASSE</button>
         <div className="bg-white p-10 rounded-[3rem] shadow-[15px_15px_0_rgba(0,0,0,1)] w-full max-w-3xl text-center border-4 border-slate-900">
            <h2 className="text-5xl font-black text-slate-900 mb-2 uppercase">{currentClass?.name}</h2>
            <p className="text-slate-500 mb-10 text-2xl font-bold">Qual è la password segreta? 🕵️</p>
            <div className={`flex justify-center gap-6 mb-12 h-28 items-center transition-all ${loginError ? 'animate-shake' : ''}`}>
               {[0, 1, 2].map(idx => (<div key={idx} className="w-28 h-28 rounded-[2rem] bg-slate-100 flex items-center justify-center border-4 border-slate-300 shadow-inner">{graphicPasswordInput[idx] && <PasswordIcon id={graphicPasswordInput[idx]} size={64} />}</div>))}
            </div>
            <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto p-4">
              {PASSWORD_ICONS.map(item => (
                <button key={item.id} onClick={() => handleIconClick(item.id)} className={`bg-white hover:bg-slate-50 border-4 border-slate-200 hover:border-slate-400 p-4 rounded-3xl flex flex-col items-center justify-center transition-all h-32 w-full group shadow-[0_6px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[6px] active:border-slate-300`}>
                  <item.icon className={`${item.color} transform group-hover:scale-125 transition-transform duration-300`} size={56} strokeWidth={2.5} />
                </button>
              ))}
            </div>
         </div>
      </div>
    );
  }

  if (view === 'student-day-select') {
    return (
      <div className="min-h-screen bg-teal-400 flex flex-col items-center justify-center p-6 gap-8 font-sans">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 text-center drop-shadow-[5px_5px_0_#000]">{currentClass?.name}: Che giorno è? 📅</h1>
        <div className="flex flex-col md:flex-row gap-12 w-full max-w-6xl justify-center px-4">
          <button onClick={() => { setSelectedDay('tuesday'); setRunnerIndex(0); setView('student-runner'); }} className="flex-1 bg-red-500 border-4 border-slate-900 rounded-[3rem] p-16 flex flex-col items-center gap-8 transition-all hover:-translate-y-4 hover:shadow-[15px_15px_0_rgba(0,0,0,0.5)] shadow-[8px_8px_0_rgba(0,0,0,0.3)] group relative overflow-hidden">
            <div className="bg-white p-10 rounded-full shadow-[0_10px_0_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-300 border-4 border-red-200"><Apple size={120} className="text-red-500 fill-current" /></div>
            <div className="text-center z-10"><span className="block text-5xl font-black text-white mb-2 tracking-wide drop-shadow-md">MARTEDÌ</span><span className="bg-red-800 text-white px-6 py-2 rounded-full font-bold text-xl uppercase tracking-widest shadow-inner inline-block">Giorno Frutta</span></div>
          </button>
          <button onClick={() => { setSelectedDay('thursday'); setRunnerIndex(0); setView('student-runner'); }} className="flex-1 bg-orange-500 border-4 border-slate-900 rounded-[3rem] p-16 flex flex-col items-center gap-8 transition-all hover:-translate-y-4 hover:shadow-[15px_15px_0_rgba(0,0,0,0.5)] shadow-[8px_8px_0_rgba(0,0,0,0.3)] group relative overflow-hidden">
            <div className="bg-white p-10 rounded-full shadow-[0_10px_0_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-300 border-4 border-orange-200"><Carrot size={120} className="text-orange-500 fill-current" /></div>
            <div className="text-center z-10"><span className="block text-5xl font-black text-white mb-2 tracking-wide drop-shadow-md">GIOVEDÌ</span><span className="bg-orange-800 text-white px-6 py-2 rounded-full font-bold text-xl uppercase tracking-widest shadow-inner inline-block">Merenda Sana</span></div>
          </button>
        </div>
      </div>
    );
  }

  if (view === 'student-runner') {
    const classStudents = students.filter(s => s.class_id === currentClass?.id).sort((a,b) => a.name.localeCompare(b.name));
    const currentStudent = classStudents[runnerIndex];
    if (!currentStudent) return <div className="flex h-screen items-center justify-center font-bold text-2xl">Caricamento studente...</div>;

    const isTuesday = selectedDay === 'tuesday';
    return (
      <div className={`min-h-screen ${isTuesday ? 'bg-red-400' : 'bg-orange-400'} flex flex-col items-center justify-center p-6 font-sans select-none relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2.5px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute top-8 left-8 right-8 h-8 bg-black/20 rounded-full border-4 border-black/10 overflow-hidden"><div className="h-full transition-all duration-500 ease-out bg-white rounded-full" style={{ width: `${((runnerIndex) / classStudents.length) * 100}%` }} /></div>
        <div className="text-center mb-8 animate-fade-in relative z-10 w-full max-w-4xl bg-white/90 backdrop-blur-sm p-12 rounded-[3rem] border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2"><div className="transition-transform duration-300 hover:scale-110 cursor-pointer drop-shadow-2xl"><AvatarDisplay src={currentStudent.avatar} size={180} /></div></div>
          <div className="mt-24">
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-4 tracking-tighter leading-none">{currentStudent.name}</h1>
            <p className={`text-2xl md:text-4xl font-black ${isTuesday ? 'text-red-600' : 'text-orange-600'} uppercase tracking-wide`}>Hai portato {isTuesday ? 'la Frutta? 🍎' : 'la Merenda Sana? 🥕'}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 w-full max-w-5xl relative z-10">
          <button onClick={() => handleVote('yes')} className="bg-green-500 text-white rounded-[2rem] border-b-[12px] border-green-700 active:border-b-0 active:translate-y-[12px] transition-all flex flex-col items-center justify-center gap-2 group p-6 h-64 hover:bg-green-400">
            <HappyFace className="w-32 h-32 animate-bounce" /><span className="text-5xl font-black uppercase tracking-widest drop-shadow-md">Sì!</span>
          </button>
          <button onClick={() => handleVote('no')} className="bg-red-500 text-white rounded-[2rem] border-b-[12px] border-red-700 active:border-b-0 active:translate-y-[12px] transition-all flex flex-col items-center justify-center gap-2 group p-6 h-64 hover:bg-red-400">
            <SadFace className="w-32 h-32 hover:animate-pulse" /><span className="text-5xl font-black uppercase tracking-widest drop-shadow-md">No...</span>
          </button>
           <button onClick={() => handleVote('absent')} className="bg-slate-500 text-white rounded-[2rem] border-b-[12px] border-slate-700 active:border-b-0 active:translate-y-[12px] transition-all flex flex-col items-center justify-center gap-2 group p-6 h-64 hover:bg-slate-400">
            <AbsentFace className="w-32 h-32" /><span className="text-4xl font-black uppercase tracking-widest drop-shadow-md">Assente</span>
          </button>
        </div>
      </div>
    );
  }

  if (view === 'summary') {
    const classStudents = students.filter(s => s.class_id === currentClass?.id).sort((a, b) => a.name.localeCompare(b.name));
    const maxScore = Math.max(...classStudents.map(s => s.total_points || 0), 10);
    return (
      <div className="min-h-screen bg-green-400 flex flex-col p-6 font-sans">
        <div className="max-w-6xl mx-auto w-full mb-6 flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-[8px_8px_0_rgba(0,0,0,0.2)] border-4 border-slate-900">
            <div><h1 className="text-4xl font-black text-slate-900 flex items-center gap-4 italic tracking-tighter"><Flag className="text-green-600 fill-current" size={48} strokeWidth={3} /> GRAN PREMIO MERENDA</h1></div>
            <button onClick={() => setView('landing')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:scale-105 border-b-4 border-black active:border-b-0 active:translate-y-1">TORNA ALLA HOME</button>
        </div>
        <div className="max-w-6xl mx-auto w-full bg-[#f8fafc] rounded-[2.5rem] shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] border-8 border-slate-900 flex-1 p-8 overflow-y-auto custom-scrollbar relative">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }}></div>
            <div className="flex flex-col gap-4 relative z-10">
                {classStudents.map((student, idx) => {
                    const points = student.total_points || 0;
                    const percentage = Math.min((points / maxScore) * 100, 100);
                    const laneColor = idx % 2 === 0 ? 'bg-red-100 border-red-200' : 'bg-white border-slate-200';
                    return (
                        <div key={student.id} className="flex items-center gap-4 group">
                            <div className="w-48 font-black text-xl text-slate-700 truncate text-right uppercase tracking-tight">{student.name}</div>
                            <div className={`flex-1 relative h-24 ${laneColor} rounded-2xl border-4 overflow-visible shadow-sm`}>
                                <div className="absolute top-1/2 left-0 w-full h-0 border-t-4 border-dashed border-slate-300 opacity-60 transform -translate-y-1/2"></div>
                                <div className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-out flex flex-col items-center z-10" style={{ left: `calc(${percentage}% - 35px)` }}>
                                    <div className="drop-shadow-xl animate-bounce-slow cursor-default select-none transform hover:scale-125 transition-transform z-20"><AvatarDisplay src={student.avatar} size={70} /></div>
                                    <div className="absolute -bottom-3 z-30 bg-yellow-400 text-slate-900 border-2 border-slate-900 px-3 py-0.5 rounded-full shadow-sm font-black text-sm">{points}</div>
                                </div>
                            </div>
                            <div className="w-12 flex justify-center opacity-40 text-slate-900"><Flag size={40} fill="currentColor" /></div>
                        </div>
                    )
                })}
            </div>
        </div>
      </div>
    );
  }

  return <div>Errore stato sconosciuto</div>;
}
