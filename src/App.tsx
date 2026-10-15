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
  const statement = title === 'SNF Birds'
    ? 'Sitting along the edge of a river, my friend group sat in silence watching the water go by. One of my best friends spoke up and asked, “So what\'s your favorite bird?” At the moment it was hilarious and random, but it kept me thinking: how can I not know this about them? How could I not know the random, funny, unspoken facts about them? I knew we were going our separate ways as college graduation inched closer. I wanted to use my favorite people\'s favorite birds as a way to say, “I know you, you know me.” Each bird represents each person in the group chat, “Short and Fat,” all sitting on the same branch, in the same place. This collection will most likely never be shown again, as I gave each of the paintings away to their rightful owners at graduation.'
    : title === '2 for 22'
      ? 'If there was one day where you were granted the ability to meet the younger version of yourself, would you take it? I wanted to explore the idea through a series of paintings of who I am at my core and in my soul. Could I meet a younger version of myself and see how much I\'ve changed? How similar are we? What would we do together? This series tells the story of my 22nd birthday and cashing in my wish of meeting a younger me and being able to spend a day with someone who knows the most about myself - ME. I used this time to confront and question the terrifying idea of how a different version of myself would think about current me and my accomplishments.'
      : 'Artist statement will be added here.';
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
  const twoFor22Works = [
    ['1_soul_enter.jpeg', 'Where Did Your Soul Enter the World?', 'Acrylic on canvas', '24 x 20 in', '2026'],
    ['2_reading_time.jpeg', 'Reading Time', 'Acrylic on canvas', '24 x 18 in', '2025'],
    ['3_birthday_girl.jpeg', 'Birthday Girl', 'Acrylic, felt, pom-poms on canvas', '12 x 9 in', '2025'],
    ['4_cake.jpeg', 'Cake for Two', 'Paper mache, cardboard, wire, acrylic, clay', '11 1/2 x 6 x 6 in', '2025'],
    ['5_left.jpeg', 'Special Occasion - left', 'Acrylic on canvas', '18 x 24 in', '2025'],
    ['6_right.jpeg', 'Special Occasion - right', 'Acrylic on canvas', '18 x 24 in', '2025'],
    ['7_Letter_To_You.jpg', 'Letter to you', 'Acrylic on canvas', '10 x 8 in', '2026'],
    ['7_wild_horses.jpeg', 'Wild Horses', 'Acrylic on canvas', '24 x 20 in', '2026'],
    ['8_tiny_travelers.jpeg', 'Twin Travelers', 'Acrylic on canvas', '30 x 37 in', '2025'],
    ['9_state_flowers.jpeg', 'State Flowers', 'Acrylic on canvas', '24 x 18 in', '2025'],
    ['10_happiest.jpeg', 'Happiest', 'Acrylic, mica powder on canvas', '24 x 36 in', '2026'],
    ['11_dress_up.jpeg', 'Dress up Delainey', 'Acrylic, magnets on canvas', '18 x 24 in', '2026'],
    ['12_Shirt.jpg', 'Shirt 1', 'Acrylic, cardboard, magnet', '2026'],
    ['13_Shirt.jpg', 'Shirt 2', 'Acrylic, cardboard, magnet', '2026'],
    ['14_Pant_1.jpg', 'Pant 1', 'Acrylic, cardboard, magnet', '2026'],
    ['15_Pants_2.jpg', 'Pant 2', 'Acrylic, cardboard, magnet', '2026'],
    ['16_Shoes_1.jpg', 'Shoes 1', 'Acrylic, cardboard, magnet', '2026'],
  ];

  return (
    <main className="page project-page">
      <h1>{title}</h1>
      {title !== 'Other Work' && <p className="statement-placeholder">{statement}</p>}
      <div className={`artwork-grid${title === '2 for 22' ? ' two-for-22-grid' : ''}`} aria-label={`${title} artwork image spaces`}>
        {title === 'SNF Birds' || title === 'Other Work' || title === '2 for 22'
          ? (title === 'SNF Birds' ? birdWorks : title === 'Other Work' ? collectionWorks : []).map(([file, name, medium, dimensions, year]) => (
              <figure className="artwork-card" key={file}>
                <img className="artwork-slot" src={title === 'SNF Birds' ? `/pics/birds/${file}` : `/pics/other_works/${file}`} alt={name} />
                <figcaption>
                  <strong>{name}</strong>
                  <span>{medium}</span>
                  <span>{dimensions}</span>
                  <span>{year}</span>
                </figcaption>
              </figure>
            )).concat(title === '2 for 22' ? twoFor22Works.map(([file, name, medium, dimensions, year]) => (
              <figure className="artwork-card" key={file}>
                <img className="artwork-slot" src={`/pics/two_twenty_two/${file}`} alt={name} />
                <figcaption>
                  <strong>{name}</strong>
                  <span>{medium}</span>
                  <span>{dimensions}</span>
                  <span>{year}</span>
                </figcaption>
              </figure>
            )) : [])
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
      <p className="about-bio">
        Born and raised in Northern Nevada, she draws a lot of influence from nature and the outdoors. Her work explores the ideas of who we are at our core and how nature has an effect on us. In 2026, she graduated from Oregon State University with a Bachelor of Fine Arts in Studio Art with a concentration in painting, additionally with an art history minor.
      </p>
    </main>
  );
}

function ContactPage() {
  return (
    <main className="page simple-page contact-page">
      <p className="eyebrow">Delainey Anderson</p>
      <h1>Contact</h1>
      <div className="contact-copy">
        <p>I would love to hear from you!</p>
        <p>If you have inquiries regarding myself or my artwork, please contact me using the info below.</p>
        <p>
          Email: <a href="mailto:delaineyandersonart@gmail.com">delaineyandersonart@gmail.com</a><br />
          Instagram: <a href="https://www.instagram.com/delaineyandersonart/" target="_blank" rel="noreferrer">delaineyandersonart</a>
        </p>
      </div>
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
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<SimplePage title="Page not found" note="The page you are looking for does not exist." />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Site;
