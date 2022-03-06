import { Connection } from "libp2p/src/connection-manager"
import { Peer } from "libp2p/src/peer-store/types"
import Libp2p from 'libp2p';
import { NOISE } from 'libp2p-noise';
import Bootstrap from 'libp2p-bootstrap';

const WebSockets = require('libp2p-websockets');
const MPLEX = require('libp2p-mplex');

const bootstrapMultiaddrs = [
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'
]

async function main() {
    const node = await Libp2p.create({
        modules: {
            transport: [WebSockets],
            connEncryption: [NOISE],
            streamMuxer: [MPLEX],
            peerDiscovery: [Bootstrap]
        },
        config: {
            peerDiscovery: {
                autoDial: true,
                [Bootstrap.tag]: {
                    enabled: true,
                    list: bootstrapMultiaddrs
                }
            }
        }
    });

    node.on('peer:discovery', (peer: Peer) => {
        console.log('Discovered %s', peer.id.toB58String()) // Log discovered peer
    });
      
    node.connectionManager.on('peer:connect', (connection: Connection) => {
        console.log('Connected to %s', connection.remotePeer.toB58String()) // Log connected peer
    });

    await node.start();
}

main();
