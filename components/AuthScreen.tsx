
import React, { useState } from 'react';

interface AuthScreenProps {
  onLogin: () => void;
}

const AuthForm: React.FC<{ onLogin: () => void; isLogin: boolean }> = ({ onLogin, isLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin();
      // No need to set loading to false as the component will unmount
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isLogin && (
          <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-400">Nome de Usuário</label>
              <div className="mt-1">
                  <input id="username" name="username" type="text" required className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-700 text-white" defaultValue={`cocota_user_${Math.floor(Math.random() * 1000)}`} />
              </div>
          </div>
      )}
      <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
          <div className="mt-1">
              <input id="email" name="email" type="email" autoComplete="email" required className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-700 text-white" defaultValue="email@cocota.bet" />
          </div>
      </div>
      <div>
          <label htmlFor="password"  className="block text-sm font-medium text-gray-400">Senha</label>
          <div className="mt-1">
              <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-700 text-white" defaultValue="password123" />
          </div>
      </div>
      <div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-800 disabled:cursor-not-allowed transition-colors btn-press">
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
      </div>
    </form>
  );
};


export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-5xl font-extrabold text-white">
          COCOTA <span className="text-green-400">BET</span>
        </h1>
        <p className="mt-2 text-center text-sm text-gray-400">A aposta mais galinácea da internet.</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <div className="flex border-b border-gray-700">
                <button 
                  onClick={() => setActiveTab('login')} 
                  className={`w-1/2 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'login' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}
                >
                  Entrar
                </button>
                <button 
                  onClick={() => setActiveTab('register')} 
                  className={`w-1/2 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'register' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}
                >
                  Cadastrar
                </button>
            </div>
          </div>
          <AuthForm onLogin={onLogin} isLogin={activeTab === 'login'} />
        </div>
      </div>
    </div>
  );
};