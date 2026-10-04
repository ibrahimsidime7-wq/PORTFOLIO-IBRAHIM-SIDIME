import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  projectName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title = 'Supprimer ce projet ?',
  projectName,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md bg-[#0b101f] border border-red-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 space-y-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-syne">{title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Cette action est irréversible.</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#070b16] border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
          <p>
            Voulez-vous vraiment supprimer définitivement le projet :
          </p>
          <p className="font-bold text-orange-400 text-sm truncate">
            « {projectName} »
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Le projet ainsi que ses fichiers vidéo et miniatures associés seront définitivement effacés de la base de données et du serveur.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            ANNULER
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>SUPPRESSION...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>SUPPRIMER DÉFINITIVEMENT</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
