Write-Host "Running baseline type-safety audit..."
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Error "TypeScript compilation failed. Fix regressions before finalizing task."
    exit 1
}
Write-Host "Quality assurance passed successfully."
