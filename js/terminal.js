/**
 * Interactive Terminal Emulator for Moin Mulla's Portfolio
 * Simulates real CLI tools including stdotp (Zero-dependency TOTP tool)
 * Full interactive support for project demos, history, click-to-focus, and auto-scroll.
 */

// Global runner accessible from anywhere in the document (project cards, modal, chips)
window.runTerminalCommand = function(cmd) {
  if (!cmd) return;
  const terminalSection = document.getElementById('terminal-section');
  const terminalInput = document.getElementById('terminal-input');
  
  if (terminalSection) {
    terminalSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (window._terminalExec) {
    window._terminalExec(cmd);
  }
  if (terminalInput) {
    terminalInput.focus();
  }
};

function initTerminal() {
  const terminalBody = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  const terminalForm = document.getElementById('terminal-form');
  const terminalContainer = document.getElementById('interactive-terminal');
  const runBtn = document.getElementById('terminal-run-btn');

  if (!terminalBody || !terminalInput) return;

  // Virtual file system & simulated state
  let history = [];
  let historyIndex = -1;
  let vaultInitialized = true;
  let vaultAccounts = {
    'github': { secret: 'JBSWY3DPEHPK3PXP', algo: 'SHA1', digits: 6, period: 30 },
    'aws': { secret: 'KVKFKRCPNZQUYMLX', algo: 'SHA256', digits: 6, period: 30 },
    'cloudflare': { secret: 'NBSWY3DPEHPK3PXP', algo: 'SHA1', digits: 6, period: 30 }
  };

  const banner = `
<div class="text-sky-400 font-bold flex items-center gap-2">
  <span>⚡ Moin Mulla CLI Workstation [v2.9.0-release]</span>
  <span class="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">ONLINE</span>
</div>
<div class="text-slate-400 text-xs mt-1">
  Type <span class="text-emerald-400 font-semibold">'help'</span> for command listing, or <span class="text-sky-300 font-semibold">'demo'</span> / <span class="text-sky-300 font-semibold">'projects'</span> to launch live engineering project simulations.
</div>
`;

  printOutput(banner);

  // Expose execution function internally
  window._terminalExec = function(rawCmd) {
    const cmd = (rawCmd || '').trim();
    if (!cmd) return;
    history.push(cmd);
    historyIndex = history.length;
    printCommand(cmd);
    processCommand(cmd);
    scrollToBottom();
  };

  // Click-to-focus: clicking anywhere inside the terminal focuses the prompt
  if (terminalContainer) {
    terminalContainer.addEventListener('click', (e) => {
      if (!e.target.closest('button') && !e.target.closest('a')) {
        terminalInput.focus();
      }
    });
  }

  // Terminal launcher links in nav and hero
  document.querySelectorAll('a[href="#terminal-section"]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      setTimeout(() => {
        terminalInput.focus();
      }, 400);
    });
  });

  // Delegated click handler for quick chips and in-output command buttons
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.cli-quick-chip, .terminal-cmd-btn');
    if (!chip) return;
    const cmd = chip.getAttribute('data-cmd');
    if (!cmd) return;
    if (window._terminalExec) {
      window._terminalExec(cmd);
    }
    terminalInput.focus();
  });

  // Form submit handler
  if (terminalForm) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cmd = terminalInput.value.trim();
      if (!cmd) return;
      terminalInput.value = '';
      if (window._terminalExec) {
        window._terminalExec(cmd);
      }
    });
  }

  // Direct run button click handler
  if (runBtn) {
    runBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = terminalInput.value.trim();
      if (!cmd) return;
      terminalInput.value = '';
      if (window._terminalExec) {
        window._terminalExec(cmd);
      }
    });
  }

  // Keyboard navigation for command history & enter submission
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = terminalInput.value.trim();
      if (!cmd) return;
      terminalInput.value = '';
      if (window._terminalExec) {
        window._terminalExec(cmd);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        terminalInput.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        terminalInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        terminalInput.value = '';
      }
    }
  });

  function scrollToBottom() {
    setTimeout(() => {
      if (terminalBody) {
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    }, 20);
  }

  function printCommand(cmd) {
    const line = document.createElement('div');
    line.className = 'flex items-center gap-2 mt-3 font-mono text-sm';
    line.innerHTML = `<span class="text-emerald-400">moin@workstation</span><span class="text-slate-400">:</span><span class="text-sky-400">~</span><span class="text-slate-400">$</span> <span class="text-white font-semibold">${escapeHtml(cmd)}</span>`;
    terminalBody.appendChild(line);
  }

  function printOutput(htmlContent) {
    const output = document.createElement('div');
    output.className = 'font-mono text-sm text-slate-300 leading-relaxed mt-1.5';
    output.innerHTML = htmlContent;
    terminalBody.appendChild(output);
    scrollToBottom();
  }

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function processCommand(rawCmd) {
    const parts = rawCmd.split(' ').filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Support 'project demo' or 'projects demo'
    if ((cmd === 'project' || cmd === 'projects') && args[0] === 'demo') {
      if (args[1]) {
        routeProjectDemo(args[1], args.slice(2));
      } else {
        showDemoMenu();
      }
      return;
    }

    // Support 'demo <name>'
    if (cmd === 'demo' || cmd === 'demos') {
      if (args.length > 0) {
        routeProjectDemo(args[0], args.slice(1));
      } else {
        showDemoMenu();
      }
      return;
    }

    // Support 'run <name>' or 'test <name>'
    if ((cmd === 'run' || cmd === 'test') && args.length > 0) {
      routeProjectDemo(args[0], args.slice(1));
      return;
    }

    switch (cmd) {
      case 'help':
        printOutput(`
<span class="text-emerald-400 font-bold">// Available System Commands:</span>
  <span class="text-sky-400 font-semibold">demo</span> [name]       - Launch interactive project demo simulations (e.g. 'demo stdotp', 'demo hr-sphere')
  <span class="text-sky-400 font-semibold">projects</span>          - List flagship engineering systems & repositories
  <span class="text-sky-400 font-semibold">hr-sphere</span>         - Inspect Diploma Capstone Project (C#.NET & MS SQL 2022)
  <span class="text-sky-400 font-semibold">transitpro</span>        - Inspect TransitPro Bus Management (Java Swing & SQLite DAO)
  <span class="text-sky-400 font-semibold">stdotp</span>            - Execute Zero-Dependency Go TOTP Authenticator & test suite
  <span class="text-sky-400 font-semibold">marineguard</span>       - Simulate MarineGuard MCP Sonar Debris Detection (SIH26057)
  <span class="text-sky-400 font-semibold">drishyamitra</span>      - Inspect Drishyamitra Smart Bridge Telemetry Stream
  <span class="text-sky-400 font-semibold">wasp</span>              - Run WASP Forensic Artifact & Super-timeline simulation
  <span class="text-sky-400 font-semibold">anchor</span>            - Verify Video Merkle Tree & Tamper Provenance engine
  <span class="text-sky-400 font-semibold">whoami</span>            - Display engineer profile & hackathon credentials
  <span class="text-sky-400 font-semibold">skills</span>            - List competencies across Systems, Cryptography, & AI
  <span class="text-sky-400 font-semibold">ls</span> / <span class="text-sky-400 font-semibold">dir</span>           - List files and directories in current workstation
  <span class="text-sky-400 font-semibold">socials</span>           - Output GitHub, LinkedIn & live portfolio links
  <span class="text-sky-400 font-semibold">resume</span>            - View resume highlights and download link
  <span class="text-sky-400 font-semibold">clear</span> / <span class="text-sky-400 font-semibold">cls</span>       - Clear the terminal screen
        `);
        break;

      case 'demo':
      case 'demos':
        showDemoMenu();
        break;

      case 'projects':
      case 'project':
        printOutput(`
<span class="text-emerald-400 font-bold">Flagship Engineering Projects (github.com/moin08s):</span>

  1. <span class="text-sky-400 font-bold">HR SPHERE</span> [C#.NET / MS SQL Server 2022]
     • Diploma Capstone Project at RIT & IJARSCT research publication (April 2024).
     • Enterprise employee records, automated payroll calculation & V-Model SDLC.
     • <button class="terminal-cmd-btn px-2 py-0.5 rounded text-[11px] bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30" data-cmd="hr-sphere">Run Simulation</button> · <a href="https://github.com/moin08s/HR_SPHERE" target="_blank" class="text-slate-400 hover:text-emerald-400 underline">GitHub Repo</a>

  2. <span class="text-sky-400 font-bold">stdotp</span> [Pure Go 1.27 Standard Library]
     • Zero-dependency CLI 2FA Authenticator & AES-256-GCM encrypted vault.
     • Zero Dependency Hackathon 2026 entry; 56 RFC-compliant passing tests.
     • <button class="terminal-cmd-btn px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30" data-cmd="stdotp self-test">Run Self-Test</button> · <a href="https://moin08s.github.io/stdotp/" target="_blank" class="text-emerald-400 underline font-semibold">Open Browser Web Demo</a>

  3. <span class="text-sky-400 font-bold">TransitPro</span> [Java Swing / SQLite]
     • 3-Layer DAO architecture desktop transit logistics platform.
     • Real-time seat concurrency locking and salted SHA-256 authentication.
     • <button class="terminal-cmd-btn px-2 py-0.5 rounded text-[11px] bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30" data-cmd="transitpro">Run Simulation</button> · <a href="https://github.com/moin08s/Bus_Management_System" target="_blank" class="text-slate-400 hover:text-emerald-400 underline">GitHub Repo</a>

  4. <span class="text-sky-400 font-bold">MarineGuard MCP</span> [Python / Model Context Protocol]
     • SIH26057 MoES acoustic side-scan sonar underwater debris detection.
     • <button class="terminal-cmd-btn px-2 py-0.5 rounded text-[11px] bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30" data-cmd="marineguard">Run Telemetry</button> · <a href="https://github.com/moin08s/marineguard-mcp" target="_blank" class="text-slate-400 hover:text-emerald-400 underline">GitHub Repo</a>

  5. <span class="text-sky-400 font-bold">Drishyamitra</span> [JavaScript / Node.js / Vite]
     • Smart bridge continuous infrastructure health monitoring & alert dispatch.
     • <button class="terminal-cmd-btn px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30" data-cmd="drishyamitra">Run Telemetry</button> · <a href="https://github.com/moin08s/Drishyamitra" target="_blank" class="text-slate-400 hover:text-emerald-400 underline">GitHub Repo</a>

  6. <span class="text-sky-400 font-bold">WASP</span> [Python 3.11+]
     • Wide-scope Artifact & Super-timeline Platform (DFIR, 29/29 tests pass).
     • <button class="terminal-cmd-btn px-2 py-0.5 rounded text-[11px] bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30" data-cmd="wasp">Run DFIR Ingestion</button> · <a href="https://github.com/moin08s/WASP" target="_blank" class="text-slate-400 hover:text-emerald-400 underline">GitHub Repo</a>
        `);
        break;

      case 'hr-sphere':
      case 'hrsphere':
      case 'hr_sphere':
      case 'hr':
        printOutput(`
<span class="text-sky-400 font-bold">🏢 HR SPHERE — Enterprise Employee Management & Payroll System</span>
<span class="text-slate-300">Official Diploma Capstone Project | Rajarambapu Institute of Technology (RIT)</span>
<span class="text-slate-400">Industry Sponsor: Amrut Enterprises | Guided by: Mr. Patil D.B. | Research: IJARSCT (April 2024)</span>

<span class="text-emerald-400 font-semibold">[Simulating Enterprise Core Transaction]:</span>
  <span class="text-slate-400">[01/04]</span> Authenticating HR Administrator with Role-Based Access Control... <span class="text-emerald-400">✔ OK</span>
  <span class="text-slate-400">[02/04]</span> Connecting to MS SQL Server 2022 [tbl_EmployeeRecords] (142 active staff)... <span class="text-emerald-400">✔ Verified</span>
  <span class="text-slate-400">[03/04]</span> Ingesting biometric punch-clock attendance log: 98.4% monthly adherence... <span class="text-emerald-400">✔ Synchronized</span>
  <span class="text-slate-400">[04/04]</span> Executing automated payroll calculator (Basic + DA + HRA - EPF & Tax):
          • Basic Salary: ₹42,000 | Allowances: ₹18,400 | Deductions: ₹4,800
          • Net Disbursement Computed: <span class="text-emerald-400 font-bold">₹55,600.00</span> (Zero manual calculation error)
          • Generated audit-ready batch: EMP-2026-04.pdf (142 disbursements queued)
<span class="text-emerald-400 font-bold">✔ Transaction committed successfully to MS SQL Server 2022.</span>
<span class="text-slate-400">Repository: <a href="https://github.com/moin08s/HR_SPHERE" target="_blank" class="text-sky-300 underline">https://github.com/moin08s/HR_SPHERE</a></span>
        `);
        break;

      case 'transitpro':
      case 'transit':
      case 'bus':
        printOutput(`
<span class="text-sky-400 font-bold">🚌 TransitPro — Bus Management System & Ticketing Platform</span>
<span class="text-slate-300">Desktop Travel Logistics with 3-Layer DAO Architecture</span>
<span class="text-slate-400">Stack: Java Swing UI ➔ Service Business Logic ➔ Data Access Object (DAO) ➔ SQLite</span>

<span class="text-emerald-400 font-semibold">[Simulating Real-Time Booking & Concurrency Lock]:</span>
  <span class="text-slate-400">[01/04]</span> Fetching Route Schedules: Route #402 (Sangli ➔ Pune Express)... <span class="text-emerald-400">✔ OK</span>
  <span class="text-slate-400">[02/04]</span> Loading interactive 40-seat visual matrix in Java Swing... <span class="text-emerald-400">✔ Ready</span>
  <span class="text-slate-400">[03/04]</span> Reserving Seat #14A (Passenger: Rahul V.)...
          • Acquiring SQLite atomic transaction lock to prevent double-booking... <span class="text-emerald-400">✔ Lock Acquired</span>
  <span class="text-slate-400">[04/04]</span> Dynamic pricing calculated: ₹650.00 + GST | Salted SHA-256 Agent verified
          • Manifest updated: PNR #TP-84920
<span class="text-emerald-400 font-bold">✔ Ticket confirmed & Seat #14A marked reserved across all terminal stations!</span>
<span class="text-slate-400">Repository: <a href="https://github.com/moin08s/Bus_Management_System" target="_blank" class="text-sky-300 underline">https://github.com/moin08s/Bus_Management_System</a></span>
        `);
        break;

      case 'stdotp':
        handleStdotp(args);
        break;

      case 'marineguard':
      case 'sonar':
        handleMarineGuard(args);
        break;

      case 'drishyamitra':
      case 'bridge':
        handleDrishyamitra(args);
        break;

      case 'wasp':
      case 'forensics':
        handleWasp(args);
        break;

      case 'anchor':
        handleAnchor(args);
        break;

      case 'jammukhoj':
        handleJammuKhoj(args);
        break;

      case 'whoami':
        printOutput(`
<span class="text-sky-400 font-bold">Moin Sajit Mulla</span> (@moin08s)
<span class="text-slate-300">Systems & Backend Software Engineer | Applied Cryptography & Forensics | Mobile & AI Pipelines</span>
Location: Sangli / Islampur, Maharashtra, India
Education: Diploma in Computer Engineering, Rajarambapu Institute of Technology (RIT)
Hackathons: 🥉 3rd Prize Aarambh '26 (WCE Sangli) · Zero Dependency '26 (stdotp) · SIH26057 MoES
Public Repositories: 12 on GitHub
GitHub: <a href="https://github.com/moin08s" target="_blank" class="text-emerald-400 underline">https://github.com/moin08s</a>
LinkedIn: <a href="https://www.linkedin.com/in/moin-mulla-4ba680218/" target="_blank" class="text-emerald-400 underline">https://www.linkedin.com/in/moin-mulla-4ba680218/</a>
Live Web Demo: <a href="https://moin08s.github.io/stdotp/" target="_blank" class="text-sky-300 underline font-semibold">https://moin08s.github.io/stdotp/</a>
        `);
        break;

      case 'skills':
        printOutput(`
<span class="text-emerald-400 font-bold">Core Engineering Competencies:</span>
  • <span class="text-sky-300 font-medium">Languages:</span> C# (.NET), Java, Python, C (DSA Stack/Queue), Go (1.27 Pure Stdlib), JavaScript, TypeScript, SQL
  • <span class="text-sky-300 font-medium">Desktop & Enterprise:</span> Visual Studio 2022, MS SQL Server 2022, Java Swing, 3-Layer DAO, V-Model SDLC, RBAC
  • <span class="text-sky-300 font-medium">AI & Protocol Systems:</span> Geodata Processing (ISRO IIRS), Model Context Protocol (MCP), Sonar AI, PyTorch
  • <span class="text-sky-300 font-medium">Systems & Cryptography:</span> AES-256-GCM, Merkle Trees, PBKDF2 (OWASP), RFC 4226/6238, DFIR, Lockfiles
        `);
        break;

      case 'ls':
      case 'dir':
        printOutput(`
<span class="text-slate-400">Workstation Directory Listing: /home/moin/portfolio</span>
drwxr-xr-x  moin  staff   <button class="terminal-cmd-btn text-sky-400 hover:underline" data-cmd="hr-sphere">hr-sphere/</button>       (C#.NET & MS SQL Desktop Capstone)
drwxr-xr-x  moin  staff   <button class="terminal-cmd-btn text-sky-400 hover:underline" data-cmd="transitpro">transitpro/</button>      (Java Swing 3-Layer Logistics)
-rwxr-xr-x  moin  staff   <button class="terminal-cmd-btn text-emerald-400 hover:underline font-bold" data-cmd="stdotp self-test">stdotp*</button>          (Pure Go 1.27 CLI Authenticator)
drwxr-xr-x  moin  staff   <button class="terminal-cmd-btn text-sky-400 hover:underline" data-cmd="marineguard">marineguard/</button>     (MoES Acoustic Sonar MCP Agent)
drwxr-xr-x  moin  staff   <button class="terminal-cmd-btn text-sky-400 hover:underline" data-cmd="drishyamitra">drishyamitra/</button>    (Smart Bridge Telemetry Pipeline)
drwxr-xr-x  moin  staff   <button class="terminal-cmd-btn text-sky-400 hover:underline" data-cmd="wasp">wasp/</button>            (DFIR Super-Timeline Ingestion)
drwxr-xr-x  moin  staff   <button class="terminal-cmd-btn text-sky-400 hover:underline" data-cmd="anchor">anchor/</button>          (Video Merkle Provenance Engine)
drwxr-xr-x  moin  staff   <button class="terminal-cmd-btn text-sky-400 hover:underline" data-cmd="jammukhoj">jammukhoj/</button>       (Offline-First Pilgrim PWA)
-rw-r--r--  moin  staff   <a href="assets/resume.html" target="_blank" class="text-slate-300 underline">RESUME.pdf</a>
-rw-r--r--  moin  staff   <a href="README.md" target="_blank" class="text-slate-300 underline">README.md</a>
<span class="text-slate-500 text-xs">Tip: Click any directory or type 'demo &lt;project&gt;' to execute.</span>
        `);
        break;

      case 'cat':
        if (args.length === 0) {
          printOutput(`<span class="text-rose-400">Usage: cat &lt;project-or-file&gt; (e.g. 'cat hr-sphere', 'cat stdotp', 'cat resume')</span>`);
          return;
        }
        routeProjectDemo(args[0], ['cat']);
        break;

      case 'socials':
      case 'contact':
        printOutput(`
<span class="text-emerald-400 font-bold">Connect with Moin Mulla:</span>
  • GitHub: <a href="https://github.com/moin08s" target="_blank" class="text-sky-400 underline">https://github.com/moin08s</a>
  • LinkedIn: <a href="https://www.linkedin.com/in/moin-mulla-4ba680218/" target="_blank" class="text-sky-400 underline">https://www.linkedin.com/in/moin-mulla-4ba680218/</a>
  • Interactive Web Demo: <a href="https://moin08s.github.io/stdotp/" target="_blank" class="text-emerald-400 underline">https://moin08s.github.io/stdotp/</a>
        `);
        break;

      case 'resume':
        printOutput(`
<span class="text-emerald-400 font-bold">Résumé Highlights:</span>
Moin Sajit Mulla — Backend & Systems Software Engineer.
Specialist in High-Assurance Cryptography, Zero-Dependency Clean Architecture, and Cross-Platform Full-Stack.
<a href="assets/resume.html" target="_blank" class="text-emerald-400 underline font-semibold">📄 Click here to open and download full Résumé (PDF)</a>
        `);
        break;

      case 'clear':
      case 'cls':
        terminalBody.innerHTML = '';
        break;

      case 'theme':
        printOutput(`<span class="text-sky-300">Theme locked to high-contrast engineering Dark Mode.</span>`);
        break;

      case 'date':
        printOutput(new Date().toUTCString());
        break;

      case 'echo':
        printOutput(escapeHtml(args.join(' ')));
        break;

      default:
        printOutput(`<span class="text-rose-400">Command not recognized: '${escapeHtml(cmd)}'. Type <span class="text-emerald-400 font-semibold">'help'</span> or <span class="text-emerald-400 font-semibold">'demo'</span> for available options.</span>`);
        break;
    }
  }

  function showDemoMenu() {
    printOutput(`
<span class="text-emerald-400 font-bold">// Flagship Project Interactive Demos:</span>
<span class="text-slate-400">Click any button below or type <span class="text-sky-300 font-semibold">'demo &lt;project&gt;'</span> to run:</span>

  1. <span class="text-sky-300 font-bold">stdotp</span>: Zero-dependency Go TOTP Authenticator (RFC 4226/6238)
     <button class="terminal-cmd-btn px-2.5 py-1 rounded text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30" data-cmd="stdotp self-test">Run 56 Cryptographic Tests</button>
     <button class="terminal-cmd-btn px-2.5 py-1 rounded text-xs font-mono bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30 ml-1" data-cmd="stdotp code github">Generate GitHub 2FA Code</button>
     <a href="https://moin08s.github.io/stdotp/" target="_blank" class="px-2.5 py-1 rounded text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 inline-block ml-1">Open Full Browser Demo ↗</a>

  2. <span class="text-sky-300 font-bold">HR SPHERE</span>: Diploma Capstone Project (C#.NET & MS SQL 2022)
     <button class="terminal-cmd-btn px-2.5 py-1 rounded text-xs font-mono bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30" data-cmd="hr-sphere">Simulate Payroll & Biometric Pipeline</button>

  3. <span class="text-sky-300 font-bold">TransitPro</span>: Desktop Bus Logistics Engine (Java Swing & SQLite DAO)
     <button class="terminal-cmd-btn px-2.5 py-1 rounded text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30" data-cmd="transitpro">Simulate Seat Lock & Reservation</button>

  4. <span class="text-sky-300 font-bold">MarineGuard MCP</span>: MoES Underwater Sonar Debris Detection
     <button class="terminal-cmd-btn px-2.5 py-1 rounded text-xs font-mono bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30" data-cmd="marineguard">Dispatch MCP Sonar Telemetry</button>

  5. <span class="text-sky-300 font-bold">Drishyamitra</span>: Smart Bridge Telemetry & Structural Stress Monitoring
     <button class="terminal-cmd-btn px-2.5 py-1 rounded text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30" data-cmd="drishyamitra">Read Real-Time Strain Sensors</button>

  6. <span class="text-sky-300 font-bold">WASP</span>: Automated DFIR Super-Timeline Platform (29 Tests Passing)
     <button class="terminal-cmd-btn px-2.5 py-1 rounded text-xs font-mono bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30" data-cmd="wasp">Run DFIR Artifact Ingestion</button>

  7. <span class="text-sky-300 font-bold">Anchor</span>: Cryptographic Video Merkle Provenance Engine
     <button class="terminal-cmd-btn px-2.5 py-1 rounded text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30" data-cmd="anchor">Run Video Hash & Sig Verification</button>
    `);
  }

  function routeProjectDemo(projectName, subArgs) {
    const target = projectName.toLowerCase().replace(/_/g, '-');
    switch (target) {
      case 'stdotp':
        if (subArgs.length > 0) {
          handleStdotp(subArgs);
        } else {
          handleStdotp(['self-test']);
        }
        break;
      case 'hr-sphere':
      case 'hrsphere':
      case 'hr':
        processCommand('hr-sphere');
        break;
      case 'transitpro':
      case 'transit':
      case 'bus':
        processCommand('transitpro');
        break;
      case 'marineguard':
      case 'sonar':
        handleMarineGuard(subArgs);
        break;
      case 'drishyamitra':
      case 'bridge':
        handleDrishyamitra(subArgs);
        break;
      case 'wasp':
      case 'forensics':
        handleWasp(subArgs);
        break;
      case 'anchor':
        handleAnchor(subArgs);
        break;
      case 'jammukhoj':
        handleJammuKhoj(subArgs);
        break;
      default:
        printOutput(`<span class="text-amber-400">Project '${escapeHtml(projectName)}' found. Running default demo:</span>`);
        showDemoMenu();
        break;
    }
  }

  function handleStdotp(args) {
    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
      printOutput(`
<span class="text-sky-400 font-bold">stdotp v1.0.0</span> — Zero-Dependency CLI TOTP/HOTP Authenticator
<span class="text-slate-400">Pure Go 1.27 Standard Library · RFC 4226 & RFC 6238 Compliant</span>

<span class="text-emerald-400 font-semibold">Commands:</span>
  • <button class="terminal-cmd-btn text-sky-300 underline" data-cmd="stdotp self-test">stdotp self-test</button>       - Run standalone cryptographic test suite (56 tests)
  • <button class="terminal-cmd-btn text-sky-300 underline" data-cmd="stdotp code github">stdotp code github</button>    - Generate current 6-digit TOTP code
  • <button class="terminal-cmd-btn text-sky-300 underline" data-cmd="stdotp list">stdotp list</button>           - List all stored accounts in vault
  • <button class="terminal-cmd-btn text-sky-300 underline" data-cmd="stdotp init">stdotp init</button>           - Initialize encrypted AES-256-GCM vault
  • <a href="https://moin08s.github.io/stdotp/" target="_blank" class="text-emerald-400 underline font-semibold">Open Live In-Browser Web Demo ↗</a>
      `);
      return;
    }

    const sub = args[0].toLowerCase();
    switch (sub) {
      case 'self-test':
        printOutput(`
<span class="text-slate-300">=== RUN   TestRFC4226_HOTPVectors</span>
<span class="text-emerald-400">--- PASS: TestRFC4226_HOTPVectors (0.00s)</span>
<span class="text-slate-300">=== RUN   TestRFC6238_TOTPVectors_SHA1_SHA256_SHA512</span>
<span class="text-emerald-400">--- PASS: TestRFC6238_TOTPVectors_SHA1_SHA256_SHA512 (0.00s)</span>
<span class="text-slate-300">=== RUN   TestPBKDF2_RFC7914_Vectors</span>
<span class="text-emerald-400">--- PASS: TestPBKDF2_RFC7914_Vectors (0.04s)</span>
<span class="text-slate-300">=== RUN   TestAES256GCM_VaultSealAndOpen_AAD</span>
<span class="text-emerald-400">--- PASS: TestAES256GCM_VaultSealAndOpen_AAD (0.01s)</span>
<span class="text-slate-300">=== RUN   TestFailSafe_CorruptAuthTag</span>
<span class="text-emerald-400">--- PASS: TestFailSafe_CorruptAuthTag (exit code 3 verified)</span>
<span class="text-emerald-300 font-bold">PASS: 56 tests passed | 81.1% coverage | 0 dependencies | Go 1.27 stdlib</span>
<span class="text-slate-400">Play with the live web version: <a href="https://moin08s.github.io/stdotp/" target="_blank" class="text-sky-300 underline">https://moin08s.github.io/stdotp/</a></span>
        `);
        break;

      case 'init':
        vaultInitialized = true;
        printOutput(`
<span class="text-emerald-400 font-bold">✔ Vault initialized successfully!</span>
<span class="text-slate-400">Path: ~/.stdotp/vault.json</span>
<span class="text-slate-400">KDF: PBKDF2-HMAC-SHA256 (600,000 iterations per OWASP 2026)</span>
<span class="text-slate-400">Cipher: AES-256-GCM + AAD Metadata Bind</span>
        `);
        break;

      case 'list':
        const names = Object.keys(vaultAccounts);
        printOutput(`
<span class="text-emerald-400 font-bold">Encrypted Vault Accounts (${names.length}):</span>
${names.map(n => `  • <span class="text-sky-300 font-bold">${n}</span> (${vaultAccounts[n].algo}, ${vaultAccounts[n].digits} digits, ${vaultAccounts[n].period}s) ➔ <button class="terminal-cmd-btn text-xs text-emerald-400 underline" data-cmd="stdotp code ${n}">generate code</button>`).join('\n')}
        `);
        break;

      case 'code':
        const target = args[1] ? args[1].toLowerCase() : 'github';
        if (!vaultAccounts[target]) {
          printOutput(`<span class="text-rose-400">Error: account '${escapeHtml(target)}' not found in vault. Try 'stdotp list' or 'stdotp code github'.</span>`);
          return;
        }
        const now = Math.floor(Date.now() / 1000);
        const remaining = 30 - (now % 30);
        const pseudoCode = generateSimulatedTOTP(target);
        printOutput(`
<span class="text-slate-400">Account:</span> <span class="text-sky-300 font-bold">${target}</span>
<span class="text-slate-400">TOTP Token:</span> <span class="text-emerald-400 font-mono text-xl font-bold tracking-wider">${pseudoCode}</span>
<span class="text-slate-400">Expires in:</span> <span class="text-amber-400 font-bold">${remaining}s</span> <span class="text-slate-500">[Algorithm: ${vaultAccounts[target].algo}]</span>
        `);
        break;

      case 'add':
        const newAcc = args[1] ? args[1].toLowerCase() : 'gitlab';
        vaultAccounts[newAcc] = { secret: 'GEZDGNBVGY3TQOJQ', algo: 'SHA256', digits: 6, period: 30 };
        printOutput(`
<span class="text-emerald-400 font-bold">✔ Successfully added account '${escapeHtml(newAcc)}' to encrypted vault.</span>
<span class="text-slate-400">Atomic write completed with lockfile and fsync discipline.</span>
        `);
        break;

      default:
        printOutput(`<span class="text-rose-400">Unknown stdotp subcommand: '${escapeHtml(sub)}'. Run 'stdotp --help'.</span>`);
        break;
    }
  }

  function handleDrishyamitra(args) {
    printOutput(`
<span class="text-emerald-400 font-bold">🌉 Drishyamitra — Smart Bridge Infrastructure Telemetry Stream</span>
<span class="text-slate-300">Real-Time Sensor Telemetry Ingestion & Vision-Assisted Structural Monitoring</span>

<span class="text-sky-300 font-semibold">[Simulating Bridge Telemetry Stream]:</span>
  • Bridge Location: Krishna River Viaduct, Span #4 (Kollapur-Sangli corridor)
  • Piezoelectric Strain Sensor #1: <span class="text-emerald-400 font-bold">382 µε</span> (Threshold: &lt; 650 µε - Nominal)
  • Accelerometer Vibration Frequency: <span class="text-emerald-400 font-bold">1.42 Hz</span> (Baseline Resonance Safe)
  • Riverbed Ultrasonic Scour Depth: <span class="text-emerald-400 font-bold">1.84m</span> (Normal Seasonal Flow)
  • Visual Traffic Load Ingestion: Moderate Vehicle Density
<span class="text-emerald-400 font-bold">✔ System Status: All structural metrics within safe operating limits.</span>
<span class="text-slate-400">Repository: <a href="https://github.com/moin08s/Drishyamitra" target="_blank" class="text-sky-300 underline">https://github.com/moin08s/Drishyamitra</a></span>
    `);
  }

  function handleMarineGuard(args) {
    printOutput(`
<span class="text-sky-400 font-bold">🌊 MarineGuard MCP Server [SIH26057 · Ministry of Earth Sciences]</span>
<span class="text-slate-300">Autonomous Underwater Sonar Debris Detection & Anomaly Notification Engine</span>

<span class="text-emerald-400 font-semibold">[Simulating Side-Scan Sonar Telemetry]:</span>
  • Ingesting acoustic backscatter array (240 kHz High-Frequency Sonar)...
  • Running deep acoustic feature extraction model (PyTorch / Side-Scan Spectrogram)...
  <span class="text-emerald-400">✔ Detected anomaly: Submerged Ghost Fishing Gear & Marine Netting</span>
  <span class="text-emerald-400">✔ Confidence Score: 94.2% · Estimated Depth: 18.6m</span>
  <span class="text-emerald-400">✔ MCP Tool Call dispatched: notify_coastal_surveillance(lat=15.498, lon=73.827)</span>
<span class="text-sky-300 font-semibold">Autonomous coastal agent alerted via Model Context Protocol endpoint.</span>
<span class="text-slate-400">Repository: <a href="https://github.com/moin08s/marineguard-mcp" target="_blank" class="text-sky-300 underline">https://github.com/moin08s/marineguard-mcp</a></span>
    `);
  }

  function handleWasp(args) {
    printOutput(`
<span class="text-purple-400 font-bold">🛡️ WASP — Wide-scope Artifact & Super-timeline Platform</span>
<span class="text-slate-300">Automated Digital Forensics & Incident Response (DFIR) Ingestion Engine</span>

<span class="text-emerald-400 font-semibold">[Simulating DFIR Artifact Ingestion & Super-Timeline]:</span>
  • Ingesting disk image: evidence_volume01.raw (NTFS Partition)
  • Parsing artifacts: $MFT (Records: 84,200), Windows Event Logs (.evtx), Prefetch, Registry Shellbags
  <span class="text-emerald-400">✔ Extracted 14,820 discrete forensic event timestamps</span>
  <span class="text-emerald-400">✔ Pytest validation suite: 29/29 tests PASSING</span>
  <span class="text-emerald-400">✔ Forensic Compliance: NIST SP 800-86 & ISO/IEC 27037 Verified</span>
<span class="text-sky-300">Reconstructed super-timeline exported: evidence_super_timeline.csv</span>
<span class="text-slate-400">Repository: <a href="https://github.com/moin08s/WASP" target="_blank" class="text-sky-300 underline">https://github.com/moin08s/WASP</a></span>
    `);
  }

  function handleAnchor(args) {
    printOutput(`
<span class="text-sky-400 font-bold">⚓ Anchor — Video Provenance & Context Engine</span>
<span class="text-slate-300">Tamper-Proof Video Signing via Merkle Trees & Perceptual Hashing</span>

<span class="text-emerald-400 font-semibold">[Simulating Video Integrity Pipeline]:</span>
  1. Fragmenting input video stream: 2.0s GOP boundary detection (ffprobe)...
  2. Building SHA-256 Merkle Tree over 12 video fragments...
  3. Computing 1.0Hz DCT Perceptual Frame Hashing (pHash)...
  <span class="text-emerald-400">✔ Ed25519 Cryptographic Signature Verified: 0x4f8e...9a12</span>
  <span class="text-emerald-400">✔ Signed Merkle Root: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
  <span class="text-emerald-400">✔ Zero-Shot NLI Integrity Score: 98.7% (BART-large-MNLI)</span>
<span class="text-sky-300 font-bold">Status: Tamper-Free Verified Video Stream</span>
    `);
  }

  function handleJammuKhoj(args) {
    printOutput(`
<span class="text-emerald-400 font-bold">🏔️ JammuKhoj — Offline-First Smart Tourism & Pilgrim Safety Companion</span>
<span class="text-slate-300">Region: Jammu Division & Vaishno Devi Pilgrimage Corridor</span>
  • Offline Service Worker Cache: Active (100% PWA offline availability)
  <span class="text-emerald-400">✔ Katra ➔ Bhawan Yatra Route tiles loaded from IndexedDB</span>
  <span class="text-emerald-400">✔ Emergency Medical Posts & Disaster Hotlines active (Offline Synced)</span>
<span class="text-sky-300">Stack: React 18.3, TypeScript 5.5, Vite 5.4, TailwindCSS</span>
    `);
  }

  function generateSimulatedTOTP(service) {
    const epochStep = Math.floor(Date.now() / 30000);
    let hash = 0;
    const str = service + epochStep.toString();
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    const positive = Math.abs(hash);
    const code = (positive % 900000 + 100000).toString();
    return `${code.slice(0, 3)} ${code.slice(3)}`;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTerminal);
} else {
  initTerminal();
}
