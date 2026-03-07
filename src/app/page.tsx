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

      {/* How it Works Section - Revamped */}
      <section id="how-it-works" style={{ padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '100px' }}>
            <h2 className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '16px', fontWeight: 900 }}>How It Works</h2>
            <p style={{ color: 'var(--gray-400)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>Your journey from inspiration to adventure in three simple, verified steps.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '120px', position: 'relative' }}>

            {/* Step 1 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
              <div style={{ flex: '1 1 400px', position: 'relative' }}>
                <div className="glass" style={{ padding: '40px', borderRadius: '32px', border: '1px solid rgba(139, 92, 246, 0.3)', background: 'linear-gradient(135deg, rgba(255,133,162,0.1), rgba(139,92,246,0.1))' }}>
                  {/* Mock Search Bar UI */}
                  <div style={{ background: 'var(--background)', borderRadius: '100px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--gray-400)', position: 'relative' }}>
                      <div style={{ width: '10px', height: '2px', background: 'var(--gray-400)', position: 'absolute', bottom: '-4px', right: '-6px', transform: 'rotate(45deg)' }} />
                    </div>
                    <span style={{ color: 'var(--gray-400)', fontSize: '1.1rem' }}>Kyoto Hidden Temp...</span>
                  </div>
                  {/* Floating Tags */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: 'var(--primary)', color: 'var(--background)', fontWeight: 600, padding: '8px 16px' }}>#HiddenGems</span>
                    <span className="badge" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)', padding: '8px 16px' }}>#LocalCoffee</span>
                  </div>
                </div>
              </div>
              <div style={{ flex: '1 1 400px' }}>
                <div className="text-gradient" style={{ fontSize: '4rem', fontWeight: 900, opacity: 0.5, marginBottom: '-10px', lineHeight: 1 }}>01</div>
                <h3 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: 800 }}>Discover Verified Magic</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '1.15rem', lineHeight: '1.8' }}>
                  Stop scrolling through endless, sponsored top-10 lists. Search by destination or vibe to find field-tested itineraries from verified creators who actually travel there.
                </p>
              </div>
            </div>

            {/* Step 2 (Reversed) */}
            <div style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: '60px' }}>
              <div style={{ flex: '1 1 400px' }}>
                <div className="text-gradient" style={{ fontSize: '4rem', fontWeight: 900, opacity: 0.5, marginBottom: '-10px', lineHeight: 1 }}>02</div>
                <h3 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: 800 }}>Instant, Lifetime Access</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '1.15rem', lineHeight: '1.8' }}>
                  Purchase once, own it forever. Skip the subscriptions. Get instant access to beautiful web guides and detailed offline PDF downloads the second you buy.
                </p>
              </div>
              <div style={{ flex: '1 1 400px', position: 'relative' }}>
                <div className="glass" style={{ padding: '40px', borderRadius: '32px', border: '1px solid rgba(59, 130, 246, 0.3)', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))', display: 'flex', justifyContent: 'center' }}>
                  {/* Mock PDF/Unlock UI */}
                  <div style={{ background: 'var(--background)', borderRadius: '24px', padding: '24px', width: '250px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-15px', right: '-15px', background: 'var(--primary)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                    </div>
                    <div style={{ height: '120px', background: 'var(--surface)', borderRadius: '12px', marginBottom: '16px' }} />
                    <div style={{ height: '8px', width: '80%', background: 'var(--border)', borderRadius: '4px', margin: '0 auto 8px' }} />
                    <div style={{ height: '8px', width: '60%', background: 'var(--border)', borderRadius: '4px', margin: '0 auto' }} />
                    <div style={{ marginTop: '20px', color: 'var(--primary)', fontWeight: 800 }}>$10.00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
              <div style={{ flex: '1 1 400px', position: 'relative' }}>
                <div className="glass" style={{ padding: '40px', borderRadius: '32px', border: '1px solid rgba(255, 133, 162, 0.3)', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(255,133,162,0.1))' }}>
                  {/* Mock Map UI */}
                  <div style={{ background: 'var(--background)', borderRadius: '24px', height: '220px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                    <svg width="100%" height="100%" style={{ stroke: 'var(--border)', strokeWidth: 2 }}>
                      <line x1="0" y1="50" x2="100%" y2="50" />
                      <line x1="0" y1="100" x2="100%" y2="100" />
                      <line x1="0" y1="150" x2="100%" y2="150" />
                      <line x1="0" y1="200" x2="100%" y2="200" />
                      <line x1="50" y1="0" x2="50" y2="100%" />
                      <line x1="100" y1="0" x2="100" y2="100%" />
                      <line x1="150" y1="0" x2="150" y2="100%" />
                      <line x1="200" y1="0" x2="200" y2="100%" />
                      <line x1="250" y1="0" x2="250" y2="100%" />
                      <line x1="300" y1="0" x2="300" y2="100%" />
                    </svg>
                    {/* Path and Pins */}
                    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                      <path d="M 60,160 Q 150,50 240,120" fill="none" stroke="var(--primary)" strokeWidth="4" strokeDasharray="8 8" />
                    </svg>
                    <div style={{ position: 'absolute', top: '140px', left: '40px', color: 'var(--primary)' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--primary)" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" fill="var(--background)" /></svg>
                    </div>
                    <div style={{ position: 'absolute', top: '100px', left: '220px', color: 'var(--secondary)' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--secondary)" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" fill="var(--background)" /></svg>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ flex: '1 1 400px' }}>
                <div className="text-gradient" style={{ fontSize: '4rem', fontWeight: 900, opacity: 0.5, marginBottom: '-10px', lineHeight: 1 }}>03</div>
                <h3 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: 800 }}>Navigate Like a Local</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '1.15rem', lineHeight: '1.8' }}>
                  No more juggling 5 different apps. Every itinerary comes with a custom interactive map routing. Drop a pin, grab an Uber, and go.
                </p>
              </div>
            </div>

          </div>

          <div style={{ textAlign: 'center', marginTop: '100px' }}>
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

          <TopCreators />
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

async function TopCreators() {
  await connectToDatabase();

  // Aggregate user pipeline to find users with itineraries
  let topCreators = await DbUser.aggregate([
    { $match: { role: { $in: ['influencer', 'admin'] } } },
    {
      $lookup: {
        from: 'itineraries',
        localField: '_id',
        foreignField: 'creator_id',
        as: 'itineraries'
      }
    },
    // Only keep creators who have published itineraries (or keep all if you want empty profiles too)
    // For now, let's keep ones with itineraries to ensure they have content
    { $match: { 'itineraries.0': { $exists: true } } },
    {
      $addFields: {
        itineraryCount: { $size: "$itineraries" }
      }
    },
    { $sort: { itineraryCount: -1 } },
    { $limit: 3 }
  ]);

  if (!topCreators || topCreators.length === 0) {
    // Fallback if no creators with itineraries exist yet
    topCreators = await DbUser.find({ role: { $in: ['influencer', 'admin'] } }).limit(3).lean();
    topCreators = topCreators.map(c => ({ ...c, itineraryCount: 0 }));
  }

  if (!topCreators || topCreators.length === 0) return <p style={{ textAlign: 'center', color: 'var(--gray-400)' }}>More creators joining soon...</p>;

  // Convert ObjectIds to strings for Client Component safe passing if needed, 
  // though we are in a server component rendering standard HTML elements here
  const safeCreators = JSON.parse(JSON.stringify(topCreators));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
      {safeCreators.map((creator: any, i: number) => {
        const username = creator.username || creator.full_name.toLowerCase().replace(/\s+/g, '');
        return (
          <Link href={`/creators/${username}`} key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass card card-hover" style={{ padding: '32px', textAlign: 'center', borderRadius: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 24px auto', overflow: 'hidden', border: '4px solid var(--primary-light)', padding: '4px', background: 'var(--surface)' }}>
                <img
                  src={creator.profile_image || `https://images.unsplash.com/photo-${['1494790108377-be9c29b29330', '1500648767791-00dcc994a43e', '1507003211169-0a1dd7228f2d'][i % 3]}?q=80&w=400`}
                  alt={creator.full_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                {creator.full_name}
                {creator.is_verified && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--primary)" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
                )}
              </h3>
              <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px' }}>@{username}</p>
              <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.6', flexGrow: 1 }}>
                {creator.bio || "Travel enthusiast and itinerary creator on ItineraryGravity."}
              </p>
              <div style={{ background: 'var(--background)', padding: '12px', borderRadius: '16px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
                <span className="text-gradient" style={{ fontWeight: 900, fontSize: '1.2rem' }}>{creator.itineraryCount || 0}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Available Guides</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

