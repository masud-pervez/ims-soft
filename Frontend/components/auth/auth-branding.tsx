interface AuthBrandingProps {
  title?: string;
  description?: string;
}

export function AuthBranding({
  title = "IMS Pro",
  description = "Manage your inventory, orders, and finances with a modern, premium experience.",
}: AuthBrandingProps) {
  return (
    <div className="hidden lg:flex w-1/2 bg-zinc-900 border-r border-zinc-800 items-center justify-center p-12">
      <div className="max-w-md space-y-4 text-white">
        <h1 className="text-4xl font-bold tracking-tighter">{title}</h1>
        <p className="text-zinc-400 text-lg">{description}</p>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="h-32 bg-zinc-800/50 rounded-lg border border-zinc-700/50 p-4">
            <div className="h-full w-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-md" />
          </div>
          <div className="h-32 bg-zinc-800/50 rounded-lg border border-zinc-700/50 p-4">
            <div className="h-full w-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
