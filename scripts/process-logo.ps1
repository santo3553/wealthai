Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\santo\.gemini\antigravity\brain\b22ea08e-dbdc-4d5a-8c47-a21a3518ae4b\.user_uploaded\media_1789105048081.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($sourcePath)

Write-Host "Source image loaded: $($bmp.Width) x $($bmp.Height)"

$publicDir = "g:\upwork project\public"
if (!(Test-Path $publicDir)) { New-Item -ItemType Directory -Path $publicDir -Force | Out-Null }

# 1. Save full logo to public/logo.png
$fullLogoPath = Join-Path $publicDir "logo.png"
$bmp.Save($fullLogoPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved full logo to $fullLogoPath"

# 2. Find bounding box of the 'W' icon symbol (upper region, Y < 350)
$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

$cutoffY = [int]($bmp.Height * 0.65)
for ($y = 0; $y -lt $cutoffY; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Symbol bounds: X=$minX to $maxX, Y=$minY to $maxY, W=$($maxX - $minX), H=$($maxY - $minY)"

$symW = [int]($maxX - $minX)
$symH = [int]($maxY - $minY)
$symCenterX = [int]($minX + ($symW / 2))
$symCenterY = [int]($minY + ($symH / 2))

$targetSize = [int]([Math]::Max($symW, $symH) * 1.35)
$cropX = [int][Math]::Max(0, ($symCenterX - ($targetSize / 2)))
$cropY = [int][Math]::Max(0, ($symCenterY - ($targetSize / 2)))
$cropW = [int][Math]::Min($bmp.Width - $cropX, $targetSize)
$cropH = [int][Math]::Min($bmp.Height - $cropY, $targetSize)

# Create high-res square symbol bitmap
$symbolBmp = New-Object System.Drawing.Bitmap $targetSize, $targetSize
$g = [System.Drawing.Graphics]::FromImage($symbolBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::White)

$srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH
$destRect = New-Object System.Drawing.Rectangle 0, 0, $targetSize, $targetSize
$g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$iconPath = Join-Path $publicDir "logo-icon.png"
$symbolBmp.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved square symbol to $iconPath"

function Resize-And-Save {
    param(
        [Parameter(Mandatory=$true)] [System.Drawing.Bitmap] $SourceImg,
        [Parameter(Mandatory=$true)] [string] $TargetPath,
        [Parameter(Mandatory=$true)] [int] $Width,
        [Parameter(Mandatory=$true)] [int] $Height,
        [System.Drawing.Color] $BgColor = [System.Drawing.Color]::Transparent
    )

    $parentDir = Split-Path $TargetPath
    if (!(Test-Path $parentDir)) { New-Item -ItemType Directory -Path $parentDir -Force | Out-Null }

    $resized = New-Object System.Drawing.Bitmap $Width, $Height
    $gr = [System.Drawing.Graphics]::FromImage($resized)
    $gr.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gr.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gr.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gr.Clear($BgColor)
    $gr.DrawImage($SourceImg, 0, 0, $Width, $Height)
    $gr.Dispose()

    $resized.Save($TargetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $resized.Dispose()
    Write-Host "Generated: $TargetPath ($Width x $Height)"
}

# 3. Generate web icons
Resize-And-Save -SourceImg $symbolBmp -TargetPath (Join-Path $publicDir "icon-512.png") -Width 512 -Height 512 -BgColor ([System.Drawing.Color]::White)
Resize-And-Save -SourceImg $symbolBmp -TargetPath (Join-Path $publicDir "icon-192.png") -Width 192 -Height 192 -BgColor ([System.Drawing.Color]::White)
Resize-And-Save -SourceImg $symbolBmp -TargetPath (Join-Path $publicDir "favicon.png") -Width 64 -Height 64 -BgColor ([System.Drawing.Color]::White)

# 4. Generate Android App Launcher Icons
$androidRes = "g:\upwork project\android\app\src\main\res"

$densities = @(
    @{ Name = "mipmap-mdpi"; Size = 48 },
    @{ Name = "mipmap-hdpi"; Size = 72 },
    @{ Name = "mipmap-xhdpi"; Size = 96 },
    @{ Name = "mipmap-xxhdpi"; Size = 144 },
    @{ Name = "mipmap-xxxhdpi"; Size = 192 }
)

foreach ($d in $densities) {
    $dir = Join-Path $androidRes $d.Name
    $icPath = Join-Path $dir "ic_launcher.png"
    $icRoundPath = Join-Path $dir "ic_launcher_round.png"
    $icForePath = Join-Path $dir "ic_launcher_foreground.png"

    Resize-And-Save -SourceImg $symbolBmp -TargetPath $icPath -Width $d.Size -Height $d.Size -BgColor ([System.Drawing.Color]::White)
    Resize-And-Save -SourceImg $symbolBmp -TargetPath $icRoundPath -Width $d.Size -Height $d.Size -BgColor ([System.Drawing.Color]::White)
    Resize-And-Save -SourceImg $symbolBmp -TargetPath $icForePath -Width $d.Size -Height $d.Size -BgColor ([System.Drawing.Color]::Transparent)
}

# 5. Generate Android Splash Screens
$splashDensities = @(
    @{ Dir = "drawable"; W = 480; H = 800 },
    @{ Dir = "drawable-port-mdpi"; W = 320; H = 480 },
    @{ Dir = "drawable-port-hdpi"; W = 480; H = 800 },
    @{ Dir = "drawable-port-xhdpi"; W = 720; H = 1280 },
    @{ Dir = "drawable-port-xxhdpi"; W = 960; H = 1600 },
    @{ Dir = "drawable-port-xxxhdpi"; W = 1280; H = 1920 }
)

foreach ($s in $splashDensities) {
    $dir = Join-Path $androidRes $s.Dir
    $splashPath = Join-Path $dir "splash.png"
    
    $splashBmp = New-Object System.Drawing.Bitmap $s.W, $s.H
    $gs = [System.Drawing.Graphics]::FromImage($splashBmp)
    $gs.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gs.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gs.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Warm dark luxury background #120d0b
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(18, 13, 11))
    $gs.FillRectangle($bgBrush, 0, 0, $s.W, $s.H)
    $bgBrush.Dispose()
    
    # Place full logo centered (65% width)
    $logoW = [int]($s.W * 0.65)
    $logoH = [int]($logoW * ($bmp.Height / $bmp.Width))
    $logoX = [int](($s.W - $logoW) / 2)
    $logoY = [int](($s.H - $logoH) / 2)
    
    $gs.DrawImage($bmp, $logoX, $logoY, $logoW, $logoH)
    $gs.Dispose()
    
    $splashBmp.Save($splashPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $splashBmp.Dispose()
    Write-Host "Generated splash: $splashPath ($($s.W) x $($s.H))"
}

$symbolBmp.Dispose()
$bmp.Dispose()
Write-Host "All assets generated successfully!"
