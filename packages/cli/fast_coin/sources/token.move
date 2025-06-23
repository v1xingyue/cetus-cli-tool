module fast_coin::token;

use sui::coin::{Self};

// token
public struct TOKEN has drop {}

fun init(witness: TOKEN, ctx: &mut TxContext) {
    let (treasury, metadata) = coin::create_currency(
        witness,
        12,
        // name
        b"TOKEN",
        // symbol
        b"TOKEN",
        // description
        b"Fast Token",
        // icon url
        option::none(),
        ctx,
	);

    transfer::public_transfer(metadata,ctx.sender());
	transfer::public_transfer(treasury,ctx.sender());
}

