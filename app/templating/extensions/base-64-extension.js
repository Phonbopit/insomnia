import BaseExtension from './base/base-extension';

export default class Base64Extension extends BaseExtension {
  getName () {
    return 'base64';
  }

  getDescription () {
    return 'encode or decode values';
  }

  getArguments () {
    return [
      {
        key: 'action',
        label: 'Action',
        type: 'enum',
        options: [
          {name: 'Encode', value: 'encode'},
          {name: 'Decode', value: 'decode'}
        ]
      },
      {
        key: 'value',
        label: 'Value',
        type: 'string',
        placeholder: 'My text'
      }
    ];
  }

  run (context, op, text) {
    text = text || '';

    if (op === 'encode') {
      return Buffer.from(text, 'utf8').toString('base64');
    } else if (op === 'decode') {
      return Buffer.from(text, 'base64').toString('utf8');
    } else {
      throw new Error('Unsupported operation "' + op + '". Must be encode or decode.');
    }
  }
}
