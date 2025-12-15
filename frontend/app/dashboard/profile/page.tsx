"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, Info, Shield } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Topbar } from "@/components/layout/topbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store/auth-store";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { useProfileQuery, useUpdateProfile } from "@/lib/hooks/useAuth";

const heroImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80";

const getErrorMessage = (error: unknown) =>
  error && typeof error === "object" && "message" in error && typeof (error as { message?: string }).message === "string"
    ? (error as { message?: string }).message ?? "Something went wrong."
    : "Something went wrong. Please try again.";

export default function ProfilePage() {
  const { hydrated, accessToken } = useAuthGuard();
  const user = useAuthStore((state) => state.user);
  const queriesEnabled = hydrated && Boolean(accessToken);
  useProfileQuery(queriesEnabled);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", bio: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    const previous = previewRef.current;
    if (previous && previous.startsWith("blob:") && previous !== avatarPreview) {
      URL.revokeObjectURL(previous);
    }
    previewRef.current = avatarPreview;
  }, [avatarPreview]);

  console.log(avatarPreview)

  useEffect(() => {
    return () => {
      const previous = previewRef.current;
      if (previous && previous.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    setForm({
      username: user.username,
      email: user.email,
      bio: user.bio ?? "",
    });
    setSelectedFile(null);
    setRemoveAvatar(false);
    setAvatarPreview(user.avatar ?? null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [user]);

  const handleChange =
    (field: keyof typeof form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const triggerFileInput = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedFile(file);
    setRemoveAvatar(false);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    if (!isEditing) return;
    setSelectedFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    if (!user) return;
    setForm({
      username: user.username,
      email: user.email,
      bio: user.bio ?? "",
    });
    setSelectedFile(null);
    setAvatarPreview(user.avatar ?? null);
    setRemoveAvatar(false);
    setFormError(null);
    setFormSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleEditing = () => {
    if (isEditing) {
      resetForm();
    } else {
      setFormError(null);
      setFormSuccess(null);
    }
    setIsEditing((prev) => !prev);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isEditing) {
      return;
    }
    setFormError(null);
    setFormSuccess(null);

    try {
      await updateProfile.mutateAsync({
        username: form.username,
        email: form.email,
        bio: form.bio,
        avatar: selectedFile ?? undefined,
        removeAvatar: removeAvatar || undefined,
      });
      setFormSuccess("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  if (!hydrated) {
    return <CenteredMessage message="Preparing your workspace…" />;
  }

  if (!accessToken) {
    return <CenteredMessage message="Redirecting you to sign in…" />;
  }

  if (!user) {
    return (
      <DashboardShell>
        <Topbar />
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white shadow-2xl shadow-black/30 backdrop-blur">
          <p className="text-sm text-white/70">Loading your profile…</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <Topbar />

      <section className="grid gap-6 rounded-4xl border border-white/10 bg-white/10 p-6 text-white shadow-2xl shadow-black/30 backdrop-blur lg:grid-cols-[1.05fr,0.95fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">Account</p>
          <h1 className="text-3xl font-semibold">Keep your workspace profile in sync.</h1>
          <p className="text-sm text-white/80">
            Update your contact details and bio so collaborators always see the latest context.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
              onClick={toggleEditing}
            >
              {isEditing ? "Cancel editing" : "Edit profile"}
            </Button>
            {!isEditing && (
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Click to make changes</p>
            )}
          </div>
        </div>
        <div
          className="rounded-3xl border border-white/20 bg-cover bg-center shadow-xl shadow-black/40"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="flex h-full flex-col justify-end rounded-3xl bg-gradient-to-t from-black/80 to-transparent p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Workspace presence</p>
            <p className="text-lg font-semibold">Make it personal yet professional.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr,0.6fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-4xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl shadow-black/30 backdrop-blur"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Profile</p>
            <h2 className="text-2xl font-semibold">Public details</h2>
            <p className="text-sm text-white/70">These fields appear on tasks, comments, and project rosters.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar
                  name={user.username}
                  src={avatarPreview ?? undefined}
                  className="h-16 w-16 border border-white/30 bg-white/20 text-white"
                />
                <div>
                  <p className="text-sm font-semibold">Workspace avatar</p>
                  <p className="text-xs text-white/70">This image shows up on assignments and comments.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={!isEditing}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
                  onClick={triggerFileInput}
                  disabled={!isEditing || updateProfile.isPending}
                >
                  Upload avatar
                </Button>
                {(avatarPreview || user.avatar || removeAvatar) && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full text-white hover:bg-white/20"
                    onClick={handleRemoveAvatar}
                    disabled={!isEditing || updateProfile.isPending}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/80">
                Username
              </Label>
              <Input
                id="username"
                required
                value={form.username}
                onChange={handleChange("username")}
                className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
                disabled={!isEditing || updateProfile.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
                disabled={!isEditing || updateProfile.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white/80">
                Bio
              </Label>
              <Textarea
                id="bio"
                rows={4}
                value={form.bio}
                onChange={handleChange("bio")}
                placeholder="Tell teammates about what drives your work."
                className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
                disabled={!isEditing || updateProfile.isPending}
              />
            </div>
          </div>

          {formError && (
            <div className="rounded-2xl border border-red-400/60 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
              {formSuccess}
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-full bg-white text-zinc-900 hover:bg-zinc-200"
            disabled={!isEditing || updateProfile.isPending}
          >
            {updateProfile.isPending ? "Saving changes…" : "Save profile"}
          </Button>
        </form>

        <aside className="space-y-6">
          <ProfileSnapshot isEditing={isEditing} previewAvatar={avatarPreview} />
          <SecurityCard emailVerified={Boolean(user.email_verified)} />
        </aside>
      </div>
    </DashboardShell>
  );
}

const ProfileSnapshot = ({ isEditing, previewAvatar }: { isEditing: boolean; previewAvatar: string | null }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const avatarSource = isEditing ? previewAvatar : user.avatar ?? null;

  return (
    <div className="rounded-4xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl shadow-black/30 backdrop-blur">
      <div className="flex items-center gap-4">
        <Avatar
          name={user.username}
          src={avatarSource ?? undefined}
          className="h-14 w-14 border border-white/30 bg-white/20 text-white"
        />
        <div>
          <h3 className="text-xl font-semibold">{user.username}</h3>
          <p className="text-sm text-white/70">{user.email}</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Role</p>
            <p className="text-lg font-semibold">{user.role}</p>
          </div>
          <Badge variant="outline" className="border-white/60 bg-transparent text-white">
            {user.role}
          </Badge>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Bio</p>
          <p className="mt-2 text-sm text-white/80">{user.bio?.trim() ? user.bio : "Add a short bio to help teammates know you."}</p>
        </div>
      </div>
    </div>
  );
};

const SecurityCard = ({ emailVerified }: { emailVerified: boolean }) => {
  return (
    <div className="rounded-4xl border border-white/10 bg-gradient-to-br from-zinc-900/80 via-zinc-900 to-zinc-950 p-6 text-white shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3">
        <Shield className="h-10 w-10 rounded-2xl border border-white/20 bg-white/10 p-2" />
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Security</p>
          <h3 className="text-xl font-semibold">Account signal</h3>
        </div>
      </div>
      <ul className="mt-6 space-y-4 text-sm text-white/80">
        <li className="flex items-start gap-3">
          <CheckCircle2 className={`h-5 w-5 ${emailVerified ? "text-emerald-400" : "text-white/40"}`} />
          <div>
            <p className="font-semibold">Email verification</p>
            <p className="text-white/70">
              {emailVerified ? "Your email is verified." : "Verify your email to unlock notifications and invites."}
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <Info className="h-5 w-5 text-white/60" />
          <div>
            <p className="font-semibold">Password hygiene</p>
            <p className="text-white/70">Rotate your password periodically using the Change Password endpoint.</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

const CenteredMessage = ({ message }: { message: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-900 to-slate-950 text-white">
    <p className="text-sm text-white/70">{message}</p>
  </div>
);
