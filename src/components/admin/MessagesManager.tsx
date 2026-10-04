import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trash2, 
  Clock, 
  Phone, 
  Mail, 
  Search, 
  MessageCircle 
} from 'lucide-react';

export const MessagesManager: React.FC = () => {
  const { messages, markMessageRead, deleteMessage } = useApp();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    messages[0]?.id || null
  );
  const [search, setSearch] = useState('');
  const [filterUnread, setFilterUnread] = useState(false);

  const filteredMessages = messages.filter((m) => {
    if (filterUnread && !m.unread) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.projectType.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  const selectedMessage = messages.find((m) => m.id === selectedMessageId) || filteredMessages[0];

  const handleSelect = (id: string) => {
    setSelectedMessageId(id);
    markMessageRead(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
          <span className="w-3 h-0.5 bg-orange-500 inline-block" />
          <span>ADMIN &gt; MESSAGES</span>
        </div>
        <h2 className="text-2xl font-bold text-white font-syne">
          Demandes &amp; Messages Clients ({messages.length})
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Consultez les demandes reçues via le portfolio public et répondez rapidement à vos futurs clients.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Rechercher un message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0a0f1e] border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <button
          onClick={() => setFilterUnread(!filterUnread)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filterUnread
              ? 'bg-orange-500 text-white'
              : 'bg-slate-800/80 text-slate-300 hover:text-white'
          }`}
        >
          {filterUnread ? 'Afficher tous' : 'Non lus seulement'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0a0f1e] border border-slate-800 text-center text-xs text-slate-400">
              Aucun message trouvé
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelect(msg.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#101730] border-orange-500 shadow-lg shadow-orange-950/20'
                      : msg.unread
                      ? 'bg-[#0a0f1e] border-orange-500/40'
                      : 'bg-[#0a0f1e] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {msg.name}
                      </span>
                      {msg.unread && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {msg.date}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-orange-400 mb-1">
                    {msg.projectType}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Message Detail */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800/90 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white font-syne">
                      {selectedMessage.name}
                    </h3>
                    {selectedMessage.unread && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-orange-400" />
                      <span>{selectedMessage.email}</span>
                    </a>
                    {selectedMessage.phone && (
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-orange-400" />
                        <span>{selectedMessage.phone}</span>
                      </a>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Supprimer ce message ?')) {
                      deleteMessage(selectedMessage.id);
                    }
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Type de projet demandé
                </span>
                <div className="mt-1 inline-block px-3 py-1 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-semibold text-xs">
                  {selectedMessage.projectType}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Message du client :
                </span>
                <div className="mt-2 p-5 rounded-2xl bg-[#070b16] border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
                {selectedMessage.phone && (
                  <a
                    href={`https://wa.me/225${selectedMessage.phone.replace(/\D/g, '')}?text=Bonjour%20${encodeURIComponent(
                      selectedMessage.name
                    )},%20c'est%20Ibrahim%20Sidime,%20suite%20%C3%A0%20votre%20demande%20sur%20mon%20portfolio.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Répondre sur WhatsApp</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedMessage.email}?subject=Réponse%20à%20votre%20demande%20de%20projet%20vidéo&body=Bonjour%20${encodeURIComponent(
                    selectedMessage.name
                  )},%0A%0AMerci%20pour%20votre%20message.%20`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Mail className="w-4 h-4 text-orange-400" />
                  <span>Répondre par Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800 p-12 text-center text-slate-400 text-sm">
              Sélectionnez un message à gauche pour afficher son contenu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
