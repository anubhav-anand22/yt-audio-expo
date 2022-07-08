export const clearText = (txt = '') => {
    let output = '';
    const allowed = 'abcdefthijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    for(let i of txt){
        if(allowed.includes(i)){
            output += i;
        }
    };
    return output;
}