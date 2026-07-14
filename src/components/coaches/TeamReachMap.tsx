import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

// ---------------------------------------------------------------------------
// TeamReachMap — the "every athlete is in play" board, ported from the
// standalone team-map.html pitch page into the live /coaches site. Loads
// d3 + topojson from CDN at runtime (no npm deps added) and renders an
// interactive US map: category filter chips, per-category pin colors, and
// an athlete-weighted reach counter. Colors come from the page tokens.
// ---------------------------------------------------------------------------

type Cat = 'pro' | 'womens' | 'college' | 'hs' | 'ind';

const CATS: Record<Cat, { color: string; label: string; w: number }> = {
  pro: { color: 'hsl(145 72% 50%)', label: 'Pro', w: 55 },
  womens: { color: 'hsl(330 82% 62%)', label: "Women's Pro", w: 30 },
  college: { color: 'hsl(195 60% 55%)', label: 'College', w: 550 },
  hs: { color: 'hsl(265 72% 68%)', label: 'High School', w: 280000 },
  ind: { color: 'hsl(38 92% 55%)', label: 'Olympic & Individual', w: 3500 },
};

const ORDER: (Cat | 'ALL')[] = ['ALL', 'pro', 'womens', 'college', 'hs', 'ind'];

// [name, league, cat, city, lon, lat, weight?]
type Row = [string, string, Cat, string, number, number, number?];

