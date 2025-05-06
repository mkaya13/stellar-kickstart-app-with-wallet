import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CB2BE565GY7BEP4BEH2YGV4O33DC3G6VIC5WCFYJNWOZ5RLNAGBI645L",
    }
};
export const Errors = {};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAAFaGVsbG8AAAAAAAABAAAAAAAAAAJ0bwAAAAAAEAAAAAEAAAPqAAAAEA==",
            "AAAAAAAAAAAAAAAJaW5jcmVtZW50AAAAAAAAAAAAAAEAAAAE",
            "AAAAAAAAAAAAAAAIZGVjcmVhc2UAAAAAAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAAMcmV0dXJuX2NvdW50AAAAAAAAAAEAAAAE"]), options);
        this.options = options;
    }
    fromJSON = {
        hello: (this.txFromJSON),
        increment: (this.txFromJSON),
        decrease: (this.txFromJSON),
        return_count: (this.txFromJSON)
    };
}
