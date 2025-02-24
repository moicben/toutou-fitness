$apiToken = 'dop_v1_21700258cc56beed3f7527d37d739cd068b563965b3f31c63f60c42136d8d2e2'

$headers = @{
    "Authorization" = "Bearer $apiToken"
    "Content-Type" = "application/json"
}

$dropletIds = @("478905880", "478906760", "478907767", "478907784", "478908770", "478908994", "478909919")  # Remplace avec les IDs à supprimer

foreach ($id in $dropletIds) {
  Write-Output "🗑 Suppression du Droplet ID: $id..."
  Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/droplets/$id" -Method Delete -Headers $headers
  Write-Output "✅ Droplet $id supprimé."
}
