import { NeumorphicCard } from './ui/NeumorphicCard'
import { PhoneFrame } from './ui/PhoneFrame'

/** Shown when Supabase env vars are missing (common on Vercel until you add them). */
export function MissingEnvScreen() {
  return (
    <main className="min-h-dvh px-5 py-10 text-pc-text">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center">
        <PhoneFrame ariaLabel="小宝数数 · 配置提示">
          <div className="flex min-h-[420px] flex-col justify-center px-2 py-8">
            <div className="text-center text-[22px] font-semibold tracking-tightish text-pc-text">小宝数数</div>
            <p className="mt-2 text-center text-[13px] font-medium text-pc-text/60">
              需要配置 Supabase 环境变量后才能使用。
            </p>
            <NeumorphicCard className="mt-8 px-5 py-5 text-left">
              <p className="text-[13px] font-medium leading-relaxed text-pc-text/80">
                在 Vercel 打开本项目 → Settings → Environment Variables，添加：
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-[12px] font-medium text-pc-text/70">
                <li>
                  <code className="rounded bg-pc-bg/80 px-1.5 py-0.5 text-pc-text">VITE_SUPABASE_URL</code>
                </li>
                <li>
                  <code className="rounded bg-pc-bg/80 px-1.5 py-0.5 text-pc-text">VITE_SUPABASE_ANON_KEY</code>
                </li>
              </ul>
              <p className="mt-4 text-[12px] font-medium text-pc-text/55">
                保存后在 Deployments 里 Redeploy 重新部署；本地开发请放在项目根目录{' '}
                <code className="rounded bg-pc-bg/80 px-1">.env</code>。
              </p>
            </NeumorphicCard>
          </div>
        </PhoneFrame>
      </div>
    </main>
  )
}
