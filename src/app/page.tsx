import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User as DbUser } from "@/models/User";
import { Itinerary } from "@/models/Itinerary";
import { redirect } from "next/navigation";
import Link from "next/link";
import HeroSearch from "@/components/itinerary/HeroSearch";
import ItineraryCard from "@/components/ItineraryCard";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const role = (session.user as any).role;
    if (role === 'influencer' || role === 'admin') {
      redirect("/dashboard");
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        padding: '80px 20px',
        width: '100%'
      }}>
        {/* Animated Mesh Gradient Background (Matches Explore Page) */}
        <div className="mesh-gradient-animate" style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '120%',
          height: '100%',
          zIndex: -1,
          opacity: 0.3,
          filter: 'blur(80px)',
          background: `
            radial-gradient(at 0% 0%, rgba(255, 133, 162, 0.4) 0px, transparent 50%),
            radial-gradient(at 50% 0%, rgba(139, 92, 246, 0.4) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.4) 0px, transparent 50%)
          `
        }}></div>

        {/* Abstract Background Elements (Existing) */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          opacity: 0.08,
          filter: 'blur(120px)',
          zIndex: -1,
          animation: 'floating 15s infinite alternate'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          opacity: 0.08,
          filter: 'blur(120px)',
          zIndex: -1,
          animation: 'floating 20s infinite alternate-reverse'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="text-gradient" style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 800,
            marginBottom: '24px',
            lineHeight: 1.1,
            display: 'block'
          }}>
            Stop Guessing. <br />
            Start Experiencing.
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--gray-400)',
            marginBottom: '48px',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.8'
          }}>
            Access field-tested itineraries from the world’s most trusted travel creators.
            No tourist traps. Just authentic, verified adventures.
          </p>

          <HeroSearch />

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/explore" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem', minWidth: '200px' }}>
              Explore Itineraries
            </Link>
            <Link href="/creators" className="btn btn-outline" style={{ padding: '16px 40px', fontSize: '1.1rem', minWidth: '200px' }}>
              Become a Creator
            </Link>
          </div>
        </div>
      </section>

      {/* Features / Value Prop */}
      <section style={{ padding: '80px 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            {[
              { title: "Field-Tested Truth", desc: "Every guide is backed by \"Proof of Visit\" photos. If they haven't been there, they can't sell it here." },
              { title: "The Local Edge", desc: "Skip the \"Top 10\" lists. Get the coffee shop only locals know and the sunset spot that isn't on Instagram yet." },
              { title: "Travel with Confidence", desc: "Downloadable offline guides and interactive maps that work even when your signal doesn't." }
            ].map((feature, i) => (
              <div key={i} className="glass" style={{ padding: '32px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--foreground)' }}>{feature.title}</h3>
                <p style={{ color: 'var(--gray-400)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" style={{ padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '16px', fontWeight: 900 }}>How It Works</h2>
            <p style={{ color: 'var(--gray-400)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>Your journey from inspiration to adventure in three simple, verified steps.</p>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Desktop Connector Line (SVG) */}
            <div className="desktop-only" style={{ position: 'absolute', top: '50px', left: '15%', right: '15%', height: '2px', zIndex: 0 }}>
              <svg width="100%" height="20" style={{ overflow: 'visible' }}>
                <path
                  d="M 0,10 Q 250,10 500,10 T 1000,10"
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeDasharray="10,10"
                  className="connector-path"
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
                    <stop offset="50%" stopColor="var(--primary)" stopOpacity="1" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', position: 'relative', zIndex: 1 }}>
              {[
                {
                  step: "01",
                  title: "Find Inspiration",
                  desc: "Browse premium itineraries from verified world-travelers and influencers you trust."
                },
                {
                  step: "02",
                  title: "Unlock Access",
                  desc: "Purchase the guide for a small fee. 70% goes directly to the creator, supporting their journey."
                },
                {
                  step: "03",
                  title: "Travel Smart",
                  desc: "Get instant access to hidden locations, booking tips, and daily schedules via PDF or interactive map."
                }
              ].map((item, i) => (
                <div key={i} className="how-it-works-card glass" style={{
                  position: 'relative',
                  padding: '48px 32px',
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '32px',
                    boxShadow: '0 10px 20px rgba(255, 133, 162, 0.3)'
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{ fontSize: '1.6rem', marginBottom: '16px', fontWeight: 800 }}>{item.title}</h3>
                  <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', fontSize: '1.05rem' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <Link href="/explore" className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1.2rem', borderRadius: '100px' }}>
              Start Your Journey
            </Link>
          </div>
        </div>


      </section>

      {/* Trending Section */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '12px' }}>Trending Guides ✨</h2>
              <p style={{ color: 'var(--gray-400)' }}>Hand-picked itineraries from our verified creators.</p>
            </div>
            <Link href="/explore" style={{ color: 'var(--foreground)', fontWeight: 600, borderBottom: '1px solid var(--foreground)', textDecoration: 'none', paddingBottom: '2px' }}>View all →</Link>
          </div>

          <TrendingItineraries />
        </div>
      </section>

      {/* Featured Destinations */}
      <section style={{ padding: '100px 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '16px' }}>Top Destinations</h2>
            <p style={{ color: 'var(--gray-400)' }}>Explore the world's most sought-after locations through expert guides.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {[
              { name: "Kyoto", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800", count: 12 },
              { name: "Bali", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800", count: 24 },
              { name: "Paris", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800", count: 18 },
              { name: "Tokyo", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800", count: 31 }
            ].map(dest => (
              <Link
                key={dest.name}
                href={`/explore?search=${dest.name}`}
                className="glass card-hover"
                style={{
                  position: 'relative',
                  height: '350px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  textDecoration: 'none'
                }}
              >
                <img
                  src={dest.img}
                  alt={dest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '32px'
                }}>
                  <h3 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '4px' }}>{dest.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{dest.count} Guides</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Creators Section */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '16px' }}>Meet Our Top Creators</h2>
            <p style={{ color: 'var(--gray-400)' }}>Learn from the best travelers who live life on the edge.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              { name: "Sarah Travels", bio: "Culture explorer based in Kyoto. Sharing hidden shrines and tea houses.", handle: "@SarahTravels", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400", sales: "2.4k" },
              { name: "WanderJohn", bio: "Adventure junkie & solo traveler. expert on the Amalfi Coast and Alps.", handle: "@WanderJohn", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400", sales: "1.8k" },
              { name: "Bali Explorer", bio: "Living the dream in Ubud. Waterfalls, spiritual retreats, and surf spots.", handle: "@BaliExplorer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400", sales: "3.2k" }
            ].map((creator, i) => (
              <div key={i} className="glass card card-hover" style={{ padding: '32px', textAlign: 'center', borderRadius: '32px' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 24px auto', overflow: 'hidden', border: '4px solid var(--primary-light)', padding: '4px' }}>
                  <img src={creator.img} alt={creator.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{creator.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px' }}>{creator.handle}</p>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.6' }}>{creator.bio}</p>
                <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: '16px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{creator.sales}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Sales</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

async function TrendingItineraries() {
  await connectToDatabase();

  let itineraries: any = await Itinerary.find({
    is_published: true,
    is_approved: true
  })
    .populate('creator_id', 'full_name is_verified')
    .sort({ average_rating: -1 })
    .limit(3)
    .lean();

  if (!itineraries || itineraries.length === 0) {
    itineraries = await Itinerary.find({
      is_published: true
    })
      .populate('creator_id', 'full_name is_verified')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
  }

  if (!itineraries || itineraries.length === 0) return null;

  // Convert the Mongoose documents (which may contain ObjectIds or Dates)
  // to plain Javascript objects to safely pass to the Client Component
  const safeItineraries = JSON.parse(JSON.stringify(itineraries));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
      {safeItineraries.map((item: any) => (
        <ItineraryCard
          key={item._id.toString()}
          itinerary={{
            ...item,
            id: item._id.toString(),
            creator: item.creator_id?.full_name || "@Creator",
            image: item.image_url || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800",
            is_verified: item.creator_id?.is_verified,
            tags: item.tags || []
          }}
        />
      ))}
    </div>
  );
}

