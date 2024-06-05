"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var libp2p_noise_1 = require("@chainsafe/libp2p-noise");
var libp2p_yamux_1 = require("@chainsafe/libp2p-yamux");
var circuit_relay_v2_1 = require("@libp2p/circuit-relay-v2");
var identify_1 = require("@libp2p/identify");
var bootstrap_1 = require("@libp2p/bootstrap");
var mplex_1 = require("@libp2p/mplex");
var websockets_1 = require("@libp2p/websockets");
var filters = require("@libp2p/websockets/filters");
var libp2p_gossipsub_1 = require("@chainsafe/libp2p-gossipsub");
var libp2p_1 = require("libp2p");
var pubsub_peer_discovery_1 = require("@libp2p/pubsub-peer-discovery");
var peer_id_factory_1 = require("@libp2p/peer-id-factory");
var webrtc_1 = require("@libp2p/webrtc");
var base_x_1 = require("base-x");
var crypto_1 = require("@libp2p/crypto");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)({
    path: '.env',
});
var createNode = function (peerId, bootstraps) { return __awaiter(void 0, void 0, void 0, function () {
    var config, node;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                config = {
                    addresses: {
                        listen: ['/ip4/127.0.0.1/tcp/6969/ws'],
                    },
                    transports: [
                        (0, websockets_1.webSockets)({
                            filter: filters.all,
                        }),
                        (0, webrtc_1.webRTC)(),
                    ],
                    peerId: peerId,
                    connectionEncryption: [(0, libp2p_noise_1.noise)()],
                    streamMuxers: [(0, libp2p_yamux_1.yamux)(), (0, mplex_1.mplex)()],
                    peerDiscovery: [
                        (0, pubsub_peer_discovery_1.pubsubPeerDiscovery)({
                            interval: 1000,
                        }),
                    ],
                    services: {
                        pubsub: (0, libp2p_gossipsub_1.gossipsub)({
                            allowPublishToZeroTopicPeers: true,
                            fallbackToFloodsub: true,
                        }),
                        identify: (0, identify_1.identify)(),
                        relay: (0, circuit_relay_v2_1.circuitRelayServer)({
                            reservations: {
                                maxReservations: Infinity,
                            },
                        }),
                    },
                };
                if (bootstraps.length > 0) {
                    (_a = config.peerDiscovery) === null || _a === void 0 ? void 0 : _a.push((0, bootstrap_1.bootstrap)({ list: bootstraps }));
                }
                return [4 /*yield*/, (0, libp2p_1.createLibp2p)(config)];
            case 1:
                node = _b.sent();
                return [4 /*yield*/, node.start()];
            case 2:
                _b.sent();
                return [2 /*return*/, node];
        }
    });
}); };
var base58 = (0, base_x_1.default)('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
var key = base58.decode((_a = process.env.USER_KEY) !== null && _a !== void 0 ? _a : '');
var pubKey = key.subarray(32);
var privKey = new crypto_1.keys.Ed25519PrivateKey(key, pubKey);
var relayPeerID = await (0, peer_id_factory_1.createFromPrivKey)(privKey);
console.log("\nRelay Peer ID: ".concat(relayPeerID.toString(), "\n"));
var relay = await createNode(relayPeerID, []);
console.log("Relay started...\n");
var relayMultiaddr = relay.getMultiaddrs().map(function (m) { return m.toString(); });
console.log('Listening on: ', relayMultiaddr);
relay.addEventListener('peer:discovery', function (e) {
    var peer = e.detail;
    console.log("Relay discovered: ".concat(peer.id.toString()));
});
relay.addEventListener('peer:connect', function (e) {
    var peer = e.detail;
    console.log("Relay connected to: ".concat(peer.toString()));
});
