import { useEffect, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Home from './home';
import './App.css';
import { instagramUrl } from './siteConfig';

const projects = [
  { label: '2 for 22', slug: '2-for-22' },
  { label: 'SNF Birds', slug: 'snf-birds' },
  { label: 'Other Work', slug: 'collection' },
];

function SiteHeader() {
  const [workOpen, setWorkOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setWorkOpen(false), [location.pathname]);

  return (
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="Delainey Anderson, home">
        Delainey Anderson
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        <NavLink end to="/">Home</NavLink>
        <div
          className="work-menu"
          onMouseEnter={() => setWorkOpen(true)}
          onMouseLeave={() => setWorkOpen(false)}
        >
          <NavLink className={({ isActive }) => isActive || location.pathname.startsWith('/work') ? 'active' : ''} to="/work">
            Collections
          </NavLink>
          <button
            className="menu-toggle"
            type="button"
            aria-label="Toggle work menu"
            aria-haspopup="true"
            aria-expanded={workOpen}
            onClick={() => setWorkOpen((open) => !open)}
          >
            <span aria-hidden="true">⌄</span>
          </button>
          {workOpen && (
            <div className="work-dropdown">
              {projects.map((project) => (
                <Link key={project.slug} to={`/work/${project.slug}`}>
                  {project.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <NavLink to="/cv">CV</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <a
          className={`instagram-link${instagramUrl ? '' : ' is-unlinked'}`}
          href={instagramUrl || undefined}
          aria-label={instagramUrl ? 'Instagram' : 'Instagram link (add profile URL in src/siteConfig.ts)'}
          aria-disabled={!instagramUrl}
          tabIndex={instagramUrl ? 0 : -1}
          target={instagramUrl ? '_blank' : undefined}
          rel={instagramUrl ? 'noreferrer' : undefined}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle className="instagram-dot" cx="18" cy="6.5" r="1" />
          </svg>
        </a>
      </nav>
    </header>
  );
}

function WorkPage() {
  return (
    <main className="page work-index">
      <h1>Collections</h1>
      <div className="project-links">
        {projects.map((project, index) => (
          <Link key={project.slug} to={`/work/${project.slug}`}>
            <span className="project-number">0{index + 1}</span>
            <span>{project.label}</span>
            <span className="project-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

function ProjectPage({ title }: { title: string }) {
  const birdWorks = [
    ['Stellers_Jay.jpeg', "Steller’s Jay", 'Acrylic', '10” x 8”', '2026'],
    ['Puffin.jpeg', 'Puffin', 'Acrylic', '10” x 8”', '2026'],
    ['Cardinal.jpeg', 'Cardinal', 'Acrylic', '10” x 8”', '2026'],
    ['Manu_o_ku.jpeg', 'Manu o ku', 'Acrylic', '10” x 8”', '2026'],
    ['Loon.jpeg', 'Loon', 'Acrylic', '10” x 8”', '2026'],
    ['Hummingbird.jpeg', 'Hummingbird', 'Acrylic', '10” x 8”', '2026'],
    ['Chickadee.jpg', 'Chickadee', 'Acrylic', '8” x 10”', '2026'],
  ];
  const collectionWorks = [
    ['Beaver.jpeg', 'Beaver', 'Acrylic', '10 x 8 in', '2026'],
    ['Arizona.jpeg', 'Arizona', 'Acrylic', '8 x 10 in', '2026'],
    ['California_Bighorn.jpeg', 'California Bighorn', 'Gouache and acrylic', '8 x 8 in', '2025'],
    ['Sand_Harbor.jpg', 'Sand Harbor', 'Acrylic', '24 x 30 in', '2024'],
    ['Rainbow_Trout.jpeg', 'Rainbow Trout', 'Acrylic and Mica Powder', '24 x 24 in', '2026'],
  ];

  return (
    <main className="page project-page">
      <p className="eyebrow">Selected work</p>
      <h1>{title}</h1>
      <p className="statement-placeholder">Artist statement will be added here.</p>
      <div className="artwork-grid" aria-label={`${title} artwork image spaces`}>
        {title === 'SNF Birds' || title === 'Other Work'
          ? (title === 'SNF Birds' ? birdWorks : collectionWorks).map(([file, name, medium, dimensions, year]) => (
              <figure className="artwork-card" key={file}>
                <img className="artwork-slot" src={title === 'SNF Birds' ? `/pics/birds/${file}` : `/pics/other_works/${file}`} alt={name} />
                <figcaption>
                  <strong>{name}</strong>
                  <span>{medium}</span>
                  <span>{dimensions}</span>
                  <span>{year}</span>
                </figcaption>
              </figure>
            ))
          : Array.from({ length: 6 }, (_, index) => (
              <div className="artwork-slot" key={index} aria-label={`Artwork image space ${index + 1}`} />
            ))}
      </div>
    </main>
  );
}

function SimplePage({ title, note }: { title: string; note: string }) {
  return (
    <main className="page simple-page">
      <p className="eyebrow">Delainey Anderson</p>
      <h1>{title}</h1>
      <p>{note}</p>
    </main>
  );
}

function CvPage() {
  return (
    <main className="page cv-page">
      <h1>CV</h1>
      <div className="cv-content">
        <section className="cv-section">
          <h2>Education</h2>
          <p><em>2022–2026</em> <strong>Bachelor of Fine Arts, Painting</strong>, Oregon State University, Corvallis, OR</p>
        </section>
        <section className="cv-section">
          <h2>Solo Exhibitions</h2>
          <p className="cv-year">2026</p>
          <p><strong>2 for 22</strong>, PRAXIS Gallery, Corvallis, OR</p>
        </section>
        <section className="cv-section">
          <h2>Group Exhibitions</h2>
          <p className="cv-year">2026</p>
          <p><strong>Annual Graduating BFA Exhibition</strong>, Fairbanks Galleries, Corvallis, OR</p>
          <p><strong>Nurture Nature</strong>, PRAXIS Gallery, Corvallis, OR</p>
          <p><strong>Between Crisis and Hope</strong>, Memorial Union Concourse Gallery, Corvallis, OR</p>
          <p><strong>Howland Community Open</strong>, The Arts Center, Corvallis, OR</p>
          <p className="cv-year">2025</p>
          <p><strong>Soundbox8 DRIP</strong>, PRAXIS Gallery, Corvallis, OR</p>
          <p><strong>Soundbox8 DRIP - EDDY: A Transdisciplinary Feedback Loop</strong>, PRAXIS Gallery, Corvallis, OR</p>
          <p><strong>Potential Spam - A Zine Exhibition</strong>, Corrine Woodman Gallery at The Art Center, Corvallis
OR, Juror Evan Baden</p>
          <p><strong>Howland Community Open</strong>, The Arts Center, Corvallis, OR</p>
          <p className="cv-year">2023</p>
          <p><strong>Core Studio</strong>, Praxis Gallery Corvallis OR, Juror Joan Truckenbrod</p>
        </section>
        <section className="cv-section">
          <h2>Awards</h2>
          <p className="cv-year">2026</p>
          <p><strong>SVPDA Art Excellence Purchase Award</strong>, Oregon State University, Corvallis OR</p>
        </section>
      </div>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="page about-page">
      <p className="eyebrow">About</p>
      <h1>Delainey Anderson is an artist and painter currently based in Gilbert, Arizona.</h1>
    </main>
  );
}

function Site() {
  return (
    <BrowserRouter>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/2-for-22" element={<ProjectPage title="2 for 22" />} />
        <Route path="/work/snf-birds" element={<ProjectPage title="SNF Birds" />} />
        <Route path="/work/collection" element={<ProjectPage title="Other Work" />} />
        <Route path="/cv" element={<CvPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<SimplePage title="Contact" note="Contact details will be added here." />} />
        <Route path="*" element={<SimplePage title="Page not found" note="The page you are looking for does not exist." />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Site;
