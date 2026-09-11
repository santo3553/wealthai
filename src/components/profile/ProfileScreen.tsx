import React, { useState } from 'react';
import {
  User,
  Shield,
  Fingerprint,
  Bell,
  Download,
  Building2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Key,
  Coins,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAppSettings } from '../../context/AppSettingsContext';
import { useFinance } from '../../context/FinanceContext';
import { exportTransactionsToCsv } from '../../utils/csv';
import { formatCurrency } from '../../utils/currency';

export const ProfileScreen: React.FC = () => {
  const { settings, updateSettings, addLinkedAccount, removeLinkedAccount, setApiKey } =
    useAppSettings();
  const { transactions, monthlyCashFlows } = useFinance();

  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [newAccountInput, setNewAccountInput] = useState('');
  const [showAddAccountInput, setShowAddAccountInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(settings.apiKey || '');
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);

  // CSV Reporter trigger
  const handleExportCsv = () => {
    exportTransactionsToCsv(transactions, settings.userName, settings.userEmail);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccountInput.trim()) {
      addLinkedAccount(newAccountInput.trim());
      setNewAccountInput('');
      setShowAddAccountInput(false);
    }
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(apiKeyInput);
    setIsApiKeySaved(true);
    setTimeout(() => setIsApiKeySaved(false), 2500);
  };

  return (
    <div className="pb-32 pt-6 px-6 max-w-md mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="p-6 rounded-3xl heavy-glass border border-white/15 relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-200 shadow-xl shadow-amber-500/20 shrink-0">
              <div className="w-full h-full rounded-2xl bg-[#120d0b] flex items-center justify-center border border-white/10">
                <span className="font-serif font-bold text-2xl text-amber-300">
                  {settings.userName.charAt(0)}
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  Tier 1 Private Client
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5 truncate">
                {settings.userName}
              </h2>
              <p className="text-xs text-white/40 truncate">{settings.userEmail}</p>
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl p-[2px] bg-gradient-to-tr from-teal-400 via-cyan-400 to-amber-300 shadow-lg shadow-cyan-500/20 shrink-0">
            <img
              src="/logo-icon.png"
              alt="WealthAI"
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
        </div>

        {/* CSV Reporter Button: Generate a file using Blob */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-white/80 block">
              Financial Audit Export
            </span>
            <span className="text-[10px] text-white/40">Download full ledger as CSV</span>
          </div>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400 text-[#120d0b] font-bold text-xs shadow-md shadow-amber-400/20 hover:bg-amber-300 transition-colors active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            CSV Report
          </button>
        </div>
      </div>

      {/* Accordion List: "Financial History" section showing monthly progress bars */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-lg">
        <button
          onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Financial History
              </h3>
              <p className="text-[11px] text-white/40">Monthly savings & progress bars</p>
            </div>
          </div>
          {isHistoryExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40" />
          )}
        </button>

        {isHistoryExpanded && (
          <div className="p-4 pt-1 border-t border-white/10 space-y-4">
            {monthlyCashFlows.map((flow) => {
              const totalFlow = flow.income + flow.expense;
              const savingsRatio =
                flow.income > 0 ? Math.max(0, Math.min(100, Math.round((flow.net / flow.income) * 100))) : 0;

              return (
                <div key={flow.month} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white/80">{flow.month}</span>
                    <span className="font-semibold text-emerald-400">
                      +{formatCurrency(flow.net, settings.currency)} Net
                    </span>
                  </div>

                  {/* Monthly Progress Bar */}
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                      style={{ width: `${Math.max(5, savingsRatio)}%` }}
                      title={`Savings rate: ${savingsRatio}%`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-white/40">
                    <span>In: {formatCurrency(flow.income, settings.currency)}</span>
                    <span>Out: {formatCurrency(flow.expense, settings.currency)}</span>
                    <span className="text-amber-300/80 font-medium">{savingsRatio}% Saved</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Settings Toggles: Interactive checkboxes/toggles for Security (2FA, Biometric) and Notifications */}
      <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Security & Preferences
          </h3>
        </div>

        <div className="space-y-3">
          {/* Two-Factor Authentication */}
          <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-white/60" />
              <div>
                <span className="text-xs font-semibold text-white block">
                  Two-Factor Authentication (2FA)
                </span>
                <span className="text-[10px] text-white/40">Hardware key or authenticator</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => updateSettings({ twoFactorAuth: e.target.checked })}
              className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
            />
          </label>

          {/* Biometric Login */}
          <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-4 h-4 text-white/60" />
              <div>
                <span className="text-xs font-semibold text-white block">
                  Biometric Authentication
                </span>
                <span className="text-[10px] text-white/40">Touch ID / Face ID hardware bridge</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.biometricLogin}
              onChange={(e) => updateSettings({ biometricLogin: e.target.checked })}
              className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
            />
          </label>

          {/* Notifications */}
          <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-white/60" />
              <div>
                <span className="text-xs font-semibold text-white block">
                  Executive Push Notifications
                </span>
                <span className="text-[10px] text-white/40">Capital alerts & AI insights</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
              className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
            />
          </label>

          {/* Currency Selector */}
          <div className="flex items-center justify-between p-2.5 rounded-xl">
            <div className="flex items-center gap-3">
              <Coins className="w-4 h-4 text-white/60" />
              <div>
                <span className="text-xs font-semibold text-white block">
                  Portfolio Base Currency
                </span>
                <span className="text-[10px] text-white/40">Global denomination</span>
              </div>
            </div>
            <select
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              className="bg-white/10 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-semibold focus:outline-none"
            >
              <option value="USD" className="bg-[#120d0b] text-white">USD ($)</option>
              <option value="EUR" className="bg-[#120d0b] text-white">EUR (€)</option>
              <option value="GBP" className="bg-[#120d0b] text-white">GBP (£)</option>
              <option value="BDT" className="bg-[#120d0b] text-white">BDT (৳)</option>
              <option value="JPY" className="bg-[#120d0b] text-white">JPY (¥)</option>
              <option value="CHF" className="bg-[#120d0b] text-white">CHF (Fr)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Linked Accounts: CRUD list to add/remove bank strings */}
      <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Linked Banking Desks
              </h3>
              <p className="text-[11px] text-white/40">Custodian accounts</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddAccountInput(!showAddAccountInput)}
            className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Link
          </button>
        </div>

        {/* Add Account Inline Form */}
        {showAddAccountInput && (
          <form onSubmit={handleAddAccount} className="space-y-2 pt-2 border-t border-white/10">
            <input
              type="text"
              value={newAccountInput}
              onChange={(e) => setNewAccountInput(e.target.value)}
              placeholder="e.g. UBS Private Vault (•••• 9912)"
              className="w-full px-3 py-2 rounded-xl glass-panel border border-white/20 text-white text-xs placeholder-white/30 focus:outline-none focus:border-amber-400"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddAccountInput(false)}
                className="px-3 py-1 rounded-lg text-xs text-white/50 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-amber-400 text-[#120d0b] font-bold text-xs"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* CRUD List */}
        <div className="space-y-2">
          {settings.linkedAccounts.map((account, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Building2 className="w-4 h-4 text-white/40 shrink-0" />
                <span className="text-white/90 font-medium truncate">{account}</span>
              </div>
              <button
                onClick={() => removeLinkedAccount(idx)}
                className="p-1 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 ml-2"
                title="Remove account"
                aria-label="Remove account"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Gemini AI Engine Configuration */}
      <div className="p-5 rounded-3xl glow-orange space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Gemini AI Engine
            </h3>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            gemini-2.0-flash
          </span>
        </div>
        <p className="text-[11px] text-white/60 leading-relaxed">
          Primary: <code className="text-amber-300">gemini-2.0-flash</code>. Automatic fallback to <code className="text-amber-300">gemini-1.5-flash</code>. You may supply your custom API Key below or use environment defaults.
        </p>

        <form onSubmit={handleSaveApiKey} className="space-y-2">
          <div className="relative">
            <Key className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste custom Gemini API key (optional)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl glass-panel border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="flex items-center justify-between">
            {isApiKeySaved && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                API Key saved
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-[#120d0b] font-bold text-xs shadow-md shadow-amber-500/20"
            >
              Update Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
