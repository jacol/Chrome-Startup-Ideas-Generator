# Create simple PNG icons using .NET System.Drawing
Add-Type -AssemblyName System.Drawing

function Create-Icon {
    param(
        [int]$Size,
        [string]$OutputPath
    )
    
    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = 'AntiAlias'
    
    # Create gradient brush
    $rect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(102, 126, 234), [System.Drawing.Color]::FromArgb(118, 75, 162), 45)
    
    # Draw rounded background
    $graphics.FillRectangle($brush, $rect)
    
    # Draw rocket shape (simplified triangle)
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $centerX = $Size / 2
    $centerY = $Size / 2
    $rocketSize = $Size * 0.4
    
    $points = @(
        [System.Drawing.Point]::new($centerX, $centerY - $rocketSize/2),
        [System.Drawing.Point]::new($centerX - $rocketSize/3, $centerY + $rocketSize/2),
        [System.Drawing.Point]::new($centerX + $rocketSize/3, $centerY + $rocketSize/2)
    )
    
    $graphics.FillPolygon($whiteBrush, $points)
    
    # Draw star
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Gold)
    $sparkSize = $Size * 0.08
    $sparkX = $centerX + $rocketSize/2
    $sparkY = $centerY - $rocketSize/3
    $graphics.FillEllipse($goldBrush, $sparkX - $sparkSize, $sparkY - $sparkSize, $sparkSize * 2, $sparkSize * 2)
    
    # Save the image
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $whiteBrush.Dispose()
    $goldBrush.Dispose()
}

# Create icons directory if it doesn't exist
$iconsDir = "c:\Users\jniki\source\repos\2025\ChromePlugin\icons"
if (!(Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir
}

# Generate icons
try {
    Create-Icon -Size 16 -OutputPath "$iconsDir\icon16.png"
    Create-Icon -Size 48 -OutputPath "$iconsDir\icon48.png"
    Create-Icon -Size 128 -OutputPath "$iconsDir\icon128.png"
    Write-Host "Icons created successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error creating icons: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Creating simple placeholder icons instead..." -ForegroundColor Yellow
      # Create simple colored rectangles as fallback
    foreach ($size in @(16, 48, 128)) {
        $bitmap = New-Object System.Drawing.Bitmap($size, $size)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(102, 126, 234))
        $graphics.FillRectangle($brush, 0, 0, $size, $size)
        $bitmap.Save("$iconsDir\icon$size.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $graphics.Dispose()
        $bitmap.Dispose()
        $brush.Dispose()
    }
}
