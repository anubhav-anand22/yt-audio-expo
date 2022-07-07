export const resolveYtUrl = (str = '') => {
    if(str.length === 11 && isId(str)) {
        return {v: str}
    } else if (str.length === 34 && isId(str)) {
        return {list: str}
    }
    
    const urlSplit = str?.split('?')
    const query = urlSplit[1]?.split('&') || [];
    let obj = {}
    query.forEach(e => {
        const m = e.split('=');
        obj[m[0]] = m[1]
    });
    if(obj['list'] && obj['list'].length !== 34){
        delete obj['list']
    }

    if(urlSplit[0].includes('https://youtu.be')){
        const id = urlSplit[0].split('/').reverse()[0];
        obj['v'] = id
    }

    return obj

}

const isId = (str = '') => {
    let is = true;
    const allowed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_'.split('');
    for (let i of str){
        if(!allowed.includes(i)){
            is = false;
        }
    }
    return is
}