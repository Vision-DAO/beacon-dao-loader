var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { create } from "ipfs-core";
import LogoSquare from "./LogoSquare";
/**
 * Addresses of Ethereum Beacon DAO's deployed on different chains.
 */
const DEPLOYED_CONTRACTS = {
    80001: "0xEfa56061B06aC1481E1B30e30E8617f2E18d0907"
};
const ERR_NO_TEMPLATES = "Client does not support HTML templates.";
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Use one global IPFS instance
    const ipfs = yield create();
    // Show branding info
    const logoSquare = LogoSquare();
    if (logoSquare === null) {
        console.warn(ERR_NO_TEMPLATES);
        return;
    }
    // Check for a present Ethereum provider. Present a prompt if it isn't available.
    if (window.ethereum === undefined) {
    }
}));
