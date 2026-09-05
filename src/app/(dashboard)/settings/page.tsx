import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const user = await db.user.findUnique({ where: { id: userId } });


  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-xl font-mono font-bold text-canvas-text mb-6">
        Settings
      </h2>

      {/* Profile */}
      <section className="bg-surface border border-canvas-border rounded-[--radius-lg] p-6 mb-4">
        <h3 className="font-mono font-medium text-canvas-text mb-4">Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-canvas-text-dim mb-1">
              Name
            </label>
            <input
              type="text"
              defaultValue={user?.name ?? ""}
              className="w-full px-3 py-2 bg-canvas-input border border-canvas-border rounded-[--radius-sm] text-canvas-text text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-canvas-text-dim mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue={user?.email ?? ""}
              className="w-full px-3 py-2 bg-canvas-input border border-canvas-border rounded-[--radius-sm] text-canvas-text text-sm"
            />
          </div>
        </div>
      </section>

      {/* AI Provider */}
      <section className="bg-surface border border-canvas-border rounded-[--radius-lg] p-6 mb-4">
        <h3 className="font-mono font-medium text-canvas-text mb-4">
          AI Provider (BYOK)
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-canvas-text-dim mb-1">
              Provider
            </label>
            <select className="w-full px-3 py-2 bg-canvas-input border border-canvas-border rounded-[--radius-sm] text-canvas-text text-sm">
              <option value="">Not configured</option>
              <option value="openrouter">OpenRouter</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="ollama">Ollama (Local)</option>
              <option value="litellm">LiteLLM</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-canvas-text-dim mb-1">
              Base URL
            </label>
            <input
              type="text"
              placeholder="https://api.openai.com/v1"
              className="w-full px-3 py-2 bg-canvas-input border border-canvas-border rounded-[--radius-sm] text-canvas-text text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-canvas-text-dim mb-1">
              API Key
            </label>
            <input
              type="password"
              placeholder="sk-..."
              className="w-full px-3 py-2 bg-canvas-input border border-canvas-border rounded-[--radius-sm] text-canvas-text text-sm"
            />
            <p className="text-xs text-canvas-text-dim mt-1">
              Encrypted at rest. Never sent to the frontend.
            </p>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-surface border border-canvas-border rounded-[--radius-lg] p-6">
        <h3 className="font-mono font-medium text-canvas-text mb-4">
          Preferences
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-canvas-text-dim mb-1">
              Theme
            </label>
            <select className="w-full px-3 py-2 bg-canvas-input border border-canvas-border rounded-[--radius-sm] text-canvas-text text-sm">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-canvas-text-dim mb-1">
              Default View
            </label>
            <select className="w-full px-3 py-2 bg-canvas-input border border-canvas-border rounded-[--radius-sm] text-canvas-text text-sm">
              <option value="grid">Grid</option>
              <option value="list">List</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}