const TEAMS: Row[] = [
  // PRO — NFL / NBA / MLB / NHL / MLS
  ['Patriots — NFL', 'NFL', 'pro', 'Foxborough, MA', -71.264, 42.091],
  ['Bills — NFL', 'NFL', 'pro', 'Buffalo, NY', -78.787, 42.774],
  ['Giants / Jets — NFL', 'NFL', 'pro', 'East Rutherford, NJ', -74.074, 40.813],
  ['Eagles — NFL', 'NFL', 'pro', 'Philadelphia, PA', -75.167, 39.901],
  ['Cowboys — NFL', 'NFL', 'pro', 'Arlington, TX', -97.093, 32.748],
  ['49ers — NFL', 'NFL', 'pro', 'Santa Clara, CA', -121.97, 37.403],
  ['Chiefs — NFL', 'NFL', 'pro', 'Kansas City, MO', -94.484, 39.049],
  ['Packers — NFL', 'NFL', 'pro', 'Green Bay, WI', -88.062, 44.501],
  ['Dolphins — NFL', 'NFL', 'pro', 'Miami, FL', -80.239, 25.958],
  ['Seahawks — NFL', 'NFL', 'pro', 'Seattle, WA', -122.332, 47.595],
  ['Broncos — NFL', 'NFL', 'pro', 'Denver, CO', -105.02, 39.744],
  ['Saints — NFL', 'NFL', 'pro', 'New Orleans, LA', -90.081, 29.951],
  ['Lakers / Clippers — NBA', 'NBA', 'pro', 'Los Angeles, CA', -118.267, 34.043],
  ['Celtics — NBA', 'NBA', 'pro', 'Boston, MA', -71.062, 42.366],
  ['Warriors — NBA', 'NBA', 'pro', 'San Francisco, CA', -122.388, 37.768],
  ['Knicks / Nets — NBA', 'NBA', 'pro', 'New York, NY', -73.993, 40.75],
  ['Heat — NBA', 'NBA', 'pro', 'Miami, FL', -80.187, 25.781],
  ['Bulls — NBA', 'NBA', 'pro', 'Chicago, IL', -87.674, 41.881],
  ['Nuggets — NBA', 'NBA', 'pro', 'Denver, CO', -105.007, 39.749],
  ['Mavericks — NBA', 'NBA', 'pro', 'Dallas, TX', -96.81, 32.79],
  ['Suns — NBA', 'NBA', 'pro', 'Phoenix, AZ', -112.071, 33.446],
  ['Bucks — NBA', 'NBA', 'pro', 'Milwaukee, WI', -87.917, 43.045],
  ['Yankees / Mets — MLB', 'MLB', 'pro', 'New York, NY', -73.926, 40.829],
  ['Red Sox — MLB', 'MLB', 'pro', 'Boston, MA', -71.097, 42.346],
  ['Dodgers — MLB', 'MLB', 'pro', 'Los Angeles, CA', -118.24, 34.073],
  ['Cubs — MLB', 'MLB', 'pro', 'Chicago, IL', -87.656, 41.948],
  ['Braves — MLB', 'MLB', 'pro', 'Atlanta, GA', -84.468, 33.891],
  ['Astros — MLB', 'MLB', 'pro', 'Houston, TX', -95.355, 29.757],
  ['Cardinals — MLB', 'MLB', 'pro', 'St. Louis, MO', -90.193, 38.623],
  ['Giants — MLB', 'MLB', 'pro', 'San Francisco, CA', -122.389, 37.779],
  ['Rangers — NHL', 'NHL', 'pro', 'New York, NY', -73.976, 40.75],
  ['Bruins — NHL', 'NHL', 'pro', 'Boston, MA', -71.062, 42.366],
  ['Blackhawks — NHL', 'NHL', 'pro', 'Chicago, IL', -87.674, 41.881],
  ['Red Wings — NHL', 'NHL', 'pro', 'Detroit, MI', -83.055, 42.341],
  ['Avalanche — NHL', 'NHL', 'pro', 'Denver, CO', -105.008, 39.749],
  ['Golden Knights — NHL', 'NHL', 'pro', 'Las Vegas, NV', -115.178, 36.103],
  ['Wild — NHL', 'NHL', 'pro', 'St. Paul, MN', -93.101, 44.945],
  ['LAFC / Galaxy — MLS', 'MLS', 'pro', 'Los Angeles, CA', -118.284, 33.864],
  ['Sounders — MLS', 'MLS', 'pro', 'Seattle, WA', -122.331, 47.595],
  ['Atlanta United — MLS', 'MLS', 'pro', 'Atlanta, GA', -84.401, 33.755],
  ['Timbers — MLS', 'MLS', 'pro', 'Portland, OR', -122.691, 45.521],
  ['Inter Miami — MLS', 'MLS', 'pro', 'Miami, FL', -80.161, 25.958],
  ['FC Cincinnati — MLS', 'MLS', 'pro', 'Cincinnati, OH', -84.522, 39.111],
  ['Nashville SC — MLS', 'MLS', 'pro', 'Nashville, TN', -86.766, 36.131],
  // WOMEN'S PRO — WNBA / NWSL / PWHL
  ['NY Liberty — WNBA', 'WNBA', 'womens', 'New York, NY', -73.994, 40.683],
  ['Las Vegas Aces — WNBA', 'WNBA', 'womens', 'Las Vegas, NV', -115.198, 36.09],
  ['Seattle Storm — WNBA', 'WNBA', 'womens', 'Seattle, WA', -122.354, 47.622],
  ['Phoenix Mercury — WNBA', 'WNBA', 'womens', 'Phoenix, AZ', -112.071, 33.446],
  ['Chicago Sky — WNBA', 'WNBA', 'womens', 'Chicago, IL', -87.617, 41.853],
  ['Minnesota Lynx — WNBA', 'WNBA', 'womens', 'Minneapolis, MN', -93.276, 44.979],
  ['Indiana Fever — WNBA', 'WNBA', 'womens', 'Indianapolis, IN', -86.155, 39.764],
  ['Atlanta Dream — WNBA', 'WNBA', 'womens', 'Atlanta, GA', -84.396, 33.757],
  ['Dallas Wings — WNBA', 'WNBA', 'womens', 'Arlington, TX', -97.117, 32.744],
  ['LA Sparks — WNBA', 'WNBA', 'womens', 'Los Angeles, CA', -118.267, 34.043],
  ['GS Valkyries — WNBA', 'WNBA', 'womens', 'San Francisco, CA', -122.388, 37.768],
  ['Washington Mystics — WNBA', 'WNBA', 'womens', 'Washington, DC', -76.986, 38.868],
  ['Connecticut Sun — WNBA', 'WNBA', 'womens', 'Uncasville, CT', -72.09, 41.437],
  ['Portland Thorns — NWSL', 'NWSL', 'womens', 'Portland, OR', -122.691, 45.521],
  ['Angel City FC — NWSL', 'NWSL', 'womens', 'Los Angeles, CA', -118.284, 33.864],
  ['KC Current — NWSL', 'NWSL', 'womens', 'Kansas City, MO', -94.581, 39.1],
  ['Gotham FC — NWSL', 'NWSL', 'womens', 'Harrison, NJ', -74.15, 40.736],
  ['Washington Spirit — NWSL', 'NWSL', 'womens', 'Washington, DC', -76.986, 38.868],
  ['San Diego Wave — NWSL', 'NWSL', 'womens', 'San Diego, CA', -117.119, 32.746],
  ['Houston Dash — NWSL', 'NWSL', 'womens', 'Houston, TX', -95.352, 29.752],
  ['Orlando Pride — NWSL', 'NWSL', 'womens', 'Orlando, FL', -81.389, 28.539],
  ['NC Courage — NWSL', 'NWSL', 'womens', 'Cary, NC', -78.78, 35.791],
  ['Bay FC — NWSL', 'NWSL', 'womens', 'San Jose, CA', -121.925, 37.361],
  ['Utah Royals — NWSL', 'NWSL', 'womens', 'Salt Lake City, UT', -111.893, 40.583],
  ['Racing Louisville — NWSL', 'NWSL', 'womens', 'Louisville, KY', -85.759, 38.328],
  ['PWHL Boston', 'PWHL', 'womens', 'Boston, MA', -71.062, 42.366],
  ['PWHL Minnesota', 'PWHL', 'womens', 'St. Paul, MN', -93.101, 44.945],
  ['PWHL New York', 'PWHL', 'womens', 'Newark, NJ', -74.172, 40.735],
  // COLLEGE — NCAA (all sports)
  ['Alabama', 'NCAA', 'college', 'Tuscaloosa, AL', -87.538, 33.208],
  ['Ohio State', 'NCAA', 'college', 'Columbus, OH', -83.02, 40.001],
  ['Michigan', 'NCAA', 'college', 'Ann Arbor, MI', -83.749, 42.266],
  ['Georgia', 'NCAA', 'college', 'Athens, GA', -83.373, 33.95],
  ['Texas', 'NCAA', 'college', 'Austin, TX', -97.733, 30.284],
  ['USC / UCLA', 'NCAA', 'college', 'Los Angeles, CA', -118.287, 34.021],
  ['LSU', 'NCAA', 'college', 'Baton Rouge, LA', -91.187, 30.412],
  ['Oklahoma', 'NCAA', 'college', 'Norman, OK', -97.442, 35.206],
  ['Notre Dame', 'NCAA', 'college', 'South Bend, IN', -86.235, 41.703],
  ['Oregon', 'NCAA', 'college', 'Eugene, OR', -123.068, 44.058],
  ['Florida', 'NCAA', 'college', 'Gainesville, FL', -82.348, 29.65],
  ['Penn State', 'NCAA', 'college', 'State College, PA', -77.859, 40.812],
  ['Nebraska', 'NCAA', 'college', 'Lincoln, NE', -96.705, 40.82],
  ['Washington', 'NCAA', 'college', 'Seattle, WA', -122.303, 47.65],
  ['Clemson', 'NCAA', 'college', 'Clemson, SC', -82.837, 34.678],
  ['Tennessee', 'NCAA', 'college', 'Knoxville, TN', -83.925, 35.955],
  ['Wisconsin', 'NCAA', 'college', 'Madison, WI', -89.412, 43.075],
  ['Utah', 'NCAA', 'college', 'Salt Lake City, UT', -111.849, 40.762],
  ['Texas A&M', 'NCAA', 'college', 'College Station, TX', -96.34, 30.61],
  ['Colorado', 'NCAA', 'college', 'Boulder, CO', -105.271, 40.01],
  ['North Carolina', 'NCAA', 'college', 'Chapel Hill, NC', -79.051, 35.905],
  ['Duke', 'NCAA', 'college', 'Durham, NC', -78.938, 36.001],
  ['Kentucky', 'NCAA', 'college', 'Lexington, KY', -84.504, 38.031],
  ['Arkansas', 'NCAA', 'college', 'Fayetteville, AR', -94.178, 36.068],
  ['Stanford / Cal', 'NCAA', 'college', 'Berkeley, CA', -122.259, 37.872],
  ['Arizona State', 'NCAA', 'college', 'Tempe, AZ', -111.939, 33.425],
  ['Iowa', 'NCAA', 'college', 'Iowa City, IA', -91.53, 41.661],
  ['Michigan State', 'NCAA', 'college', 'East Lansing, MI', -84.483, 42.701],
  ['Illinois', 'NCAA', 'college', 'Champaign, IL', -88.243, 40.116],
  ['Auburn', 'NCAA', 'college', 'Auburn, AL', -85.481, 32.594],
  ['Ole Miss', 'NCAA', 'college', 'Oxford, MS', -89.538, 34.365],
  ['West Virginia', 'NCAA', 'college', 'Morgantown, WV', -79.955, 39.629],
  ['Virginia Tech', 'NCAA', 'college', 'Blacksburg, VA', -80.418, 37.229],
  ['Miami (FL)', 'NCAA', 'college', 'Coral Gables, FL', -80.279, 25.721],
  ['Kansas', 'NCAA', 'college', 'Lawrence, KS', -95.244, 38.954],
  ['Oklahoma State', 'NCAA', 'college', 'Stillwater, OK', -97.058, 36.116],
  ['BYU', 'NCAA', 'college', 'Provo, UT', -111.658, 40.234],
  ['Baylor', 'NCAA', 'college', 'Waco, TX', -97.115, 31.549],
  ['Washington State', 'NCAA', 'college', 'Pullman, WA', -117.18, 46.731],
  ['Oregon State', 'NCAA', 'college', 'Corvallis, OR', -123.262, 44.564],
  // HIGH SCHOOL — state athletic associations
  ['Texas HS Athletics', 'UIL', 'hs', 'Dallas–Fort Worth, TX', -96.797, 32.777, 600000],
  ['Texas HS Athletics', 'UIL', 'hs', 'Houston, TX', -95.369, 29.76, 480000],
  ['California HS Athletics', 'CIF', 'hs', 'Los Angeles, CA', -118.244, 34.052, 700000],
  ['California HS Athletics', 'CIF', 'hs', 'SF Bay Area, CA', -122.271, 37.804, 300000],
  ['Florida HS Athletics', 'FHSAA', 'hs', 'Miami, FL', -80.192, 25.762, 300000],
  ['IMG Academy', 'Prep', 'hs', 'Bradenton, FL', -82.583, 27.47, 1400],
  ['Georgia HS Athletics', 'GHSA', 'hs', 'Atlanta, GA', -84.388, 33.749, 250000],
  ['Ohio HS Athletics', 'OHSAA', 'hs', 'Columbus, OH', -82.999, 39.961, 300000],
  ['Pennsylvania HS Athletics', 'PIAA', 'hs', 'Pittsburgh, PA', -79.996, 40.441, 250000],
  ['New Jersey HS Athletics', 'NJSIAA', 'hs', 'Newark, NJ', -74.172, 40.735, 220000],
  ['New York HS Athletics', 'NYSPHSAA', 'hs', 'Long Island, NY', -73.59, 40.789, 300000],
  ['Illinois HS Athletics', 'IHSA', 'hs', 'Chicago, IL', -87.617, 41.862, 300000],
  ['Louisiana HS Athletics', 'LHSAA', 'hs', 'New Orleans, LA', -90.071, 29.951, 150000],
  ['Arizona HS Athletics', 'AIA', 'hs', 'Phoenix, AZ', -112.074, 33.448, 200000],
  ['Tennessee HS Athletics', 'TSSAA', 'hs', 'Nashville, TN', -86.781, 36.162, 180000],
  ['Michigan HS Athletics', 'MHSAA', 'hs', 'Detroit, MI', -83.046, 42.331, 240000],
  ['Washington HS Athletics', 'WIAA', 'hs', 'Seattle, WA', -122.332, 47.606, 180000],
  ['Colorado HS Athletics', 'CHSAA', 'hs', 'Denver, CO', -104.991, 39.739, 160000],
  // OLYMPIC & INDIVIDUAL — federations, combat, tour sports
  ['Team USA Training Center', 'USOPC', 'ind', 'Colorado Springs, CO', -104.821, 38.834, 15000],
  ['USA Track & Field', 'USATF', 'ind', 'Eugene, OR', -123.021, 44.058, 4000],
  ['USA Gymnastics', 'USAG', 'ind', 'Indianapolis, IN', -86.158, 39.768, 3000],
  ['USA Swimming', 'USA-S', 'ind', 'Colorado Springs, CO', -104.76, 38.846, 8000],
  ['UFC / MMA', 'UFC', 'ind', 'Las Vegas, NV', -115.14, 36.17, 2000],
  ['PGA Tour', 'PGA', 'ind', 'Ponte Vedra, FL', -81.386, 30.196, 1500],
  ['USTA Tennis', 'USTA', 'ind', 'Orlando, FL', -81.29, 28.36, 3000],
  ['CrossFit Games', 'CrossFit', 'ind', 'Madison, WI', -89.384, 43.074, 5000],
  ['NASCAR', 'NASCAR', 'ind', 'Charlotte, NC', -80.843, 35.227, 1200],
  ['USA Wrestling', 'USAW', 'ind', 'Colorado Springs, CO', -104.8, 38.87, 3500],
  ['USA Boxing', 'USAB', 'ind', 'Colorado Springs, CO', -104.81, 38.855, 2500],
  ['USA Volleyball', 'USAV', 'ind', 'Anaheim, CA', -117.914, 33.836, 4000],
];

