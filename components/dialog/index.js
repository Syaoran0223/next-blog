import Link from 'next/link'
import Router from 'next/router'
import ioClient from 'socket.io-client'
import DialogList from './Dialog-List'
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      socket: ioClient('http://127.0.0.1:3001'),
      chatRecords: [],
      userList: [
        {
          name: 'hwf',
          id: 1
        },
        {
          name: 'hwf1',
          id: 2
        }
      ]
    }
    this.init()
  }
  init () {
    this.state.socket.on('chat message', (msg) => {
      setTimeout(() => {
        this.pushToChatRecores(msg)
      }, 1000)
      console.log('接受到服务器返回')
    })
    this.state.socket.on('broadcast', (msg) => {
      console.log(`广播发出的消息${msg}`)
      this.pushToChatRecores(msg)
    })
  }
  componentWillMount() {
  }
  pushToChatRecores (input) {
    this.setState({
      chatRecords: [...this.state.chatRecords, input]
    })
  }
  handleClick () {
    this.pushToChatRecores(this.state.inputValue)
    this.state.socket.emit('chat message', this.state.inputValue)
  }
  inputOnchange (event) {
    this.setState({
      inputValue: event.target.value
    })
  }
  // static async getInitialProps({ req }) {
  //   const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
  //   return { userAgent }
  // }
  render() {
    return (
      <div id='dialog'>
        <div id="dialog-list">
        <DialogList userList={this.state.userList}/>
        </div>
        <div id="dialog-content">
          <div id="top">
            <ul>{this.state.chatRecords.map(e => <li key={Math.random().toString()}>{e}</li>)}</ul>
          </div>
          <div id="bottom">
            <input type="text" value={this.state.value} onChange={e => this.inputOnchange(e)} />
            <button onClick={e => this.handleClick(e)} >发送</button>
          </div>
        </div>
        <style jsx>{`
        #dialog {
          border: 1px solid #cebdbd;
          margin: 15px;
          height: 500px;
          width: 800px;
          display: flex;
          flex-wrap: wrap;
          #dialog-list {
            width: 200px;
          }
          #dialog-content {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            #top {
              width: 100%;
              flex-grow: 1;
            }
            #bottom {
              width: 100%;
              height: 120px;
            }
          }
        }
        `
        }
        </style>
      </div>
    )
  }
}
