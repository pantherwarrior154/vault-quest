import os
import subprocess
import time
import webbrowser
import sys

# Project Paths
PROJECT_ROOT = "/home/nbrow/vault-quest"
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")

def run_backend():
    print("🧙 [Backend] Preparing the Alchemist's Lab...")
    os.chdir(BACKEND_DIR)
    # Check for venv
    if not os.path.exists("venv"):
        print("🪄 Creating virtual environment for the Alchemist's Lab...")
        subprocess.run([sys.executable, "-m", "venv", "venv"])
        subprocess.run(["venv/bin/pip", "install", "fastapi", "uvicorn", "cryptography", "pydantic"])
    
    # Start the backend server
    return subprocess.Popen(["venv/bin/python3", "-m", "app.main"])

def run_frontend():
    print("🎨 [Frontend] Summoning the Visuals...")
    os.chdir(FRONTEND_DIR)
    # Check for node_modules
    if not os.path.exists("node_modules"):
        print("📦 Gathering the building blocks (npm install)...")
        subprocess.run(["npm", "install"])
    
    # Start the Vite development server
    return subprocess.Popen(["npm", "run", "dev"])

def main():
    backend_proc = None
    frontend_proc = None
    
    try:
        # Step 1: Start Backend
        backend_proc = run_backend()
        
        # Step 2: Start Frontend
        frontend_proc = run_frontend()
        
        # Step 3: Wait and Open Browser
        print("⏳ Waiting for the quest to begin...")
        time.sleep(3) # Give it time to start
        
        print("🌍 Opening the Magic Portal (http://localhost:5173)...")
        webbrowser.open("http://localhost:5173")
        
        # Keep the script running
        print("\n✅ Vault-Quest is now ACTIVE!")
        print("📝 Press Ctrl+C to end the session and return to the Tavern.\n")
        
        # Monitor processes
        while True:
            if backend_proc.poll() is not None:
                print("❌ [Backend] Unexpectedly left the tavern!")
                break
            if frontend_proc.poll() is not None:
                print("❌ [Frontend] Unexpectedly faded away!")
                break
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n💤 Ending the session. Saving progress...")
    finally:
        if backend_proc:
            backend_proc.terminate()
        if frontend_proc:
            frontend_proc.terminate()
        print("🛡️  Safe Travels!")

if __name__ == "__main__":
    main()