const STATES_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

function loadScript(src: string) {
  return new Promise<void>((res, rej) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => res();
    s.onerror = () => rej(new Error('failed ' + src));
    document.head.appendChild(s);
  });
}

async function ensureLibs() {
  const w = window as any;
  if (!w.d3) await loadScript('https://cdn.jsdelivr.net/npm/d3@7');
  if (!w.topojson) await loadScript('https://cdn.jsdelivr.net/npm/topojson-client@3');
}

function hslAlpha(c: string, a: number) {
  return c.replace('hsl(', 'hsla(').replace(')', ` / ${a})`);
}

const TeamReachMap = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const pinsRef = useRef<any>(null);
  const [active, setActive] = useState<Cat | 'ALL'>('ALL');
  const [reach, setReach] = useState(0);
  const reachRAF = useRef<number>();

  // Build the map once, after the CDN libs are ready.
  useEffect(() => {
    let cancelled = false;
    ensureLibs()
      .then(() => {
        if (cancelled || !svgRef.current) return;
        const d3 = (window as any).d3;
        const topojson = (window as any).topojson;
        const W = 975;
        const H = 610;
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        const projection = d3.geoAlbersUsa();
        const path = d3.geoPath();

        d3.json(STATES_URL).then((us: any) => {
          if (cancelled) return;
          const states = topojson.feature(us, us.objects.states);
          projection.fitExtent(
            [
              [24, 20],
              [W - 24, H - 30],
            ],
            states
          );
          path.projection(projection);

          svg
            .append('g')
            .selectAll('path')
            .data(states.features)
            .join('path')
            .attr('d', path)
            .attr('fill', 'rgba(255,255,255,0.035)')
            .attr('stroke', 'rgba(255,255,255,0.10)')
            .attr('stroke-width', 0.7);

          const jit: Record<Cat, [number, number]> = {
            pro: [0, -5],
            womens: [5, -2],
            college: [4, 5],
            hs: [-5, 4],
            ind: [-5, -4],
          };
          const g = svg.append('g');
          const placed = TEAMS.map((t) => {
            const p = projection([t[4], t[5]]);
            if (!p) return null;
            const j = jit[t[2]] || [0, 0];
            return {
              name: t[0],
              league: t[1],
              cat: t[2],
              city: t[3],
              x: p[0] + j[0] + (Math.random() * 4 - 2),
              y: p[1] + j[1] + (Math.random() * 4 - 2),
            };
          }).filter(Boolean);

          const pins = g
            .selectAll('g.trm-pin')
            .data(placed)
            .join('g')
            .attr('class', 'trm-pin')
            .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
            .style('opacity', 0);
          pinsRef.current = pins;

          pins
            .append('circle')
            .attr('class', 'trm-ring')
            .attr('r', 5)
            .attr('fill', 'none')
            .attr('stroke', (d: any) => CATS[d.cat as Cat].color)
            .attr('stroke-width', 1.6);
          pins
            .append('circle')
            .attr('r', 3.6)
            .attr('fill', (d: any) => CATS[d.cat as Cat].color)
            .attr('stroke', 'rgba(0,0,0,.35)')
            .attr('stroke-width', 0.5);

          pins.each(function (this: any, _d: any, i: number) {
            setTimeout(() => {
              this.style.transition = 'opacity .5s';
              this.style.opacity = 1;
            }, 150 + i * 12);
          });
          pins
            .select('.trm-ring')
            .style('animation', 'trm-pulse 2.6s ease-out infinite')
            .style('animation-delay', () => (Math.random() * 2.6).toFixed(2) + 's');

          pins
            .on('mousemove', (e: MouseEvent, d: any) => {
              const C = CATS[d.cat as Cat];
              const tip = tipRef.current;
              if (!tip) return;
              tip.innerHTML =
                '<div style="font-weight:700;font-size:13px;color:#fff">' +
                d.name +
                '</div><div style="font-size:11px;color:rgba(255,255,255,.5);margin-top:2px">' +
                d.city +
                '</div>';
              const badge = document.createElement('div');
              badge.textContent = d.league + ' · ' + C.label;
              badge.style.cssText =
                'margin-top:7px;display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;color:' +
                C.color +
                ';background:' +
                hslAlpha(C.color, 0.14) +
                ';border:1px solid ' +
                C.color;
              tip.appendChild(badge);
              tip.style.left = e.clientX + 'px';
              tip.style.top = e.clientY + 'px';
              tip.style.opacity = '1';
            })
            .on('mouseleave', () => {
              if (tipRef.current) tipRef.current.style.opacity = '0';
            });

          // initial dim + reach for current filter
          applyFilter(active);
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to filter changes (dim pins + animate reach).
  const applyFilter = (k: Cat | 'ALL') => {
    if (pinsRef.current)
      pinsRef.current.classed('trm-dim', (d: any) => k !== 'ALL' && d.cat !== k);
    const target = TEAMS.reduce(
      (s, t) => (k === 'ALL' || t[2] === k ? s + (t[6] || CATS[t[2]].w) : s),
      0
    );
    const from = reach;
    cancelAnimationFrame(reachRAF.current as number);
    const t0 = performance.now();
    const dur = 650;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setReach(Math.round(from + (target - from) * e));
      if (p < 1) reachRAF.current = requestAnimationFrame(step);
    };
    reachRAF.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    applyFilter(active);
    return () => cancelAnimationFrame(reachRAF.current as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <section className="relative py-20 lg:py-28">
      <style>{`
        @keyframes trm-pulse { 0%{ stroke-opacity:.9; r:5 } 70%{ stroke-opacity:0; r:13 } 100%{ stroke-opacity:0; r:13 } }
        g.trm-pin { transition: opacity .35s; cursor: default; }
        g.trm-pin.trm-dim { opacity: .09 !important; }
      `}</style>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(var(--primary) / 0.07) 0%, transparent 70%)',
        }}
      />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.div
          className="text-center max-w-[720px] mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span
            variants={fadeUpVariant}
            className="dmd-concave inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase text-primary"
          >
            The board
          </motion.span>
          <motion.h2
            variants={fadeUpVariant}
            className="mt-4 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', lineHeight: 1.1 }}
          >
            Every athlete in the country is in play.
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-4 text-foreground/70 text-lg">
            Pro and women's pro, college, high school, Olympic and individual — every
            sport, every league. The market isn't one team. It's every athlete. Filter to
            see the reach.
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-12 rounded-[24px] p-5 lg:p-7 bg-[rgba(255,255,255,0.03)] border border-white/[0.07] backdrop-blur-sm"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 30px 60px -30px rgba(0,0,0,0.7)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex flex-wrap gap-2">
              {ORDER.map((k) => {
                const isActive = active === k;
                return (
                  <button
                    key={k}
                    onClick={() => setActive(k)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${
                      isActive
                        ? 'bg-white/[0.10] border-primary/40 text-foreground'
                        : 'bg-white/[0.03] border-white/[0.08] text-foreground/60 hover:text-foreground/90'
                    }`}
                  >
                    {k !== 'ALL' && (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: CATS[k as Cat].color }}
                      />
                    )}
                    {k === 'ALL' ? 'Every athlete' : CATS[k as Cat].label}
                  </button>
                );
              })}
            </div>
            <div className="text-right">
              <div className="font-extrabold tabular-nums gradient-text leading-none tracking-[-0.03em] text-3xl lg:text-4xl">
                {reach.toLocaleString()}
              </div>
              <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-foreground/40 mt-1">
                athletes in reach
              </div>
            </div>
          </div>

          <div className="rounded-[16px] overflow-hidden bg-[rgba(255,255,255,0.015)] border border-white/[0.05]">
            <svg
              ref={svgRef}
              viewBox="0 0 975 610"
              role="img"
              aria-label="US map of teams and athletic programs across every sport"
              className="w-full h-auto block"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {(Object.keys(CATS) as Cat[]).map((k) => (
              <span
                key={k}
                className="inline-flex items-center gap-2 text-[11px] font-semibold text-foreground/55"
              >
                <i className="w-2.5 h-2.5 rounded-full" style={{ background: CATS[k].color }} />
                {CATS[k].label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fixed tooltip — positioned in the viewport, updated by d3 handlers. */}
      <div
        ref={tipRef}
        className="fixed z-[2000] pointer-events-none opacity-0 transition-opacity duration-150"
        style={{
          transform: 'translate(14px, -50%)',
          padding: '10px 12px',
          borderRadius: '12px',
          background: 'rgba(10,10,16,0.92)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.7)',
          maxWidth: '240px',
        }}
      />
    </section>
  );
};

export default TeamReachMap;
