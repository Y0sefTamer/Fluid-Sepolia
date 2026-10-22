import { ActivityFeed } from '@/components/faucet/activity-feed'
import { ClaimCard } from '@/components/faucet/claim-card'
import { DonateCard } from '@/components/faucet/donate-card'
import { Hero } from '@/components/faucet/hero'
import { OwnerPanel } from '@/components/faucet/owner-panel'
import { StatsGrid } from '@/components/faucet/stats-grid'
import { BackgroundDecor } from '@/components/layout/background-decor'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { WrongNetworkBanner } from '@/components/layout/wrong-network-banner'

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <BackgroundDecor />
      <Header />
      <WrongNetworkBanner />

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        <Hero />
        <StatsGrid />

        <section
          id="claim"
          aria-label="Faucet actions"
          className="grid scroll-mt-24 gap-5 pb-14 lg:grid-cols-12 lg:items-stretch lg:pb-20"
        >
          <div className="lg:col-span-7">
            <ClaimCard />
          </div>
          <div className="lg:col-span-5">
            <DonateCard />
          </div>
        </section>

        <div className="space-y-5 pb-14 lg:pb-20">
          <ActivityFeed />
          <OwnerPanel />
        </div>
      </main>

      <Footer />
    </div>
  )
}
