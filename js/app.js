/**
 * Main Application Logic for Moin Mulla Portfolio
 * High-Performance, Zero-Dependency ES6
 */

function initApp() {
  document.body.classList.add('hydrated');
  initTheme();
  initMobileMenu();
  initScrollSpy();
  initProjectFilters();
  initProjectModals();
  initContactForm();
  initCounterAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// ==========================================
// 1. THEME LOCK (HIGH-CONTRAST ENGINEERING DARK MODE)
// ==========================================
function initTheme() {
  document.documentElement.setAttribute('data-theme', 'dark');
  try {
    localStorage.setItem('theme', 'dark');
  } catch (e) {
    // ignore in restricted private browsing
  }
}

// ==========================================
// 2. MOBILE MENU
// ==========================================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// ==========================================
// 3. SCROLLSPY & HEADER BLUR
// ==========================================
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('main-header');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (header) {
      if (scrollY > 40) {
        header.classList.add('shadow-lg', 'bg-opacity-95');
      } else {
        header.classList.remove('shadow-lg', 'bg-opacity-95');
      }
    }

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('text-sky-400', 'font-semibold');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-sky-400', 'font-semibold');
          }
        });
      }
    });
  });
}

// ==========================================
// 4. PROJECT FILTERS
// ==========================================
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-sky-500', 'text-slate-900', 'font-semibold', 'shadow-lg', 'shadow-sky-500/20');
        b.classList.add('text-slate-300', 'hover:bg-slate-800');
      });

      btn.classList.remove('text-slate-300', 'hover:bg-slate-800');
      btn.classList.add('bg-sky-500', 'text-slate-900', 'font-semibold', 'shadow-lg', 'shadow-sky-500/20');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

