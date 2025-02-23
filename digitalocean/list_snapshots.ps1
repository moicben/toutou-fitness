$apiToken = 'dop_v1_21700258cc56beed3f7527d37d739cd068b563965b3f31c63f60c42136d8d2e2'

$headers = @{
  "Authorization" = "Bearer $apiToken"
  "Content-Type"  = "application/json"
}

# Récupérer la liste des snapshots
$response = Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/snapshots" -Method Get -Headers $headers

# Afficher les snapshots pour trouver l'ID de ton snapshot "eneba-flow-ready"
$response.snapshots | Select-Object id, name
