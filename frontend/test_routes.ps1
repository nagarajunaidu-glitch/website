$urls = @(
  'http://localhost:8085/',
  'http://localhost:8085/about/',
  'http://localhost:8085/services/',
  'http://localhost:8085/website-development/',
  'http://localhost:8085/app-development/',
  'http://localhost:8085/android-app-development/',
  'http://localhost:8085/ios-app-development/',
  'http://localhost:8085/digital-marketing/',
  'http://localhost:8085/seo/',
  'http://localhost:8085/sem/',
  'http://localhost:8085/smo/',
  'http://localhost:8085/smm/',
  'http://localhost:8085/lead-generation/',
  'http://localhost:8085/local-seo/',
  'http://localhost:8085/aeo/',
  'http://localhost:8085/geo/',
  'http://localhost:8085/ai-powered-sdlc/',
  'http://localhost:8085/industries/',
  'http://localhost:8085/process/',
  'http://localhost:8085/case-studies/',
  'http://localhost:8085/blog/',
  'http://localhost:8085/contact/',
  'http://localhost:8085/thank-you/',
  'http://localhost:8085/privacy-policy/',
  'http://localhost:8085/terms/',
  'http://localhost:8085/cookie-policy/',
  'http://localhost:8085/sitemap.xml',
  'http://localhost:8085/robots.txt',
  'http://localhost:8085/css/main.css',
  'http://localhost:8085/css/components.css',
  'http://localhost:8085/css/animations.css',
  'http://localhost:8085/css/responsive.css',
  'http://localhost:8085/js/main.js',
  'http://localhost:8085/js/lead-modal.js',
  'http://localhost:8085/js/form-validation.js',
  'http://localhost:8085/js/calculator.js',
  'http://localhost:8085/js/cookie-consent.js',
  'http://localhost:8085/assets/images/hero-platform.jpg',
  'http://localhost:8085/assets/images/ai-sdlc-model.jpg',
  'http://localhost:8085/assets/images/growth-command-center.jpg'
)

$allPassed = $true
foreach ($u in $urls) {
    try {
        $res = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 3
        Write-Host "[$($res.StatusCode)] $u ($($res.RawContentLength) bytes)" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] $u - $($_.Exception.Message)" -ForegroundColor Red
        $allPassed = $false
    }
}

if ($allPassed) {
    Write-Host "`n>>> ALL 40 ENDPOINTS AND ASSETS LOADED WITH STATUS 200 OK! <<<" -ForegroundColor Cyan
} else {
    Write-Host "`n>>> SOME ENDPOINTS FAILED <<<" -ForegroundColor Red
}
