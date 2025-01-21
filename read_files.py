import os

def read_file_contents(file_path):
    try:
        with open(file_path, 'r') as file:
            content = file.read()
            print(f"\n{'='*80}")
            print(f"File: {file_path}")
            print(f"{'='*80}")
            print(content)
    except FileNotFoundError:
        print(f"\nFile not found: {file_path}")
    except Exception as e:
        print(f"\nError reading {file_path}: {str(e)}")

# Lista de archivos a leer
files_to_read = [
    'tech-evaluation-app/.env.local',
    'tech-evaluation-app/src/app/evaluation/[role]/page.tsx',
    'tech-evaluation-app/src/app/api/questions/[role]/route.ts',
    'tech-evaluation-app/tsconfig.json',
    'tech-evaluation-app/setup.sh'
]

# Leer cada archivo
for file_path in files_to_read:
    read_file_contents(file_path) 