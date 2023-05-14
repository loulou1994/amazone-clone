export default function quantityOptions(maxQty){
    let possibleOptions = [];
    for(let i = maxQty - 1; i >= 0; --i){
        possibleOptions.push(maxQty - i);
    }
    return possibleOptions
}