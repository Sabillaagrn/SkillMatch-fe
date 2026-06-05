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
import { loadProfile } from "../lib/storage.js"; // Hanya butuh load untuk mengambil email login

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

  // Mengambil data profil dari Backend
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

  // Fungsi untuk menyimpan perubahan ke Backend
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
      saveToBackend(nextProfile); // Simpan ke BE
      return nextProfile;
    });
  };

  const removeSkill = (name) => {
    setProfile((p) => {
      const nextProfile = { ...p, skills: p.skills.filter((s) => s !== name) };
      saveToBackend(nextProfile); // Simpan ke BE
      return nextProfile;
    });
  };

  const handleSaveEdit = (newDetails) => {
    setProfile((p) => {
      const nextProfile = { ...p, ...newDetails };
      saveToBackend(nextProfile); // Simpan ke BE
      return nextProfile;
    });
    setEditOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="h-8 w-8 text-brand-600" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center mt-10">Silakan login terlebih dahulu.</div>;
  }

  const rows = showAll ? (profile.history || []) : (profile.history || []).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your career details and view your skill progression.
          </p>
        </div>
        <Button variant="outline" size="md" onClick={() => setEditOpen(true)}>
          <Pencil size={16} /> Edit Profile
        </Button>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={profile.name}
              className="h-28 w-28 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="grid h-28 w-28 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-400">
              <Camera size={32} />
            </span>
          )}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-ink">{profile.name}</h2>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted sm:justify-start">
              <MapPin size={15} /> {profile.location || "Belum ada lokasi"}
            </p>

            <div className="mt-5 flex items-center justify-center gap-2 sm:justify-start">
              <BadgeCheck size={18} className="text-brand-600" />
              <span className="font-bold text-ink">Skill Utama</span>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {(profile.skills || []).map((s) => (
                <span
                  key={s}
                  className="group inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-800"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    aria-label={`Hapus ${s}`}
                    className="text-brand-400 transition hover:text-rose-600"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => setSkillOpen(true)}
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-line px-3.5 py-1.5 text-sm font-semibold text-muted transition hover:border-brand-300 hover:text-brand-600"
              >
                <Plus size={14} /> Add Skill
              </button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <History size={20} className="text-brand-600" />
              <h3 className="text-lg font-bold text-ink">Riwayat Analisis</h3>
            </div>
            <p className="mt-1 text-sm text-muted">
              Track your compatibility with different career paths over time.
            </p>
          </div>
          {profile.history && profile.history.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"
            >
              {showAll ? "Tampilkan Sedikit" : "View All"} <ArrowRight size={15} />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          {rows.length === 0 ? (
            <p className="text-sm text-muted">Belum ada riwayat analisis. Coba gunakan fitur Analisis Skill!</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y border-line bg-canvas text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-semibold">Tanggal Analisis</th>
                  <th className="px-4 py-3 font-semibold">Target Posisi</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Hasil Kecocokan
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((h, i) => (
                  <tr key={i} className="border-b border-line">
                    <td className="px-4 py-4 text-muted">{h.date}</td>
                    <td className="px-4 py-4 font-semibold text-ink">{h.role}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <div className="h-1.5 w-28 rounded-full bg-brand-100">
                          <div
                            className={`h-1.5 rounded-full ${BAR[h.tone] || BAR.brand}`}
                            style={{ width: `${h.pct}%` }}
                          />
                        </div>
                        <span className={`w-10 text-right font-bold ${TEXT[h.tone] || TEXT.brand}`}>
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
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          {draft?.photo ? (
            <img
              src={draft.photo}
              alt="Preview"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-100 text-brand-400">
              <Camera size={26} />
            </span>
          )}
          <div className="flex flex-col gap-2">
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
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={15} /> Unggah Foto
            </Button>
            {draft?.photo && (
              <button
                type="button"
                onClick={() => setDraft((d) => ({ ...d, photo: null }))}
                className="text-left text-xs font-semibold text-rose-600 hover:underline"
              >
                Hapus foto
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">Nama</label>
          <input
            value={draft?.name || ""}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">Lokasi</label>
          <input
            value={draft?.location || ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, location: e.target.value }))
            }
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" size="md" onClick={onClose}>
            Batal
          </Button>
          <Button
            size="md"
            onClick={() =>
              onSave({
                name: draft.name.trim() || profile.name,
                location: draft.location?.trim() || profile.location,
                photo: draft.photo,
              })
            }
          >
            Simpan
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
    <Modal open={open} onClose={onClose} title="Tambah Skill">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">
            Nama Skill
          </label>
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="mis. TypeScript, Tableau, Docker…"
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" size="md" disabled={!value.trim()}>
            <Plus size={15} /> Tambah
          </Button>
        </div>
      </form>
    </Modal>
  );
}