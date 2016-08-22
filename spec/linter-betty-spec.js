'use babel';
/* eslint-env jasmine */

import * as path from 'path';

const badPath = path.join(__dirname, 'files', 'bad.c');
const goodPath = path.join(__dirname, 'files', 'good.c');
const emptyPath = path.join(__dirname, 'files', 'empty.c');

const lint = require('../lib/main.js').provideLinter().lint;

describe('The Betty provider for Linter', () => {
  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-betty');
      return atom.packages.activatePackage('linter-betty').then(() =>
        atom.workspace.open(badPath)
      );
    });
  });

  it('should be in the packages list', () =>
    expect(atom.packages.isPackageLoaded('linter-betty')).toBe(true)
  );

  it('should be an active package', () =>
    expect(atom.packages.isPackageActive('linter-betty')).toBe(true)
  );

  describe('checks bad.c and', () => {
    let editor = null;
    beforeEach(() => {
      atom.workspace.open(badPath).then(function(openEditor) {
        editor = openEditor;
      });
    });

    it('finds at least one message', () => {
      atom.workspace.open(badPath).then(function(openEditor) {
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        });
      });
    });

    it('verifies that message', () => {
      atom.workspace.open(badPath).then(function(openEditor) {
        lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('ERROR');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text)
            .toEqual('externs should be avoided in .c files');
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toEqual(badPath);
          expect(messages[0].range).toBeDefined();
          //expect(messages[0].range.length).toEqual(2);
          //expect(messages[0].range).toEqual([[1, 0], [1, 6]]);
        });
      });
    });
  });

  it('finds nothing wrong with an empty file', () => {
    atom.workspace.open(emptyPath).then(editor =>
      lint(editor).then(messages => {
        expect(messages.length).toEqual(0);
      })
    );
  });

  it('finds nothing wrong with a valid file', () => {
    atom.workspace.open(goodPath).then(editor =>
      lint(editor).then(messages => {
        expect(messages.length).toEqual(0);
      })
    );
  });
});
