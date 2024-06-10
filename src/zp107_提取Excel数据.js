function init(ref) {
    ref.exc('load("https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js")', {}, () => ref.ready = true)
    let x = document.createElement("input")
    x.addEventListener("change", e => onChange(ref, e))
    x.type = "file"
    x.accept = ".xls,.xlsx"
    ref.container.appendChild(x)
    ref.children.forEach(c => {
        ref.container.append(c)
    })
}

function onChange(ref, e) {
    const { exc, props } = ref
    const file = e.target.files[0]
    if (!file || !file.name) return exc('warn("请选择Excel文件")')
    const reader = new FileReader();
    reader.onload = e => {
        if (!ref.ready) return exc('warn("请稍等")')
        const workbook = XLSX.read(e.target.result)
        // const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        // const raw_data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        let $val = workbook.SheetNames.map(name => XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 }))
        if (props.json) $val.forEach((sheet, s) => {
            let header
            Array(parseInt(props.head) || 1).fill(1).forEach(() => header = sheet.shift())
            let arr = []
            sheet.forEach((row, r) => {
                arr[r] = {}
                row.forEach((col, c) => {
                    let h = header[c]
                    if (h && col != "" && col != undefined) arr[r][h] = col
                })
            })
            $val[s] = arr
        })
        if (props.onSuccess) exc(props.onSuccess, { ...ref.ctx, $val }, () => exc("render()"))
        exc('$v.zp107 = $val', { $val }, () => exc("render()"))
    }
    reader.readAsArrayBuffer(file)
}

$plugin({
    id: "zp107",
    props: [{
        prop: "json",
        type: "switch",
        label: "转换成对象数组"
    }, {
        prop: "head",
        label: "表头",
        ph: "默认第一行是表头"
    }, {
        prop: "onSuccess",
        type: "exp",
        label: "onSuccess表达式",
        ph: "$val"
    }],
    init
})