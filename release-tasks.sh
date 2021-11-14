#!/bin/bash

echo "Running Release Tasks"

echo "Running Migrations"
ENV_SILENT=true node ace migration:run --force

echo "Refreshing Migrations"
#ENV_SILENT=true node ace migration:refresh --force

echo "Running Seed"
ENV_SILENT=true node ace seed --force

echo "Done"