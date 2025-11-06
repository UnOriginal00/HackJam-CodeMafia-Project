[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
$group=1
$base='https://localhost:7122/api'

function safeGetIdeas($attempts=3) {
  for ($i=0; $i -lt $attempts; $i++) {
    try {
      $ideas = Invoke-RestMethod -Uri "$base/ideas/group/$group" -Method GET -ErrorAction Stop
      return $ideas
    } catch {
      Write-Output "GET attempt $($i+1) failed: $_"
      Start-Sleep -Seconds 1
    }
  }
  return $null
}

$ideas = safeGetIdeas 3
if ($ideas -and $ideas.Length -gt 0) { 
  Write-Output '--- GET IDEAS ---'
  $ideas | ConvertTo-Json -Depth 5
  $userId = $ideas[0].userID
} else {
  Write-Output 'No existing ideas or GET failed; cannot reliably pick userId. Aborting POST.'
  exit 0
}

$payload = @{ groupID = $group; userID = $userId; title = "Test Idea from automated check"; content = "This idea was posted by the assistant as a smoke test at $(Get-Date)" }

try {
  $post = Invoke-RestMethod -Uri "$base/ideas" -Method Post -Body ($payload | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  Write-Output '--- POST RESPONSE ---'
  $post | ConvertTo-Json -Depth 5
} catch {
  Write-Output "POST failed: $_"
}

$verify = safeGetIdeas 3
if ($verify) { Write-Output '--- GET IDEAS AFTER POST ---'; $verify | ConvertTo-Json -Depth 5 }
