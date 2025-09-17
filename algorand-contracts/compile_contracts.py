"""Compile wrapper for Algorand TealScript contracts.

This script is a small CLI helper that runs the project's npm scripts
for compiling TealScript contracts and generating client artifacts.

Usage examples:
  python compile_contracts.py --compile
  python compile_contracts.py --build
  python compile_contracts.py --generate-client

It runs the corresponding `npm run` command in the `algorand-contracts`
folder so you can call it from Python-aware environments or CI.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent


def run_cmd(cmd: list[str], cwd: Path = ROOT) -> int:
	"""Run a command and stream output to stdout/stderr.

	Returns the process return code.
	"""
	print(f"Running: {' '.join(cmd)} (cwd={cwd})")
	try:
		proc = subprocess.run(
			cmd,
			cwd=str(cwd),
			stdout=subprocess.PIPE,
			stderr=subprocess.PIPE,
			text=True,
		)
		if proc.stdout:
			print(proc.stdout)
		if proc.stderr:
			print(proc.stderr, file=sys.stderr)
		return proc.returncode
	except FileNotFoundError:
		print(f"Command not found: {cmd[0]}")
		return 127


def ensure_node_dependencies(cwd: Path = ROOT) -> bool:
	"""Ensure node dependencies are installed (checks node_modules).

	Returns True if dependencies look installed or installation succeeded.
	"""
	node_modules = cwd / "node_modules"
	if node_modules.exists():
		return True

	print("node_modules not found — running `npm install` to install dependencies...")
	rc = run_cmd(["npm", "install"], cwd)
	return rc == 0


def compile_contracts(cwd: Path = ROOT) -> int:
	if not ensure_node_dependencies(cwd):
		print("Failed to install node dependencies. Aborting.")
		return 1
	return run_cmd(["npm", "run", "compile-contract"], cwd)


def build_all(cwd: Path = ROOT) -> int:
	if not ensure_node_dependencies(cwd):
		print("Failed to install node dependencies. Aborting.")
		return 1
	return run_cmd(["npm", "run", "build"], cwd)


def generate_client(cwd: Path = ROOT) -> int:
	if not ensure_node_dependencies(cwd):
		print("Failed to install node dependencies. Aborting.")
		return 1
	return run_cmd(["npm", "run", "generate-client"], cwd)


def main(argv: list[str] | None = None) -> int:
	parser = argparse.ArgumentParser(
		prog="compile_contracts.py",
		description="Helper to compile TealScript contracts and generate client stubs",
	)
	group = parser.add_mutually_exclusive_group()
	group.add_argument("--compile", action="store_true", help="Run the tealscript compile step (npm run compile-contract)")
	group.add_argument("--build", action="store_true", help="Run full build (npm run build)")
	group.add_argument("--generate-client", action="store_true", help="Generate TypeScript client stubs (npm run generate-client)")
	group.add_argument("--install", action="store_true", help="Run npm install in the contracts folder")
	parser.add_argument("--cwd", type=str, default=str(ROOT), help="Directory to run commands in (defaults to script folder)")

	args = parser.parse_args(argv)
	cwd = Path(args.cwd)

	if not cwd.exists():
		print(f"Working directory does not exist: {cwd}")
		return 2

	# Map flags to functions
	if args.install:
		return 0 if run_cmd(["npm", "install"], cwd) == 0 else 1

	if args.build:
		return 0 if build_all(cwd) == 0 else 1

	if args.generate_client:
		return 0 if generate_client(cwd) == 0 else 1

	# default: compile
	if args.compile or not (args.build or args.generate_client or args.install):
		return 0 if compile_contracts(cwd) == 0 else 1


if __name__ == "__main__":
	rc = main()
	sys.exit(rc)

