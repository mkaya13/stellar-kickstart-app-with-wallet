#![no_std]
use soroban_sdk::{contract, contractimpl, vec, Env, String, Vec, log, Symbol, symbol_short};

#[contract]
pub struct Contract;

const COUNTER: Symbol = symbol_short!("COUNTER");

#[contractimpl]
impl Contract {
    pub fn hello(env: Env, to: String) -> Vec<String> {
        vec![&env, String::from_str(&env, "Hello"), to]       // Returns a vector that contains ["Hello" "<to>"]
    }

    pub fn increment(env: Env) -> u32 {
        let mut count: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        log!(&env, "count: {}", count);

        count += 1;
        env.storage().instance().set(&COUNTER, &count);
        env.storage().instance().extend_ttl(50, 100);

        count
    }

    pub fn decrease(env: Env) -> u32 {
        let mut count: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        log!(&env, "count: {}", count);

        if count != 0 {
            count -= 1;
            env.storage().instance().set(&COUNTER, &count);
            env.storage().instance().extend_ttl(50, 100);
        }

        count
    }

    pub fn return_count(env: Env) -> u32 {
        let count = env.storage().instance().get(&COUNTER).unwrap_or(0);
        count
    }
}

mod test;
