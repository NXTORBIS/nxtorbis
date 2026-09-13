<#
.SYNOPSIS
    Publishes the built site to nxtorbis.com (GitHub Pages, gh-pages branch).

.DESCRIPTION
    Backs up whatever is live today, builds the site, verifies the export is
    deployable, then replaces the gh-pages branch that GitHub Pages serves.

    Safe to re-run. Stops at the first failure, so a broken build can never
    reach the live site.

.EXAMPLE
    .\scripts\deploy.ps1 -Backup
    Only creates the backup branches. Run this first, once.

.EXAMPLE
    .\scripts\deploy.ps1
    Builds and publishes. The site changes over in about a minute.

.EXAMPLE
    .\scripts\deploy.ps1 -DryRun
    Builds and checks everything but does not publish. Safe to run anytime.

.EXAMPLE
    .\scripts\deploy.ps1 -Rollback
    Restores the Angular site from the backup branch.
#>
[CmdletBinding()]
param(
    [switch]$Backup,
    [switch]$Rollback,
    [switch]$DryRun,
    [string]$RepoUrl = "https://github.com/NXTORBIS/nxtorbis.git"
)

$ErrorActionPreference = "Stop"

function Step($text) { Write-Host "`n==> $text" -ForegroundColor Cyan }
function Ok($text)   { Write-Host "    $text" -ForegroundColor DarkGray }

# Native executables do not trip $ErrorActionPreference, so check explicitly.
function Invoke-Checked {
    param([string]$File, [string[]]$Arguments, [string]$What)
    & $File @Arguments
    if ($LASTEXITCODE -ne 0) { throw "$What failed (exit $LASTEXITCODE)." }
}

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
Ok "Project: $root"

if (-not (Test-Path (Join-Path $root "package.json"))) {
    throw "package.json not found. Run this from the Nxtorbis project folder."
}

# ---------------------------------------------------------------- rollback --
if ($Rollback) {
    Step "Restoring the previous (Angular) site"
    Invoke-Checked git @("push", "--force", $RepoUrl,
        "refs/remotes/origin/gh-pages-angular-backup:refs/heads/gh-pages") "Rollback push"
    Write-Host "`nDone. The previous site returns once Pages rebuilds, usually under a minute." -ForegroundColor Green
    return
}

# ------------------------------------------------------------------ remote --
Step "Checking the git remote"
$remotes = @(git remote)
if ($remotes -notcontains "origin") {
    Invoke-Checked git @("remote", "add", "origin", $RepoUrl) "git remote add"
    Ok "Added origin -> $RepoUrl"
} else {
    Ok "origin already set to $(git remote get-url origin)"
}

# ------------------------------------------------------------------ backup --
# Runs automatically before the first deploy, so the previous site is always
# recoverable without anyone having to remember a separate step.
function Ensure-Backup {
    Step "Backing up the site that is live now"
    Write-Host "    A browser sign-in may appear. That is GitHub asking who you are." -ForegroundColor Yellow

    Invoke-Checked git @("fetch", "-q", "origin", "main", "gh-pages") "Fetching current branches"

    $existing = & git ls-remote --heads $RepoUrl gh-pages-angular-backup
    if ($LASTEXITCODE -ne 0) { throw "Could not reach GitHub. Check your sign-in and network." }

    if ($existing) {
        Ok "Backup already exists, leaving it untouched"
    } else {
        Invoke-Checked git @("push", "-q", $RepoUrl,
            "refs/remotes/origin/gh-pages:refs/heads/gh-pages-angular-backup") "Backup of the live site"
        Ok "Live site   -> branch gh-pages-angular-backup"
        Invoke-Checked git @("push", "-q", $RepoUrl,
            "refs/remotes/origin/main:refs/heads/angular-source-backup") "Backup of the old source"
        Ok "Old source  -> branch angular-source-backup"
    }
}

if ($Backup) {
    Ensure-Backup
    Write-Host "`nBackup done. Run .\scripts\deploy.ps1 when you are ready to go live." -ForegroundColor Green
    return
}

if (-not $DryRun) { Ensure-Backup }

