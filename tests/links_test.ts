import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Can create a new link",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('links', 'create-link', [
                types.utf8("My Website"),
                types.ascii("https://example.com"),
                types.some(types.utf8("Check out my website")),
                types.some(types.utf8("🌐")),
                types.ascii("#F4D03F"),
                types.ascii("#1B365D"),
                types.none(),
                types.uint(0),
                types.ascii("lg"),
                types.ascii("md")
            ], wallet1.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, 2);
        
        block.receipts[0].result.expectOk().expectUint(1);
    },
});

Clarinet.test({
    name: "Can update a link",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Create link first
        let createBlock = chain.mineBlock([
            Tx.contractCall('links', 'create-link', [
                types.utf8("My Website"),
                types.ascii("https://example.com"),
                types.none(),
                types.none(),
                types.ascii("#F4D03F"),
                types.ascii("#1B365D"),
                types.none(),
                types.uint(0),
                types.ascii("lg"),
                types.ascii("md")
            ], wallet1.address)
        ]);
        
        createBlock.receipts[0].result.expectOk().expectUint(1);
        
        // Update the link
        let updateBlock = chain.mineBlock([
            Tx.contractCall('links', 'update-link', [
                types.uint(1),
                types.some(types.utf8("Updated Website")),
                types.some(types.ascii("https://updated-example.com")),
                types.some(types.utf8("Updated description")),
                types.some(types.utf8("🚀")),
                types.some(types.bool(false))
            ], wallet1.address)
        ]);
        
        updateBlock.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Can update link style",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Create link first
        let createBlock = chain.mineBlock([
            Tx.contractCall('links', 'create-link', [
                types.utf8("My Website"),
                types.ascii("https://example.com"),
                types.none(),
                types.none(),
                types.ascii("#F4D03F"),
                types.ascii("#1B365D"),
                types.none(),
                types.uint(0),
                types.ascii("lg"),
                types.ascii("md")
            ], wallet1.address)
        ]);
        
        createBlock.receipts[0].result.expectOk().expectUint(1);
        
        // Update the link style
        let updateBlock = chain.mineBlock([
            Tx.contractCall('links', 'update-link-style', [
                types.uint(1),
                types.ascii("#FF0000"),
                types.ascii("#FFFFFF"),
                types.some(types.ascii("#000000")),
                types.uint(2),
                types.ascii("full"),
                types.ascii("lg")
            ], wallet1.address)
        ]);
        
        updateBlock.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Can delete a link",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Create link first
        let createBlock = chain.mineBlock([
            Tx.contractCall('links', 'create-link', [
                types.utf8("My Website"),
                types.ascii("https://example.com"),
                types.none(),
                types.none(),
                types.ascii("#F4D03F"),
                types.ascii("#1B365D"),
                types.none(),
                types.uint(0),
                types.ascii("lg"),
                types.ascii("md")
            ], wallet1.address)
        ]);
        
        createBlock.receipts[0].result.expectOk().expectUint(1);
        
        // Delete the link
        let deleteBlock = chain.mineBlock([
            Tx.contractCall('links', 'delete-link', [
                types.uint(1)
            ], wallet1.address)
        ]);
        
        deleteBlock.receipts[0].result.expectOk().expectBool(true);
        
        // Try to get the deleted link
        let getLink = chain.callReadOnlyFn('links', 'get-link', [
            types.uint(1)
        ], deployer.address);
        
        getLink.result.expectNone();
    },
});

Clarinet.test({
    name: "Can increment click count",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Create link first
        let createBlock = chain.mineBlock([
            Tx.contractCall('links', 'create-link', [
                types.utf8("My Website"),
                types.ascii("https://example.com"),
                types.none(),
                types.none(),
                types.ascii("#F4D03F"),
                types.ascii("#1B365D"),
                types.none(),
                types.uint(0),
                types.ascii("lg"),
                types.ascii("md")
            ], wallet1.address)
        ]);
        
        createBlock.receipts[0].result.expectOk().expectUint(1);
        
        // Increment click count
        let clickBlock = chain.mineBlock([
            Tx.contractCall('links', 'increment-click-count', [
                types.uint(1)
            ], wallet1.address)
        ]);
        
        clickBlock.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Only link owner can update link",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        // Create link as wallet1
        let createBlock = chain.mineBlock([
            Tx.contractCall('links', 'create-link', [
                types.utf8("My Website"),
                types.ascii("https://example.com"),
                types.none(),
                types.none(),
                types.ascii("#F4D03F"),
                types.ascii("#1B365D"),
                types.none(),
                types.uint(0),
                types.ascii("lg"),
                types.ascii("md")
            ], wallet1.address)
        ]);
        
        createBlock.receipts[0].result.expectOk().expectUint(1);
        
        // Try to update as wallet2 (should fail)
        let updateBlock = chain.mineBlock([
            Tx.contractCall('links', 'update-link', [
                types.uint(1),
                types.some(types.utf8("Hacked Website")),
                types.none(),
                types.none(),
                types.none(),
                types.none()
            ], wallet2.address)
        ]);
        
        updateBlock.receipts[0].result.expectErr().expectUint(200); // ERR_NOT_AUTHORIZED
    },
});

Clarinet.test({
    name: "Only link owner can delete link",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        // Create link as wallet1
        let createBlock = chain.mineBlock([
            Tx.contractCall('links', 'create-link', [
                types.utf8("My Website"),
                types.ascii("https://example.com"),
                types.none(),
                types.none(),
                types.ascii("#F4D03F"),
                types.ascii("#1B365D"),
                types.none(),
                types.uint(0),
                types.ascii("lg"),
                types.ascii("md")
            ], wallet1.address)
        ]);
        
        createBlock.receipts[0].result.expectOk().expectUint(1);
        
        // Try to delete as wallet2 (should fail)
        let deleteBlock = chain.mineBlock([
            Tx.contractCall('links', 'delete-link', [
                types.uint(1)
            ], wallet2.address)
        ]);
        
        deleteBlock.receipts[0].result.expectErr().expectUint(200); // ERR_NOT_AUTHORIZED
    },
});

Clarinet.test({
    name: "Can get link by ID",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Create link first
        let createBlock = chain.mineBlock([
            Tx.contractCall('links', 'create-link', [
                types.utf8("My Website"),
                types.ascii("https://example.com"),
                types.some(types.utf8("Test description")),
                types.some(types.utf8("🌐")),
                types.ascii("#F4D03F"),
                types.ascii("#1B365D"),
                types.none(),
                types.uint(0),
                types.ascii("lg"),
                types.ascii("md")
            ], wallet1.address)
        ]);
        
        createBlock.receipts[0].result.expectOk().expectUint(1);
        
        // Get the link
        let getLink = chain.callReadOnlyFn('links', 'get-link', [
            types.uint(1)
        ], deployer.address);
        
        getLink.result.expectSome();
    },
});
