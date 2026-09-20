import fs from 'fs';


const systemsFile = '/Users/kedargurav/Documents/COLLEGE/Projects/IKS 2 /src/data/systems.json';
const systems = JSON.parse(fs.readFileSync(systemsFile, 'utf8'));

const headers = { 'User-Agent': 'JalSanskritiApp/1.0 (https://jalsanskriti.in)' };

const delay = ms => new Promise(res => setTimeout(res, ms));

async function getCommonsImages(query, max = 3) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=${max}&prop=imageinfo&iiprop=url&format=json`;
    const res = await fetch(url, { headers });
    const data = await res.json();
    if (data.query && data.query.pages) {
      const imgs = Object.values(data.query.pages)
        .map(p => p.imageinfo && p.imageinfo[0] && p.imageinfo[0].url)
        .filter(Boolean);
      return imgs;
    }
  } catch (e) {}
  return [];
}

async function getWikipediaImage(query) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&srlimit=1`;
    const searchRes = await fetch(searchUrl, { headers });
    const searchData = await searchRes.json();
    if (searchData.query && searchData.query.search && searchData.query.search.length) {
      const title = searchData.query.search[0].title;
      const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`;
      const imgRes = await fetch(imgUrl, { headers });
      const imgData = await imgRes.json();
      const pages = imgData.query && imgData.query.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        if (pages[pageId].original && pages[pageId].original.source) {
          return pages[pageId].original.source;
        }
      }
    }
  } catch (e) {}
  return null;
}

async function fetchImagesForSystem(system) {
  const query = system.name;
  // Gather images from each source independently
  const commons = await getCommonsImages(query, 5);
  const wiki = await getWikipediaImage(query);
  const unsplash = `https://source.unsplash.com/featured/1200x800?${encodeURIComponent(query)}`;

  // Combine, deduplicate, and keep order of priority (Commons > Wiki > Unsplash)
  const all = [];
  const seen = new Set();
  const add = (url) => {
    if (url && !seen.has(url)) {
      seen.add(url);
      all.push(url);
    }
  };
  commons.forEach(add);
  if (wiki) add(wiki);
  add(unsplash);

  // Return up to 9 images (or whatever you prefer)
  return all.slice(0, 9);
}

(async () => {
  console.log('Starting image enrichment...');
  for (let i = 0; i < systems.length; i++) {
    const sys = systems[i];
    if (!sys.images || sys.images.length === 0) {
      const imgs = await fetchImagesForSystem(sys);
      sys.images = imgs;
      sys.image = imgs[0];
      console.log(`[${i + 1}/${systems.length}] ${sys.name} -> ${imgs.length} images`);
      await delay(200);
    }
  }
  fs.writeFileSync(systemsFile, JSON.stringify(systems, null, 2));
  console.log('All done. Updated systems.json');
})();
