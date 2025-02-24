param (
  [string]$dropletIp = "164.92.222.43",
  [string]$privateKeyPath = "C:/Users/bendo/.ssh/id_rsa",
  [string]$localFilePath = "C:/Users/bendo/Desktop/Documents/Sport Maison/digitalocean/eneba_checkout.js",
  [string]$remoteFilePath = "/root/eneba_checkout.js"
)

# Copiez le fichier .mjs sur le droplet
scp -i $privateKeyPath $localFilePath root@${dropletIp}:${remoteFilePath}

# Connectez-vous au droplet et exécutez le script
#ssh -i $privateKeyPath root@${dropletIp} "node ${remoteFilePath}"