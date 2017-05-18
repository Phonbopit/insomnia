import uuid from 'uuid';
import BaseExtension from './base/base-extension';

export default class UuidExtension extends BaseExtension {
  getTagName () {
    return 'uuid';
  }

  getArguments () {
    return [{
      name: 'type',
      type: 'enum',
      options: ['v4', 'v1']
    }];
  }

  run (context, uuidType = 'v4') {
    if (typeof uuidType === 'number') {
      uuidType += '';
    } else if (typeof uuidType === 'string') {
      uuidType = uuidType.toLowerCase();
    }

    switch (uuidType) {
      case '1':
      case 'v1':
        return uuid.v1();
      case '4':
      case 'v4':
        return uuid.v4();
      default:
        throw new Error(`Invalid UUID type "${uuidType}"`);
    }
  }
}
