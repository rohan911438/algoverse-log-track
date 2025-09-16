import { Contract } from '@algorandfoundation/tealscript';

/**
 * Organizer Registry
 * - On create: owner = txn.sender()
 * - Local state per account: authorized (0/1)
 * - Methods (owner-only): authorize(account), deauthorize(account)
 *
 * Contributions stay off-chain in tx note; verification checks account local state 'authorized' on this app.
 */
export class OrganizerRegistry extends Contract {
  // Global state: contract owner
  owner = GlobalStateKey<Address>({ key: 'owner' });

  // Local state: whether an account is an authorized organizer (0/1)
  authorized = LocalStateKey<uint64>({ key: 'authorized' });

  /**
   * init on create: set owner = sender
   */
  init(): void { // onCreate: require
    this.owner.value = this.txn.sender;
  }

  /**
   * Authorize an account (must have opted in). Only owner can call.
   */
  authorize(account: Address): void { // NoOp only
    assert(this.txn.sender === this.owner.value, 'Only owner');

    // Ensure account has opted-in (local state exists)
    assert(this.authorized(account).exists, 'Target not opted-in');

    // Set local key to 1
    this.authorized(account).value = 1 as uint64;
  }

  /**
   * Deauthorize an account (must have opted in). Only owner can call.
   */
  deauthorize(account: Address): void { // NoOp only
    assert(this.txn.sender === this.owner.value, 'Only owner');
    assert(this.authorized(account).exists, 'Target not opted-in');
    this.authorized(account).value = 0 as uint64;
  }
} 