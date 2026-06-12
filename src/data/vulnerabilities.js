/**
 * HardenShield — Vulnerability & OS Data Layer
 * ---------------------------------------------
 * Single source of truth for: CVE findings, OS profiles,
 * service options, and the API integration point.
 */

// ─── OS options ───────────────────────────────────────────────────────────────
export const OS_OPTIONS = [
  'Windows XP SP3',
  'Windows Server 2003',
  'Windows 7 SP1',
  'Windows Server 2008',
  'Ubuntu 14.04',
  'CentOS 6',
]

// OS end-of-life flags
export const OS_EOL = new Set([
  'Windows XP SP3', 'Windows Server 2003', 'Ubuntu 14.04', 'CentOS 6',
])

// Risk multipliers per OS (applied to raw severity score)
export const OS_MULTIPLIERS = {
  'Windows XP SP3':      1.30,
  'Windows Server 2003': 1.35,
  'Windows 7 SP1':       1.15,
  'Windows Server 2008': 1.20,
  'Ubuntu 14.04':        1.10,
  'CentOS 6':            1.10,
}

// ─── Service options (form checkboxes) ───────────────────────────────────────
export const SERVICE_OPTIONS = [
  { key: 'smb',     label: 'SMBv1',         cve: 'CVE-2017-0144',  severity: 'Critical' },
  { key: 'rdp',     label: 'RDP Exposed',   cve: 'CVE-2019-0708',  severity: 'Critical' },
  { key: 'ftp',     label: 'FTP',           cve: 'CWE-319',        severity: 'High'     },
  { key: 'telnet',  label: 'Telnet',        cve: 'CWE-312',        severity: 'High'     },
  { key: 'iis',     label: 'IIS 6.0',       cve: 'CVE-2017-7269',  severity: 'High'     },
  { key: 'spooler', label: 'Print Spooler', cve: 'CVE-2021-34527', severity: 'Medium'   },
]

