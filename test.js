function json_desc(desc, key, with_inspect) {
    let res = {
        writable: desc.writable,
        enumerable: desc.enumerable,
        configurable: desc.configurable,
        value: desc.value.toString(),
    }
    if (with_inspect) {
        res["inspect"] = inspect_object(desc.value, key)
    }
    return res;
}

function inspect_object(obj, prefix) {
    if (!obj) return {};

    let result = {}
    let name = obj.constructor.name || "Object";

    if (name == prefix) {
        let deep = inspect_object(Object.getPrototypeOf(obj), name);
        return Object.assign(result, deep);
    }

    if (name == "Object" || name == "String" || name == "Function" || name == "Number") {
        return Object.assign(result, { "typename": name });
    }

    if (prefix) name = prefix + "." + name
    //console.log("-----------",name)
    Object.getOwnPropertyNames(obj).forEach((val) => {
        let key = name + "." + val
        try {
            let desc = Object.getOwnPropertyDescriptor(obj, val);
            result[key] = json_desc(desc, "", false);
            //console.log(key, "->", desc);
        } catch (e) {
            result[key] = { "error": e };
            //console.log(key, "-> e:", e);
        }
    });

    let deep = inspect_object(Object.getPrototypeOf(obj), name);
    return Object.assign(result, deep);
}

addEventListener('fetch', event => {
    //console.log(JSON.stringify(inspect_object(this)))
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    return new Response(JSON.stringify(inspect_object(this)), { status: 200 })
}
