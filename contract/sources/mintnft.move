/// Module: mintnft
module mintnft::mintnft;

use std::string::{Self, String};
use sui::event;
use sui::package;

// === Imports ===

// === Structs ===

/// Owned Object - NFT cane be accessed and modified by the owner
public struct Nft has key, store {
    id: sui::object::UID,
    name: String,
    description: String,
    url: String,
}

// Shared Object - Addresses that minted NFTs will be stored and everyone can access and modify it
public struct MintAddresses has key, store {
    id: sui::object::UID,
    addresses: vector<address>,
}

// Immutable Object - No one can modify this object
public struct NftMetadata has key, store {
    id: sui::object::UID,
    timestamp: u64,
}

// ===OTW===
public struct MINTNFT has drop {}

// === Events ===
public struct MintNftEvent has copy, drop {
    nft_id: address,
    name: String,
}

public struct UpdateNftEvent has copy, drop {
    nft_id: address,
    old_name: String,
    new_name: String,
}

// ===Initializers===
fun init(otw: MINTNFT, ctx: &mut sui::tx_context::TxContext) {
    // Create a MintAddresses object
    let mint_addresses = MintAddresses {
        id: sui::object::new(ctx),
        addresses: vector::empty(),
    };

    // Claim package publisher rights
    let publisher = package::claim(otw, ctx);

    // Transfer publisher to sender, share MintAddresses
    sui::transfer::public_transfer(publisher, sui::tx_context::sender(ctx));
    sui::transfer::share_object(mint_addresses);
}

// === Public Functions ===

public entry fun mint(
    mint_addresses: &mut MintAddresses,
    name: String,
    url: String,
    ctx: &mut sui::tx_context::TxContext,
) {
    // Create a new NFT object with name, description and url
    let nft = Nft {
        id: sui::object::new(ctx),
        name,
        description: string::utf8(b"An NFT from the mint collection"),
        url,
    };

    // Emit mint event with NFT id and name
    event::emit(MintNftEvent {
        nft_id: sui::object::uid_to_address(&nft.id),
        name: nft.name,
    });

    // Transfer NFT to minter
    sui::transfer::public_transfer(nft, sui::tx_context::sender(ctx));

    // Add minter address to tracking list
    vector::push_back(&mut mint_addresses.addresses, sui::tx_context::sender(ctx));

    // Create immutable metadata object with timestamp
    let metadata = NftMetadata {
        id: sui::object::new(ctx),
        timestamp: 0, // Using 0 as placeholder timestamp
    };
    sui::transfer::freeze_object(metadata);
}

//Update Nft Name ------> This will not throw an error as it is a mutable object but only the owner can update it
public entry fun update_nft(nft: &mut Nft, name: String) {
    let old_name = nft.name;
    nft.name = name;

    // Emit update event
    event::emit(UpdateNftEvent {
        nft_id: sui::object::uid_to_address(&nft.id),
        old_name,
        new_name: nft.name,
    });
}

// Update the nft metadata ------> This will not updated as it is a freezed object
public entry fun update_nft_metadata(
    nft: &mut Nft,
    new_name: String,
    new_description: String,
    new_url: String,
    _ctx: &mut sui::tx_context::TxContext,
) {
    let old_name = nft.name;
    nft.name = new_name;
    nft.description = new_description;
    nft.url = new_url;

    // Emit update event
    event::emit(UpdateNftEvent {
        nft_id: sui::object::uid_to_address(&nft.id),
        old_name,
        new_name: nft.name,
    });
}
