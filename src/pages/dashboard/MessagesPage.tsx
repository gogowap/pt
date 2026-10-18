import React, { useState, useEffect } from 'react';
import { ApiClient } from '../../lib/api';
import { Mail, Clock, Building2, Check, Archive, RefreshCw } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchMessages = async () => {
    setLoading(true);
    const url = `/api/contact/messages${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`;
    const res = await ApiClient.get<any[]>(url);
    if (res.success && res.data) {
      setMessages(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: number, status: string) => {
    const res = await ApiClient.put(`/api/contact/messages/${id}/status`, { status });
    if (res.success) {
      fetchMessages();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Kotak Pesan Konsultasi Masuk
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Permohonan konsultasi teknis yang disubmit pengunjung melalui formulir publik website.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMessages}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded text-xs font-semibold text-zinc-700 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Perbarui Inbox</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="p-1 bg-zinc-100 rounded border border-zinc-200 flex items-center gap-1 w-fit">
        {['all', 'unread', 'read', 'archived'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 text-xs font-semibold rounded uppercase tracking-wider transition-colors cursor-pointer ${
              statusFilter === st
                ? 'bg-zinc-950 text-white'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200'
            }`}
          >
            {st === 'all' ? 'Semua' : st === 'unread' ? 'Belum Dibaca' : st === 'read' ? 'Sudah Dibaca' : 'Diarsipkan'}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-zinc-400">
            Mengambil pesan dari tabel contact_messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg border border-zinc-200 text-zinc-500 text-xs">
            Belum ada pesan pada status ini.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-lg border bg-white space-y-3 transition-colors ${
                msg.status === 'unread' ? 'border-zinc-950 shadow-xs' : 'border-zinc-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-950">{msg.name}</span>
                    <span className="text-zinc-400">·</span>
                    <span className="text-xs text-zinc-600 font-medium">{msg.company}</span>
                    {msg.status === 'unread' && (
                      <span className="px-1.5 py-0.2 rounded bg-zinc-950 text-white font-mono text-[9px] uppercase font-bold">
                        BARU
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">{msg.email}</div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{msg.created_at}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block mb-1">
                  Subjek Solusi: {msg.subject}
                </span>
                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-3 rounded border border-zinc-100 whitespace-pre-line">
                  {msg.message}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                {msg.status === 'unread' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(msg.id, 'read')}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Tandai Dibaca</span>
                  </button>
                )}
                {msg.status !== 'archived' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(msg.id, 'archived')}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 rounded cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Arsipkan</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
