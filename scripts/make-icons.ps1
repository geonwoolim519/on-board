Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$dest = Join-Path $root 'public\icons'
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$candidates = @(
  (Join-Path $root 'ChatGPT Image 2026년 9월 13일 오전 10_51_08.png'),
  'C:\Users\geony\.cursor\projects\c\assets\c__Users_geony_AppData_Roaming_Cursor_User_workspaceStorage_248a8de5253ac595a17b380c5c36bbe2_images_ChatGPT_Image_2026__9__13_____10_51_08-6e7a40b7-3b30-4b84-9f7a-4546fba4479d.png'
)
$source = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $source) { throw 'App icon PNG not found' }

$original = [System.Drawing.Bitmap]::FromFile($source)
$minX = $original.Width
$minY = $original.Height
$maxX = 0
$maxY = 0
for ($y = 0; $y -lt $original.Height; $y++) {
  for ($x = 0; $x -lt $original.Width; $x++) {
    $p = $original.GetPixel($x, $y)
    if (($p.R + $p.G + $p.B) -gt 36) {
      if ($x -lt $minX) { $minX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}

$pad = [Math]::Max(2, [int](($maxX - $minX) * 0.01))
$minX = [Math]::Max(0, $minX - $pad)
$minY = [Math]::Max(0, $minY - $pad)
$maxX = [Math]::Min($original.Width - 1, $maxX + $pad)
$maxY = [Math]::Min($original.Height - 1, $maxY + $pad)
$cropW = $maxX - $minX + 1
$cropH = $maxY - $minY + 1
$side = [Math]::Max($cropW, $cropH)
$cropped = New-Object System.Drawing.Bitmap $side, $side
$cg = [System.Drawing.Graphics]::FromImage($cropped)
$cg.Clear([System.Drawing.Color]::FromArgb(8, 42, 138))
$cg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$cg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$offsetX = [int](($side - $cropW) / 2)
$offsetY = [int](($side - $cropH) / 2)
$cg.DrawImage($original, $offsetX, $offsetY, (New-Object System.Drawing.Rectangle $minX, $minY, $cropW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)
$cg.Dispose()

function Save-Resized([System.Drawing.Bitmap]$bmp, [int]$size, [string]$path) {
  $out = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.Clear([System.Drawing.Color]::FromArgb(8, 42, 138))
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($bmp, 0, 0, $size, $size)
  $g.Dispose()
  $out.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()
}

function Save-Maskable([System.Drawing.Bitmap]$bmp, [int]$size, [string]$path) {
  $out = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.Clear([System.Drawing.Color]::FromArgb(8, 42, 138))
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $inner = [int]($size * 0.8)
  $left = [int](($size - $inner) / 2)
  $g.DrawImage($bmp, $left, $left, $inner, $inner)
  $g.Dispose()
  $out.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()
}

Save-Resized $cropped 512 (Join-Path $dest 'icon-512.png')
Save-Resized $cropped 192 (Join-Path $dest 'icon-192.png')
Save-Resized $cropped 180 (Join-Path $dest 'apple-touch-icon.png')
Save-Resized $cropped 512 (Join-Path $dest 'icon-512-maskable.png')
$cropped.Save((Join-Path $dest 'app-icon.png'), [System.Drawing.Imaging.ImageFormat]::Png)

$original.Dispose()
$cropped.Dispose()
Write-Output "icons updated from $source"
