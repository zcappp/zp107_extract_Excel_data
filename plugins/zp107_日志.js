function init(ref) {
    ref.exc('load("https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js")', {}, () => ref.ready = true)
    const x = document.createElement("input")
    x.addEventListener("change", e => onChange(ref, e))
    x.type = "file"
    x.accept = ".xls,.xlsx"
    ref.container.appendChild(x)
}

function render(ref) {
    return <input onChange={e => onChange(ref, e)} type="file" accept=".xls,.xlsx"/>
}

function onChange(ref, e) {
    const { exc } = ref
    const file = e.target.files[0]
    if (!file || !file.name) return exc('warn("请选择Excel文件")')
    const reader = new FileReader();
    reader.onload = e => {
        if (!ref.ready) return exc('warn("请稍等")')
        const workbook = XLSX.read(e.target.result)
        // const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        // const raw_data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        const $x = ref.container.$x = workbook.SheetNames.map(name => XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 }))
        if (ref.props.onSuccess) exc(ref.props.onSuccess, { ...ref.ctx, $x }, () => exc("render()"))
        exc('$v.zp107 = $x', { $x })
    }
    reader.readAsArrayBuffer(file)
}

$plugin({
    id: "zp107",
    props: [{
        prop: "onSuccess",
        type: "exp",
        label: "onSuccess表达式"
    }],
    init
})