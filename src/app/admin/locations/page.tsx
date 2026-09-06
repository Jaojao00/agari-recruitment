'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Plus, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  mapUrl?: string;
  isActive: boolean;
  order: number;
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', mapUrl: '' });

  const fetchLocations = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/locations');
    const data = await res.json();
    setLocations(data.locations || []);
    setLoading(false);
  };

  useEffect(() => { fetchLocations(); }, []);

  const handleAdd = async () => {
    if (!form.name || !form.address) return alert('Vui long nhap ten va dia chi');
    setSaving(true);
    await fetch('/api/admin/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', address: '', mapUrl: '' });
    setShowForm(false);
    await fetchLocations();
    setSaving(false);
  };

  const toggleActive = async (loc: Location) => {
    await fetch('/api/admin/locations/' + loc.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !loc.isActive }),
    });
    await fetchLocations();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm('Xoa khu vuc: ' + name + '?')) return;
    await fetch('/api/admin/locations/' + id, { method: 'DELETE' });
    await fetchLocations();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="text-red-600" size={24} />
            Quan ly khu vuc tuyen dung
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Cac khu vuc nay se hien thi trong form ung tuyen de ung vien lua chon.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-red-700 hover:bg-red-800 text-white">
          <Plus size={16} className="mr-1" /> Them khu vuc
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader><CardTitle className="text-lg">Them khu vuc moi</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Ten khu vuc *</label>
              <Input
                placeholder="Vi du: SW SOC - KCN BINH MINH VINH LONG"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="mt-1 h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Dia chi *</label>
              <Input
                placeholder="Vi du: Lo 01, Kho A01, KCN Binh Minh, Vinh Long"
                value={form.address}
                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                className="mt-1 h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Link Google Maps (tuy chon)</label>
              <Input
                placeholder="https://maps.app.goo.gl/..."
                value={form.mapUrl}
                onChange={e => setForm(p => ({ ...p, mapUrl: e.target.value }))}
                className="mt-1 h-11"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAdd} disabled={saving} className="bg-red-700 hover:bg-red-800 text-white">
                {saving ? <Loader2 size={14} className="animate-spin mr-1" /> : <Plus size={14} className="mr-1" />}
                Luu khu vuc
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Huy</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : locations.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <MapPin size={48} className="mx-auto mb-3 opacity-50" />
          <p>Chua co khu vuc nao. Them khu vuc dau tien!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {locations.map((loc) => (
            <Card key={loc.id} className={'border ' + (loc.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60')}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3">
                  <div className={'w-3 h-3 rounded-full mt-1.5 shrink-0 ' + (loc.isActive ? 'bg-green-500' : 'bg-gray-300')} />
                  <div>
                    <p className="font-bold text-gray-900">{loc.name}</p>
                    <p className="text-sm text-gray-500">{loc.address}</p>
                    {loc.mapUrl && (
                      <a href={loc.mapUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline">
                        Xem ban do
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(loc)}
                    title={loc.isActive ? 'An khoi ung vien' : 'Hien thi voi ung vien'}
                  >
                    {loc.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                    <span className="ml-1 text-xs">{loc.isActive ? 'Hien' : 'An'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                    onClick={() => handleDelete(loc.id, loc.name)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}