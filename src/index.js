import React, {Component, PropTypes} from 'react';

const ValidationRules = {
    //手机号码
  checkTel: (val) => {
    return {
      result: () => {
        return (/^1\d{10}$/).test(val)
      },
      msg: '请输入正确的手机号'
    };
  },
  //是否为空
  chekEmpty: (val) => {
    return {
      result: () => {
        return val !== '';
      },
      msg: '请输入内容'
    };
  },
  //校验金额
  checkAmount: (val) => {
    return {
      result: () => {
        return (/^[1-9]\d*(\.\d{1,2})?$|^0\.[1-9]\d?$|^0\.0[1-9]$/).test(val)
      },
      msg: '请输入正确的金额'
    };
  },
  //校验金额
  checkNumber: (val) => {
    return {
      result: () => {
        return (/^\+?[1-9][0-9]*$/).test(val)
      },
      msg: '请输入正确的份额'
    };
  },
  //银行卡检验
  checkBankCard: (val) => {
    return {
      result: () => {
        return (/^\d{13,19}$/).test(val)
      },
      msg: '请输入正确银行卡号'
    };
  },
  //银行卡有效期校验
  checkExpiry: (val) => {
    return {
      result: () => {
        return (/^((1[0-2])|(0?[1-9]))\/\d{2}$/).test(val)
      },
      msg: '请输入正确的有效期'
    };
  },
  //短信码校验
  checkSmsCode: (val) => {
    return {
      result: () => {
        return (/^\d{6}$/).test(val)
      },
      msg: '请输入正确的验证码'
    };
  },
  //身份证校验
  checkIdCardNo: (val) => {
    return {
      result: () => {
        //15位或18位
        return (/^\d{15}|(\d{17}(\d|x|X))$/).test(val)
      },
      msg: '请输入正确的身份证号码'
    };
  },
  //邮箱校验
  checkEmail: (val) => {
    return {
      result: () => {
        return (/^['_A-Za-z0-9-]+(\.['_A-Za-z0-9-]+)*@([A-Za-z0-9-])+(\.[A-Za-z0-9-]+)*((\.[A-Za-z0-9]{2,})|(\.[A-Za-z0-9]{2,}\.[A-Za-z0-9]{2,}))$/).test(val);
      },
      msg: '请输入正确的邮箱'
    };
  }
} 


