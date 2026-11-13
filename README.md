# Travel Weather Explorer

A single-file HTML application for exploring the best time to visit 172 destinations worldwide. Features interactive maps, weather rankings, precipitation charts, travel type filters, favorites, and export capabilities.

![Travel Weather Explorer](https://img.shields.io/badge/version-3.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![PWA](https://img.shields.io/badge/PWA-ready-purple)

## 🌍 Features

### Core Functionality
- **172 Destinations** — Countries worldwide with monthly weather data
- **Best Month Rankings** — Each month ranked 1–12 by weather + crowds
- **Temperature Ranges** — Typical low/high temps for main tourist areas (Celsius/Fahrenheit)
- **Travel Advisories** — US State Department levels with visa requirements
- **Cost Estimates** — Daily budget ranges per destination

### Interactive Map
- **Leaflet.js World Map** — Click any country for quick climate snapshot
- **Highlighted Countries** — Filtered results highlighted on map
- **Popups with Details** — Best month, temperature, conditions, travel types
- **Keyboard Accessible** — Full map navigation via keyboard

### Weather & Climate
- **Precipitation Charts** — Monthly rainfall bars (Chart.js) color-coded by rank
- **Rainfall Data** — Average mm per month from climate normals
- **Weather Notes** — Qualitative conditions per month (dry, humid, rainy season, etc.)

### Filtering & Search
- **Full-text Search** — Country, visa, notes, weather, travel types
- **Month Selector** — "Best in January" through December
- **Advisory Filter** — Level 1 / Level 2 / All
- **Region Chips** — Filter by geographic region with counts
- **Travel Type Chips** — 12 types: Adventure, Beach, Culture, Family, Food, Luxury, Nature, Wildlife, Water Sports, Budget, History, Photography
- **Sort Options** — Name, Region, Cost, Best in Month, Custom Ranking

### Personalization
- **Favorites** — Save destinations (❤️) persisted in localStorage
- **Custom Ranking Weights** — Adjust 5 factors: Temperature, Rainfall, Humidity, Hazards, Crowds
- **Unit Toggle** — Celsius ↔ Fahrenheit
- **URL Sharing** — Shareable links encode full view state

### Export & Sharing
- **JSON Export** — Full filtered dataset with all monthly details
- **CSV Export** — Spreadsheet-ready monthly breakdown
- **Per-Country Export** — Individual country JSON/CSV
- **Shareable Links** — `?view=...` restores filters, weights, favorites; `?country=...` opens specific destination

### Accessibility (WCAG 2.1 AA)
- Semantic HTML5 with ARIA roles/labels
- Keyboard navigation for all interactive elements
- Focus management and visible focus indicators
- Skip link for main content
- Screen reader announcements for dynamic updates
- High contrast mode support
- Reduced motion support

### Progressive Web App
- **Offline Support** — Service Worker caches static assets, map tiles, and data
- **Installable** — Add to home screen on mobile/desktop
- **Web Manifest** — Theme color, icons, shortcuts
- **Fast Loading** — Cached resources load instantly on repeat visits

### Performance
- **Debounced Search** — 150ms delay prevents excessive renders
- **Lazy Map Init** — Map loads only when scrolled into view
- **Chart Cleanup** — Chart.js instances properly destroyed
- **Virtual Scrolling Ready** — Architecture supports large lists

## 🚀 Quick Start

### Local Development
```bash
# Clone and serve with any static server
git clone <repo>
cd travel-weather-explorer
npx serve .  # or python -m http.server 8000
```

### Open Directly
Double-click `travel-weather-explorer.html` in any modern browser.

## 📁 Project Structure

```
travel-weather-explorer/
├── travel-weather-explorer.html   # Main application (single file)
├── manifest.json                   # PWA manifest
├── sw.js                          # Service Worker for offline
├── icon-192.png                   # PWA icon (192x192)
├── icon-512.png                   # PWA icon (512x512)
├── README.md                      # This file
├── LICENSE                        # MIT License
└── .github/
    └── workflows/
        └── deploy.yml             # GitHub Pages deployment
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Structure** | HTML5 (single file) |
| **Styling** | CSS Custom Properties, Bootstrap 5.3 (CDN) |
| **Map** | Leaflet 1.9 + TopoJSON 3 (Natural Earth Data) |
| **Charts** | Chart.js 4.4 |
| **Storage** | localStorage (favorites, weights, view state) |
| **Offline** | Service Worker (Cache API) |
| **Deploy** | GitHub Pages / any static host |

## 📊 Data Sources

- **Weather & Rankings** — Long-term climate normals (temperature ranges, precipitation averages)
- **Travel Advisories** — US State Department (verified Nov 2026)
- **Visa Rules** — Official government entry-rule sites (verified Nov 2026)
- **Cost Estimates** — Daily budget ranges from travel workbooks
- **Country Boundaries** — Natural Earth Data (public domain)
- **Map Tiles** — OpenStreetMap contributors

⚠️ **Disclaimer**: Weather values are climate normals, not forecasts. Advisory levels, visa policies, and fees change — always recheck before booking.

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Navigate interactive elements |
| `Enter` / `Space` | Activate buttons, chips, dropdowns |
| `Arrow Keys` | Navigate between chips |
| `Escape` | Close dropdowns, return focus |
| `Skip Link` | Jump to country list (first Tab) |

## 🔧 Customization

### Adding Countries
Add objects to `window.TWDATA` array with required fields:
```javascript
{
  "name": "Country Name",
  "region": "Region",
  "advisory": "Level X: ...",
  "level": "1|2",
  "issued": "MM/DD/YYYY",
  "best": "Month-Range",
  "why": "Reason",
  "visa": "Visa status",
  "visaLabel": "Label",
  "visaType": "free|eta|voa|visa",
  "howto": "Instructions",
  "cost": [min, max],
  "costRaw": "$X-Y",
  "notes": "Details",
  "tt": ["type1", "type2"],  // travel types
  "p": [12, 10, ...],        // 12 monthly precipitation values (mm)
  "m": [["low","high","notes"], ...],  // 12 months of temp + notes
  "r": [1,2,3,...],          // 12 monthly ranks (1=best)
  "top": [0, 11]             // indices of best months
}
```

### Modifying Travel Types
Edit `TRAVEL_TYPES` object:
```javascript
const TRAVEL_TYPES = {
  "new-type": {label:"🏷️ Label", color:"#hexcolor"}
};
```

### Adjusting Default Ranking Weights
Modify `rankingWeights` defaults in initialization:
```javascript
let rankingWeights = {temp:30, rain:25, humid:15, hazard:20, crowd:10};
```

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Open the app
2. Click install icon in address bar → "Install"

### Mobile (iOS Safari)
1. Open in Safari
2. Share → "Add to Home Screen"

### Mobile (Android Chrome)
1. Open in Chrome
2. Menu → "Install app"

## 🌐 Deployment

### GitHub Pages (Automatic)
1. Push to `main` branch
2. GitHub Action builds and deploys to `gh-pages`
3. Enable Pages in repo settings → Source: `gh-pages` branch

### Netlify / Vercel / Cloudflare Pages
- Connect repo → Auto-detects static site → Deploy

### Manual (Any Static Host)
```bash
# Just upload travel-weather-explorer.html + manifest.json + sw.js + icons
```

## 🔒 Privacy & Security

- **No Tracking** — Zero analytics, no cookies, no external tracking
- **Local Storage Only** — Favorites, weights, view state stay in your browser
- **HTTPS Required** — Service Worker and PWA features need secure context
- **CSP Compatible** — Inline scripts only (single-file architecture)

## 🧪 Browser Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 15+ | Full support |
| Edge | 90+ | Full support |
| Mobile Safari | 15+ | PWA install via Share menu |
| Chrome Android | 90+ | Full PWA support |

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing`)
5. Open Pull Request

### Development Guidelines
- Keep single-file architecture (all in `travel-weather-explorer.html`)
- Maintain accessibility (WCAG 2.1 AA)
- Test offline functionality after changes
- Update version in manifest.html comment

## 📞 Support

- **Issues**: GitHub Issues for bugs/features
- **Questions**: GitHub Discussions
- **Security**: Email for vulnerabilities

---

**Built with ❤️ for travelers who want to chase the perfect weather.**