// ─── CVE finding database ─────────────────────────────────────────────────────
export const FINDING_DB = {
  smb: {
    id: 'smb', severity: 'Critical', weight: 28,
    title: 'SMBv1 Protocol Enabled',
    cve: 'CVE-2017-0144',
    description:
      'SMBv1 is a legacy file-sharing protocol with critical vulnerabilities. ' +
      'CVE-2017-0144 (EternalBlue) enables remote code execution via a crafted SMB packet — ' +
      'exploited by WannaCry and NotPetya ransomware to propagate across networks without user interaction.',
    remediation: [
      'Disable SMBv1 on all hosts immediately via PowerShell.',
      'Apply Microsoft security bulletin MS17-010 where available.',
      'Block TCP port 445 at the perimeter and between network segments.',
      'Enable Windows Firewall rules restricting SMB to authorised subnets only.',
    ],
    fixCommand: {
      lang: 'PowerShell',
      code: `# Disable SMBv1 Server and Client
Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force
Set-SmbClientConfiguration -EnableSMB1Protocol $false -Force

# Verify the change
Get-SmbServerConfiguration | Select EnableSMB1Protocol`,
    },
  },

  rdp: {
    id: 'rdp', severity: 'Critical', weight: 28,
    title: 'RDP Exposed to Internet (BlueKeep)',
    cve: 'CVE-2019-0708',
    description:
      'RDP exposed on a public interface without NLA enables BlueKeep (CVE-2019-0708) — ' +
      'a wormable pre-authentication RCE vulnerability affecting Windows 7 and Server 2008 R2. ' +
      'An unauthenticated attacker achieves SYSTEM-level access via crafted packets to port 3389.',
    remediation: [
      'Restrict RDP access to VPN or jump-host only; never expose port 3389 publicly.',
      'Enable Network Level Authentication (NLA) on all RDP-enabled hosts.',
      'Apply security patch KB4499175 for BlueKeep.',
      'Implement account lockout (≤5 failed attempts) to prevent brute force.',
    ],
    fixCommand: {
      lang: 'PowerShell',
      code: `# Enable NLA for RDP
Set-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server\\WinStations\\RDP-Tcp' \`
  -Name 'UserAuthentication' -Value 1

# Block RDP from public interfaces
New-NetFirewallRule -DisplayName "Block Public RDP" \`
  -Direction Inbound -Protocol TCP -LocalPort 3389 \`
  -RemoteAddress Internet -Action Block

Write-Host "NLA enabled; public RDP blocked." -ForegroundColor Green`,
    },
  },

  ftp: {
    id: 'ftp', severity: 'High', weight: 14,
    title: 'Cleartext FTP Service Active',
    cve: 'CWE-319',
    description:
      'FTP transmits credentials and data in plaintext (CWE-319). On legacy systems, ' +
      'FTP servers often run with anonymous access enabled, allowing unauthenticated file retrieval. ' +
      'Network sniffers trivially capture credentials in transit.',
    remediation: [
      'Disable FTP and replace with SFTP or FTPS.',
      'If FTP cannot be replaced, restrict to internal network and enable TLS.',
      'Audit FTP logs for anonymous access attempts.',
      'Disable anonymous login and enforce strong passwords.',
    ],
    fixCommand: {
      lang: 'PowerShell',
      code: `# Stop and disable Windows FTP service
Stop-Service -Name "MSFTPSVC" -Force -ErrorAction SilentlyContinue
Set-Service  -Name "MSFTPSVC" -StartupType Disabled -ErrorAction SilentlyContinue

# Remove FTP site from IIS if present
Import-Module WebAdministration -ErrorAction SilentlyContinue
Get-Website | Where-Object { $_.bindings.Collection.protocol -eq 'ftp' } | Remove-Website

Write-Host "FTP service disabled." -ForegroundColor Yellow`,
    },
  },

  telnet: {
    id: 'telnet', severity: 'High', weight: 14,
    title: 'Telnet Service Running',
    cve: 'CWE-312',
    description:
      'Telnet transmits all data — including passwords and session content — in plaintext (CWE-312). ' +
      'Legacy SCADA/ICS devices often ship with Telnet enabled and default credentials. ' +
      'An attacker with network access can perform a full session hijack using freely available tools.',
    remediation: [
      'Disable Telnet immediately and migrate to SSH.',
      'Block TCP port 23 at all firewalls and managed switches.',
      'For ICS devices that only support Telnet, isolate them on a dedicated VLAN.',
      'Rotate all credentials that may have been exposed over Telnet.',
    ],
    fixCommand: {
      lang: 'Bash',
      code: `# Disable Telnet on Linux/Unix
sudo systemctl stop telnet.socket
sudo systemctl disable telnet.socket

# Remove telnetd (Debian/Ubuntu)
sudo apt-get remove --purge telnetd inetutils-telnetd -y

# Block port 23 via iptables
sudo iptables -A INPUT  -p tcp --dport 23 -j DROP
sudo iptables -A OUTPUT -p tcp --sport 23 -j DROP
sudo iptables-save | sudo tee /etc/iptables/rules.v4`,
    },
  },

  iis: {
    id: 'iis', severity: 'High', weight: 14,
    title: 'IIS 6.0 — WebDAV Buffer Overflow',
    cve: 'CVE-2017-7269',
    description:
      'IIS 6.0 (Windows Server 2003) contains a buffer overflow in ScStoragePathFromUrl via WebDAV ' +
      '(CVE-2017-7269). An unauthenticated attacker sends a crafted HTTP PROPFIND request to achieve ' +
      'arbitrary code execution at SYSTEM level. No vendor patch exists — the OS is end-of-life.',
    remediation: [
      'Disable WebDAV on IIS 6.0 immediately.',
      'Migrate to IIS 10+ on Windows Server 2019/2022 as a priority.',
      'Place IIS 6.0 behind a reverse proxy/WAF that blocks PROPFIND/PROPPATCH verbs.',
      'Restrict all inbound HTTP(S) traffic to authorised internal IPs only.',
    ],
    fixCommand: {
      lang: 'PowerShell',
      code: `# Disable WebDAV in IIS 6.0 (Windows Server 2003)
# Run in an elevated command prompt

# Remove WebDAV from IIS extensions via adsutil
cscript C:\\Inetpub\\AdminScripts\\adsutil.vbs SET W3SVC/WebDavEnabled 0

# Disable via IIS extension manager
%windir%\\system32\\inetsrv\\iisext.vbs /DisableExtension "WebDAV"

# Restart IIS
iisreset /restart`,
    },
  },

  spooler: {
    id: 'spooler', severity: 'Medium', weight: 7,
    title: 'Print Spooler — PrintNightmare',
    cve: 'CVE-2021-34527',
    description:
      'The Windows Print Spooler service is vulnerable to PrintNightmare (CVE-2021-34527), ' +
      'allowing authenticated attackers to install malicious printer drivers for SYSTEM-level RCE. ' +
      'On Domain Controllers this can lead to full domain compromise.',
    remediation: [
      'Disable Print Spooler on non-printing servers, especially Domain Controllers.',
      'Apply KB5005010 and subsequent cumulative updates.',
      'Restrict printer driver installation via Group Policy.',
      'Enable "Point and Print Restrictions" GPO to block untrusted drivers.',
    ],
    fixCommand: {
      lang: 'PowerShell',
      code: `# Disable Print Spooler (recommended on DCs / non-print servers)
Stop-Service -Name Spooler -Force
Set-Service  -Name Spooler -StartupType Disabled

# If printing is required: restrict driver installation
Set-ItemProperty \`
  -Path "HKLM:\\Software\\Policies\\Microsoft\\Windows NT\\Printers\\PointAndPrint" \`
  -Name "RestrictDriverInstallationToAdministrators" -Value 1 -Type DWord

Write-Host "Print Spooler disabled / restricted." -ForegroundColor Green`,
    },
  },
}

// ─── Severity sort order ──────────────────────────────────────────────────────
export const SEV_ORDER = { Critical: 0, High: 1, Medium: 2 }

// ─── Scan step messages ───────────────────────────────────────────────────────
export const SCAN_STEPS = [
  'Initialising analysis engine…',
  'Loading OS vulnerability profile…',
  'Mapping services to CVE database…',
  'Calculating risk score with OS multipliers…',
  'Generating remediation playbook…',
  'Compiling results…',
]

// ─── Local scoring engine ─────────────────────────────────────────────────────
function computeScore(os, serviceKeys) {
  const findings = serviceKeys.map(k => FINDING_DB[k]).filter(Boolean)
  const raw      = findings.reduce((s, f) => s + f.weight, 0)
  const mult     = OS_MULTIPLIERS[os] ?? 1.0
  return { findings, score: Math.min(100, Math.round(raw * mult)) }
}

// ─── API integration point ────────────────────────────────────────────────────
/**
 * callHardenAPI(os, services, context)
 *
 * Currently mocked with a setTimeout delay.
 *
 * INTEGRATION POINT — replace the mock block with a real call, e.g.:
 *   const res = await fetch('/api/analyse', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ os, services, context }),
 *   })
 *   return res.json()   // expects { findings: [], score: number }
 *
 * @param {string}   os       Selected operating system
 * @param {string[]} services Array of selected service keys
 * @param {string}   context  Free-text analyst context
 * @returns {Promise<{ findings: object[], score: number }>}
 */
export async function callHardenAPI(os, services, context) {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 3200))
  return computeScore(os, services)
}
