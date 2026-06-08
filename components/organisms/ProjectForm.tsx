'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Badge } from '@/components/atoms/Badge';
import { validateProjectPayload, sanitizeProjectPayload } from '@/lib/projectPayload';
import { SlackChannelSelect } from '@/components/molecules/SlackChannelSelect';
import { X } from 'lucide-react';



interface RoleInput {
  title: string;
  skills: string[];
  experience: string;
  openings: number;
}

interface ProjectFormProps {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<Record<string, unknown>>;
  submitLabel?: string;
  className?: string;
}

export function ProjectForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Save',
  className,
}: ProjectFormProps) {
  const [roles, setRoles] = useState<RoleInput[]>(() => {
    const source = ((initialData as { roles?: Array<{ title?: string; skills?: string[]; experience?: string; openings?: number }> } | undefined)?.roles ?? []);
    const parsed = source.map((r) => ({
      title: r.title ?? '',
      skills: r.skills ?? [],
      experience: r.experience ?? '',
      openings: r.openings ?? 1,
    }));
    return parsed.length > 0 ? parsed : [{ title: '', skills: [], experience: '', openings: 1 }];
  });
  const [skillInput, setSkillInput] = useState<Record<number, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Record<string, unknown>>({
    defaultValues: {
      title: (initialData?.title as string) ?? '',
      description: (initialData?.description as string) ?? '',
      deadline: (initialData?.deadline as string) ?? '',
      slackChannelId: (initialData?.slackChannelId as string) ?? '',
    },
  });

  const addRole = () => {
    setRoles((prev) => [...prev, { title: '', skills: [], experience: '', openings: 1 }]);
  };

  const updateRole = (idx: number, field: keyof RoleInput, value: unknown) => {
    setRoles((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addSkill = (roleIdx: number) => {
    const value = skillInput[roleIdx]?.trim();
    if (!value) return;
    setRoles((prev) => {
      const next = [...prev];
      next[roleIdx] = {
        ...next[roleIdx],
        skills: [...next[roleIdx].skills, value],
      };
      return next;
    });
    setSkillInput((prev) => ({ ...prev, [roleIdx]: '' }));
  };

  const removeSkill = (roleIdx: number, skill: string) => {
    setRoles((prev) => {
      const next = [...prev];
      next[roleIdx] = {
        ...next[roleIdx],
        skills: next[roleIdx].skills.filter((s) => s !== skill),
      };
      return next;
    });
  };

  const removeRole = (idx: number) => {
    setRoles((prev) => prev.filter((_, i) => i !== idx));
  };

  const onFormSubmit = handleSubmit(async (data) => {
    setFormError(null);
    const payload = { ...data, roles };
    const validationError = validateProjectPayload(payload);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(sanitizeProjectPayload(payload));
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onFormSubmit} className={cn('space-y-5', className)}>
      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {formError}
        </div>
      )}
      <Input label="Title" {...register('title')} error={errors.title?.message} required />
      <Input
        label="Description"
        {...register('description')}
        error={errors.description?.message}
        required
        as="textarea"
      />
      <Input
        label="Deadline"
        type="date"
        {...register('deadline')}
        error={errors.deadline?.message}
      />
      <Controller
        name="slackChannelId"
        control={control}
        render={({ field }) => (
          <SlackChannelSelect
            value={(field.value as string) ?? ''}
            onChange={field.onChange}
          />
        )}
      />

      <div className="space-y-3">
        <label className="text-xs font-medium text-[var(--text-muted)]">Roles</label>
        {roles.map((role, idx) => (
          <div
            key={idx}
            className="surface-card p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-syne text-[var(--text-faint)]">Role #{idx + 1}</span>
              {roles.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRole(idx)}
                  className="text-[var(--text-faint)] hover:text-red-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Title"
                value={role.title}
                onChange={(e) => updateRole(idx, 'title', e.target.value)}
                required
              />
              <Input
                label="Experience"
                value={role.experience}
                onChange={(e) => updateRole(idx, 'experience', e.target.value)}
                required
              />
            </div>
            <Input
              label="Openings"
              type="number"
              value={String(role.openings)}
              onChange={(e) => updateRole(idx, 'openings', parseInt(e.target.value) || 1)}
              min={1}
            />
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">Skills</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                  {role.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium font-syne bg-[#4F6EF7] text-white"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(idx, skill)}
                        className="opacity-60 hover:opacity-100"
                        aria-label={`Remove ${skill}`}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput[idx] ?? ''}
                  onChange={(e) => setSkillInput((prev) => ({ ...prev, [idx]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(idx);
                    }
                  }}
                  placeholder="Add skill and press Enter"
                  className="flex-1 h-8 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 text-xs text-[var(--text)] placeholder:text-[var(--text-faint)]"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => addSkill(idx)} className="cursor-pointer">
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
        {errors.roles && (
          <p className="text-xs text-[#EF4444]">{errors.roles.message ?? 'Invalid roles'}</p>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addRole}
          className="cursor-pointer"
        >
          + Add role
        </Button>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} className="cursor-pointer">
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting} className="cursor-pointer">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
