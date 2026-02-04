import Link from "next/link";


export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        padding: '20px 20px',
        paddingTop: '40px'
      }}>
        {/* Abstract Background Elements */}
        <div style={{
          position: 'absolute',
          top: '0%',
          left: '0%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, var(--border) 0%, transparent 70%)',
          filter: 'blur(100px)',
          zIndex: -1,
          animation: 'floating 20s infinite alternate'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '0%',
          right: '0%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, var(--border) 0%, transparent 70%)',
          filter: 'blur(100px)',
          zIndex: -1,
          animation: 'floating 25s infinite alternate-reverse'
        }} />

        <div className="container">
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 800,
            marginBottom: '24px',
            lineHeight: 1.05,
            background: 'linear-gradient(to bottom, var(--foreground) 40%, var(--gray-400))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Travel Like Your <br />
            <span style={{ color: 'var(--foreground)', WebkitTextFillColor: 'initial' }}>Favorite Creator</span>
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            color: 'var(--gray-400)',
            marginBottom: '40px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '0 20px'
          }}>
            Access detailed, verified itineraries from top travel influencers.
            Experience the world through their eyes, with curated tips for hotels, food, and hidden gems.
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            padding: '0 20px'
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
              { title: "Verified Itineraries", desc: "Every itinerary is verified with proof of visit. No more fake reviews." },
              { title: "Hidden Gems", desc: "Discover spots that aren't on the usual tourist map, curated by locals and experts." },
              { title: "Instant Access", desc: "Download PDF guides instantly or view them interactively on our app." }
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
      <section id="how-it-works" style={{ padding: '100px 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>How It Works</h2>
            <p style={{ color: 'var(--gray-400)', maxWidth: '600px', margin: '0 auto' }}>Getting your next perfect trip plan is as easy as 1-2-3.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', position: 'relative' }}>
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
              <div key={i} style={{ position: 'relative', padding: '40px', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)', opacity: 0.2, position: 'absolute', top: '20px', right: '30px' }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', position: 'relative' }}>{item.title}</h3>
                <p style={{ color: 'var(--gray-400)', position: 'relative', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            ))}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {[
              { title: "Kyoto: Traditional Japan", creator: "@SarahTravels", price: "$15", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600" },
              { title: "Amalfi Coast Summer", creator: "@WanderlustJohn", price: "$25", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600" },
              { title: "Bali: Hidden Gems", creator: "@BaliExplorer", price: "$12", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600" }
            ].map((item, i) => (
              <div key={i} className="glass card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '200px', backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '16px' }}>by {item.creator}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{item.price}</span>
                    <Link href={`/itinerary/${i === 0 ? 'kyoto-traditional' : 'bali-hidden'}`} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
