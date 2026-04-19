$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | Where-Object { $_ -match '^(?!#)(?<name>[^=]+)=(?<value>.*)$' } | ForEach-Object {
        [Environment]::SetEnvironmentVariable($matches.name, $matches.value, 'Process')
    }
}

Set-Location (Join-Path $PSScriptRoot "backend")
& (Join-Path $PSScriptRoot ".tools\apache-maven-3.9.14\bin\mvn.cmd") spring-boot:run
