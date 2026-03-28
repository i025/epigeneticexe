$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $env:TEMP "epigenetics-gui-check"
$edgeCandidates = @(
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
)
$edgePath = $edgeCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if (-not $edgePath) {
  throw "Microsoft Edge was not found. Expected one of: $($edgeCandidates -join ', ')"
}

function Get-FileUri([string]$path) {
  return ([System.Uri](Resolve-Path -LiteralPath $path).Path).AbsoluteUri
}

function Invoke-Step([string]$label, [scriptblock]$action) {
  Write-Host "==> $label"
  & $action
  if ($LASTEXITCODE -ne 0) {
    throw "$label failed with exit code $LASTEXITCODE"
  }
}

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Invoke-Step "Build homepage" {
  & npm.cmd --prefix "$repoRoot\\pencil-new-react" run build
}

$distEntryUri = Get-FileUri (Join-Path $repoRoot "pencil-new-react\\dist\\index.html")
$cases = @(
  @{
    name = "direct-pre-study"
    url = Get-FileUri (Join-Path $repoRoot "content\\articles\\pre-study\\index.html")
    window = "1440,960"
  },
  @{
    name = "direct-cpg"
    url = Get-FileUri (Join-Path $repoRoot "content\\articles\\cpg\\index.html")
    window = "1440,960"
  },
  @{
    name = "direct-famine"
    url = Get-FileUri (Join-Path $repoRoot "content\\articles\\famine\\index.html")
    window = "1440,960"
  },
  @{
    name = "app-pre-study"
    url = "$distEntryUri#/view/pre-study"
    window = "1440,960"
  },
  @{
    name = "app-cpg"
    url = "$distEntryUri#/view/cpg"
    window = "1440,960"
  },
  @{
    name = "app-famine"
    url = "$distEntryUri#/view/famine"
    window = "1440,960"
  },
  @{
    name = "direct-pre-study-tall"
    url = Get-FileUri (Join-Path $repoRoot "content\\articles\\pre-study\\index.html")
    window = "1440,3200"
  },
  @{
    name = "app-pre-study-tall"
    url = "$distEntryUri#/view/pre-study"
    window = "1440,3200"
  },
  @{
    name = "direct-famine-tall"
    url = Get-FileUri (Join-Path $repoRoot "content\\articles\\famine\\index.html")
    window = "1440,3200"
  },
  @{
    name = "app-famine-tall"
    url = "$distEntryUri#/view/famine"
    window = "1440,3200"
  }
)

foreach ($case in $cases) {
  $screenshotPath = Join-Path $outputDir "$($case.name).png"
  Remove-Item -LiteralPath $screenshotPath -Force -ErrorAction SilentlyContinue
  Invoke-Step "Screenshot $($case.name)" {
    & $edgePath `
      --headless `
      --disable-gpu `
      --hide-scrollbars `
      --allow-file-access-from-files `
      "--window-size=$($case.window)" `
      --virtual-time-budget=8000 `
      "--screenshot=$screenshotPath" `
      $case.url
  }
}

Write-Host ""
Write-Host "GUI verification screenshots written to: $outputDir"
