import React, {PropTypes, PureComponent} from 'react';
import autobind from 'autobind-decorator';
import Input from '../codemirror/one-line-editor';
import * as templating from '../../../templating';
import * as templateUtils from '../../../templating/utils';

@autobind
class TagEditor extends PureComponent {
  constructor (props) {
    super(props);

    const activeTagData = templateUtils.tokenizeTag(props.defaultValue);

    const defs = templating.getTagDefinitions();
    const activeTagDefinition = defs.find(d => d.name === activeTagData.name);

    this.state = {
      activeTagData,
      activeTagDefinition,
      preview: '',
      error: ''
    };
  }

  async componentWillMount () {
    this._update(this.state.activeTagDefinition, this.state.activeTagData, true);
  }

  _handleChange (e) {
    const tagDefinition = templating.getTagDefinitions().find(d => d.name === e.target.value);
    this._update(tagDefinition, false);
  }

  _setSelectRef (n) {
    this._select = n;

    // Let it render, then focus the input
    setTimeout(() => {
      this._select && this._select.focus();
    }, 100);
  }

  async _update (tagDefinition, tagData, noCallback = false) {
    const {handleRender} = this.props;

    let preview = '';
    let error = '';

    const activeTagData = tagData || {
      name: tagDefinition.name,
      args: tagDefinition.args.map(arg => {
        if (arg.type === 'enum') {
          return {type: 'string', value: arg.options[0].value};
        } else {
          return {type: 'string', value: ''};
        }
      })
    };

    try {
      const template = templateUtils.unTokenizeTag(activeTagData);
      preview = await handleRender(template, true);
    } catch (err) {
      error = err.message;
    }

    const isMounted = !!this._select;
    if (isMounted) {
      this.setState({
        activeTagData,
        preview,
        error,
        activeTagDefinition: tagDefinition
      });
    }

    // Call the callback if we need to
    if (!noCallback) {
      // this.props.onChange(value);
    }
  }

  renderArgString (value, placeholder) {
    return (
      <Input
        type="text"
        defaultValue={value || ''}
        placeholder={placeholder}
        onChange={() => console.log('TODO string.onChange')}
      />
    );
  }

  renderArgEnum (value, options) {
    return (
      <select value={value} onChange={() => console.log('TODO enum.onChange')}>
        {options.map(option => {
          return (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          );
        })}
      </select>
    );
  }

  renderArgModel (value, modelType) {
    // TODO: Somehow figure out how to fetch models
    const docs = [];
    return (
      <select value={value} onChange={() => console.log('TODO model.onChange')}>
        {docs.map(m => (
          <option key={m._id} value={m._id}>{m.name}</option>
        ))}
        <option value="n/a">-- Select Item --</option>
      </select>
    );
  }

  renderArg (argDefinition, argData) {
    let argInput;
    const value = argData.value;

    if (argDefinition.type === 'string') {
      const {placeholder} = argDefinition;
      argInput = this.renderArgString(value, placeholder);
    } else if (argDefinition.type === 'enum') {
      const {options} = argDefinition;
      argInput = this.renderArgEnum(value, options);
    } else if (argDefinition.type === 'model') {
      const {model} = argDefinition;
      argInput = this.renderArgModel(value, model);
    } else {
      return null;
    }

    return (
      <div key={argDefinition.key} className="form-control form-control--outlined">
        <label>
          {argDefinition.label || argDefinition.key}
          {argInput}
        </label>
      </div>
    );
  }

  render () {
    const {error, preview, activeTagDefinition, activeTagData} = this.state;

    return (
      <div>
        <div className="form-control form-control--outlined">
          <label>Function to Perform
            <select ref={this._setSelectRef}
                    onChange={this._handleChange}
                    value={activeTagDefinition.name}>
              {templating.getTagDefinitions().map((tagDefinition, i) => (
                <option key={`${i}::${tagDefinition.name}`} value={tagDefinition.name}>
                  {tagDefinition.name} – {tagDefinition.description}
                </option>
              ))}
              <option value="n/a">
                -- Custom --
              </option>
            </select>
          </label>
        </div>
        {activeTagDefinition.args.map((argDefinition, i) => {
          const argData = activeTagData.args[i] || {};
          return this.renderArg(argDefinition, argData);
        })}
        <div className="form-control form-control--outlined">
          <label>Live Preview
            {error
              ? <code className="block danger selectable">{error || <span>&nbsp;</span>}</code>
              : <code className="block selectable">{preview || <span>&nbsp;</span>}</code>
            }
          </label>
        </div>
      </div>
    );
  }
}

TagEditor.propTypes = {
  handleRender: PropTypes.func.isRequired,
  defaultValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default TagEditor;
