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
  // HIGH SCHOOL — every state association, anchored on major metros so the
  // board reads fully saturated coast to coast (Jack, 2026-07-13). Weights
  // are per-metro HS participants; the HS category sums to the ~5M market.
  // California
  ['California HS Athletics', 'CIF', 'hs', 'Los Angeles, CA', -118.244, 34.052, 250000],
  ['California HS Athletics', 'CIF', 'hs', 'SF Bay Area, CA', -122.271, 37.804, 120000],
  ['California HS Athletics', 'CIF', 'hs', 'San Diego, CA', -117.161, 32.716, 75000],
  ['California HS Athletics', 'CIF', 'hs', 'Sacramento, CA', -121.494, 38.582, 45000],
  ['California HS Athletics', 'CIF', 'hs', 'Fresno, CA', -119.772, 36.746, 30000],
  // Texas
  ['Texas HS Athletics', 'UIL', 'hs', 'Dallas–Fort Worth, TX', -96.797, 32.777, 180000],
  ['Texas HS Athletics', 'UIL', 'hs', 'Houston, TX', -95.369, 29.76, 145000],
  ['Texas HS Athletics', 'UIL', 'hs', 'San Antonio, TX', -98.494, 29.424, 70000],
  ['Texas HS Athletics', 'UIL', 'hs', 'Austin, TX', -97.743, 30.267, 55000],
  ['Texas HS Athletics', 'UIL', 'hs', 'El Paso, TX', -106.485, 31.762, 30000],
  // Florida
  ['Florida HS Athletics', 'FHSAA', 'hs', 'Miami, FL', -80.192, 25.762, 95000],
  ['Florida HS Athletics', 'FHSAA', 'hs', 'Orlando, FL', -81.379, 28.538, 60000],
  ['Florida HS Athletics', 'FHSAA', 'hs', 'Tampa, FL', -82.458, 27.95, 55000],
  ['Florida HS Athletics', 'FHSAA', 'hs', 'Jacksonville, FL', -81.656, 30.332, 40000],
  ['IMG Academy', 'Prep', 'hs', 'Bradenton, FL', -82.583, 27.47, 1400],
  // New York
  ['New York HS Athletics', 'NYSPHSAA', 'hs', 'New York, NY', -73.99, 40.712, 130000],
  ['New York HS Athletics', 'NYSPHSAA', 'hs', 'Long Island, NY', -73.13, 40.789, 60000],
  ['New York HS Athletics', 'NYSPHSAA', 'hs', 'Buffalo, NY', -78.878, 42.886, 35000],
  ['New York HS Athletics', 'NYSPHSAA', 'hs', 'Albany, NY', -73.756, 42.652, 20000],
  // Illinois
  ['Illinois HS Athletics', 'IHSA', 'hs', 'Chicago, IL', -87.63, 41.878, 125000],
  ['Illinois HS Athletics', 'IHSA', 'hs', 'Peoria, IL', -89.589, 40.693, 28000],
  ['Illinois HS Athletics', 'IHSA', 'hs', 'Rockford, IL', -89.094, 42.271, 22000],
  // Pennsylvania
  ['Pennsylvania HS Athletics', 'PIAA', 'hs', 'Philadelphia, PA', -75.163, 39.952, 80000],
  ['Pennsylvania HS Athletics', 'PIAA', 'hs', 'Pittsburgh, PA', -79.996, 40.441, 60000],
  ['Pennsylvania HS Athletics', 'PIAA', 'hs', 'Harrisburg, PA', -76.882, 40.273, 35000],
  // Ohio
  ['Ohio HS Athletics', 'OHSAA', 'hs', 'Cleveland, OH', -81.694, 41.499, 55000],
  ['Ohio HS Athletics', 'OHSAA', 'hs', 'Columbus, OH', -82.999, 39.961, 55000],
  ['Ohio HS Athletics', 'OHSAA', 'hs', 'Cincinnati, OH', -84.512, 39.103, 55000],
  // Georgia
  ['Georgia HS Athletics', 'GHSA', 'hs', 'Atlanta, GA', -84.388, 33.749, 105000],
  ['Georgia HS Athletics', 'GHSA', 'hs', 'Savannah, GA', -81.099, 32.083, 22000],
  ['Georgia HS Athletics', 'GHSA', 'hs', 'Columbus, GA', -84.988, 32.461, 18000],
  // Michigan
  ['Michigan HS Athletics', 'MHSAA', 'hs', 'Detroit, MI', -83.046, 42.331, 82000],
  ['Michigan HS Athletics', 'MHSAA', 'hs', 'Grand Rapids, MI', -85.669, 42.963, 35000],
  ['Michigan HS Athletics', 'MHSAA', 'hs', 'Lansing, MI', -84.556, 42.732, 23000],
  // North Carolina
  ['North Carolina HS Athletics', 'NCHSAA', 'hs', 'Charlotte, NC', -80.843, 35.227, 58000],
  ['North Carolina HS Athletics', 'NCHSAA', 'hs', 'Raleigh, NC', -78.638, 35.779, 45000],
  ['North Carolina HS Athletics', 'NCHSAA', 'hs', 'Greensboro, NC', -79.791, 36.073, 27000],
  // New Jersey
  ['New Jersey HS Athletics', 'NJSIAA', 'hs', 'Newark, NJ', -74.172, 40.735, 68000],
  ['New Jersey HS Athletics', 'NJSIAA', 'hs', 'Trenton, NJ', -74.764, 40.217, 37000],
  ['New Jersey HS Athletics', 'NJSIAA', 'hs', 'Camden, NJ', -75.119, 39.945, 25000],
  // Virginia
  ['Virginia HS Athletics', 'VHSL', 'hs', 'Virginia Beach, VA', -75.978, 36.853, 50000],
  ['Virginia HS Athletics', 'VHSL', 'hs', 'Richmond, VA', -77.436, 37.541, 40000],
  ['Virginia HS Athletics', 'VHSL', 'hs', 'Arlington, VA', -77.087, 38.88, 30000],
  // Washington
  ['Washington HS Athletics', 'WIAA', 'hs', 'Seattle, WA', -122.332, 47.606, 70000],
  ['Washington HS Athletics', 'WIAA', 'hs', 'Spokane, WA', -117.426, 47.659, 30000],
  ['Washington HS Athletics', 'WIAA', 'hs', 'Tacoma, WA', -122.444, 47.253, 20000],
  // Arizona
  ['Arizona HS Athletics', 'AIA', 'hs', 'Phoenix, AZ', -112.074, 33.448, 75000],
  ['Arizona HS Athletics', 'AIA', 'hs', 'Tucson, AZ', -110.975, 32.222, 35000],
  // Massachusetts
  ['Massachusetts HS Athletics', 'MIAA', 'hs', 'Boston, MA', -71.058, 42.36, 80000],
  ['Massachusetts HS Athletics', 'MIAA', 'hs', 'Worcester, MA', -71.802, 42.263, 30000],
  // Tennessee
  ['Tennessee HS Athletics', 'TSSAA', 'hs', 'Nashville, TN', -86.781, 36.162, 50000],
  ['Tennessee HS Athletics', 'TSSAA', 'hs', 'Memphis, TN', -90.049, 35.149, 40000],
  ['Tennessee HS Athletics', 'TSSAA', 'hs', 'Knoxville, TN', -83.921, 35.96, 20000],
  // Indiana
  ['Indiana HS Athletics', 'IHSAA', 'hs', 'Indianapolis, IN', -86.158, 39.768, 60000],
  ['Indiana HS Athletics', 'IHSAA', 'hs', 'Fort Wayne, IN', -85.139, 41.079, 30000],
  ['Indiana HS Athletics', 'IHSAA', 'hs', 'Evansville, IN', -87.571, 37.975, 15000],
  // Missouri
  ['Missouri HS Athletics', 'MSHSAA', 'hs', 'St. Louis, MO', -90.199, 38.627, 50000],
  ['Missouri HS Athletics', 'MSHSAA', 'hs', 'Kansas City, MO', -94.578, 39.1, 50000],
  // Wisconsin
  ['Wisconsin HS Athletics', 'WIAA', 'hs', 'Milwaukee, WI', -87.906, 43.039, 50000],
  ['Wisconsin HS Athletics', 'WIAA', 'hs', 'Madison, WI', -89.384, 43.073, 30000],
  ['Wisconsin HS Athletics', 'WIAA', 'hs', 'Green Bay, WI', -88.014, 44.513, 20000],
  // Minnesota
  ['Minnesota HS Athletics', 'MSHSL', 'hs', 'Minneapolis, MN', -93.265, 44.978, 60000],
  ['Minnesota HS Athletics', 'MSHSL', 'hs', 'St. Paul, MN', -93.09, 44.954, 40000],
  // Colorado
  ['Colorado HS Athletics', 'CHSAA', 'hs', 'Denver, CO', -104.991, 39.739, 60000],
  ['Colorado HS Athletics', 'CHSAA', 'hs', 'Colorado Springs, CO', -104.821, 38.834, 35000],
  // Maryland
  ['Maryland HS Athletics', 'MPSSAA', 'hs', 'Baltimore, MD', -76.612, 39.29, 55000],
  ['Maryland HS Athletics', 'MPSSAA', 'hs', 'Silver Spring, MD', -77.026, 38.991, 40000],
  // Alabama
  ['Alabama HS Athletics', 'AHSAA', 'hs', 'Birmingham, AL', -86.802, 33.521, 40000],
  ['Alabama HS Athletics', 'AHSAA', 'hs', 'Montgomery, AL', -86.301, 32.367, 30000],
  ['Alabama HS Athletics', 'AHSAA', 'hs', 'Mobile, AL', -88.043, 30.695, 20000],
  // South Carolina
  ['South Carolina HS Athletics', 'SCHSL', 'hs', 'Columbia, SC', -81.035, 34.001, 40000],
  ['South Carolina HS Athletics', 'SCHSL', 'hs', 'Charleston, SC', -79.931, 32.777, 25000],
  ['South Carolina HS Athletics', 'SCHSL', 'hs', 'Greenville, SC', -82.394, 34.853, 20000],
  // Louisiana
  ['Louisiana HS Athletics', 'LHSAA', 'hs', 'New Orleans, LA', -90.071, 29.951, 45000],
  ['Louisiana HS Athletics', 'LHSAA', 'hs', 'Baton Rouge, LA', -91.187, 30.451, 40000],
  // Kentucky
  ['Kentucky HS Athletics', 'KHSAA', 'hs', 'Louisville, KY', -85.759, 38.253, 45000],
  ['Kentucky HS Athletics', 'KHSAA', 'hs', 'Lexington, KY', -84.504, 38.048, 35000],
  // Oregon
  ['Oregon HS Athletics', 'OSAA', 'hs', 'Portland, OR', -122.676, 45.523, 50000],
  ['Oregon HS Athletics', 'OSAA', 'hs', 'Eugene, OR', -123.089, 44.052, 30000],
  // Oklahoma
  ['Oklahoma HS Athletics', 'OSSAA', 'hs', 'Oklahoma City, OK', -97.517, 35.467, 45000],
  ['Oklahoma HS Athletics', 'OSSAA', 'hs', 'Tulsa, OK', -95.993, 36.154, 35000],
  // Connecticut
  ['Connecticut HS Athletics', 'CIAC', 'hs', 'Hartford, CT', -72.685, 41.764, 35000],
  ['Connecticut HS Athletics', 'CIAC', 'hs', 'Bridgeport, CT', -73.189, 41.179, 25000],
  // Iowa
  ['Iowa HS Athletics', 'IHSAA', 'hs', 'Des Moines, IA', -93.62, 41.586, 40000],
  ['Iowa HS Athletics', 'IHSAA', 'hs', 'Cedar Rapids, IA', -91.665, 41.978, 20000],
  // Utah
  ['Utah HS Athletics', 'UHSAA', 'hs', 'Salt Lake City, UT', -111.891, 40.761, 45000],
  ['Utah HS Athletics', 'UHSAA', 'hs', 'Provo, UT', -111.658, 40.234, 20000],
  // Nevada
  ['Nevada HS Athletics', 'NIAA', 'hs', 'Las Vegas, NV', -115.139, 36.169, 45000],
  ['Nevada HS Athletics', 'NIAA', 'hs', 'Reno, NV', -119.814, 39.53, 15000],
  // Arkansas
  ['Arkansas HS Athletics', 'AAA', 'hs', 'Little Rock, AR', -92.289, 34.746, 35000],
  ['Arkansas HS Athletics', 'AAA', 'hs', 'Fayetteville, AR', -94.157, 36.062, 20000],
  // Mississippi
  ['Mississippi HS Athletics', 'MHSAA', 'hs', 'Jackson, MS', -90.185, 32.299, 35000],
  ['Mississippi HS Athletics', 'MHSAA', 'hs', 'Gulfport, MS', -89.093, 30.367, 20000],
  // Kansas
  ['Kansas HS Athletics', 'KSHSAA', 'hs', 'Wichita, KS', -97.336, 37.687, 30000],
  ['Kansas HS Athletics', 'KSHSAA', 'hs', 'Overland Park, KS', -94.671, 38.982, 25000],
  // Nebraska
  ['Nebraska HS Athletics', 'NSAA', 'hs', 'Omaha, NE', -95.936, 41.257, 30000],
  ['Nebraska HS Athletics', 'NSAA', 'hs', 'Lincoln, NE', -96.706, 40.814, 15000],
  // New Mexico
  ['New Mexico HS Athletics', 'NMAA', 'hs', 'Albuquerque, NM', -106.61, 35.084, 32000],
  ['New Mexico HS Athletics', 'NMAA', 'hs', 'Las Cruces, NM', -106.778, 32.312, 10000],
  // Idaho
  ['Idaho HS Athletics', 'IHSAA', 'hs', 'Boise, ID', -116.201, 43.615, 30000],
  ['Idaho HS Athletics', 'IHSAA', 'hs', 'Idaho Falls, ID', -112.034, 43.492, 10000],
  // West Virginia
  ['West Virginia HS Athletics', 'WVSSAC', 'hs', 'Charleston, WV', -81.633, 38.349, 25000],
  ['West Virginia HS Athletics', 'WVSSAC', 'hs', 'Morgantown, WV', -79.956, 39.629, 15000],
  // Hawaii
  ['Hawaii HS Athletics', 'HHSAA', 'hs', 'Honolulu, HI', -157.858, 21.306, 30000],
  ['Hawaii HS Athletics', 'HHSAA', 'hs', 'Hilo, HI', -155.089, 19.706, 8000],
  // New Hampshire
  ['New Hampshire HS Athletics', 'NHIAA', 'hs', 'Manchester, NH', -71.455, 42.995, 30000],
  // Maine
  ['Maine HS Athletics', 'MPA', 'hs', 'Portland, ME', -70.255, 43.662, 30000],
  // Montana
  ['Montana HS Athletics', 'MHSA', 'hs', 'Billings, MT', -108.5, 45.783, 20000],
  ['Montana HS Athletics', 'MHSA', 'hs', 'Missoula, MT', -113.994, 46.872, 12000],
  // Alaska
  ['Alaska HS Athletics', 'ASAA', 'hs', 'Anchorage, AK', -149.9, 61.218, 25000],
  ['Alaska HS Athletics', 'ASAA', 'hs', 'Fairbanks, AK', -147.716, 64.838, 7000],
  // Rhode Island
  ['Rhode Island HS Athletics', 'RIIL', 'hs', 'Providence, RI', -71.413, 41.824, 26000],
  // Delaware
  ['Delaware HS Athletics', 'DIAA', 'hs', 'Wilmington, DE', -75.546, 39.739, 24000],
  // South Dakota
  ['South Dakota HS Athletics', 'SDHSAA', 'hs', 'Sioux Falls, SD', -96.7, 43.55, 24000],
  // North Dakota
  ['North Dakota HS Athletics', 'NDHSAA', 'hs', 'Fargo, ND', -96.79, 46.877, 24000],
  // Vermont
  ['Vermont HS Athletics', 'VPA', 'hs', 'Burlington, VT', -73.213, 44.476, 20000],
  // Wyoming
  ['Wyoming HS Athletics', 'WHSAA', 'hs', 'Cheyenne, WY', -104.82, 41.14, 20000],
  // Washington, D.C.
  ['DC HS Athletics', 'DCSAA', 'hs', 'Washington, DC', -77.037, 38.907, 22000],
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
  const scatterRef = useRef<any>(null);
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

          // ---- Saturation scatter -------------------------------------
          // The named TEAMS are the interactive hover pins, but Jack's
          // market is ~5M athletes — the board should read WALL-TO-WALL
          // full, not a handful of dots. Procedurally scatter a dense
          // decorative dot field across the whole country (continental +
          // AK + HI insets + tight metro clusters). geoAlbersUsa returns
          // null outside US land, so off-map candidates self-clip. These
          // dots are non-interactive and sit UNDER the real pins.
          const scatterData: { x: number; y: number; cat: Cat }[] = [];
          const catPool: Cat[] = ['hs','hs','hs','hs','hs','college','hs','hs','ind','hs','womens','hs','pro','hs'];
          const pickCat = () => catPool[(Math.random() * catPool.length) | 0];
          const drop = (lon: number, lat: number, cat: Cat) => {
            const p = projection([lon, lat]);
            if (p) scatterData.push({ x: p[0], y: p[1], cat });
          };
          // Continental grid
          for (let lon = -124; lon <= -67; lon += 0.9)
            for (let lat = 25; lat <= 49; lat += 0.9)
              drop(lon + (Math.random() * 0.7 - 0.35), lat + (Math.random() * 0.7 - 0.35), pickCat());
          // Alaska inset
          for (let lon = -165; lon <= -141; lon += 1.8)
            for (let lat = 56; lat <= 69; lat += 1.4)
              drop(lon + (Math.random() * 1.2 - 0.6), lat + (Math.random() * 1 - 0.5), pickCat());
          // Hawaii inset
          for (let lon = -160; lon <= -154.5; lon += 0.55)
            for (let lat = 18.8; lat <= 22.3; lat += 0.5)
              drop(lon + (Math.random() * 0.35 - 0.175), lat + (Math.random() * 0.35 - 0.175), pickCat());
          // Tight clusters around every HS metro so cities read dense
          TEAMS.filter((t) => t[2] === 'hs').forEach((t) => {
            const n = 8 + ((Math.random() * 10) | 0);
            for (let i = 0; i < n; i++)
              drop(t[4] + (Math.random() * 1.7 - 0.85), t[5] + (Math.random() * 1.7 - 0.85), 'hs');
          });

          const scatterG = svg.append('g').style('pointer-events', 'none');
          const scatter = scatterG
            .selectAll('circle')
            .data(scatterData)
            .join('circle')
            .attr('class', 'trm-scatter')
            .attr('cx', (d: any) => d.x)
            .attr('cy', (d: any) => d.y)
            .attr('r', () => (1.2 + Math.random() * 1.3).toFixed(2))
            .attr('fill', (d: any) => CATS[d.cat as Cat].color)
            .style('opacity', 0);
          scatterRef.current = scatter;
          scatter.each(function (this: any, _d: any, i: number) {
            setTimeout(() => {
              this.style.transition = 'opacity .5s';
              this.style.opacity = (0.32 + Math.random() * 0.33).toFixed(2);
            }, 120 + i * 1.5);
          });

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
    if (scatterRef.current)
      scatterRef.current.classed('trm-dim', (d: any) => k !== 'ALL' && d.cat !== k);
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
        circle.trm-scatter { transition: opacity .35s; }
        circle.trm-scatter.trm-dim { opacity: .04 !important; }
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