class Validate extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      value: '',
      rules: '',
      needBlur: false,
      msgData: {}
    }
    this.onBlur = this.onBlur.bind(this);
    this.onValidateChange = this.onValidateChange.bind(this);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('--------')
  //   console.log(nextProps)
  //   console.log(nextState)
  //   return true;
  // }

  componentDidUpdate() {
    const { tirgger } = this.props; 
    //this.mapChildren(tirgger || '')
  }

  _isType(obj, type) {
    return Object.prototype.toString.call( obj ) === "[object "+type +"]";
  }

  _setId(target, key) {
    return target.name + target.type + key;
  }

  onValidateChange({...args}, rules, msgId, callback) {
    const e = args[0];
    const value = e.target.value;
    
    this.setState({
      value,
      rules
    })

    this._checkValidation({
      e,
      value,
      rules,
      msgId
    }, callback)
  }

  onBlur({...args}, callback) {
    const e = args[0];
    const {value, rules} = this.state;
    this._checkValidation({
      e,
      value,
      rules
    }, callback)
  }

  //设置失去焦点
  _setBlur(originalOnChange, callback) {
    return (...args) => {
      this.onBlur({...args}, (validator, msg) => {

        if (typeof originalOnChange === 'function') {
          originalOnChange({...args}, validator, msg)
        }
      });
    }
  }

  //设置change
  _setChange(originalOnChange, rules, msgId) {
    return (...args) => {
     
      this.onValidateChange({...args}, rules, msgId, (validator, msg) => {
        if (typeof originalOnChange === 'function') {
          originalOnChange({...args}, validator, msg)
        }
      });
    }
  }

  //校验当前类
  _checkValidation({e, value, rules, msgId}, callback) {
  
    const _validator = rules.validator;

    if (!_validator) {
      return;
    }

    const checkfn = () => {
      let j = 0;
      
      for (j = 0; j <= _validator.length - 1; j++) {
        const _data = _validator[j];
        const _type = ValidationRules[_data.name];
        let valid = false, msg = '没有匹配的规则';
        const _rules = e._targetInst._currentElement.props['data-rules'];
        const msgData = this.state.msgData;
        

        //自定义校验规则
        if (_data.reg) {
          valid = (_data.reg).test(value);
        } else if (_type) {
          valid = _type(value).result();
          msg = _type().msg;
        }

        //自定义提示
        if (_data.msg) {
          msg = _data.msg;
        }
        
        if (value === '' || !value) {
          msgData[msgId] = {
            id: msgId,
            msg: ''
          }
          this.setState({
            msgData
          })
          callback && callback(false, '');
          return null;
        }

        //默认校验
        if (value && valid) {
          if (j === _validator.length - 1) {
            //console.log('校验成功')
            //_rules.message = '';
            //e.target.setAttribute('data-rules', _rules)
            
            msgData[msgId] = {
              id: msgId,
              msg: ''
            }
            this.setState({
              msgData
            })
            callback && callback(true, '');
          }
        } else {
         // console.log('校验失败')
         console.log('校验失败-------')

          // _rules.message = msg;
          // e.target.setAttribute('data-rules', _rules)
          if (!msgId) {
            return
          }

          msgData[msgId] = {
            id: msgId,
            msg: msg
          }
          this.setState({
            msgData
          })
          
          callback && callback(false, msg);
          return null;
        }
        
      }
    }

    checkfn();

  }



  cloneElement() {
    const { children } = this.props;
    let _index = 0;
    const _children = (newChildren) => {
      const baseProps = {};
      const childs = newChildren || children;
      

      return React.Children.map(childs, (child, _key) => {
        const rules = (child.props && child.props['data-rules']) || '';
        let childrens = (child.props && child.props['children']) || '';
        //const _msg = (rules && rules['message'] ) || '';
        const isDefaultMsg = (rules && rules['isDefaultMsg'] ) ? true : false;
        const isTag = typeof child === 'string' ? false : true;
        const wrapper = (child.props && child.props['className'] === 'valid-wrapper') ? true : false;
        const msgId = (child && child.props && (this._setId(child.props, _index++))) || '';
        let childArr = [];
        
        
        //如果标签有校验规则，则添加校验事件
        if (rules) {
          baseProps[this.props.propForOnChange] = this._setChange(child.props[this.props.propForOnChange], child.props[this.props.propRules], msgId)
          baseProps[this.props.propForOnBlur] = this._setBlur(child.props[this.props.propForOnBlur]);
        } else {
          baseProps["key"] = _key;
        }

        // 不是标签直接返回
        if (!isTag) {
          return child;
        }


        if (this._isType(childrens, 'Object')) {
          //如果子元素是个对象，放入数组，递归
          childrens = _children([childrens]);
        } else if (this._isType(childrens, 'Array') && childrens.length > 0) {
          //如果子元素是个数组，直接传递，递归
          childrens = _children(childrens);
        } else if(!childrens){
          //没有为null
          childrens = null;
        }
        
        
        if (rules && isDefaultMsg) {
          let _msg = this.state.msgData[msgId];
          _msg = _msg ? _msg.msg : '';

          //检测是否有默认校验设置，如果有校验失败展示
          baseProps.key = _key;
          childArr = [
            React.cloneElement(child, baseProps , childrens),
            React.createElement('p', {key: 'p', className: 'valid-msg'} , _msg)
          ]

          return (
            React.createElement('div', {className: 'valid-wrapper'} , childArr)
          )

        } else {
          return (
            React.cloneElement(child, baseProps , childrens)
          )
        }
        
      });
    }

    return _children();
  }


  render() {
    
    return (
      <div className="validator" >
        {this.cloneElement()}
      </div>
    )
  }
}

Validate.defaultProps = {
  defaultValue: '',
  propForShowError: '',
  propForErrorText: 'errorText',
  propForValue: 'value',
  propRules: 'data-rules',
  propForOnChange: 'onChange',
  propForOnBlur: 'onBlur',
  errorText: '',
  className: 'validate',
};

export default Validate;

export function ValidateRules() {
  return ValidationRules;
};