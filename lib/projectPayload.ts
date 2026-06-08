type RoleInput = {
  title: string;
  skills: string[];
  experience: string;
  openings: number;
};

export function validateProjectPayload(data: Record<string, unknown>): string | null {
  const title = String(data.title ?? '').trim();
  const description = String(data.description ?? '').trim();

  if (title.length < 3) return 'Project title must be at least 3 characters.';
  if (description.length < 10) return 'Description must be at least 10 characters.';

  const roles = (data.roles as RoleInput[] | undefined) ?? [];
  if (roles.length === 0) return 'Add at least one role.';

  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    if (!role.title?.trim()) return `Role #${i + 1} needs a title.`;
    if (!role.experience?.trim()) return `Role #${i + 1} needs an experience level.`;
    if (!role.skills?.length) return `Role #${i + 1} needs at least one skill.`;
  }

  return null;
}

export function sanitizeProjectPayload(data: Record<string, unknown>) {
  const roles = ((data.roles as RoleInput[]) ?? []).map((role) => ({
    title: role.title.trim(),
    skills: role.skills.map((s) => s.trim()).filter(Boolean),
    experience: role.experience.trim(),
    openings: Math.max(1, Number(role.openings) || 1),
  }));

  let deadline: string | null = null;
  const rawDeadline = String(data.deadline ?? '').trim();
  if (rawDeadline) {
    deadline = rawDeadline.includes('T')
      ? new Date(rawDeadline).toISOString()
      : new Date(`${rawDeadline}T00:00:00.000Z`).toISOString();
  }

  const slackRaw = String(data.slackChannelId ?? '').trim();

  return {
    title: String(data.title).trim(),
    description: String(data.description).trim(),
    deadline,
    slackChannelId: slackRaw || null,
    roles,
  };
}
