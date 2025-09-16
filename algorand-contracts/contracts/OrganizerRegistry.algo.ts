import { Contract } from '@algorandfoundation/tealscript';

/**
 * Organizer Registry - Modern TealScript Implementation
 * - On create: owner = txn.sender()
 * - Local state per account: authorized (0/1), reputation score
 * - Global state: total organizers, total contributions verified
 * - Methods: authorize, deauthorize, checkAuthorization, updateStats
 */
export class OrganizerRegistry extends Contract {
  // Global state keys
  owner = GlobalStateKey<Address>({ key: 'owner' });
  totalOrganizers = GlobalStateKey<uint64>({ key: 'total_organizers' });
  totalContributions = GlobalStateKey<uint64>({ key: 'total_contributions' });

  // Local state keys
  authorized = LocalStateKey<uint64>({ key: 'authorized' });
  reputation = LocalStateKey<uint64>({ key: 'reputation' });
  contributionsVerified = LocalStateKey<uint64>({ key: 'contributions_verified' });

  /**
   * Initialize contract on deployment
   */
  @method
  createApplication(): void {
    this.owner.value = this.txn.sender;
    this.totalOrganizers.value = 0;
    this.totalContributions.value = 0;
  }

  /**
   * Authorize an organizer (only owner can call)
   */
  @method
  authorize(account: Address): void {
    assert(this.txn.sender === this.owner.value, 'Only contract owner can authorize');
    assert(this.authorized(account).exists, 'Account must opt-in first');

    // Authorize the account
    this.authorized(account).value = 1;
    this.reputation(account).value = 100; // Starting reputation
    this.contributionsVerified(account).value = 0;

    // Update global stats
    this.totalOrganizers.value = this.totalOrganizers.value + 1;
  }

  /**
   * Deauthorize an organizer (only owner can call)
   */
  @method
  deauthorize(account: Address): void {
    assert(this.txn.sender === this.owner.value, 'Only contract owner can deauthorize');
    assert(this.authorized(account).exists, 'Account must opt-in first');
    
    const wasAuthorized = this.authorized(account).value;
    this.authorized(account).value = 0;
    
    if (wasAuthorized === 1) {
      this.totalOrganizers.value = this.totalOrganizers.value - 1;
    }
  }

  /**
   * Check if an account is authorized (public method)
   */
  @method
  checkAuthorization(account: Address): uint64 {
    if (this.authorized(account).exists) {
      return this.authorized(account).value;
    }
    return 0;
  }

  /**
   * Update organizer stats after verifying contributions
   */
  @method
  updateOrganizerStats(organizer: Address, contributionsCount: uint64): void {
    assert(this.authorized(organizer).value === 1, 'Account not authorized');
    assert(this.authorized(organizer).exists, 'Organizer must opt-in first');

    // Update organizer's verified contributions
    this.contributionsVerified(organizer).value = this.contributionsVerified(organizer).value + contributionsCount;
    
    // Increase reputation based on contributions verified
    const currentReputation = this.reputation(organizer).value;
    this.reputation(organizer).value = currentReputation + (contributionsCount * 10);

    // Update global contribution count
    this.totalContributions.value = this.totalContributions.value + contributionsCount;
  }

  /**
   * Get organizer information
   */
  @method
  getOrganizerInfo(account: Address): [uint64, uint64, uint64] {
    if (!this.authorized(account).exists) {
      return [0, 0, 0]; // [authorized, reputation, contributions_verified]
    }
    
    return [
      this.authorized(account).value,
      this.reputation(account).value,
      this.contributionsVerified(account).value
    ];
  }

  /**
   * Opt into the contract (required before authorization)
   */
  @method
  optIn(): void {
    // Initialize local state for the sender
    this.authorized(this.txn.sender).value = 0;
    this.reputation(this.txn.sender).value = 0;
    this.contributionsVerified(this.txn.sender).value = 0;
  }
} 