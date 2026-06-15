import { useState, useEffect } from "react";
import { ShoppingCart, User, Lock, Eye, EyeOff, Mail, Loader2, ChevronRight, Menu, X, Globe, Trash2, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

const translations = {
  fr: {
    "nav.home": "Accueil",
    "nav.services": "Services",
    "nav.contact": "Contact",
    "nav.client": "Espace Client",
    "hero.badge": "AGENCE CRÉATIVE FULL-SERVICE",
    "hero.title": "Grow Faster. Create Smarter.",
    "hero.desc": "Solutions créatives sur mesure.",
    "hero.btn": "Démarrer",
    "services.main_title": "Nos Services Premium",
    "serviceCard.addToCart": "Ajouter au Panier",
    "cart.browseServices": "Parcourir les services",
    "cart.continueShopping": "Continuer les achats",
    "service.1.title": "Création de contenu UGC",
    "service.1.price": "À partir de 5 000 MAD",
    "service.1.f1": "Vidéos originales",
    "service.1.f2": "Stratégie de contenu",
    login_title: "Connexion",
    signup_title: "Créer un compte",
    login_welcome: "WELCOME BACK!",
    login_welcome_desc: "Accédez à votre dashboard.",
    signup_welcome: "GET STARTED",
    signup_welcome_desc: "Rejoignez-nous en quelques secondes.",
    login_email: "Adresse Email",
    login_pass: "Mot de passe",
    login_name: "Nom Complet",
    login_remember: "Se souvenir de moi",
    login_forgot: "Mot de passe oublié ?",
    login_btn: "Se connecter",
    signup_btn: "S'inscrire",
    login_switch: "Pas de compte ? S'inscrire",
    signup_switch: "Déjà un compte ? Se connecter"
  },
  en: {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.contact": "Contact",
    "nav.client": "Client Space",
    "hero.badge": "FULL-SERVICE AGENCY",
    "hero.title": "Grow Faster. Create Smarter.",
    "hero.desc": "Custom creative solutions.",
    "hero.btn": "Start Project",
    "services.main_title": "Our Premium Services",
    "serviceCard.addToCart": "Add to Cart",
    "cart.browseServices": "Browse Services",
    "cart.continueShopping": "Continue Shopping",
    "service.1.title": "UGC Content Creation",
    "service.1.price": "From 5,000 MAD",
    "service.1.f1": "Original videos",
    "service.1.f2": "Content strategy",
    login_title: "Sign In",
    signup_title: "Create Account",
    login_welcome: "WELCOME BACK!",
    login_welcome_desc: "Access your dashboard.",
    signup_welcome: "GET STARTED",
    signup_welcome_desc: "Join us in seconds.",
    login_email: "Email Address",
    login_pass: "Password",
    login_name: "Full Name",
    login_remember: "Remember me",
    login_forgot: "Forgot password?",
    login_btn: "Login",
    signup_btn: "Sign Up",
    login_switch: "Don't have an account? Sign Up",
    signup_switch: "Already have an account? Login"
  }
};

const langOptions = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

const servicesData = [
  {
    id: "service_1",
    titleKey: "service.1.title",
    priceKey: "service.1.price",
    features: ["service.1.f1", "service.1.f2"],
    iconBg: "bg-indigo-100"
  }
];

const defaultCartItems = [
  { id: "service_1", titleKey: "service.1.title", priceKey: "service.1.price", qty: 1 }
];

export default function GrowstackApp() {
  const [lang, setLang] = useState("fr");
  const [view, setView] = useState("home");
  const [navOpen, setNavOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState(defaultCartItems);

  const translate = (key) => {
    if (translations[lang]?.[key] && typeof translations[lang][key] === "string") {
      return translations[lang][key];
    }
    const parts = key.split(".");
    let current = translations[lang];
    for (const part of parts) {
      if (current && typeof current === "object") {
        current = current[part];
      } else {
        current = null;
        break;
      }
    }
    return typeof current === "string" ? current : key;
  };

  useEffect(() => {
    document.documentElement.dir = "ltr";
  }, []);

  const switchLang = (code) => {
    setLang(code);
    setLangOpen(false);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (serviceId) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === serviceId);
      if (existing) {
        return prev.map((item) => item.id === serviceId ? { ...item, qty: item.qty + 1 } : item);
      }
      const svc = servicesData.find((s) => s.id === serviceId);
      if (!svc) return prev;
      return [...prev, { id: svc.id, titleKey: svc.titleKey, priceKey: svc.priceKey, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item).filter((item) => item.qty > 0)
    );
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const raw = translate(item.priceKey).replace(/[^0-9]/g, "");
    return sum + (parseInt(raw, 10) || 0) * item.qty;
  }, 0);

  const resetForm = () => {
    setError("");
    setPassword("");
    setName("");
    setEmail("");
  };

  const toggleAuth = () => {
    setIsSignUp((p) => !p);
    resetForm();
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError(translate("login_btn"));
      return;
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const loginClip = isSignUp
    ? "polygon(0% 0%, 92% 0%, 100% 100%, 0% 100%)"
    : "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)";

  const formClip = isSignUp
    ? "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)"
    : "polygon(0% 0%, 92% 0%, 100% 100%, 0% 100%)";

  const navTabs = [
    { key: "nav.home", action: () => { setView("home"); setNavOpen(false); } },
    { key: "nav.services", action: () => setNavOpen(false) },
    { key: "nav.contact", action: () => setNavOpen(false) },
    { key: "nav.client", action: () => { setView("login"); setNavOpen(false); setIsSignUp(false); resetForm(); } }
  ];

  const sharedNav = (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button onClick={() => setView("home")} className="text-2xl font-bold tracking-tight text-slate-900">
            growstack<span className="text-slate-400">.</span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            {navTabs.map((tab) => (
              <button key={tab.key} onClick={tab.action} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {translate(tab.key)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                <Globe size={14} />
                {langOptions.find((l) => l.code === lang)?.label}
              </button>
              {langOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white border border-slate-200 rounded-xl shadow-md py-1 z-50 min-w-[100px]">
                  {langOptions.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => switchLang(opt.code)}
                      className={`block w-full text-left px-4 py-2 text-xs font-semibold transition-colors ${lang === opt.code ? "text-indigo-600 bg-indigo-50" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setView("cart")} className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setNavOpen(!navOpen)} className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors">
              {navOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      {navOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            {navTabs.map((tab) => (
              <button key={tab.key} onClick={tab.action} className="block w-full text-left text-sm font-medium text-slate-600 hover:text-slate-900 py-2 transition-colors">
                {translate(tab.key)}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );

  if (view === "login") {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        {sharedNav}
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-64px)]">
          <div className="relative w-full max-w-4xl min-h-[550px] bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
            <div
              className="md:col-span-7 bg-white z-10 transition-all duration-700 ease-in-out p-8 lg:p-12 flex items-center justify-center"
              style={{ clipPath: formClip }}
            >
              <div className="w-full max-w-md">
                <button onClick={() => setView("home")} className="inline-block text-2xl font-bold tracking-tight text-slate-900 mb-8">
                  growstack<span className="text-slate-400">.</span>
                </button>
                {!isSignUp ? (
                  <>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{translate("login_title")}</h1>
                    <div className="mt-2 w-10 h-1 bg-slate-900 rounded-full" />
                    {error && (
                      <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                        <span className="text-sm font-medium text-red-700">{error}</span>
                      </div>
                    )}
                    <form onSubmit={handleAuth} className="mt-8 space-y-5">
                      <div className="relative border-b border-slate-200 focus-within:border-slate-900 transition-colors">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={translate("login_email")} className="w-full bg-transparent py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none" />
                        <Mail size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                      <div className="relative border-b border-slate-200 focus-within:border-slate-900 transition-colors">
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={translate("login_pass")} className="w-full bg-transparent py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600 transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                          <Lock size={16} className="text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/30" />
                          <span className="text-sm text-slate-500">{translate("login_remember")}</span>
                        </label>
                        <button type="button" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">{translate("login_forgot")}</button>
                      </div>
                      <button type="submit" disabled={loading} className="w-full rounded-full bg-black text-white py-2.5 text-sm font-semibold hover:bg-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" />{translate("login_btn")}</span> : <span>{translate("login_btn")}</span>}
                      </button>
                    </form>
                    <div className="mt-6 text-center">
                      <p className="text-sm text-slate-500"><button onClick={toggleAuth} className="font-semibold text-slate-900 hover:underline">{translate("login_switch")}</button></p>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{translate("signup_title")}</h1>
                    <div className="mt-2 w-10 h-1 bg-slate-900 rounded-full" />
                    {error && (
                      <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                        <span className="text-sm font-medium text-red-700">{error}</span>
                      </div>
                    )}
                    <form onSubmit={handleAuth} className="mt-8 space-y-5">
                      <div className="relative border-b border-slate-200 focus-within:border-slate-900 transition-colors">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={translate("login_name")} className="w-full bg-transparent py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none" />
                        <User size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                      <div className="relative border-b border-slate-200 focus-within:border-slate-900 transition-colors">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={translate("login_email")} className="w-full bg-transparent py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none" />
                        <Mail size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                      <div className="relative border-b border-slate-200 focus-within:border-slate-900 transition-colors">
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={translate("login_pass")} className="w-full bg-transparent py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600 transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                          <Lock size={16} className="text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">By creating an account, you agree to our Terms and Privacy Policy.</p>
                      <button type="submit" disabled={loading} className="w-full rounded-full bg-black text-white py-2.5 text-sm font-semibold hover:bg-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" />{translate("signup_btn")}</span> : <span>{translate("signup_btn")}</span>}
                      </button>
                    </form>
                    <div className="mt-6 text-center">
                      <p className="text-sm text-slate-500"><button onClick={toggleAuth} className="font-semibold text-slate-900 hover:underline">{translate("signup_switch")}</button></p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div
              className="md:col-span-5 bg-slate-950 flex items-center justify-center z-20 transition-all duration-700 ease-in-out p-8 lg:p-12"
              style={{ clipPath: loginClip }}
            >
              <div className="text-center max-w-sm">
                <h3 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white mb-4">
                  {isSignUp ? translate("login_welcome") : translate("signup_welcome")}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-8">
                  {isSignUp ? translate("login_welcome_desc") : translate("signup_welcome_desc")}
                </p>
                <button type="button" onClick={toggleAuth} className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-slate-950 transition-all duration-300">
                  {isSignUp ? translate("login_btn") : translate("signup_btn")}
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "cart") {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        {sharedNav}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                <ShoppingCart size={28} className="inline-block mr-3 -mt-1 text-slate-700" /> Cart
              </h1>
              <p className="text-slate-500 mt-1 text-sm">{cartCount} {cartCount === 1 ? "item" : "items"}</p>
            </div>
            <button onClick={() => setView("home")} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} /> {translate("cart.continueShopping")}
            </button>
          </div>
          {cartItems.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
              <ShoppingCart size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Your cart is empty</h3>
              <p className="text-sm text-slate-500 mb-6">Looks like you have not added any services yet.</p>
              <button onClick={() => setView("home")} className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-2.5 text-sm font-semibold hover:bg-slate-800 transition-all">
                {translate("cart.browseServices")} <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-xl shrink-0">
                    <Sparkles size={24} className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm">{translate(item.titleKey)}</h3>
                    <p className="text-lg font-extrabold text-slate-900 mt-0.5">{translate(item.priceKey)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                      <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">−</button>
                      <span className="px-3 py-1.5 text-sm font-bold text-slate-900 min-w-[28px] text-center border-x border-slate-200">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">+</button>
                    </div>
                    <button onClick={() => updateQty(item.id, -item.qty)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-500">Subtotal</span>
                  <span className="text-xl font-extrabold text-slate-900">{totalPrice.toLocaleString()} MAD</span>
                </div>
                <button className="w-full rounded-full bg-black text-white py-3 text-sm font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
                <button onClick={() => setView("home")} className="w-full text-center mt-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                  {translate("cart.continueShopping")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {sharedNav}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6 text-left">
              <span className="inline-block rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold px-4 py-1.5 tracking-wide">
                {translate("hero.badge")}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                {translate("hero.title")}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg">
                {translate("hero.desc")}
              </p>
              <button className="inline-flex items-center gap-2 rounded-full bg-black text-white px-8 py-3 text-sm font-semibold hover:bg-slate-800 transition-all shadow-md">
                {translate("hero.btn")} <ChevronRight size={16} />
              </button>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-full max-w-md aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/60 shadow-sm p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">G</div>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-slate-200 rounded-full w-3/5" />
                    <div className="h-2 bg-slate-100 rounded-full w-2/5" />
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white border border-slate-100 p-3 space-y-2 shadow-sm">
                    <div className="h-2 bg-slate-200 rounded-full w-4/5" />
                    <div className="h-2 bg-slate-100 rounded-full w-3/5" />
                    <div className="h-6 rounded-md bg-indigo-50 mt-2" />
                  </div>
                  <div className="rounded-xl bg-white border border-slate-100 p-3 space-y-2 shadow-sm">
                    <div className="h-2 bg-slate-200 rounded-full w-3/5" />
                    <div className="h-2 bg-slate-100 rounded-full w-2/5" />
                    <div className="h-6 rounded-md bg-emerald-50 mt-2" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 rounded-full bg-indigo-100 flex-1" />
                  <div className="h-8 rounded-full bg-slate-100 w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-14 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {translate("services.main_title")}
          </h2>
          <div className="mt-3 w-12 h-1 bg-slate-900 rounded-full" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500"
            >
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0" />
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-xl ${service.iconBg} flex items-center justify-center text-xl mb-5 group-hover:bg-white/20 transition-colors duration-500`}>
                  <svg className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 0 2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.23-1.128m0 0a3.001 3.001 0 0 0 3.75-2.456M9.53 16.122l2.294-1.715M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-white transition-colors duration-500">{translate(service.titleKey)}</h3>
                <p className="text-2xl font-extrabold text-slate-900 mt-2 group-hover:text-white transition-colors duration-500">{translate(service.priceKey)}</p>
                <ul className="mt-5 space-y-2.5">
                  {service.features.map((fk) => (
                    <li key={fk} className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-white/90 transition-colors duration-500">
                      <span>{translate(fk)}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => addToCart(service.id)}
                  className="mt-6 w-full rounded-full border border-slate-300 bg-white text-slate-900 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-slate-900 hover:text-white transition-all duration-500 group-hover:bg-white group-hover:text-slate-900 group-hover:border-white"
                >
                  {translate("serviceCard.addToCart")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
