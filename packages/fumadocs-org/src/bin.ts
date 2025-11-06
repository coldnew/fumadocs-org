#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { postInstall } from './next/index.js';
import { convertOrgFilesToMdx } from './convert';

async function start() {
  const [configPath] = process.argv.slice(2);

  // Convert org files to MDX
  await convertOrgFilesToMdx();

  await postInstall(configPath);
}

void start();
