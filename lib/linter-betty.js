'use babel';

import LinterBettyView from './linter-betty-view';
import { CompositeDisposable } from 'atom';

export default {

  linterBettyView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.linterBettyView = new LinterBettyView(state.linterBettyViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.linterBettyView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter-betty:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.linterBettyView.destroy();
  },

  serialize() {
    return {
      linterBettyViewState: this.linterBettyView.serialize()
    };
  },

  toggle() {
    console.log('LinterBetty was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
