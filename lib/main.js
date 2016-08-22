'use babel'
module.exports = {
  activate() {
    console.log('linter-betty was activated');
  },
  deactivate() {
    console.log('linter-betty was deactivated');
  },
  bettyFile(textEditor) {

    const text = textEditor.getText();
    return new Promise(function(resolve, reject) {
      // do something async or
      return [{
        type: 'Error',
        text: 'Something went wrong',
        range: [[0,0], [0,1]],
        filePath: textEditor.getPath()
      }];
    });
  },
  provideLinter() {
    const provider = {
      name: 'Betty',
      grammarScopes: ['source.js', 'source.c'], // ['*'] will get it triggered regardless of grammar
      scope: 'file', // or 'project'
      lintOnFly: true,
      lint: bettyFile
    };
    return provider;
  }
};
