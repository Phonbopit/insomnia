import BaseExtension from './base/base-extension';

export default class TimestampExtension extends BaseExtension {
  constructor () {
    super();
    this.deprecated = true;
  }

  getName () {
    return 'timestamp';
  }

  getDescription () {
    return 'generate timestamp in milliseconds';
  }

  getArguments () {
    return [];
  }

  run (context) {
    return Date.now();
  }
}
