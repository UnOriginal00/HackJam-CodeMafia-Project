[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
$group=1
$base='https://localhost:7122/api'

try {
  $ideas = Invoke-RestMethod -Uri "$base/ideas/group/$group" -Method GET -ErrorAction Stop
  Write-Output '--- GET IDEAS ---'
  $ideas | ConvertTo-Json -Depth 5
} catch {
  Write-Output "GET failed: $_"
}

if ($ideas -and $ideas.Length -gt 0) { $userId = $ideas[0].userID } else { $userId = 1 }

$payload = @{ groupID = $group; userID = $userId; title = "Test Idea from automated check"; content = "This idea was posted by the assistant as a smoke test at $(Get-Date)" }

try {
  $post = Invoke-RestMethod -Uri "$base/ideas" -Method Post -Body ($payload | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  Write-Output '--- POST RESPONSE ---'
  $post | ConvertTo-Json -Depth 5
} catch {
  Write-Output "POST failed: $_"
}

try {
  $verify = Invoke-RestMethod -Uri "$base/ideas/group/$group" -Method GET -ErrorAction Stop
  Write-Output '--- GET IDEAS AFTER POST ---'
  $verify | ConvertTo-Json -Depth 5
} catch {
  Write-Output "VERIFY GET failed: $_"
}
