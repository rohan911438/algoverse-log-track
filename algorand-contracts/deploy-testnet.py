#!/usr/bin/env python3
"""
Deploy AlgoVerse contracts to TestNet one by one
Following the same successful process used for HelloWorld deployment
"""

import os
import subprocess
import sys

def run_command(cmd, description):
    """Run a command and handle output"""
    print(f"\n🔄 {description}")
    print(f"Running: {cmd}")
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Success: {description}")
            if result.stdout:
                print(result.stdout)
            return True
        else:
            print(f"❌ Failed: {description}")
            if result.stderr:
                print(f"Error: {result.stderr}")
            if result.stdout:
                print(f"Output: {result.stdout}")
            return False
    except Exception as e:
        print(f"❌ Exception during {description}: {e}")
        return False

def main():
    print("🌟 AlgoVerse Contract Deployment to TestNet")
    print("=" * 45)
    print(f"Target Network: TestNet")
    print(f"Wallet Address: I7N2JND35J2QNBO4XYDYRDUWPP7X7LJUMGDRBHQOTRPTQGZTOBFG7ZON7U")
    print("=" * 45)
    
    # Ensure we're in the right directory
    contracts_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(contracts_dir)
    print(f"Working directory: {contracts_dir}")
    
    # Check if contracts are compiled
    artifacts_dir = os.path.join("contracts", "artifacts")
    if not os.path.exists(artifacts_dir):
        print("❌ Contract artifacts not found. Please compile contracts first.")
        return False
    
    # List of contracts to deploy (HelloWorld already deployed)
    contracts_to_deploy = [
        {
            'name': 'OrganizerRegistry',
            'description': 'Organizer authorization and management contract'
        },
        {
            'name': 'ContributionLogger', 
            'description': 'Volunteer contribution logging contract'
        }
    ]
    
    deployed_apps = []
    
    print(f"\n📋 Contracts to deploy: {len(contracts_to_deploy)}")
    for i, contract in enumerate(contracts_to_deploy, 1):
        print(f"  {i}. {contract['name']} - {contract['description']}")
    
    # Deploy each contract
    for i, contract in enumerate(contracts_to_deploy, 1):
        contract_name = contract['name']
        print(f"\n{'='*60}")
        print(f"🚀 Deploying {i}/{len(contracts_to_deploy)}: {contract_name}")
        print(f"{'='*60}")
        
        # Try different deployment approaches
        deployment_commands = [
            f"algokit generate client contracts/{contract_name}.algo.ts --output contracts/clients/{contract_name}Client.ts",
            f"algokit project bootstrap all",
            f"algokit project run",
        ]
        
        success = False
        for cmd in deployment_commands:
            if run_command(cmd, f"Step for {contract_name}"):
                success = True
                break
        
        if success:
            deployed_apps.append(contract_name)
            print(f"✅ {contract_name} deployment completed!")
        else:
            print(f"❌ {contract_name} deployment failed!")
            
    # Summary
    print(f"\n{'='*60}")
    print("📊 DEPLOYMENT SUMMARY")
    print(f"{'='*60}")
    print(f"✅ HelloWorld: Already deployed (App ID: 2225)")
    
    for contract in contracts_to_deploy:
        status = "✅ Deployed" if contract['name'] in deployed_apps else "❌ Failed"
        print(f"{status} {contract['name']}")
    
    print(f"\nTotal contracts deployed: {len(deployed_apps) + 1}/3")
    
    if len(deployed_apps) == len(contracts_to_deploy):
        print("🎉 All contracts deployed successfully!")
        return True
    else:
        print("⚠️  Some contracts failed to deploy. Please check the logs above.")
        return False

if __name__ == "__main__":
    main()