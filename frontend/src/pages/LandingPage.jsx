import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Shield, Zap, BarChart2, Package, Star, ArrowRight } from 'lucide-react';

/* ── Animated pixel coin canvas ── */
function PixelCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#FBD000', '#E52521', '#049CD8', '#43B047', '#FF6B9D', '#7B2FBE'];
    const COUNT = 40;
    const coins = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 6 + 3,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      coins.forEach((c) => {
        ctx.save();
        ctx.globalAlpha = c.alpha;
        ctx.fillStyle = c.color;
        ctx.shadowColor = c.color;
        ctx.shadowBlur = 8;

        // Draw pixel-style square "coin"
        const s = c.size;
        ctx.fillRect(Math.round(c.x), Math.round(c.y), s, s);

        // Inner highlight
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = c.alpha * 0.3;
        ctx.fillRect(Math.round(c.x) + 1, Math.round(c.y) + 1, s - 2, s - 2);

        ctx.restore();

        c.x += c.dx;
        c.y += c.dy;
        if (c.x < 0 || c.x > canvas.width) c.dx *= -1;
        if (c.y < 0 || c.y > canvas.height) c.dy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ── Floating pixel badge ── */
function PixelBadge({ icon: Icon, label, sub, style }) {
  return (
    <div
      className="absolute bg-[#1A1A2E] border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] px-4 py-3 flex items-center gap-3 animate-bounce-coin"
      style={style}
    >
      <div className="bg-[#E52521] border-2 border-black p-2">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-white font-bold text-[16px]" style={{ fontFamily: "'Russo One', sans-serif" }}>{label}</p>
        <p className="text-[#5C94FC] text-[17px] mt-1" style={{ fontFamily: "'Russo One', sans-serif" }}>{sub}</p>
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: ShoppingCart, title: 'Smart Shopping', desc: 'Browse thousands of products across Electronics, Fashion, Books, and Home goods.', color: '#E52521' },
  { icon: Shield, title: 'Secure Checkout', desc: 'JWT-authenticated orders saved directly to MySQL via JDBC — real data, every time.', color: '#049CD8' },
  { icon: BarChart2, title: 'Admin Analytics', desc: 'Live revenue charts, order status breakdown, and top-product rankings.', color: '#43B047' },
  { icon: Zap, title: 'Instant Orders', desc: 'Add to cart, checkout, and track your order history in real time.', color: '#FBD000' },
  { icon: Package, title: 'Order Tracking', desc: 'Full order lifecycle: PENDING → PAID → SHIPPED → DELIVERED.', color: '#FF6B9D' },
  { icon: Star, title: 'Product Reviews', desc: 'Customers can rate and review products stored in the database.', color: '#7B2FBE' },
];

export default function LandingPage() {
  return (
    <div className="dark-page overflow-x-hidden">

      {/* ── Top Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F23]/95 border-b-3 border-black">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#E52521] border-2 border-black p-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              <ShoppingCart size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Russo One', sans-serif" }}>
              Shop<span className="text-[#FBD000]">Stream</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-[16px]" style={{ fontFamily: "'Russo One', sans-serif" }}>
            <a href="#features" className="text-[#5C94FC] hover:text-[#FBD000] transition-colors">Features</a>
            <a href="#demo" className="text-[#5C94FC] hover:text-[#FBD000] transition-colors">Demo</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[16px] font-semibold text-[#5C94FC] hover:text-[#FBD000] transition-colors px-4 py-2"
              style={{ fontFamily: "'Russo One', sans-serif" }}
            >
              Sign In
            </Link>
            <Link
              to="/login?tab=register"
              className="retro-btn bg-[#FBD000] hover:bg-[#ffe033] text-black text-[16px] font-bold px-5 py-2 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: "'Russo One', sans-serif" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Pixel canvas */}
        <PixelCanvas />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#E52521]/20 border-2 border-[#E52521]/50 px-4 py-2 mb-8 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
            <span className="w-3 h-3 bg-[#43B047] border border-black animate-blink" />
            <span className="text-white text-[17px] font-bold" style={{ fontFamily: "'Russo One', sans-serif" }}>
              Full-Stack DBMS Project — Spring Boot + MySQL + React
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-6" style={{ fontFamily: "'Russo One', sans-serif" }}>
            <span className="text-white">The Modern</span>
            <span className="block bg-gradient-to-r from-[#FBD000] via-[#E52521] to-[#FF6B9D] bg-clip-text text-transparent mt-4">
              Shopping Platform
            </span>
          </h1>

          <p className="text-sm md:text-base text-[#5C94FC] max-w-2xl mx-auto mb-10 leading-relaxed" style={{ fontFamily: "'Russo One', sans-serif" }}>
            A complete e-commerce system with customer storefront, admin dashboard,
            real JDBC database operations, JWT authentication, and live analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login?tab=register"
              className="retro-btn inline-flex items-center gap-2 bg-[#FBD000] hover:bg-[#ffe033] text-black font-bold px-8 py-4 text-[17px] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: "'Russo One', sans-serif" }}
            >
              Start Shopping <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="retro-btn inline-flex items-center gap-2 bg-[#049CD8] hover:bg-[#06b0f0] text-white font-bold px-8 py-4 text-[17px]"
              style={{ fontFamily: "'Russo One', sans-serif" }}
            >
              Admin Login
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[['20+', 'Products'], ['15+', 'Orders'], ['10+', 'Customers']].map(([num, label]) => (
              <div key={label} className="text-center bg-[#1A1A2E] border-3 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
                <p className="text-2xl font-extrabold text-white" style={{ fontFamily: "'Russo One', sans-serif" }}>{num}</p>
                <p className="text-[17px] text-[#5C94FC] mt-2" style={{ fontFamily: "'Russo One', sans-serif" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating badges */}
        <PixelBadge icon={ShoppingCart} label="Order Placed!" sub="Aurora X1 Laptop" style={{ top: '25%', left: '5%', animationDelay: '0s' }} />
        <PixelBadge icon={BarChart2} label="$4,820 Revenue" sub="This month" style={{ top: '30%', right: '5%', animationDelay: '1.5s' }} />
        <PixelBadge icon={Package} label="Shipped" sub="Order #12" style={{ bottom: '25%', left: '4%', animationDelay: '0.8s' }} />
        <PixelBadge icon={Star} label="5 Star Review" sub="Great product!" style={{ bottom: '28%', right: '4%', animationDelay: '2s' }} />
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#E52521] text-[16px] font-bold uppercase tracking-widest mb-3" style={{ fontFamily: "'Russo One', sans-serif" }}>What&apos;s Inside</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white" style={{ fontFamily: "'Russo One', sans-serif" }}>Everything you need</h2>
            <p className="text-[#5C94FC] mt-4 max-w-xl mx-auto text-[16px] leading-relaxed" style={{ fontFamily: "'Russo One', sans-serif" }}>All DBMS concepts covered — CRUD, JOINs, aggregations, transactions, and role-based access.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="retro-card p-6 hover:translate-x-[-2px] hover:translate-y-[-2px] group">
                <div className="border-2 border-black p-3 w-fit mb-4 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ background: `${color}30` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "'Russo One', sans-serif" }}>{title}</h3>
                <p className="text-[#5C94FC] text-[15px] leading-relaxed" style={{ fontFamily: "'Russo One', sans-serif" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo CTA ── */}
      <section id="demo" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative border-3 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.5)] p-12 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A1A2E, #16213E, #0F3460)' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(251,208,0,0.1) 20px, rgba(251,208,0,0.1) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(251,208,0,0.1) 20px, rgba(251,208,0,0.1) 21px)' }} />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "'Russo One', sans-serif" }}>Ready to explore?</h2>
              <p className="text-[#5C94FC] mb-8 max-w-lg mx-auto text-[16px] leading-loose" style={{ fontFamily: "'Russo One', sans-serif" }}>
                Sign in as <span className="text-white font-bold">Admin</span> to manage products, orders & analytics.
                Or register as a <span className="text-[#43B047] font-bold">Customer</span> to shop, checkout & track orders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="retro-btn inline-flex items-center gap-2 bg-[#049CD8] text-white font-bold px-8 py-3.5 text-[16px]"
                  style={{ fontFamily: "'Russo One', sans-serif" }}
                >
                  Admin Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop"
                  className="retro-btn inline-flex items-center gap-2 bg-[#FBD000] text-black font-bold px-8 py-3.5 text-[16px] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)]"
                  style={{ fontFamily: "'Russo One', sans-serif" }}
                >
                  Browse Store <ShoppingCart className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-[#4a4a6a] text-[16px] mt-6" style={{ fontFamily: "'Russo One', sans-serif" }}>
                Admin: admin@store.com / password · Customer: customer@store.com / password
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t-3 border-black bg-[#0F0F23] py-8 text-center">
        <p className="text-[#5C94FC] text-[17px]" style={{ fontFamily: "'Russo One', sans-serif" }}>© 2025 ShopStream · Built with Spring Boot, JDBC, MySQL, React & Tailwind</p>
      </footer>
    </div>
  );
}
