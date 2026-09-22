import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'greet-tool'

// Wait for the tool registry before apply() runs.
export const inject = ['tools']

export function apply(ctx) {
  // Logged once per load, so a boot log proves the plugin really activated.
  // Delete this line once you trust the wiring.
  console.log('[greet-tool] plugin loaded')

  ctx.tools.register(defineTool({
    name: 'greet',
    description: 'Greet someone by name.',
    parameters: {
      name: { type: 'string', required: true, description: 'The name to greet' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      return `Hello, ${args.name}!`
    },
  }))
}