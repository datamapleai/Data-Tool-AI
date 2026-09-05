import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export default async function ResourcesPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const resources = await db.resource.findMany({
    where: { userId },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  const categories = await db.category.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-mono font-bold text-canvas-text">
          Resources
        </h2>
        <button className="px-4 py-2 bg-accent hover:bg-accent-strong text-white rounded-[--radius-md] text-sm font-medium transition-colors">
          + Add Resource
        </button>
      </div>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="px-3 py-1.5 bg-surface border border-canvas-border rounded-full text-sm text-canvas-text hover:bg-surface-2 transition-colors"
            >
              {cat.icon && <span className="mr-1">{cat.icon}</span>}
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Resource grid */}
      {resources.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-lg font-mono font-medium text-canvas-text mb-2">
            No resources yet
          </h3>
          <p className="text-canvas-text-dim text-sm">
            Add your first bookmark to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-surface border border-canvas-border rounded-[--radius-md] p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-mono font-medium text-canvas-text text-sm leading-tight">
                  {resource.title}
                </h3>
                {resource.isFavorite && (
                  <span className="text-accent text-sm">★</span>
                )}
              </div>
              {resource.category && (
                <span className="inline-block px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full mb-2">
                  {resource.category.name}
                </span>
              )}
              {resource.description && (
                <p className="text-canvas-text-dim text-xs line-clamp-2 mb-2">
                  {resource.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {resource.tags.slice(0, 3).map((t) => (
                    <span
                      key={t.tagId}
                      className="px-1.5 py-0.5 bg-surface-2 text-canvas-text-dim text-[10px] rounded"
                    >
                      {t.tag.name}
                    </span>
                  ))}
                </div>
                {resource.rating && (
                  <span className="text-xs text-canvas-text-dim">
                    {"★".repeat(resource.rating)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
