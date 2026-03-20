import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

const testBed = getTestBed();

// Limpa se já existir uma plataforma (evita erro no watch mode)
if (testBed.platform) {
    testBed.resetTestEnvironment();
}

testBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

console.log('✅ Ambiente de Testes do Angular Inicializado');
