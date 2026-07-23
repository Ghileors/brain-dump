import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CandidateTaskSchema = z.object({
  title: z.string().trim().min(1),
  priority: z.enum(['low', 'medium', 'high']).catch('medium'),
  dueDate: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)))
    .nullable()
    .catch(null),
});

const RECORD_TASKS_TOOL: Anthropic.Tool = {
  name: 'record_tasks',
  description:
    "Record the list of actionable tasks extracted from the user's free-form brain-dump text.",
  input_schema: {
    type: 'object',
    properties: {
      tasks: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Short, actionable task title' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            dueDate: {
              type: ['string', 'null'],
              description: 'ISO 8601 date, or null if no due date is mentioned',
            },
          },
          required: ['title', 'priority', 'dueDate'],
        },
      },
    },
    required: ['tasks'],
  },
};

export async function POST(request: Request) {
  let text: string;
  try {
    const body = await request.json();
    text = typeof body?.text === 'string' ? body.text : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!text.trim()) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  const client = new Anthropic();

  let response: Anthropic.Message;
  try {
    response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      tools: [RECORD_TASKS_TOOL],
      tool_choice: { type: 'tool', name: 'record_tasks' },
      messages: [
        {
          role: 'user',
          content: `Extract actionable tasks from this brain-dump text using the record_tasks tool:\n\n${text}`,
        },
      ],
    });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error(`Anthropic API error ${error.status}: ${error.message}`);
    } else {
      console.error('Anthropic API call failed:', error);
    }
    return NextResponse.json({ error: 'Failed to reach the AI service' }, { status: 502 });
  }

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use' && block.name === 'record_tasks',
  );

  const rawTasks =
    toolUse && typeof toolUse.input === 'object' && toolUse.input !== null
      ? (toolUse.input as { tasks?: unknown }).tasks
      : undefined;

  if (!Array.isArray(rawTasks)) {
    return NextResponse.json({ error: 'Could not parse tasks from the AI response' }, { status: 502 });
  }

  const tasks = rawTasks
    .map((candidate) => CandidateTaskSchema.safeParse(candidate))
    .filter((result) => result.success)
    .map((result) => result.data);

  return NextResponse.json({ tasks });
}
