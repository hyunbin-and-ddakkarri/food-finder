#!/usr/bin/env bash

MYPYPATH=./server poetry run -C ./data mypy --strict ./data
