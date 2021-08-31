# xDaiPunks WebApp


## Connecting remix to localhost

from contract folder
remixd -s ~/Projects/Nodejs/Punks/contract --remix-ide https://remix.ethereum.org/ 

adb reverse tcp:3000 tcp:3000
adb reverse tcp:9999 tcp:9999
adb reverse tcp:8545 tcp:8545

form folder
local-ssl-proxy --config sslProxyConfig.json