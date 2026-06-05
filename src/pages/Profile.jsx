import { useEffect, useRef, useState } from "react";
import {
  Camera,
  MapPin,
  BadgeCheck,
  History,
  Plus,
  Pencil,
  ArrowRight,
  X,
  Upload,
} from "lucide-react";
import { Card, Button, Modal, Spinner } from "../components/ui.jsx";
import { loadProfile } from "../lib/storage.js";

const BAR = { emerald: "bg-emerald-500", brand: "bg-brand-600", amber: "bg-amber-600" };
const TEXT = { emerald: "text-emerald-600", brand: "text-brand-600", amber: "text-amber-600" };

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const userEmail = localStorage.getItem("email") || "";

  useEffect(() => {
    async function fetchProfile() {
      if (!userEmail) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/profile?email=${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [userEmail]);

  const saveToBackend = async (updatedProfile) => {
    try {
      await fetch(`${API_URL}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          ...updatedProfile
        }),
      });
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
    }
  };

  const addSkill = (name) => {
    const value = name.trim();
    if (!value) return;
    
    setProfile((p) => {
      if (p.skills.some((s) => s.toLowerCase() === value.toLowerCase())) return p;
      const nextProfile = { ...p, skills: [...p.skills, value] };
      saveToBackend(nextProfile);
      return nextProfile;
    });
  };

  const removeSkill = (name) => {
    setProfile((p) => {
      const nextProfile = { ...p, skills: p.skills.filter((s) => s !== name) };
      saveToBackend(nextProfile);
      return nextProfile;
    });
  };

  const handleSaveEdit = (newDetails) => {
    setProfile((p) => {
      const nextProfile = { ...p, ...newDetails };
      saveToBackend(nextProfile);
      return nextProfile;
    });
    setEditOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <Spinner className="h-8 w-8 text-brand-600 animate-spin" />
        <p className="text-sm font-medium text-muted animate-pulse">Memuat data profil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center px-4">
        <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
          <BadgeCheck size={32} />
        </span>
        <h3 className="text-lg font-bold text-ink">Profil Tidak Ditemukan</h3>
        <p className="mt-2 text-sm text-muted">Silakan login terlebih dahulu untuk melihat profil Anda.</p>
      </div>
    );
  }

  const rows = showAll ? (profile.history || []) : (profile.history || []).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-24 pb-8 md:pt-8 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your career details and view your skill progression.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="md" 
          onClick={() => setEditOpen(true)}
          className="w-full sm:w-auto shadow-sm transition-all hover:bg-slate-50"
        >
          <Pencil size={16} className="mr-1.5" /> Edit Profile
        </Button>
      </div>

      {/* Main Profile Card */}
      <Card className="p-6 sm:p-8 shadow-card overflow-hidden relative">
        {/* Dekorasi Background */}
        <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-50/50" />
        
        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Area Foto */}
          <div className="relative shrink-0">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt={profile.name}
                className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover shadow-sm ring-4 ring-white"
              />
            ) : (
              <span className="grid h-28 w-28 sm:h-32 sm:w-32 place-items-center rounded-full bg-brand-50 text-brand-400 shadow-sm ring-4 ring-white">
                <Camera size={36} className="opacity-80" />
              </span>
            )}
          </div>

          {/* Area Info & Skill */}
          <div className="flex-1 text-center sm:text-left w-full">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">{profile.name}</h2>
            <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm font-medium text-muted sm:justify-start">
              <MapPin size={16} className="text-slate-400" /> {profile.location || "Belum ada lokasi"}
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 sm:justify-start">
              <BadgeCheck size={18} className="text-brand-600" />
              <span className="text-sm font-bold uppercase tracking-wide text-ink">Skill Utama</span>
            </div>
            
            <div className="mt-3 flex flex-wrap justify-center gap-2.5 sm:justify-start">
              {(profile.skills || []).map((s) => (
                <span
                  key={s}
                  className="group flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-100/50 px-3.5 py-1.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100 hover:border-brand-200"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    aria-label={`Hapus ${s}`}
                    className="ml-1 rounded-full p-0.5 text-brand-400/80 transition-colors hover:bg-white hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => setSkillOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-line px-4 py-1.5 text-sm font-semibold text-muted transition-all duration-200 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
              >
                <Plus size={15} /> Add Skill
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* History Card */}
      <Card className="p-6 sm:p-8 shadow-card">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <History size={18} />
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-ink">Riwayat Analisis</h3>
            </div>
            <p className="mt-2 text-sm text-muted">
              Pantau perkembangan kecocokanmu dengan target karir dari waktu ke waktu.
            </p>
          </div>
          {profile.history && profile.history.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
            >
              {showAll ? "Tampilkan Sedikit" : "View All"} 
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-line/60">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-10 text-center bg-slate-50/50">
              <span className="mb-3 rounded-full bg-slate-100 p-3 text-slate-400">
                <History size={24} />
              </span>
              <p className="text-sm font-medium text-ink">Belum ada riwayat analisis</p>
              <p className="mt-1 text-xs text-muted">Coba gunakan fitur Analisis Skill untuk melihat hasilnya di sini!</p>
            </div>
          ) : (
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-muted border-b border-line">
                  <th className="px-5 py-4">Tanggal Analisis</th>
                  <th className="px-5 py-4">Target Posisi</th>
                  <th className="px-5 py-4 text-right">Hasil Kecocokan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {rows.map((h, i) => (
                  <tr key={i} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-5 py-4 text-muted whitespace-nowrap">{h.date}</td>
                    <td className="px-5 py-4 font-bold text-ink">{h.role}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-4">
                        <div className="h-2 w-24 sm:w-32 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${BAR[h.tone] || BAR.brand}`}
                            style={{ width: `${h.pct}%` }}
                          />
                        </div>
                        <span className={`w-12 text-right font-bold ${TEXT[h.tone] || TEXT.brand}`}>
                          {h.pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        onSave={handleSaveEdit}
      />

      <AddSkillModal
        open={skillOpen}
        onClose={() => setSkillOpen(false)}
        onAdd={(name) => {
          addSkill(name);
          setSkillOpen(false);
        }}
      />
    </div>
  );
}

function EditProfileModal({ open, onClose, profile, onSave }) {
  const [draft, setDraft] = useState(profile);
  const fileRef = useRef(null);

  useEffect(() => {
    if (open) setDraft(profile);
  }, [open, profile]);

  const onPickPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {draft?.photo ? (
            <img
              src={draft.photo}
              alt="Preview"
              className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-line"
            />
          ) : (
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-400 ring-2 ring-line/50">
              <Camera size={26} />
            </span>
          )}
          <div className="flex flex-col gap-2.5">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPickPhoto}
              className="hidden"
            />
            <Button
              type="button"
              variant="soft"
              size="sm"
              className="w-fit"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={16} className="mr-1.5" /> Unggah Foto
            </Button>
            {draft?.photo && (
              <button
                type="button"
                onClick={() => setDraft((d) => ({ ...d, photo: null }))}
                className="w-fit text-left text-xs font-semibold text-rose-500 transition-colors hover:text-rose-700 hover:underline"
              >
                Hapus foto saat ini
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">Nama Lengkap</label>
            <input
              value={draft?.name || ""}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Masukkan nama lengkap..."
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">Lokasi</label>
            <input
              value={draft?.location || ""}
              onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
              placeholder="Kota, Negara..."
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="md" onClick={onClose} className="w-full sm:w-auto">
            Batal
          </Button>
          <Button
            size="md"
            className="w-full sm:w-auto shadow-sm"
            onClick={() =>
              onSave({
                name: draft.name.trim() || profile.name,
                location: draft.location?.trim() || profile.location,
                photo: draft.photo,
              })
            }
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function AddSkillModal({ open, onClose, onAdd }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  const submit = (e) => {
    e.preventDefault();
    onAdd(value);
  };

  return (
    <Modal open={open} onClose={onClose} title="Tambah Skill Baru">
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">
            Nama Skill
          </label>
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="mis. TypeScript, Tableau, Docker…"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-1">
          <Button type="button" variant="outline" size="md" onClick={onClose} className="w-full sm:w-auto">
            Batal
          </Button>
          <Button type="submit" size="md" disabled={!value.trim()} className="w-full sm:w-auto shadow-sm">
            <Plus size={16} className="mr-1.5" /> Tambah
          </Button>
        </div>
      </form>
    </Modal>
  );
}