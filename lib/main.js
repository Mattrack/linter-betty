'use babel'

helpers = require('atom-linter');

module.exports = {
  config: {
    checkStyle: {
      type: 'boolean',
      title: 'Check code style with Betty?',
      default: true
    },
    executablePath: {
      type: 'string',
      title: 'Betty style script path (betty-style.pl)',
      default: '~/Betty/betty-style.pl'
    },
    checkDoc: {
      type: 'boolean',
      title: 'Check code documentation with Betty?',
      default: true
    },
    checkDocExecutablPath: {
      type: 'string',
      title: 'Betty doc script path (betty-doc.pl)',
      default: '~/Betty/betty-doc.pl'
    }
  },

  _testStyleBin() {
    title = 'linter-betty: Unable to determine Betty style checker version';
    message = 'Unable to determine the version of "' + this.executablePath +
      '", please verify that this is the right path to Betty.';
    try {
      helpers.exec(this.executablePath, ['--version']).then(function(output) {
        regex = /Version:\s(\d+)\.(\d+)/g;
        if (regex.exec(output) == null) {
          atom.notifications.addError(title, {detail: message});
          this.executablePath = '';
        }
      });
    } catch (e) {
      console.log(e);
      atom.notifications.addError(title, {detail: message});
    }
  },

  _testDocBin() {
    title = 'linter-betty:' +
      ' Unable to determine Betty documentation checker version';
    message = 'Unable to determine the version of "' +
      this.checkDocExecutablPath +
      '", please verify that this is the right path to Betty.';
    try {
      helpers.exec(this.checkDocExecutablPath,
        ['--version']).then(function(output) {
        regex = /Version:\s+(\d+)\.(\d+)/g;
        if (regex.exec(output) == null) {
          atom.notifications.addError(title, {detail: message});
          this.checkDocExecutablPath = '';
        }
      });
    } catch (e) {
      console.log(e);
      atom.notifications.addError(title, {detail: message});
    }
  },

  activate() {
    console.log('linter-betty was activated');
    this.executablePath = atom.config.get('linter-betty.executablePath');
    this._testStyleBin();
    this.checkDocExecutablPath =
      atom.config.get('linter-betty.checkDocExecutablPath');
    this._testDocBin();
  },

  deactivate() {
    console.log('linter-betty was deactivated');
  },

  lint(textEditor) {
    text = textEditor.getText();
    path = textEditor.getPath();

    if (atom.config.get('linter-betty.checkStyle') &&
    this.executablePath !== '') {
      command = atom.config.get('linter-betty.executablePath');
      parameters = [];
      parameters.push(path);
      var options = {stream: 'both'};
      this.styleLines = helpers.exec(command, parameters, options)
        .then(function(output) {
          regex = /^.*:(\d+):\s((?:ERROR|WARNING)):\s(.+)$/;
          this.messages = [];
          var totalStr = output.stdout + '\n' + output.stderr;
          lines = totalStr.split(/\n/);
          for (var i = 0; i < lines.length; ++i) {
            line = lines[i];
            if ((match = regex.exec(line)) != null) {
              this.messages.push({
                type: match[2].toLowerCase(),
                filePath: path,
                range: helpers.rangeFromLineNumber(textEditor, match[1] - 1),
                text: match[3]
              });
            }
          }

          if (atom.config.get('linter-betty.checkDoc') &&
          this.checkDocExecutablPath !== '') {
            command = atom.config.get('linter-betty.checkDocExecutablPath');
            parameters = [];
            parameters.push(path);
            var options = {stream: 'both'};
            this.docLines = helpers.exec(command, parameters, options)
              .then(function(output) {
                regex = /^[\w\d_\-\/]*\.\w:(\d+):\s((?:error|warning)):\s(.+)$/;
                var totalStr = output.stdout + '\n' + output.stderr;
                lines = totalStr.split(/\n/);
                for (var i = 0; i < lines.length; ++i) {
                  line = lines[i];
                  if ((match = regex.exec(line)) != null) {
                    this.messages.push({
                      type: match[2].toLowerCase(),
                      filePath: path,
                      range: helpers.rangeFromLineNumber(textEditor,
                        match[1] - 1),
                      text: match[3]
                    });
                  }
                }
                return this.messages;
              });
            return this.docLines;
          }
          return Promise.resolve(this.messages);
        });
    }
    return this.styleLines;
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
