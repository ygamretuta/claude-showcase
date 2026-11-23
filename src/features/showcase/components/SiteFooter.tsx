import { TextHoverEffect } from '@/components/ui/text-hover-effect';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 px-4 pt-12 pb-8">
      <div className="mx-auto flex h-40 max-w-5xl items-center sm:h-72" aria-hidden="true">
        <TextHoverEffect text="CLAUDE" />
      </div>
      <div className="mx-auto mt-4 flex max-w-6xl flex-col gap-2 text-sm text-neutral-500 sm:flex-row sm:justify-between">
        <p>Built with Claude. Next.js, Payload CMS, Tailwind, shadcn/ui and Aceternity UI.</p>
        <a className="hover:text-neutral-200" href="https://github.com/ygamretuta/claude-showcase">
          Source on GitHub
        </a>
      </div>
    </footer>
  );
}
