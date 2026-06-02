// app/events/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Search, ArrowRight, Ticket, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Event = {
  id: string;
  title: string;
  start_date: string;
  location?: string;
  category?: string;
  org_name?: string;
  description?: string;
};

const CATEGORIES = ['Tous', 'sales', 'training', 'networking', 'conference', 'workshop'];

export default function EventsPageClient({ lang = 'fr' }: { lang?: 'fr' | 'en' }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [count, setCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      params.set('limit', '12');

      const res = await fetch(`/api/events/search?${params.toString()}`);
      const data = await res.json();
      setEvents(data.data ?? []);
      setCount(data.count ?? 0);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [query, category]);

  useEffect(() => {
    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0f0c29] pt-20 pb-32">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #4f46e5 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 40%)' }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs font-medium mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {count > 0 ? `${count} événements à venir` : 'Événements publics'}
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6"
            style={{ fontFamily: '"Clash Display", "DM Sans", sans-serif' }}>
            Découvrez<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)' }}>
              les événements
            </span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            {lang === 'fr'
              ? 'Formations, conférences, salons — trouvez les événements qui comptent pour votre activité.'
              : 'Training, conferences, trade shows — find the events that matter for your business.'}
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 bg-white/[0.08] backdrop-blur-xl border border-white/10 rounded-2xl p-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search size={18} className="text-white/30 flex-shrink-0" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={lang === 'fr' ? 'Rechercher un événement...' : 'Search events...'}
                  className="flex-1 bg-transparent text-white placeholder:text-white/30 text-sm outline-none"
                />
                {query && (
                  <button onClick={() => setQuery('')}>
                    <X size={14} className="text-white/30 hover:text-white/60" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  showFilters || category
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                }`}
              >
                <SlidersHorizontal size={14} />
                {!showFilters && category ? '1' : lang === 'fr' ? 'Filtres' : 'Filters'}
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat === 'Tous' ? '' : cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      (cat === 'Tous' && !category) || cat === category
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EVENTS LIST */}
      <section className="max-w-6xl mx-auto px-6 -mt-16 pb-24">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-2xl mb-4" />
                <div className="h-5 bg-gray-100 rounded-lg mb-2 w-3/4" />
                <div className="h-4 bg-gray-50 rounded-lg mb-4 w-1/2" />
                <div className="h-3 bg-gray-50 rounded-lg w-2/3" />
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group bg-white rounded-3xl border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 overflow-hidden no-underline flex flex-col"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Card top accent */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="p-6 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <Ticket size={18} className="text-indigo-600" />
                    </div>
                    {event.category && (
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2.5 py-1 rounded-full">
                        {event.category}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors leading-snug">
                    {event.title}
                  </h3>

                  {/* Meta */}
                  <div className="space-y-2 mb-5 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={13} className="text-indigo-400 flex-shrink-0" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={13} className="text-indigo-400 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    {event.org_name && (
                      <p className="text-xs text-gray-400 font-medium">par {event.org_name}</p>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-bold uppercase tracking-widest">
                    {lang === 'fr' ? "Voir l'événement" : 'View event'}
                    <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
            <Calendar size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">
              {lang === 'fr' ? 'Aucun événement trouvé' : 'No events found'}
            </p>
            {query && (
              <button
                onClick={() => { setQuery(''); setCategory(''); }}
                className="mt-4 text-indigo-600 text-sm font-medium hover:underline"
              >
                {lang === 'fr' ? 'Effacer la recherche' : 'Clear search'}
              </button>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}