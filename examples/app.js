import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import Validate from '../src/index';

import './style.scss';


class App extends Component {
  constructor(props) {
    super(props);
    this.inputChange = this.inputChange.bind(this);
    this.submitHandle = this.submitHandle.bind(this);
    this.state = {
      error:'',
      disable: true,
      mobile: false,
      bank: false,
      amount: false,
      letters: false
    }
  }

  inputChange({...args}, validator, msg) {
    const e = args[0];
    const name = e.target.name;
    const { mobile, amount, bank} = this.state;
    if (name === 'amount') {
      if (!validator) {
        this.setState({
          error: msg,
          amount: false,
          disable: true
        })
      } else {
        this.setState({
          error: '',
          amount: true,
          disable: mobile && bank && amount && letters? false :true
        })
      }
    } else if (name === 'bank') {
      if (!validator) {
        this.setState({
          bank: false,
          disable: true
        })
      } else {
        this.setState({
          bank: true,
          disable: mobile && bank && amount && letters? false :true
        })
      }
    } else if (name === 'letters') {
      if (!validator) {
        this.setState({
          letters: false,
          disable: true
        })
      } else {
        this.setState({
          letters: true,
          disable: mobile && bank && amount && letters? false :true
        })
      }
    } else if (name === 'mobile') {
      if (!validator) {
        this.setState({
          mobile: false,
          disable: true
        })
      } else {
        this.setState({
          mobile: true,
          disable: mobile && bank && amount && letters? false :true
        })
      }
    }
    
  }

  submitHandle() {
    const {disable} = this.state;
    if (disable) {
      return;
    }
    console.log("提交")
  }

  render() {
    const {error} = this.state;
    return (
      <div className="validator-container">
       <Validate validators={{
        letters: (val) => {
          return {
            result: () => {
              return (/^[A-Za-z]+$/).test(val)
            },
            msg: '输入字母吧'
          };
        }
       }}>
         <section>
           <label>
            输入手机号：
            </label>
            <input 
              type="text"
              name="mobile"
              onChange={this.inputChange}
              onBlur={this.inputChange}
              data-rules={{
                isDefaultMsg:true,
                validator:[{
                  name:'checkTel'
                }]
              }}
            />
        </section>
        <section>
           <label >
            输入银行卡号：
            </label>
            <input 
              type="text"
              name="bank"
              onChange={this.inputChange}
              onBlur={this.inputChange}
              data-rules={{
                isDefaultMsg:true,
                validator:[{
                  name:'checkBankCard'
                }]
              }}
            />
        </section>
        <section>
           <label >
            输入英文字母：
            </label>
            <input 
              type="text"
              name="letters"
              onChange={this.inputChange}
              onBlur={this.inputChange}
              data-rules={{
                isDefaultMsg:true,
                validator:[{
                  name:'letters'
                }]
              }}
            />
        </section>
        <section>
           <label>
            输入金额：
            </label>
            <div className="valid-wrapper">
              <input 
                type="number"
                onChange={this.inputChange}
                onBlur={this.inputChange}
                name="amount"
                data-rules={{
                  validator:[{
                    name:'checkAmount'
                  }]
                }}
              />
              <p className="valid-msg">{error}</p>
            </div>
        </section>
       </Validate>
       <a className={classnames('submit',{
        disable: this.state.disable
       })}
       onClick={this.submitHandle}
       >提交</a>
     </div>
    );
  }
};

ReactDOM.render(<App/>, document.getElementById('container'));