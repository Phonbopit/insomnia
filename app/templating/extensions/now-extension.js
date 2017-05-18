import BaseExtension from './base/base-extension';

export default class NowExtension extends BaseExtension {
  getTagName () {
    return 'now';
  }

  getArguments () {
    return [{
      name: 'type',
      type: 'enum',
      options: ['millis', 'unix', 'iso-8601']
    }];
  }

  run (context, dateType = 'iso-8601') {
    if (typeof dateType === 'string') {
      dateType = dateType.toLowerCase();
    }

    const now = new Date();

    switch (dateType) {
      case 'millis':
      case 'ms':
        return now.getTime();
      case 'unix':
      case 'seconds':
      case 's':
        return Math.round(now.getTime() / 1000);
      case 'iso-8601':
        return now.toISOString();
      default:
        throw new Error(`Invalid date type "${dateType}"`);
    }
  }
}
