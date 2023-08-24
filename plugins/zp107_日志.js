import React from "react"

let list = [], exc, rd, cur, log

function init(ref) {
    exc = ref.exc
    rd = ref.render
    exc('$api.getLogs()', {}, arr => {
        list = arr.map(a => parseInt(a)).sort().reverse()
        rd()
    })
}

function render() {
    return <React.Fragment>
        <h3>服务端日志</h3>
        <table className="ztable">
            <tbody>{list.map(d => 
                <tr onClick={() => getLog(d)} className={cur === d ? "cur" : ""} key={d}>
                    <td>{new Date(d).format("yyyy-MM-dd HH:mm:ss")}</td>
                </tr>)}
            </tbody>
        </table>
        {!!log && <div className="detail"><pre>{log}</pre></div>}
    </React.Fragment>
}

function getLog(d) {
    exc(`$api.getLog("${d}")`, null, o => {
        log = o ? JSON.stringify(o, null, "  ") : "N/A"
        rd()
    })
}

const css = `
.zp107 h3{
    margin-left: 9px;
}
.zp107 table {
  max-width: 600px;
  width: auto;
  margin: 0px 0px 0px 9px;
  float: left;
  overflow-y: auto;
}

.zp107 tbody tr {
  cursor: pointer;
}

.zp107 tr.cur {
  background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(rgb(219, 219, 219)), to(rgb(210, 210, 210))) !important;
}

.zp107 .detail {
  margin: 0px 0px 0px 9px;
  float: left;
  width: calc(100vw - 224px);
  padding: 9px;
  border: 1px solid rgb(221, 221, 221);
}
`

$plugin({
    id: "zp107",
    render,
    init,
    css
})