// ==========================================
// 5. PROJECT MODAL DEEP DIVES WITH DIAGRAMS & METRICS
// ==========================================
const projectData = {
  'hr-sphere': {
    title: 'HR SPHERE — Enterprise Employee Management & Payroll System',
    tagline: 'Diploma Capstone Project (RIT Rajaramnagar) · In Association with Amrut Enterprises',
    badge: 'Enterprise & Desktop Systems',
    impact: 'Digitized workforce administration, automated monthly salary/payroll calculation, and eliminated manual accounting errors across departments. Formal research paper published in IJARSCT (April 2024).',
    metrics: [
      { label: 'Engineering SDLC', value: 'V-Model Lifecycle' },
      { label: 'Peer-Reviewed Paper', value: 'IJARSCT (Vol. 4, Issue 2)' },
      { label: 'Database', value: 'MS SQL Server 2022' },
      { label: 'Core Language', value: 'C#.NET (VS 2022)' }
    ],
    diagram: `[User Interaction: HR Admin / Employee]
         │
         ▼
[C#.NET Desktop Application Forms (Visual Studio 2022)]
         │
         ├──► [Authentication & Role-Based Privilege Engine]
         ├──► [Attendance Tracking & Leave Approval Logic]
         └──► [Automated Payroll & Tax Deduction Calculator]
                   │
                   ▼
[ADO.NET Database Access Layer]
                   │
                   ▼
[MS SQL Server 2022 Normalized Database Schemas & Stored Procedures]`,
    description: `HR SPHERE is an enterprise-grade Windows desktop application developed as the official Diploma Capstone Project at Rajarambapu Institute of Technology (RIT), sponsored by Amrut Enterprises, Islampur. Guided by Mr. Patil D.B., the project followed the formal V-Model software development lifecycle from requirements analysis through verification and acceptance testing.`,
    highlights: [
      'Official Diploma Capstone Project at Rajarambapu Institute of Technology (RIT), Rajaramnagar',
      'Developed in collaboration with industry sponsor Amrut Enterprises, Islampur under academic guidance',
      'Engineered complete modular desktop solution in C#.NET using Visual Studio 2022',
      'Architected normalized relational tables, foreign key constraints, and stored procedures in MS SQL Server 2022',
      'Automated complex employee workflows: real-time attendance tracking, leave accruals, salary calculation, and performance metrics',
      'Co-authored research paper published in International Journal of Advanced Research in Science Communication and Technology (IJARSCT), April 2024'
    ],
    stack: ['C#.NET', 'MS SQL Server 2022', 'Visual Studio 2022', 'V-Model SDLC', 'Windows Desktop', 'IJARSCT'],
    github: 'https://github.com/moin08s/HR_SPHERE',
    terminalCmd: 'hr-sphere',
    demo: null
  },
  'transitpro': {
    title: 'TransitPro — Bus Management System & Seat Reservation Logistics',
    tagline: '3-Layer Architecture Desktop Ticketing & Fleet Logistics Engine in Java Swing',
    badge: 'Desktop & Database Systems',
    impact: 'Replaced manual bus booking and ticket manifests with a deterministic, real-time Java Swing desktop management system with SQLite concurrency locking and role-based privilege isolation.',
    metrics: [
      { label: 'Software Architecture', value: '3-Layer (UI, Service, DAO)' },
      { label: 'Database Engine', value: 'Embedded SQLite' },
      { label: 'Runtime Environment', value: 'JDK 8+ Standard' },
      { label: 'Authentication', value: 'SHA-256 Hashing' }
    ],
    diagram: `[Java Swing User Interface (Customer / Admin)]
         │
         ▼
[Service Business Logic Layer (Scheduling, Pricing, Validation)]
         │
         ▼
[Data Access Object (DAO) Interface Layer]
         │
         ▼
[SQLite Embedded Database with Real-Time Seat Concurrency Locks]`,
    description: `TransitPro is a comprehensive desktop transit management application built in Java Swing following strict 3-tier architectural separation. It provides interactive seat selection, dynamic route scheduling, passenger manifest reporting, and secure credential handling.`,
    highlights: [
      'Structured 3-layer enterprise architecture: Presentation (Swing), Business Logic (Service), and Data Access Objects (DAO)',
      'Interactive visual seat reservation grid preventing double-booking through SQLite transaction locking',
      'Role-based access control (Admin / Counter Agent) with salted SHA-256 password security',
      'Comprehensive fleet and route scheduling modules with automated revenue generation reports',
      'Lightweight, zero-server deployment leveraging an embedded SQLite database'
    ],
    stack: ['Java', 'Java Swing', 'SQLite', 'DAO Architecture', 'SHA-256', 'Desktop App'],
    github: 'https://github.com/moin08s/Bus_Management_System',
    terminalCmd: 'transitpro',
    demo: null
  },
  'drishyamitra': {
    title: 'Drishyamitra — Smart Bridge Infrastructure Telemetry & Monitoring',
    tagline: 'Full-Stack Sensor Telemetry Ingestion & Vision-Assisted Structural Monitoring',
    badge: 'Infrastructure IoT & AI',
    impact: 'Enables continuous civil infrastructure monitoring by unifying sensor stress data with computer vision anomaly detection and automated emergency hazard alerts.',
    metrics: [
      { label: 'Domain', value: 'Civil Infrastructure IoT' },
      { label: 'Architecture', value: 'Full-Stack JavaScript' },
      { label: 'Telemetry Stream', value: 'Real-Time Edge' },
      { label: 'Frontend Stack', value: 'Vite / Modern JS' }
    ],
    diagram: `[Bridge Strain & Vibration Sensors + Video Ingestion]
         │
         ▼
[Node.js / Express Telemetry Processing Pipeline]
         │
         ├──► [Threshold Hazard Evaluation & Emergency Dispatch]
         │
         ▼
[Vite-Powered Real-Time Operator Monitoring Dashboard]`,
    description: `Drishyamitra is a full-stack smart infrastructure monitoring platform engineered to assess structural health and load conditions on bridge installations. It ingests sensor telemetry and visual feeds to dispatch immediate alerts when strain thresholds are breached.`,
    highlights: [
      'End-to-end full-stack architecture with decoupled frontend and backend ingestion servers',
      'Threshold-based structural alert pipeline for rapid emergency disaster response',
      'Interactive real-time monitoring interface built with Vite and modern JavaScript',
      'Engineered for resilient offline/edge field operations'
    ],
    stack: ['JavaScript', 'Node.js', 'Vite', 'IoT Telemetry', 'Computer Vision', 'Smart Bridge'],
    github: 'https://github.com/moin08s/Drishyamitra',
    terminalCmd: 'drishyamitra',
    demo: null
  },
  'stdotp': {
    title: 'stdotp — Zero-Dependency Go CLI TOTP/HOTP Authenticator',
    tagline: 'Zero Dependency Hackathon 2026 Entry · Go 1.27 Pure Standard Library',
    badge: 'Cryptography & Systems',
    impact: 'Eliminates software supply chain risk by replacing 15 third-party packages with pure, zero-CVE Go 1.27 standard library code. Ideal for air-gapped systems and high-assurance authentication.',
    metrics: [
      { label: 'External Dependencies', value: '0 (Pure Stdlib)' },
      { label: 'PBKDF2 Iterations', value: '600,000 (OWASP)' },
      { label: 'Passing RFC Tests', value: '56 / 56 (100%)' },
      { label: 'Key Derivation Latency', value: '< 0.18ms' }
    ],
    diagram: `[User Master Password]
         │
         ▼
[PBKDF2-HMAC-SHA256 (600,000 iters)] ──► [Zero-Alloc Salt Recycling]
         │
         ▼
[AES-256-GCM Authenticated Cipher] ──► [Bound with AAD Header Metadata]
         │
         ▼
[Atomic File Swap (.lock + os.Rename)] ──► [Directory fsync Sync]`,
    description: `stdotp is an air-gapped, high-assurance CLI authenticator and encrypted credential vault engineered strictly using Go 1.27's standard library with zero runtime dependencies. It achieves byte-for-byte conformance with RFC 4226 (HOTP) and RFC 6238 (TOTP) without relying on external cryptographic libraries.`,
    highlights: [
      'Zero-dependency design eliminates 15 transitive packages (pquerna/otp, google/uuid, golang.org/x/crypto)',
      'Vault Encryption: AES-256-GCM authenticated cipher bound with Additional Authenticated Data (AAD)',
      'Zero-Allocation Slice Reuse: Memory buffers are zeroed on exit to prevent memory dump inspection',
      'Atomic Persistence: Strict lockfile (.lock) protocol, temporary file staging, and directory fsync',
      'Tested against official RFC 4226, RFC 6238, and RFC 7914 test vectors (56 passing test suites)'
    ],
    stack: ['Go 1.27 Pure', 'AES-256-GCM', 'PBKDF2', 'RFC 4226', 'RFC 6238', 'Zero-Dependency', 'Lockfiles'],
    github: 'https://github.com/moin08s/stdotp',
    terminalCmd: 'stdotp self-test',
    demo: 'https://moin08s.github.io/stdotp/'
  },
  'wasp': {
    title: 'WASP — Wide-scope Artifact & Super-timeline Forensics Platform',
    tagline: 'Next-Generation Automated Digital Forensics & Incident Response (DFIR) Platform',
    badge: 'Security & Forensics',
    impact: 'Automates manual forensic analysis, parsing 14,800+ system artifacts to correlate attack timelines in seconds instead of days. Fully compliant with NIST SP 800-86 and ISO/IEC 27037.',
    metrics: [
      { label: 'Automated Test Suites', value: '29 / 29 Passing' },
      { label: 'Artifact Parsers', value: 'MFT, EVTX, Prefetch, Shellbags' },
      { label: 'External DB Required', value: 'None (Standalone)' },
      { label: 'Timeline Extraction Speed', value: '> 5,000 records/sec' }
    ],
    diagram: `[Raw System Artifacts (MFT, EVTX, Prefetch, Linux Audit)]
         │
         ▼
[Modular Forensic Ingestion Engine]
         │
         ▼
[Timestamp Normalization & Chronological Ordering]
         │
         ▼
[Adversary Dwell-Time & Attack Chain Super-Timeline (evidence.csv)]`,
    description: `WASP (Wide-scope Artifact & Super-timeline Platform) is an automated DFIR engine designed for incident responders and security analysts. It ingests forensic evidence from Windows and Linux operating systems to synthesize a tamper-evident super-timeline mapping attacker dwell-time and lateral movement.`,
    highlights: [
      'Multi-source forensic artifact ingestion across Windows event logs, shellbags, prefetch, and Linux audit logs',
      'Deterministic super-timeline synthesis establishing precise chronological adversary attack chains',
      '29 rigorous automated unit and integration tests passing in CI/CD pipeline',
      'Adheres to digital forensics evidence preservation standards (ISO/IEC 27037 & NIST SP 800-86)',
      'High-throughput parsing engine engineered in Python 3.11+ with zero heavy external database prerequisites'
    ],
    stack: ['Python 3.11+', 'DFIR', 'Super-Timeline', 'pytest', 'MIT License', 'Digital Forensics'],
    github: 'https://github.com/moin08s/WASP',
    terminalCmd: 'wasp',
    demo: null
  },
  'anchor': {
    title: 'Anchor — Cryptographic Video Provenance & Multi-Format DRM',
    tagline: 'End-to-End Cryptographic Video Signing, Perceptual Alignment & NLI Fact-Checking',
    badge: 'Applied AI & Security',
    impact: 'Protects media authenticity against generative AI deepfakes and out-of-context video clippings through tamper-proof cryptographic signatures and perceptual frame hashing.',
    metrics: [
      { label: 'fMP4 GOP Chunking', value: '2.0s Boundaries' },
      { label: 'Frame Perceptual Hashing', value: '1.0Hz DCT pHash' },
      { label: 'Neural NLI Accuracy', value: '98.7% Assertion Score' },
      { label: 'Merkle Root Latency', value: '< 45ms / video chunk' }
    ],
    diagram: `[Raw Video Stream] ──► [2.0s fMP4 GOP Boundary Segmentation]
         │
         ├──► [1.0Hz DCT Perceptual Frame Hashing (pHash)]
         │
         └──► [SHA-256 Merkle Tree Generation]
                   │
                   ▼
       [Ed25519 Digital Signing] ──► [Custom ISO-BMFF "anch" MP4 Box]
                   │
                   ▼
       [Zero-Shot Assertion Fact-Checking via BART-large-MNLI]`,
    description: `Anchor is a media integrity platform designed to neutralize deepfakes, out-of-context clipping, and unauthorized media tampering by uniting deterministic cryptography with perceptual neural AI.`,
    highlights: [
      'Dynamic fMP4 GOP boundary fragmentation (2.0s chunks) matching native FPS to eliminate algorithmic timing drift',
      'SHA-256 Merkle Tree generation embedded into custom ISO-BMFF "anch" MP4 boxes alongside Ed25519 digital signatures',
      'Perceptual Context Alignment via 1.0Hz DCT perceptual frame hashing (pHash) with sliding Hamming window matching',
      'Zero-shot neural fact-checking powered by HuggingFace BART-large-MNLI for claim-to-video assertion validation',
      'Ephemeral Multi-Format DRM engine using AES-256-GCM and Certificate Transparency Signed Tree Head (STH) logs'
    ],
    stack: ['Python 3.11', 'FastAPI', 'Ed25519', 'SHA-256 Merkle', 'BART-MNLI', 'DCT pHash', 'FFmpeg / fMP4'],
    github: 'https://github.com/moin08s/Anchor-Video-Provenance-System',
    terminalCmd: 'anchor',
    demo: null
  },
  'marineguard': {
    title: 'MarineGuard MCP — MoES Underwater Sonar Debris & Anomaly Detection',
    tagline: 'Smart India Hackathon (SIH26057) · Ministry of Earth Sciences (MoES)',
    badge: 'Protocol & Agentic Systems',
    impact: 'Enables autonomous AI agents to monitor ocean health and identify submerged marine debris in real time using side-scan acoustic sonar imagery and the Model Context Protocol (MCP).',
    metrics: [
      { label: 'Hackathon Track', value: 'SIH26057 (MoES)' },
      { label: 'Classification Confidence', value: '94.2% Anomaly Accuracy' },
      { label: 'Agent Protocol', value: 'Anthropic MCP Spec' },
      { label: 'Operator UI', value: 'Streamlit Real-Time' }
    ],
    diagram: `[Side-Scan Sonar Acoustic Feeds]
         │
         ▼
[Acoustic Feature Extractor & Debris Classifier (PyTorch)]
         │
         ▼
[Model Context Protocol (MCP) Server Endpoint]
         │
         ▼
[Autonomous LLM Agent Ingestion & Dispatch Notification Alert]`,
    description: `MarineGuard MCP is an AI-powered automated underwater marine debris and anomaly detection system using Side-Scan Sonar Imagery, engineered for Smart India Hackathon problem statement SIH26057 for the Ministry of Earth Sciences (MoES). It exposes sensor ingestion and debris detection tools via Anthropic's Model Context Protocol (MCP) server.`,
    highlights: [
      'Engineered for SIH Problem Statement SIH26057 (Ministry of Earth Sciences, MoES)',
      'Automated acoustic side-scan sonar image segmentation and underwater debris anomaly classification',
      'Anthropic Model Context Protocol (MCP) tool endpoints for autonomous LLM agent execution',
      'Interactive Streamlit operator dashboard with real-time sonar analysis telemetry',
      'Full test suite with pytest integration for high-reliability maritime deployment'
    ],
    stack: ['Python 3.10+', 'Model Context Protocol (MCP)', 'Side-Scan Sonar AI', 'Streamlit', 'Pytest', 'FastAPI'],
    github: 'https://github.com/moin08s/marineguard-mcp',
    terminalCmd: 'marineguard',
    demo: null
  },
  'guardian': {
    title: 'Guardian AI (Abhaya) — Proactive Safety & Live Mapping Mobile App',
    tagline: 'Flutter Mobile Platform with IoT Sensor Integration & LLaMA 3.3 Emergency AI',
    badge: 'Mobile & AI',
    impact: 'Protects users during emergencies by autonomously detecting physical trauma or hardware strap tampering and delivering multilingual emergency guidance with zero cellular dependency.',
    metrics: [
      { label: 'Emergency Trigger Latency', value: '< 300ms Panic Dispatch' },
      { label: 'Languages Supported', value: 'English, Hindi, Marathi' },
      { label: 'Local Storage', value: 'SQLite Encrypted Breadcrumbs' },
      { label: 'Routing Engine', value: 'OpenStreetMap (Offline)' }
    ],
    diagram: `[ESP32 Wearable (Heart Rate, GSR, Strap Tamper)]
         │
         ▼
[Flutter Mobile Event Bus (BLoC State Machine)]
         ├──► [State: Safe / Panic / Tamper Mode]
         ├──► [LLaMA 3.3 Multilingual Survival Guidance (EN/HI/MR)]
         ├──► [Offline SQLite GPS Breadcrumb Recorder]
         └──► [Overpass API Nearest Police/Hospital Routing]`,
    description: `Guardian AI (Abhaya) is a production-ready mobile application pairing with wearable IoT sensors (ESP32/nRF52) to detect physical trauma, tamper alerts, and panic situations with autonomous AI guidance.`,
    highlights: [
      'State-driven safety dashboard dynamically switching between Safe, Panic, and Tamper operational modes',
      'Standalone AI Safety Advisor using LLaMA 3.3-70B via Groq API offering instant multilingual survival directions',
      'Dynamic emergency routing integrating OpenStreetMap (OSM) via Overpass API for nearest police stations and hospitals',
      'Audio Black Box: Background ambient audio recording in high-quality AAC upon SOS trigger',
      'Offline-First architecture with local SQLite (sqflite) GPS breadcrumb logging and automatic connectivity auto-sync'
    ],
    stack: ['Flutter / Dart', 'LLaMA 3.3 (Groq API)', 'OpenStreetMap', 'SQLite', 'ESP32 IoT', 'AAC Audio'],
    github: 'https://github.com/moin08s/Guardian-app',
    demo: null
  },
  'jammukhoj': {
    title: 'JammuKhoj — Offline-First Smart Tourism & Pilgrim Safety Companion',
    tagline: 'Apple-Inspired Travel & Safety System for Jammu Division & Vaishno Devi Pilgrimage',
    badge: 'Web & Mobile Systems',
    impact: 'Guarantees uninterrupted navigation, emergency medical directories, and safety alerts for thousands of pilgrims traveling to Vaishno Devi with 100% offline PWA caching in mountainous terrain.',
    metrics: [
      { label: 'Offline Availability', value: '100% PWA Service Worker' },
      { label: 'Bundle Cold Start', value: '< 1.1s on 4G' },
      { label: 'UI Framework', value: 'React 18 + Vite 5.4' },
      { label: 'Data Store', value: 'IndexedDB Offline Cache' }
    ],
    diagram: `[User Request / Pilgrim Itinerary]
         │
         ▼
[Vite PWA Service Worker Cache Layer]
         ├──► [Offline IndexedDB Geospatial Map Tiles]
         ├──► [Vaishno Devi Yatra Medical & SOS Directory]
         └──► [Altitude & Trekking Duration Calculator]`,
    description: `JammuKhoj is an Apple-inspired, offline-first smart tourism and pilgrim safety companion web application engineered specifically for the Jammu Division and visitors to the Vaishno Devi pilgrimage. It ensures uninterrupted guidance, emergency SOS hotlines, and travel itinerary tracking even with zero cellular connectivity in mountainous regions.`,
    highlights: [
      'Offline-First architecture with local browser caching of maps, trekking routes, and pilgrimage guides',
      'Vaishno Devi yatra safety protocols, emergency medical post contacts, and SOS dispatch directories',
      'Minimalist, accessible Apple-inspired user interface built with React 18 and Tailwind CSS',
      'Fast, type-safe frontend pipeline engineered using TypeScript 5.5 and Vite',
      'Interactive point-of-interest discovery with historical notes and altitude-aware itinerary planners'
    ],
    stack: ['React 18.3', 'TypeScript 5.5', 'Vite 5.4', 'TailwindCSS', 'Offline-First', 'PWA'],
    github: 'https://github.com/moin08s/JammuKhoj',
    terminalCmd: 'jammukhoj',
    demo: null
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalTagline = document.getElementById('modal-tagline');
  const modalBadge = document.getElementById('modal-badge');
  const modalDesc = document.getElementById('modal-desc');
  const modalImpact = document.getElementById('modal-impact');
  const modalMetrics = document.getElementById('modal-metrics');
  const modalDiagram = document.getElementById('modal-diagram');
  const modalHighlights = document.getElementById('modal-highlights');
  const modalStack = document.getElementById('modal-stack');
  const modalGithub = document.getElementById('modal-github-link');
  const modalDemo = document.getElementById('modal-demo-link');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  if (!modal) return;

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalTagline.textContent = data.tagline;
      modalBadge.textContent = data.badge;
      modalDesc.textContent = data.description;

      if (modalImpact && data.impact) {
        modalImpact.innerHTML = `<div class="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs font-mono text-sky-200"><strong class="text-white uppercase tracking-wider block mb-1">// Recruiter & Business Impact:</strong> ${data.impact}</div>`;
      }

      if (modalMetrics && data.metrics) {
        modalMetrics.innerHTML = data.metrics.map(m => `
          <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center">
            <div class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">${m.label}</div>
            <div class="text-sm font-mono font-bold text-sky-300 mt-0.5">${m.value}</div>
          </div>
        `).join('');
      }

      if (modalDiagram && data.diagram) {
        modalDiagram.innerHTML = `
          <div class="mt-4">
            <h4 class="text-xs font-mono uppercase text-purple-400 tracking-wider mb-1.5">// Architectural Dataflow Diagram</h4>
            <pre class="p-3 rounded-xl bg-slate-950 border border-purple-500/30 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">${data.diagram}</pre>
          </div>
        `;
      } else if (modalDiagram) {
        modalDiagram.innerHTML = '';
      }

      modalHighlights.innerHTML = data.highlights
        .map(h => `<li class="flex items-start gap-2"><span class="text-emerald-400 mt-0.5 font-bold">✔</span><span>${h}</span></li>`)
        .join('');

      modalStack.innerHTML = data.stack
        .map(s => `<span class="px-2.5 py-1 rounded-md text-xs font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20">${s}</span>`)
        .join('');

      modalGithub.href = data.github;
      
      // Dynamic live demo / interactive CLI launcher
      if (modalDemo) {
        const demoTextSpan = modalDemo.querySelector('span');
        if (data.demo && data.demo.startsWith('http')) {
          modalDemo.href = data.demo;
          modalDemo.target = '_blank';
          modalDemo.onclick = null;
          if (demoTextSpan) demoTextSpan.textContent = 'Open Live Web Demo';
          modalDemo.classList.remove('hidden');
        } else if (data.terminalCmd || data.demo) {
          const targetCmd = data.terminalCmd || data.demo;
          modalDemo.href = '#terminal-section';
          modalDemo.target = '_self';
          if (demoTextSpan) demoTextSpan.textContent = 'Launch Interactive CLI Demo';
          modalDemo.onclick = (evt) => {
            evt.preventDefault();
            closeModal();
            if (window.runTerminalCommand) {
              window.runTerminalCommand(targetCmd);
            }
          };
          modalDemo.classList.remove('hidden');
        } else {
          modalDemo.classList.add('hidden');
        }
      }

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// ==========================================
// 6. CONTACT FORM & DIRECT NOTIFICATION DISPATCH
// ==========================================
function initContactForm() {
  const contactForm = document.getElementById('portfolio-contact-form');
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const origText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Preparing Transmission...</span>`;
    submitBtn.disabled = true;

    // Save message locally to guarantee zero lost inquiries
    try {
      const stored = JSON.parse(localStorage.getItem('portfolio_inquiries') || '[]');
      stored.push({ name, email, message, date: new Date().toISOString() });
      localStorage.setItem('portfolio_inquiries', JSON.stringify(stored));
    } catch (err) {}

    setTimeout(() => {
      // Trigger prefilled email client
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hello Moin,\n\n${message}\n\nFrom: ${name} (${email})`);
      window.location.href = `mailto:moin.sajit.mulla@gmail.com?subject=${subject}&body=${body}`;

      submitBtn.innerHTML = `<span>Transmission Ready!</span>`;
      showToast(`Thank you, ${name}! Your email client has been opened to send this directly. You can also connect on LinkedIn!`, 'success');
      contactForm.reset();

      setTimeout(() => {
        submitBtn.innerHTML = origText;
        submitBtn.disabled = false;
      }, 4000);
    }, 800);
  });

  function showToast(msg, type = 'success') {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;

    if (type === 'error') {
      toast.classList.remove('border-sky-500/50', 'text-slate-100');
      toast.classList.add('border-rose-500/80', 'text-rose-200');
    } else {
      toast.classList.remove('border-rose-500/80', 'text-rose-200');
      toast.classList.add('border-sky-500/50', 'text-slate-100');
    }

    toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 6000);
  }
}

// ==========================================
// 7. COUNTER ANIMATIONS
// ==========================================
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  function runCounters() {
    if (animated) return;
    const hero = document.getElementById('hero');
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    if (rect.top <= window.innerHeight) {
      animated = true;
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1200;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            counter.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current).toLocaleString();
          }
        }, 16);
      });
    }
  }

  window.addEventListener('scroll', runCounters);
  runCounters();
}
