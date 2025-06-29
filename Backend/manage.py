#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path

def load_env():
    """Cargar variables de entorno desde .env"""
    env_path = Path(__file__).resolve().parent / '.env'
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                if '=' in line and not line.strip().startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ.setdefault(key, value)

def main():
    """Run administrative tasks."""
    # Cargar variables de entorno antes que Django
    load_env()
    
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Pystart.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
