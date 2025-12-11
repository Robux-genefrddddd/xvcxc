import { Link } from "react-router-dom";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import { useState } from "react";

export default function Index() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-800 sticky top-0 z-40 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-sm">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F91e2732f1c03487e879c66ee97e72712%2Fee08390eccc04e8dbea3ce5415d97e92?format=webp&width=800"
              alt="PinPinCloud"
              className="w-6 h-6"
            />
            PinPinCloud
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-slate-400 hover:text-slate-200 transition text-sm">
              Fonctionnalités
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-200 transition text-sm">
              Tarification
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-200 transition text-sm">
              Documentation
            </a>
          </div>

          <div className="text-slate-400 text-sm">
            <a href="#" className="hover:text-slate-200 transition">
              Aide
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-65px)] px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold mb-3 tracking-tight">
              Bienvenue
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Accédez à votre espace PinPinCloud et gérez vos projets
            </p>
          </div>

          {/* Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 space-y-6">
            {/* Tabs */}
            <div className="flex gap-3 p-1 bg-slate-800/50 rounded-md border border-slate-700">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded transition-colors ${
                  isLogin
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded transition-colors ${
                  !isLogin
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Inscription
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <input
                    type="text"
                    placeholder="Nom complet"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 text-sm focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors"
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 text-sm focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 text-sm focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors"
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 bg-slate-800 border border-slate-700 rounded accent-blue-500"
                    />
                    <span className="text-slate-300">Se souvenir</span>
                  </label>
                  <a href="#" className="text-blue-400 hover:text-blue-300 text-sm transition">
                    Oublié?
                  </a>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition-colors">
              {isLogin ? "Se Connecter" : "Créer un Compte"}
            </button>

            {/* Footer */}
            <p className="text-center text-slate-400 text-xs">
              {isLogin ? "Pas de compte?" : "Déjà inscrit?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:text-blue-300 font-medium transition"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-slate-700"></div>
              <span className="text-slate-500 text-xs">OU</span>
              <div className="flex-1 h-px bg-slate-700"></div>
            </div>

            {/* Google Button */}
            <button className="w-full py-2.5 px-4 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 rounded-md text-slate-300 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92h8.85c.2 1.1.01 2.84-.88 4.3-.5 1.02-2.02 2.53-4.57 2.53-2.44 0-4.44-1.6-5.12-3.74H7.84c.48 2.45 2.25 4.97 5.23 4.97 2.5 0 4.9-.87 6.52-2.55 1.25-1.27 1.96-2.74 2.2-4.53h.05c.37-.05.74-.1 1.1-.1 1.1 0 1.82.35 2.02.97h3.26c-.5-1.6-2.15-3.83-4.1-4.39v-.05c-1.3-.4-2.64-.4-3.84-.05-1.2.35-2.4 1.05-3.2 2.05zm.05 3.5c.5 1.25 1.97 2.5 4 2.5 2.05 0 3.48-1.25 3.98-2.5H12.53z" />
              </svg>
              Google
            </button>
          </div>

          {/* Terms */}
          <p className="text-center text-slate-500 text-xs mt-6">
            En continuant, vous acceptez nos{" "}
            <a href="#" className="text-slate-400 hover:text-slate-300 underline">
              conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
