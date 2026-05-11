import os
import subprocess
import time
import webbrowser
import sys
import socket

# Project Paths
PROJECT_ROOT = "/home/nbrow/vault-quest"
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def kill_port(port):
    try:
        subprocess.run(["fuser", "-k", f"{port}/tcp"], stderr=subprocess.DEVNULL)
    except:
        pass

def run_backend():
    print("🧙 [Backend] Preparing the Alchemist's Lab...")
    os.chdir(BACKEND_DIR)
    
    # Check for venv
    if not os.path.exists("venv"):
        print("🪄  First-time setup: Creating the magic circle (virtual environment)...")
        subprocess.run([sys.executable, "-m", "venv", "venv"])
    
    print("📦 Checking backend components (FastAPI, Google-Auth, etc.)...")
    subprocess.run(["venv/bin/pip", "install", "fastapi", "uvicorn[standard]", "cryptography", "pydantic", "python-jose[cryptography]", "passlib", "bcrypt", "python-multipart", "google-auth", "requests", "sqlalchemy", "python-dotenv"])
    
    # Clean up old port 8000
    if is_port_in_use(8000):
        print("⚠️  Port 8000 is occupied. Clearing the space...")
        kill_port(8000)

    # Start the backend server
    return subprocess.Popen(["venv/bin/uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"])

def run_frontend():
    print("🎨 [Frontend] Summoning the Visuals...")
    os.chdir(FRONTEND_DIR)
    
    # Check for node_modules
    if not os.path.exists("node_modules"):
        print("📦 First-time setup: Gathering the building blocks (npm install)...")
        subprocess.run(["npm", "install"])
    
    # Clean up old port 5173
    if is_port_in_use(5173):
        print("⚠️  Port 5173 is occupied. Clearing the space...")
        kill_port(5173)

    # Start the Vite development server
    return subprocess.Popen(["npm", "run", "dev"])

def main():
    print("\n" + "="*50)
    print("🛡️  VAULT-QUEST: MASTER LAUNCHER v1.0")
    print("="*50 + "\n")

    backend_proc = None
    frontend_proc = None
    
    try:
        # Step 1: Start Backend
        backend_proc = run_backend()
        
        # Step 2: Start Frontend
        frontend_proc = run_frontend()
        
        # Step 3: Wait and Open Browser
        print("\n⏳ Finishing the summon... (5 seconds left)")
        time.sleep(5)
        
        print("🌍 Opening the Portal (http://localhost:5173)...")
        webbrowser.open("http://localhost:5173")
        
        print("\n✅ Vault-Quest is now LIVE!")
        print("--------------------------------------------------")
        print("🔗 App Link: http://localhost:5173")
        print("🔗 API Link: http://localhost:8000")
        print("--------------------------------------------------")
        print("📝 Press Ctrl+C to end the session and save your work.\n")
        
        while True:
            if backend_proc.poll() is not None:
                print("❌ [Backend] Unexpectedly left the tavern!")
                break
            if frontend_proc.poll() is not None:
                print("❌ [Frontend] Unexpectedly faded away!")
                break
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n💤 Ending the session safely...")
    except Exception as e:
        print(f"❌ Critical Error: {e}")
    finally:
        if backend_proc:
            backend_proc.terminate()
        if frontend_proc:
            frontend_proc.terminate()
        print("🛡️  Quest ended. Safe travels, Alchemist!")

if __name__ == "__main__":
    main()
