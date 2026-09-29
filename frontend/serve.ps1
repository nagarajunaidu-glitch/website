# ==============================================================================
# DIGIT MAXZ - HIGH-PERFORMANCE STATIC WEB SERVER (POWERSHELL NATIVE)
# ==============================================================================
param (
    [int]$Port = 8080
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Digit Maxz High-Converting Web Server Active" -ForegroundColor Green
Write-Host "  URL: http://localhost:$Port/" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".svg"  = "image/svg+xml"
    ".xml"  = "application/xml; charset=utf-8"
    ".txt"  = "text/plain; charset=utf-8"
}

$root = (Get-Location).Path

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.RawUrl
        $path = $rawUrl.Split('?')[0]

        if ($path -eq "/" -or $path -eq "") {
            $localPath = Join-Path $root "index.html"
        } else {
            $relPath = $path.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $localPath = Join-Path $root $relPath
            if (Test-Path -Path $localPath -PathType Container) {
                $localPath = Join-Path $localPath "index.html"
            } elseif (-not (Test-Path $localPath) -and (Test-Path "$localPath.html")) {
                $localPath = "$localPath.html"
            }
        }

        try {
            if (Test-Path $localPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                $bytes = [System.IO.File]::ReadAllBytes($localPath)

                $response.ContentType = $mime
                $response.ContentLength64 = $bytes.Length
                $response.AddHeader("Cache-Control", "no-cache")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $notFoundPath = Join-Path $root "404.html"
                if (Test-Path $notFoundPath) {
                    $bytes = [System.IO.File]::ReadAllBytes($notFoundPath)
                    $response.StatusCode = 404
                    $response.ContentType = "text/html; charset=utf-8"
                    $response.ContentLength64 = $bytes.Length
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                } else {
                    $response.StatusCode = 404
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
        } catch {
            Write-Host "Error serving $rawUrl : $_" -ForegroundColor Red
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
