import os
import time
import tiktoken
import concurrent.futures
from concurrent.futures import ProcessPoolExecutor

# --- CONFIGURATION ---
TARGET_DIRECTORY = "./Document-Series"  # Change this or pass as argument
OUTPUT_FILE = "report.txt"
MODEL_ENCODING = "cl100k_base"  # Encoding for GPT-4 and GPT-3.5-turbo

# folders to skip to save time and accuracy
IGNORE_DIRS = {
    '.git', '__pycache__', 'node_modules', 'venv', 
    'env', '.idea', '.vscode', 'dist', 'build'
}

# specific file extensions to include (add more as needed)
# If empty, it attempts to read all non-binary files.
ALLOWED_EXTENSIONS = {
    '.py', '.js', '.ts', '.tsx', '.jsx', '.html', '.css', 
    '.java', '.cpp', '.c', '.h', '.cs', '.go', '.rs', 
    '.php', '.rb', '.json', '.md', '.txt', '.sql'
}

def is_binary(file_path):
    """Simple heuristic to detect binary files."""
    try:
        with open(file_path, 'tr') as check_file:
            check_file.read()
            return False
    except:
        return True

def count_tokens_in_file(file_path):
    """Reads a file and returns its token count."""
    try:
        # Re-initialize encoder inside process to avoid pickling issues
        encoder = tiktoken.get_encoding(MODEL_ENCODING)
        
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        # If content is empty/whitespace, return 0
        if not content.strip():
            return 0, file_path
            
        token_count = len(encoder.encode(content))
        return token_count, file_path
        
    except Exception as e:
        return 0, f"Error reading {file_path}: {str(e)}"

def scan_directory(directory):
    """Generator that yields file paths."""
    for root, dirs, files in os.walk(directory):
        # Modify dirs in-place to skip ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ALLOWED_EXTENSIONS and ext not in ALLOWED_EXTENSIONS:
                continue
                
            file_path = os.path.join(root, file)
            yield file_path

def main():
    print(f"--- Starting Token Scan for: {os.path.abspath(TARGET_DIRECTORY)} ---")
    start_time = time.time()
    
    files_to_process = list(scan_directory(TARGET_DIRECTORY))
    total_files = len(files_to_process)
    
    print(f"Found {total_files} files. Starting parallel processing...")

    total_tokens = 0
    file_reports = []

    # Use ProcessPoolExecutor for CPU-bound task (tokenization)
    # max_workers defaults to number of processors on the machine
    with ProcessPoolExecutor() as executor:
        # Map returns results in the order they were started
        results = executor.map(count_tokens_in_file, files_to_process)
        
        for count, path in results:
            if isinstance(path, str) and path.startswith("Error"):
                # Handle error reporting if needed
                continue
            
            total_tokens += count
            file_reports.append(f"{count:<10} | {path}")

    # Sort report by token count (descending) to see "heavy" files
    file_reports.sort(key=lambda x: int(x.split('|')[0].strip()), reverse=True)

    # Write Report
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(f"TOKEN USAGE REPORT\n")
        f.write(f"==================\n")
        f.write(f"Target Directory: {os.path.abspath(TARGET_DIRECTORY)}\n")
        f.write(f"Total Files Scanned: {total_files}\n")
        f.write(f"Total Tokens: {total_tokens:,}\n")
        f.write(f"Time Taken: {time.time() - start_time:.2f} seconds\n")
        f.write(f"==================\n\n")
        f.write(f"{'TOKENS':<10} | FILE PATH\n")
        f.write(f"{'-'*10} | {'-'*50}\n")
        f.write("\n".join(file_reports))

    print(f"\nDone! Processed {total_tokens:,} tokens in {time.time() - start_time:.2f}s.")
    print(f"Report saved to: {OUTPUT_FILE}")

if __name__ == "__main__":
    # Optional: Allow passing directory via command line
    import sys
    if len(sys.argv) > 1:
        TARGET_DIRECTORY = sys.argv[1]
    
    main()