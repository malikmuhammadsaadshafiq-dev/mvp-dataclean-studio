<div align="center">

# DataClean Studio

**Client-side CSV/JSON converter with validation, formatting, and schema checking**

![React](https://img.shields.io/badge/React-333?style=flat-square) ![PapaParse](https://img.shields.io/badge/PapaParse-333?style=flat-square) ![Monaco Editor](https://img.shields.io/badge/Monaco%20Editor-333?style=flat-square) ![js-yaml](https://img.shields.io/badge/js--yaml-333?style=flat-square)
![Utility Tool](https://img.shields.io/badge/Utility-Tool-success?style=flat-square)
![Type](https://img.shields.io/badge/Type-Web%20App-blue?style=flat-square)
![Tests](https://img.shields.io/badge/Tests-13%2F14-brightgreen?style=flat-square)

</div>

---

## Problem

Developers risk data privacy by uploading sensitive JSON/CSV to online converters that process server-side

## Who Is This For?

Software developers, data analysts, QA engineers

## Features

- **Drag-and-drop file conversion between CSV/JSON/XML/YAML**
- **Syntax error highlighting with line numbers**
- **Minify, prettify, and escape/unescape utilities**

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React | Core dependency |
| PapaParse | Core dependency |
| Monaco Editor | Core dependency |
| js-yaml | Core dependency |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/malikmuhammadsaadshafiq-dev/mvp-dataclean-studio.git
cd mvp-dataclean-studio
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

### Core Workflows

**1. Drag-and-drop file conversion between CSV/JSON/XML/YAML**
   - Navigate to the relevant section in the app
   - Follow the on-screen prompts to complete the action
   - Results are displayed in real-time

**2. Syntax error highlighting with line numbers**
   - Navigate to the relevant section in the app
   - Follow the on-screen prompts to complete the action
   - Results are displayed in real-time

**3. Minify, prettify, and escape/unescape utilities**
   - Navigate to the relevant section in the app
   - Follow the on-screen prompts to complete the action
   - Results are displayed in real-time


## Quality Assurance

| Test | Status |
|------|--------|
| Has state management | ✅ Pass |
| Has form/input handling | ✅ Pass |
| Has click handlers (2+) | ✅ Pass |
| Has demo data | ⚠️ Needs attention |
| Has loading states | ✅ Pass |
| Has user feedback | ✅ Pass |
| No placeholder text | ✅ Pass |
| Has CRUD operations | ✅ Pass |
| Has empty states | ✅ Pass |
| Has responsive layout | ✅ Pass |
| Has search/filter | ✅ Pass |
| Has tab navigation | ✅ Pass |
| Has data persistence | ✅ Pass |
| No dead links | ✅ Pass |

**Overall Score: 13/14**

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Homepage
│   │   └── globals.css   # Global styles
│   └── components/       # Reusable UI components
├── public/               # Static assets
├── package.json          # Dependencies
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS config
└── tsconfig.json         # TypeScript config
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License — use freely for personal and commercial projects.

---

<div align="center">

**Built autonomously by [Openclaw MVP Factory](https://github.com/malikmuhammadsaadshafiq-dev/Openclaw)** — an AI-powered system that discovers real user needs and ships working software.

</div>
