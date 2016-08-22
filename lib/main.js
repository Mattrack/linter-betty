'use babel'

helpers = require('atom-linter');

module.exports = {
  activate() {
    console.log('linter-betty was activated');
  },
  deactivate() {
    console.log('linter-betty was deactivated');
  },
  lint(textEditor) {
    text = textEditor.getText();
    path = textEditor.getPath();
    command = '/Users/Alex/Holberton/Repositories/Betty/checkpatch.pl';
    parameters = [];
    parameters.push('--no-tree');
    parameters.push('--terse');
    parameters.push('-f', path);
    return helpers.exec(command, parameters)
      .then(function(output) {
        regex = /^.*:(\d+):\s+((?:ERROR|WARNING)):\s+(.+)$/;
        messages = [];
        lines = output.split(/\n/);
        for (var i = 0; i < lines.length; ++i) {
          line = lines[i];
          if ((match = regex.exec(line)) != null) {
            messages.push({
              type: match[2],
              filePath: path,
              range: helpers.rangeFromLineNumber(textEditor, match[1] - 1),
              text: match[3]
            });
          }
        }
        return messages;
      });
  },
  provideLinter() {
    const provider = {
      name: 'Betty',
      grammarScopes: ['source.h', 'source.c'], // ['*'] will get it triggered regardless of grammar
      scope: 'file', // or 'project'
      lintOnFly: true,
      lint: this.lint
    };
    return provider;
  }
};
