import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Can create a new profile",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('profile', 'create-profile', [
                types.ascii("testuser"),
                types.utf8("Test User"),
                types.some(types.utf8("This is a test bio")),
                types.some(types.ascii("https://example.com/avatar.jpg"))
            ], wallet1.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, 2);
        
        block.receipts[0].result.expectOk().expectUint(1);
    },
});

Clarinet.test({
    name: "Cannot create profile with duplicate username",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('profile', 'create-profile', [
                types.ascii("testuser"),
                types.utf8("Test User 1"),
                types.none(),
                types.none()
            ], wallet1.address),
            Tx.contractCall('profile', 'create-profile', [
                types.ascii("testuser"),
                types.utf8("Test User 2"),
                types.none(),
                types.none()
            ], wallet2.address)
        ]);
        
        assertEquals(block.receipts.length, 2);
        block.receipts[0].result.expectOk().expectUint(1);
        block.receipts[1].result.expectErr().expectUint(102); // ERR_PROFILE_EXISTS
    },
});

Clarinet.test({
    name: "Cannot create multiple profiles for same user",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('profile', 'create-profile', [
                types.ascii("testuser1"),
                types.utf8("Test User 1"),
                types.none(),
                types.none()
            ], wallet1.address),
            Tx.contractCall('profile', 'create-profile', [
                types.ascii("testuser2"),
                types.utf8("Test User 2"),
                types.none(),
                types.none()
            ], wallet1.address)
        ]);
        
        assertEquals(block.receipts.length, 2);
        block.receipts[0].result.expectOk().expectUint(1);
        block.receipts[1].result.expectErr().expectUint(102); // ERR_PROFILE_EXISTS
    },
});

Clarinet.test({
    name: "Can update profile information",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('profile', 'create-profile', [
                types.ascii("testuser"),
                types.utf8("Test User"),
                types.none(),
                types.none()
            ], wallet1.address)
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1);
        
        let updateBlock = chain.mineBlock([
            Tx.contractCall('profile', 'update-profile', [
                types.some(types.utf8("Updated Display Name")),
                types.some(types.utf8("Updated bio")),
                types.some(types.ascii("https://example.com/new-avatar.jpg"))
            ], wallet1.address)
        ]);
        
        updateBlock.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Can update profile theme",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('profile', 'create-profile', [
                types.ascii("testuser"),
                types.utf8("Test User"),
                types.none(),
                types.none()
            ], wallet1.address)
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1);
        
        let updateBlock = chain.mineBlock([
            Tx.contractCall('profile', 'update-theme', [
                types.ascii("#FF0000"),
                types.ascii("#00FF00"),
                types.ascii("#0000FF"),
                types.ascii("#FFFFFF"),
                types.ascii("square"),
                types.ascii("left")
            ], wallet1.address)
        ]);
        
        updateBlock.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Can get profile by username",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('profile', 'create-profile', [
                types.ascii("testuser"),
                types.utf8("Test User"),
                types.some(types.utf8("Test bio")),
                types.none()
            ], wallet1.address)
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1);
        
        let getProfile = chain.callReadOnlyFn('profile', 'get-profile-by-username', [
            types.ascii("testuser")
        ], deployer.address);
        
        getProfile.result.expectSome();
    },
});

Clarinet.test({
    name: "Can check username availability",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Check availability before creating profile
        let checkBefore = chain.callReadOnlyFn('profile', 'is-username-available', [
            types.ascii("testuser")
        ], deployer.address);
        
        checkBefore.result.expectBool(true);
        
        // Create profile
        let block = chain.mineBlock([
            Tx.contractCall('profile', 'create-profile', [
                types.ascii("testuser"),
                types.utf8("Test User"),
                types.none(),
                types.none()
            ], wallet1.address)
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1);
        
        // Check availability after creating profile
        let checkAfter = chain.callReadOnlyFn('profile', 'is-username-available', [
            types.ascii("testuser")
        ], deployer.address);
        
        checkAfter.result.expectBool(false);
    },
});

Clarinet.test({
    name: "Only contract owner can verify profiles",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        // Create profile
        let block = chain.mineBlock([
            Tx.contractCall('profile', 'create-profile', [
                types.ascii("testuser"),
                types.utf8("Test User"),
                types.none(),
                types.none()
            ], wallet1.address)
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1);
        
        // Try to verify as non-owner (should fail)
        let verifyBlock1 = chain.mineBlock([
            Tx.contractCall('profile', 'verify-profile', [
                types.uint(1)
            ], wallet2.address)
        ]);
        
        verifyBlock1.receipts[0].result.expectErr().expectUint(100); // ERR_NOT_AUTHORIZED
        
        // Verify as owner (should succeed)
        let verifyBlock2 = chain.mineBlock([
            Tx.contractCall('profile', 'verify-profile', [
                types.uint(1)
            ], deployer.address)
        ]);
        
        verifyBlock2.receipts[0].result.expectOk().expectBool(true);
    },
});