# A preview or dev server keeps a handle on out\ and .next\, and the raw
# IOException from Remove-Item does not say so. Retry briefly for transient
# locks (antivirus, the search indexer), then name what is holding it.
function Remove-Tree($path, $label) {
    if (-not (Test-Path $path)) { return }
    for ($i = 1; $i -le 5; $i++) {
        try {
            Remove-Item $path -Recurse -Force -ErrorAction Stop
            return
        } catch {
            if ($i -eq 5) { break }
            Start-Sleep -Milliseconds 400
        }
    }
    $holders = @()
    foreach ($proc in (Get-CimInstance Win32_Process -Filter "Name='node.exe'")) {
        $cmd = $proc.CommandLine
        if ($cmd -and ($cmd -match 'serve|next dev|http-server')) {
            $holders += ("    PID {0}  ->  {1}" -f $proc.ProcessId, $cmd.Trim())
        }
    }
    $msg = "Cannot delete $label - another process is using it."
    if ($holders.Count -gt 0) {
        $msg += "`n`n  A preview or dev server is still running:`n"
        $msg += ($holders -join "`n")
        $msg += "`n`n  Stop it, then run this script again:`n"
        foreach ($proc in (Get-CimInstance Win32_Process -Filter "Name='node.exe'")) {
            $cmd = $proc.CommandLine
            if ($cmd -and ($cmd -match 'serve|next dev|http-server')) {
                $msg += ("    Stop-Process -Id {0} -Force`n" -f $proc.ProcessId)
            }
        }
    } else {
        $msg += "`n`n  Close any terminal, editor or Explorer window open inside $label and try again."
    }
    throw $msg
}

# ------------------------------------------------------------------- build --
Step "Building the static site"
Remove-Tree "$root\out" "out\"
Remove-Tree "$root\.next" ".next\"
Invoke-Checked npm @("run", "build") "Build"

# ------------------------------------------------------------------ verify --
Step "Verifying the export"
foreach ($f in @("index.html", "404.html", ".nojekyll", "CNAME")) {
    if (-not (Test-Path "$root\out\$f")) { throw "out\$f is missing. Not deploying." }
    Ok "out\$f"
}
$domain = (Get-Content "$root\out\CNAME" -Raw).Trim()
if ($domain -ne "nxtorbis.com") { throw "CNAME says '$domain', expected 'nxtorbis.com'. Not deploying." }
Ok "Custom domain: $domain"
$pages = (Get-ChildItem "$root\out" -Filter *.html).Count
Ok "$pages HTML pages exported"

# ----------------------------------------------------------------- publish --
if ($DryRun) {
    Write-Host "`nDry run complete. The export is valid and ready to publish." -ForegroundColor Green
    Write-Host "Run without -DryRun to go live." -ForegroundColor Gray
    return
}

Step "Publishing to the gh-pages branch"
Write-Host "    This replaces the live site. Ctrl+C now to stop." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Push-Location "$root\out"
try {
    # A fresh history each time: the published branch is generated output,
    # not something with a meaningful past.
    if (Test-Path ".git") { Remove-Item ".git" -Recurse -Force }
    Invoke-Checked git @("init", "-q", "-b", "gh-pages") "git init"
    Invoke-Checked git @("config", "user.name", "NxtOrbis") "git config"
    Invoke-Checked git @("config", "user.email", "nxtorbis@gmail.com") "git config"
    Invoke-Checked git @("add", "-A") "git add"
    $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    Invoke-Checked git @("commit", "-q", "-m", "Deploy nxtorbis.com $stamp") "git commit"
    Invoke-Checked git @("push", "--force", "-q", $RepoUrl, "gh-pages") "Publish"
} finally {
    Pop-Location
}

Write-Host "`nDeployed." -ForegroundColor Green
Write-Host @"

  Live in about a minute at https://nxtorbis.com  (hard refresh: Ctrl+F5)

  Check:
    - https://nxtorbis.com
    - https://nxtorbis.com/about  and  /services  /products  /pricing  /contact
    - https://nxtorbis.com/products/true-review
    - https://nxtorbis.com/sitemap.xml

  To undo:  .\scripts\deploy.ps1 -Rollback
"@ -ForegroundColor Gray
