# Script pour supprimer certains Droplets par ID
$dropletIds = @("ID1", "ID2")  # Remplace avec les IDs à supprimer

foreach ($id in $dropletIds) {
  Write-Output "🗑 Suppression du Droplet ID: $id..."
  Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/droplets/$id" -Method Delete -Headers $headers
  Write-Output "✅ Droplet $id supprimé."
}
