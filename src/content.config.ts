import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    // Short name for cards and navigation.
    shortTitle: z.string(),
    // One or two sentences. Shown on the card and under the page title.
    summary: z.string(),
    // Controls the badge color. "complete" = finished, "active" = ongoing with results,
    // "progress" = in progress with results pending, "dev" = software in development.
    status: z.enum(['active', 'progress', 'dev', 'complete']),
    // Badge text, e.g. "Ongoing" or "In progress, due Jan 4, 2027".
    statusLabel: z.string(),
    // Lower numbers appear first.
    order: z.number(),
    // The flagship card spans the full width on the home page. Use for one project.
    flagship: z.boolean().default(false),
    context: z.string(),
    period: z.string(),
    role: z.string().optional(),
    tools: z.array(z.string()).default([]),
    // Headline numbers. Only measured or directly stated values.
    metrics: z
      .array(
        z.object({
          value: z.string(),
          unit: z.string().optional(),
          label: z.string(),
        }),
      )
      .default([]),
    // Repository name under the account in site.config.mjs, or a full URL.
    repo: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
