## 前言

基于react校验input等控件, 一般用于直接校验不提交表单需求。


## 示例

#### 注意：由于涉及大量的 ES6/7 等新属性，nodejs 最好是 6.0 以上版本 
```
git clone https://github.com/ql9075/react-validate-simply.git

npm install

npm run start

访问 http://localhost:7777/app.html
```

### 使用方法

安装
```
npm i react-validate-simply

```
引用
```
import Validate from 'react-validate-simply';

```
使用

```
inputChange({...args}, validator, msg) { 
  // args[0] 事件方法
  // validator 校验是否成功
  // msg 校验失败提示
}

1.使用默认提示

<Validate >
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
</Validate>

2.自定义校验方法

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
            name:'aaa'
          }]
        }}
      />
  </section>
</Validate>
```









