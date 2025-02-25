param (
  [string]$dropletIp = "164.92.222.43",
  [string]$privateKeyPath = "C:/Users/bendo/.ssh/id_rsa",
  [string]$localFilePathInit = "C:/Users/bendo/Desktop/Documents/Sport Maison/digitalocean/checkoutInit.js",
  [string]$localFilePathSend = "C:/Users/bendo/Desktop/Documents/Sport Maison/digitalocean/checkoutProceed.js",
  [string]$localFilePathVerify = "C:/Users/bendo/Desktop/Documents/Sport Maison/digitalocean/checkoutVerify.js",
  [string]$localFilePathUtils = "C:/Users/bendo/Desktop/Documents/Sport Maison/digitalocean/utils.js",
  [string]$localFilePathFinalize = "C:/Users/bendo/Desktop/Documents/Sport Maison/digitalocean/checkoutHandle.js",
  [string]$remoteFilePath = "/root/"
)

# Déployez les fichiers .js sur le droplet
scp -i $privateKeyPath $localFilePathInit root@${dropletIp}:${remoteFilePath}checkoutInit.js
scp -i $privateKeyPath $localFilePathSend root@${dropletIp}:${remoteFilePath}checkoutProceed.js
scp -i $privateKeyPath $localFilePathVerify root@${dropletIp}:${remoteFilePath}checkoutVerify.js
scp -i $privateKeyPath $localFilePathUtils root@${dropletIp}:${remoteFilePath}utils.js
scp -i $privateKeyPath $localFilePathFinalize root@${dropletIp}:${remoteFilePath}checkoutHandle.js

# Connectez-vous au droplet et exécutez le script
#ssh -i $privateKeyPath root@${dropletIp} "pm2 restart ${remoteFilePath}checkoutHandle.js"