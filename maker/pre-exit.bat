@echo off

if exist WebApp\node_modules\ (
  echo "Cleaning up node..."
  rd /s WebApp\node_modules\
) else (
  echo "No node to clean.
)

if exist bin\ (
  echo "Cleaning up..."
  rd /s bin\
) else (
  echo "No bin to clean.
)

