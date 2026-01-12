#!/usr/bin/env node

import { postInstall } from './next/index.js';

async function start() {
  await postInstall({});
}

void start();
